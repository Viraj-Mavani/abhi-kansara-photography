using System.Net.Http.Headers;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Web;
using AbhiKansara.Core.Common;
using AbhiKansara.Core.Entities;
using AbhiKansara.Core.Enums;
using AbhiKansara.Core.Interfaces;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace AbhiKansara.Infrastructure.Services;

public class SmugMugService : ISmugMugService
{
    private readonly HttpClient _httpClient;
    private readonly SmugMugSettings _settings;
    private readonly IDistributedCache _cache;
    private readonly ILogger<SmugMugService> _logger;
    private const string BaseUrl = "https://api.smugmug.com/api/v2";

    public SmugMugService(
        HttpClient httpClient,
        IOptions<SmugMugSettings> settings,
        IDistributedCache cache,
        ILogger<SmugMugService> logger)
    {
        _httpClient = httpClient;
        _settings = settings.Value;
        _cache = cache;
        _logger = logger;

        _httpClient.DefaultRequestHeaders.Accept.Clear();
        _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        _httpClient.DefaultRequestHeaders.Add("User-Agent", "AbhiKansaraPhotography/1.0");
    }

    public async Task<IEnumerable<MediaItem>> GetAlbumImagesAsync(string albumId, string albumKey)
    {
        var cacheKey = $"smugmug_images_{albumKey}";
        var cachedImages = await GetCachedDataAsync<List<MediaItem>>(cacheKey);
        if (cachedImages != null)
        {
            _logger.LogInformation("Returning {Count} cached images for album {AlbumKey}", cachedImages.Count, albumKey);
            return cachedImages;
        }

        // SmugMug API v2: album key is used in the URI
        // The albumKey is the unique identifier (e.g., "AbCd12")
        // The endpoint fetches all images in the album with ImageSizes expanded
        var allImages = new List<MediaItem>();
        var start = 1;
        const int pageSize = 100;
        var hasMore = true;

        while (hasMore)
        {
            var endpoint = $"{BaseUrl}/album/{albumKey}!images";
            var queryParams = new Dictionary<string, string>
            {
                { "_expand", "ImageSizes" },
                { "count", pageSize.ToString() },
                { "start", start.ToString() }
            };

            _logger.LogInformation("Fetching SmugMug album images: {Endpoint} (start={Start})", endpoint, start);

            var response = await SendAuthenticatedRequestAsync(HttpMethod.Get, endpoint, queryParams);
            var json = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError("SmugMug API error {StatusCode}: {Body}", (int)response.StatusCode, json);
                throw new HttpRequestException(
                    $"SmugMug API returned {(int)response.StatusCode}: {json}");
            }

            using var document = JsonDocument.Parse(json);
            var root = document.RootElement.GetProperty("Response");

            // Check if AlbumImage exists in the response
            if (!root.TryGetProperty("AlbumImage", out var albumImages))
            {
                _logger.LogWarning("No AlbumImage property in SmugMug response. Album may be empty.");
                break;
            }

            foreach (var img in albumImages.EnumerateArray())
            {
                var mediaItem = ParseImageElement(img, allImages.Count);
                if (mediaItem != null)
                    allImages.Add(mediaItem);
            }

            // Check pagination
            if (root.TryGetProperty("Pages", out var pages))
            {
                var total = pages.GetProperty("Total").GetInt32();
                var currentStart = pages.GetProperty("Start").GetInt32();
                var count = pages.GetProperty("Count").GetInt32();
                hasMore = (currentStart + count - 1) < total;
                start = currentStart + count;
            }
            else
            {
                hasMore = false;
            }
        }

        _logger.LogInformation("Fetched {Count} images from SmugMug album {AlbumKey}", allImages.Count, albumKey);
        
        // Cache the results for 1 hour
        await SetCachedDataAsync(cacheKey, allImages, TimeSpan.FromHours(1));
        
