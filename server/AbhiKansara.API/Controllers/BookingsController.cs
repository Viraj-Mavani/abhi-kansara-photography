using AbhiKansara.Core.Entities;
using AbhiKansara.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AbhiKansara.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize] // Requires valid JWT token from Admin login
public class BookingsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public BookingsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Booking>>> GetBookings([FromQuery] DateTime? start, [FromQuery] DateTime? end)
    {
        var query = _context.Bookings.AsQueryable();

        if (start.HasValue)
            query = query.Where(b => b.StartDateTime >= start.Value);
            
        if (end.HasValue)
            query = query.Where(b => b.EndDateTime <= end.Value || b.StartDateTime <= end.Value);

        var bookings = await query.OrderBy(b => b.StartDateTime).ToListAsync();
        return Ok(bookings);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Booking>> GetBooking(Guid id)
    {
        var booking = await _context.Bookings.FindAsync(id);
        if (booking == null) return NotFound();
        return Ok(booking);
    }

    [HttpPost]
    public async Task<ActionResult<Booking>> CreateBooking(Booking booking)
    {
        booking.Id = Guid.NewGuid();
        booking.StartDateTime = DateTime.SpecifyKind(booking.StartDateTime, DateTimeKind.Utc);
        if (booking.EndDateTime.HasValue)
            booking.EndDateTime = DateTime.SpecifyKind(booking.EndDateTime.Value, DateTimeKind.Utc);
        
        // Conflict Check (Optional explicit check, could also just be frontend for now)
        var conflict = await _context.Bookings.AnyAsync(b => 
            b.StartDateTime < (booking.EndDateTime ?? booking.StartDateTime.AddHours(2)) && 
            (b.EndDateTime ?? b.StartDateTime.AddHours(2)) > booking.StartDateTime);

        if (conflict)
        {
            // Log it or return warning if we wanted strict backend validation.
            // For V1, we let the frontend warn, but we still allow creation if Abhi wants to force it.
        }

        _context.Bookings.Add(booking);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetBooking), new { id = booking.Id }, booking);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateBooking(Guid id, Booking booking)
    {
        if (id != booking.Id) return BadRequest();

        var existing = await _context.Bookings.FindAsync(id);
        if (existing == null) return NotFound();

        // Update fields
        existing.ClientName = booking.ClientName;
        existing.Location = booking.Location;
        existing.StartDateTime = DateTime.SpecifyKind(booking.StartDateTime, DateTimeKind.Utc);
        if (booking.EndDateTime.HasValue)
            existing.EndDateTime = DateTime.SpecifyKind(booking.EndDateTime.Value, DateTimeKind.Utc);
        else
            existing.EndDateTime = null;
        existing.EventType = booking.EventType;
        existing.IsFullDay = booking.IsFullDay;
        existing.Status = booking.Status;
        existing.Notes = booking.Notes;
        existing.PhoneNumber = booking.PhoneNumber;
        existing.Email = booking.Email;
        existing.AmountProposed = booking.AmountProposed;
        existing.PaymentReceived = booking.PaymentReceived;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!BookingExists(id)) return NotFound();
            else throw;
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBooking(Guid id)
    {
        var booking = await _context.Bookings.FindAsync(id);
        if (booking == null) return NotFound();

        _context.Bookings.Remove(booking);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool BookingExists(Guid id)
    {
        return _context.Bookings.Any(e => e.Id == id);
    }
}
