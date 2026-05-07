namespace AbhiKansara.Core.Entities
{
    public class CarouselItem
    {
        public string Id { get; set; } = Guid.NewGuid().ToString("N");
        public string Title { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public int SortOrder { get; set; }
    }
}
