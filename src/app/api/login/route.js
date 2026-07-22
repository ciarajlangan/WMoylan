import pool from "@/app/api/libs/db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(request) {
  try {
    const {email, password} = await request.json();

    // Check email and password provided
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required",
        },
        { status: 400 }
      );
    }

    // Find user by email
    const [rows] = await pool.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    // User not found
    if (rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    const user = rows[0];

    // Compare hashed password
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    // Wrong password
    if (!passwordMatch) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    // Create response
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at, //check this 
      },
    });

    // Create session cookie EDIT THIS TO MAKE IT ONE DAY OR CHECK
    response.cookies.set("session", user.UserId.toString(), {
      httpOnly: true,
      secure: false, //change this after deployment HTTPS 
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    return response;

  } catch (err) {
    console.error("POST /api/login error:", err);

    return NextResponse.json(
      {
        success: false,
        message: "Login failed",
      },
      { status: 500 }
    );
  }
}