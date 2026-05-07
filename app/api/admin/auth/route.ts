import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5027/api";

/**
 * POST /api/admin/auth
 * Proxies login to .NET backend. On success, sets the JWT as an HttpOnly cookie.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: "Login failed" }));
      return NextResponse.json(
        { message: error.message || "Invalid credentials" },
        { status: res.status }
      );
    }

    const data = await res.json();

    // Create response and set HttpOnly cookie with the JWT
    const response = NextResponse.json({
      email: data.email,
      userId: data.userId,
    });

    response.cookies.set("admin_token", data.token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours — matches backend token expiry
      // secure: true, // Uncomment for production (HTTPS only)
    });

    return response;
  } catch {
    return NextResponse.json(
      { message: "An error occurred during authentication" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/auth
 * Clears the JWT cookie (logout).
 */
export async function DELETE() {
  const response = NextResponse.json({ message: "Logged out" });

  response.cookies.set("admin_token", "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0, // Expire immediately
  });

  return response;
}
