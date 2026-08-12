import { NextResponse } from "next/server";

export async function POST() {

    const response = NextResponse.json({
        success: true,
        message: "Logged out successfully"
    });

    // Remove the session cookie
    response.cookies.set("session", "", {
        httpOnly: true,
        secure: false, // change to true when deployed with HTTPS
        sameSite: "strict",
        expires: new Date(0),
        path: "/",
    });

    return response;
}