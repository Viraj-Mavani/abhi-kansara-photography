namespace AbhiKansara.Core.DTOs;

public class LoginRequest
{
    public required string Email { get; set; }
    public required string Password { get; set; }
}

public class RegisterRequest
{
    public required string Email { get; set; }
    public required string Password { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
}

public class AuthResponse
{
    public required string Token { get; set; }
    public required string Email { get; set; }
    public required string UserId { get; set; }
}
