import pool from "@/app/api/libs/db";
//potenitally import bycrpt later?
import bcrypt from "bcrypt";
//create an authenticate file in lib for importing 

//Validation Regex
const nameRegex = /^[a-zA-Z-]{2,50}$/; //check the number 2 IN THIS 
const emailRegex = /^\S+@\S+\.\S+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;


// Check if email already exists
async function emailExists(email) {

  const [rows] = await pool.execute(
    "SELECT id FROM users WHERE email = ?",
    [email]
  );

  return rows.length > 0;
}

// Validate user input
function validateUser(data) {

  const errors = {};

  if (!data.name || !nameRegex.test(data.name)) {
    errors.name = "Name must be 2-50 characters only";
  }


  if (!data.email || !emailRegex.test(data.email)) {
    errors.email = "Please enter a valid email.";
  }


  if (!data.password || !passwordRegex.test(data.password)) {
    errors.password =
      "Password must contain uppercase, lowercase, number and special character";
  }


  return errors;
}

//POST CREATE NEW USER
export async function POST(req) {

  try {

    const { name, email, password } = await req.json();

    const errors = validateUser({
        name,
        email,
        password,
    });
    

    if(Object.keys(errors).length > 0){
        return Response.json(
            { errors},
            { status: 400}
        );
    }

    //Check duplicate email
    if(await emailExists(email)) {

        return Response.json(
            {message: "Email already exists"},
            {status: 400}
        );
    }

    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //Insert user
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    return Response.json(
      {
        id: result.insertId,
        name,
        email
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

// GET users or a single user by id
export async function GET(req) {
  try {

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    // Return one user
    if (id) {

      const [rows] = await pool.execute(
        "SELECT id, name, email, role FROM users WHERE id = ?",
        [id]
      );

      if (rows.length === 0) {
        return Response.json(
          { message: "User not found" },
          { status: 404 }
        );
      }

      return Response.json(rows[0]);
    }

    // Return all users
    const [users] = await pool.execute(
      "SELECT id, name, email, role FROM users"
    );

    return Response.json(users);

  } catch (error) {

    console.error(error);

    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}