using AbhiKansara.Core.Entities;
using AbhiKansara.Core.Common;

namespace AbhiKansara.Core.Interfaces;

public interface ISmugMugService
{
    /// <summary>
    /// Fetches all images from a SmugMug album and returns them as MediaItem entities.
    /// </summary>
    Task<IEnumerable<MediaItem>> GetAlbumImagesAsync(string albumId, string albumKey);

    /// <summary>
    /// Lists all albums for the authenticated SmugMug account.
    /// Used for an album picker UI in the admin panel.
    /// </summary>
    Task<IEnumerable<SmugMugAlbumInfo>> GetAlbumsAsync();
}