        return allImages;
    }

    private MediaItem? ParseImageElement(JsonElement img, int order)
    {
        try
        {
            var imageKey = img.TryGetProperty("ImageKey", out var ik) ? ik.GetString() : null;
            var title = img.TryGetProperty("Title", out var t) ? t.GetString() : null;
            var caption = img.TryGetProperty("Caption", out var c) ? c.GetString() : null;
            var fileName = img.TryGetProperty("FileName", out var f) ? f.GetString() : null;
            var origWidth = img.TryGetProperty("OriginalWidth", out var ow) ? ow.GetInt32() : 0;
            var origHeight = img.TryGetProperty("OriginalHeight", out var oh) ? oh.GetInt32() : 0;

            // Try to get ArchivedUri first (original quality)
            var archivedUri = img.TryGetProperty("ArchivedUri", out var au) ? au.GetString() : null;

            // Fall back to expanded ImageSizes for the best available URL
            string? imageUrl = archivedUri;
            int width = origWidth;
            int height = origHeight;

            if (img.TryGetProperty("Uris", out var uris) &&
                uris.TryGetProperty("ImageSizes", out var imageSizesUri) &&
                imageSizesUri.TryGetProperty("ImageSizes", out var imageSizes))
            {
                // Try sizes from largest to smallest
                var sizePreference = new[]
                {
                    "X5LargeImageUrl", "X4LargeImageUrl", "X3LargeImageUrl",
                    "X2LargeImageUrl", "XLargeImageUrl", "LargeImageUrl",
                    "MediumImageUrl"
                };

                foreach (var sizeName in sizePreference)
                {
                    if (imageSizes.TryGetProperty(sizeName, out var sizeUrl))
                    {
                        var url = sizeUrl.GetString();
                        if (!string.IsNullOrEmpty(url))
                        {
                            imageUrl ??= url; // Only use as fallback if ArchivedUri wasn't available
                            break;
                        }
                    }
                }
            }

            // If we still don't have a URL, skip this image
            if (string.IsNullOrEmpty(imageUrl))
            {
                _logger.LogWarning("Skipping image {ImageKey}: no URL found", imageKey);
                return null;
            }

            // Use a sensible fallback for dimensions if not available
            if (width == 0) width = 1600;
            if (height == 0) height = 1067;

            return new MediaItem
            {
                Type = MediaType.Photo,
                Url = imageUrl,
                Width = width,
                Height = height,
                Alt = title ?? caption ?? fileName ?? "Photography by Abhi Kansara",
                SmugMugImageKey = imageKey,
                AspectRatio = height > 0 ? (double)width / height : 1.5,
                Order = order
            };
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to parse SmugMug image element");
            return null;
        }
    }

    public async Task<IEnumerable<SmugMugAlbumInfo>> GetAlbumsAsync()
    {
        var cacheKey = "smugmug_albums";
        var cachedAlbums = await GetCachedDataAsync<List<SmugMugAlbumInfo>>(cacheKey);
        if (cachedAlbums != null)
        {
            _logger.LogInformation("Returning {Count} cached albums", cachedAlbums.Count);
            return cachedAlbums;
        }

        try
        {
            _logger.LogInformation("Fetching SmugMug user albums for picker");

            // Step 1: Get the authenticated user's information
            var authUserEndpoint = $"{BaseUrl}!authuser";
            var userResponse = await SendAuthenticatedRequestAsync(HttpMethod.Get, authUserEndpoint, null);
            
            if (!userResponse.IsSuccessStatusCode)
            {
                _logger.LogError("SmugMug API error fetching !authuser: {StatusCode}", (int)userResponse.StatusCode);
                return Enumerable.Empty<SmugMugAlbumInfo>();
            }

            var userJson = await userResponse.Content.ReadAsStringAsync();
            using var userDoc = JsonDocument.Parse(userJson);
            var userRoot = userDoc.RootElement.GetProperty("Response");

            if (!userRoot.TryGetProperty("User", out var user) || 
                !user.TryGetProperty("Uris", out var uris) ||
                !uris.TryGetProperty("UserAlbums", out var userAlbumsUriObj) ||
                !userAlbumsUriObj.TryGetProperty("Uri", out var albumsUri))
            {
                _logger.LogWarning("Could not find UserAlbums URI in !authuser response.");
                return Enumerable.Empty<SmugMugAlbumInfo>();
            }

            // Step 2: Fetch albums from the discovered URI
            // Note: SmugMug URIs are usually absolute from the root (e.g. /api/v2/...), 
            // so we combine with the base domain if needed, but our SendAuthenticatedRequestAsync 
            // handles relative paths if we strip the /api/v2 prefix or just use the full absolute URL.
            var albumsUrl = albumsUri.GetString()!;
            if (!albumsUrl.StartsWith("http")) 
            {
                // If it's a relative path like /api/v2/user/..., we need the full domain
                albumsUrl = "https://api.smugmug.com" + albumsUrl;
            }

            var albumsResponse = await SendAuthenticatedRequestAsync(HttpMethod.Get, albumsUrl, null);
            var albumsJson = await albumsResponse.Content.ReadAsStringAsync();

            if (!albumsResponse.IsSuccessStatusCode)
            {
                _logger.LogError("SmugMug API error fetching albums from {Url}: {StatusCode}", albumsUrl, (int)albumsResponse.StatusCode);
                return Enumerable.Empty<SmugMugAlbumInfo>();
            }

            using var albumsDoc = JsonDocument.Parse(albumsJson);
            var albumsRoot = albumsDoc.RootElement.GetProperty("Response");

            if (!albumsRoot.TryGetProperty("Album", out var albums) || 
                albums.ValueKind != JsonValueKind.Array)
            {
                _logger.LogWarning("No albums found in response from {Url}", albumsUrl);
                return Enumerable.Empty<SmugMugAlbumInfo>();
            }

            var result = new List<SmugMugAlbumInfo>();
            foreach (var album in albums.EnumerateArray())
            {
                result.Add(new SmugMugAlbumInfo
                {
                    AlbumId = album.TryGetProperty("UrlName", out var id) ? id.GetString() : null,
                    AlbumKey = album.TryGetProperty("AlbumKey", out var key) ? key.GetString() : null,
                    Title = album.TryGetProperty("Title", out var title) ? title.GetString() : "Untitled Album",
                    Description = album.TryGetProperty("Description", out var desc) ? desc.GetString() : null,
                    LastUpdated = album.TryGetProperty("LastUpdated", out var last) ? last.GetString() : null,
                    ImageCount = album.TryGetProperty("ImageCount", out var count) ? count.GetInt32() : 0,
                    WebUri = album.TryGetProperty("WebUri", out var uri) ? uri.GetString() : null
                });
            }

            var sortedAlbums = result.OrderByDescending(a => a.LastUpdated).ToList();
            
            // Cache for 30 minutes
            await SetCachedDataAsync(cacheKey, sortedAlbums, TimeSpan.FromMinutes(30));
            
            return sortedAlbums;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to list SmugMug albums");
            return Enumerable.Empty<SmugMugAlbumInfo>();
        }
    }

    // ─────────────────────────────────────────────────────────
    //  OAuth 1.0a HTTP Request Infrastructure
    // ─────────────────────────────────────────────────────────

    private async Task<HttpResponseMessage> SendAuthenticatedRequestAsync(
        HttpMethod method, string url, Dictionary<string, string>? queryParams = null)
    {
        // Build the full URL with query parameters
        var uriBuilder = new UriBuilder(url);
        var query = HttpUtility.ParseQueryString(uriBuilder.Query);
        if (queryParams != null)
        {
            foreach (var kvp in queryParams) query[kvp.Key] = kvp.Value;
        }
        uriBuilder.Query = query.ToString();
        var fullUrl = uriBuilder.ToString();

        var request = new HttpRequestMessage(method, fullUrl);

        // OAuth signature is computed against the base URL (without query string)
        var authHeader = GenerateOAuthHeader(method.Method, url, queryParams);
        request.Headers.Authorization = new AuthenticationHeaderValue("OAuth", authHeader);

        return await _httpClient.SendAsync(request);
    }

    private string GenerateOAuthHeader(string method, string url, Dictionary<string, string>? queryParams)
    {
        var oauthParams = new Dictionary<string, string>
        {
            { "oauth_consumer_key", _settings.ApiKey },
            { "oauth_nonce", Guid.NewGuid().ToString("N") },
            { "oauth_signature_method", "HMAC-SHA1" },
            { "oauth_timestamp", DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString() },
            { "oauth_token", _settings.AccessToken },
            { "oauth_version", "1.0" }
        };

        // Combine OAuth params + query params for signature base string
        var allParams = new Dictionary<string, string>(oauthParams);
        if (queryParams != null)
        {
            foreach (var kvp in queryParams) allParams[kvp.Key] = kvp.Value;
        }

        // 1. Normalize parameters (sorted alphabetically)
        var sortedParams = allParams
            .OrderBy(p => p.Key)
            .ThenBy(p => p.Value)
            .Select(p => $"{Uri.EscapeDataString(p.Key)}={Uri.EscapeDataString(p.Value)}");
        var paramString = string.Join("&", sortedParams);

        // 2. Construct Signature Base String
        var baseString = $"{method.ToUpper()}&{Uri.EscapeDataString(url)}&{Uri.EscapeDataString(paramString)}";

        // 3. Construct Signing Key
        var signingKey = $"{Uri.EscapeDataString(_settings.ApiSecret)}&{Uri.EscapeDataString(_settings.AccessTokenSecret)}";

        // 4. Generate HMAC-SHA1 Signature
        using var hmac = new HMACSHA1(Encoding.ASCII.GetBytes(signingKey));
        var signatureBytes = hmac.ComputeHash(Encoding.ASCII.GetBytes(baseString));
        var signature = Convert.ToBase64String(signatureBytes);

        oauthParams.Add("oauth_signature", signature);

        // 5. Construct Authorization Header value
        return string.Join(", ", oauthParams
            .OrderBy(p => p.Key)
            .Select(p => $"{Uri.EscapeDataString(p.Key)}=\"{Uri.EscapeDataString(p.Value)}\""));
    }

    // ── Caching Helpers ──

    private async Task<T?> GetCachedDataAsync<T>(string cacheKey)
    {
        try
        {
            var cachedData = await _cache.GetStringAsync(cacheKey);
            if (string.IsNullOrEmpty(cachedData)) return default;
            return JsonSerializer.Deserialize<T>(cachedData);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to retrieve data from cache for key {Key}", cacheKey);
            return default;
        }
    }

    private async Task SetCachedDataAsync<T>(string cacheKey, T data, TimeSpan expiration)
    {
        try
        {
            var options = new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = expiration
            };
            var jsonData = JsonSerializer.Serialize(data);
            await _cache.SetStringAsync(cacheKey, jsonData, options);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to save data to cache for key {Key}", cacheKey);
        }
    }
}
