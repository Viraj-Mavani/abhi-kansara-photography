using AbhiKansara.Core.Entities;

namespace AbhiKansara.Core.Interfaces;

public interface ISmugMugService
{
    /// <summary>
    /// Fetches all images from a SmugMug album and returns them as MediaItem entities.
    /// </summary>
    /// <param name="albumId">The SmugMug Album ID (e.g., "n-AbCd12")</param>
    /// <param name="albumKey">The SmugMug Album Key</param>
    /// <returns>A list of MediaItem entities populated with SmugMug data.</returns>
    Task<IEnumerable<MediaItem>> GetAlbumImagesAsync(string albumId, string albumKey);
}
