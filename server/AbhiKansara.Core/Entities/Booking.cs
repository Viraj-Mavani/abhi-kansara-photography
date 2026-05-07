using AbhiKansara.Core.Common;

namespace AbhiKansara.Core.Entities;

public enum BookingStatus
{
    Inquiry,
    Confirmed,
    Blocked
}

public class Booking : BaseEntity
{
    public string ClientName { get; set; } = string.Empty;
    public string? Location { get; set; }
    public DateTime StartDateTime { get; set; }
    public DateTime? EndDateTime { get; set; }
    
    /// <summary>
    /// Type of event, defaults to visual theme "Gold" in UI if empty.
    /// </summary>
    public string? EventType { get; set; }
    
    public bool IsFullDay { get; set; } = false;
    
    public BookingStatus Status { get; set; } = BookingStatus.Inquiry;
    
    public string? Notes { get; set; }
    
    // Contact Info
    public string? PhoneNumber { get; set; }
    public string? Email { get; set; }
    
    // Payment Info
    public decimal? AmountProposed { get; set; }
    public decimal? PaymentReceived { get; set; }
}
