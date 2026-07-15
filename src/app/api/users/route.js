import pool from "@/lib/db";
//potenitally import bycrpt later?
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    return Response.json(
      {
        id: result.insertId,
        name,
        email,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const [users] = await pool.query("SELECT * FROM users");
    return Response.json(users);
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}