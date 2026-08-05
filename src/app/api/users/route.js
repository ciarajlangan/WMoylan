import pool from "@/libs/db";
//potenitally import bycrpt later?
import bcrypt from "bcrypt";
//create an authenticate file in lib for importing 
//FINISH THIS API ROUTE NB****************************

//Validation Regex
const idRegex = /^\d+$/;
const nameRegex = /^[A-Za-z][A-Za-z\s-]{1,49}$/; 
const emailRegex = /^\S+@\S+\.\S+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const validRoles = ["user", "admin"];

// create /api/users/[id]


// Check if email already exists
async function emailExists(email, excludeId = null) {

    let query = "SELECT id FROM users WHERE email = ?";
    let values = [email];

    if (excludeId) {
        query += " AND id != ?";
        values.push(excludeId);
    }

    const [rows] = await pool.execute(query, values);

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

  if (data.role && !validRoles.includes(data.role)) {
    errors.role = "Invalid role";
  } 


  return errors;
}

//POST CREATE NEW USER
export async function POST(req) {

  try {

    const { name, email, password, role } = await req.json();

    const errors = validateUser({
        name,
        email,
        password,
        role,
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
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role || "user"]
    );

    return Response.json(
      {
        id: result.insertId,
        name,
        email,
        role: role || "user"
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

    // Find one user
    if (id) {

      const [rows] = await pool.execute(
        `SELECT 
        id, name, email, role, active 
        FROM users 
        WHERE id = ?`,
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

    // Find all users
    const active = searchParams.get("active");

    let query = `SELECT 
    id, name, email, role, active
    FROM users
    `;

    if (active === "true") {
        query += " WHERE active = TRUE";
        } else if (active === "false") {
        query += " WHERE active = FALSE";
        }

        query += " ORDER BY id";

        const [users] = await pool.execute(query);

    return Response.json(users);

  } catch (error) {

    console.error(error);

    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

  //PUT (UPDATING) user details
  export async function PUT(req) {
    try {

        const { name, email, password, role } = await req.json();

        //users ID is required to know which user to update
        if ( !id || !idRegex.test(id)) {
            return Response.json(
                { success: false, message: "Valid user ID is required"},
                { status: 400}
            );
        }

        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try{
            //checks if user exists in the database
            const [userRows] = await connection.execute(
                "SELECT id, email FROM users WHERE id = ?", [id]
            );

            if (userRows.length == 0) {
                await connection.rollback();
                connection.release();
                return Response.json(
                    { success: false, message: "User not found"},
                    { status: 404 }
                );
            }

            //check if email already exists for another user 
            if (email && email !== userRows[0].email) {
                const emailTaken = await emailExists(email, id);
                if (emailTaken) {
                    await connection.rollback();
                    connection.release();
                    return Response.json(
                        { success: false, message: "Email already in use by another account" },
                        { status: 409}
                    );
                }
            }

            const updates = [];
            const values = [];

            //Update name if provided
            if(name !== undefined) {
                if (!nameRegex.test(name)){
                    await connection.rollback()
                    connection.release();
                    return Response.json(
                        { success: false, message: "Invalid name format"},
                        { status: 400 }
                    );
                }

                updates.push("name = ?");
                values.push(name);
            }

            // Update email if provided
            if (email !== undefined) {
                if (!emailRegex.test(email)) {
                    await connection.rollback();
                    connection.release();
                    return Response.json(
                        { success: false, message: "Invalid email format" },
                        { status: 400 }
                    );
                 }

                updates.push("email = ?");
                values.push(email);
            }

            //Update role if provided
            if (role !== undefined) {
                if (!validRoles.includes(role)) {
                    await connection.rollback();
                    connection.release();
                    return Response.json(
                    { success: false, message: "Invalid role" },
                    { status: 400 }
                );
            }
            updates.push("role = ?");
            values.push(role);
            }

            // Hash and update password if provided
            if (password !== undefined) {
                if (!passwordRegex.test(password)) {
                    await connection.rollback();
                    connection.release();
                    return Response.json(
                    { success: false, message: "Password must be at least 8 characters with uppercase, lowercase, number and special character" },
                    { status: 400 }
                );
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            updates.push("password = ?");
            values.push(hashedPassword);
        }

        // If nothing was provided to update
        if (updates.length === 0) {
         await connection.rollback();
            connection.release();

             return Response.json(
            {
                success: false,
                message: "No fields to update"
            },
            { status: 400 }
         );
        }

        // Add userId for WHERE clause
        values.push(id);

        await connection.execute(
         `UPDATE users SET ${updates.join(", ")} WHERE id = ?`,
             values
        );

      await connection.commit();
      connection.release();

      return Response.json({
        success: true,
        message: "User updated successfully",
      });

    } catch (err) {
      await connection.rollback();
      connection.release();
      throw err;
    }

  } catch (err) {
    console.error("PUT /api/users error:", err);
    if (err.code === 'ER_DUP_ENTRY') {
      return Response.json(
        { success: false, message: "Email already exists" },
        { status: 409 }
      );
    }
    return Response.json(
      { success: false, message: "Update failed" },
      { status: 500 }
    );
  }
            //finish this 
        }
        

    
