namespace AbhiKansara.Core.Common;

public class SmugMugSettings
{
    public const string SectionName = "SmugMug";

    public string ApiKey { get; set; } = string.Empty;
    public string ApiSecret { get; set; } = string.Empty;
    public string AccessToken { get; set; } = string.Empty;
    public string AccessTokenSecret { get; set; } = string.Empty;
}
