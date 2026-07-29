import pool from "@/libs/db";
import bcrypt from "bcrypt";

//Validation Regex
const idRegex = /^\d+$/;
const nameRegex = /^[A-Za-z][A-Za-z\s-]{1,49}$/; 
const emailRegex = /^\S+@\S+\.\S+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const validRoles = ["user", "admin"];

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

//reusable function for validation 
function validateUser(data, isUpdate = false) {

    const errors = {};

    // Name
    if (!isUpdate || data.name !== undefined) {
        if (!data.name || !nameRegex.test(data.name)) {
            errors.name = "Name must be 2-50 letters only";
        }
    }

    // Email
    if (!isUpdate || data.email !== undefined) {
        if (!data.email || !emailRegex.test(data.email)) {
            errors.email = "Please enter a valid email address";
        }
    }

    // Password
    if (!isUpdate) {
        if (!data.password || !passwordRegex.test(data.password)) {
            errors.password =
                "Password must contain uppercase, lowercase, number and special character";
        }
    } else if (data.password !== undefined) {
        if (!passwordRegex.test(data.password)) {
            errors.password =
                "Password must contain uppercase, lowercase, number and special character";
        }
    }

    // Role
    if (data.role !== undefined) {
        if (!validRoles.includes(data.role)) {
            errors.role = "Role must be user or admin";
        }
    }

    return errors;
}

//GET
export async function GET(req, { params }) {
    try {

        const { id } = await params;

        if (!idRegex.test(id)) {
            return Response.json(
                { message: "Invalid user id" },
                { status: 400 }
            );
        }

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

    } catch (error) {

        console.error(error);

        return Response.json(
            { error: error.message },
            { status: 500 }
        );
    }
}


//PUT
export async function PUT(req, { params }) {
    try {

        const { id } = await params;

        if (!idRegex.test(id)) {
            return Response.json(
                { message: "Invalid user id" },
                { status: 400 }
            );
        }

        const { name, email, password, role } = await req.json();

        const errors = validateUser(
    {
        name,
        email,
        password,
        role,
    },
    true
);

if (Object.keys(errors).length > 0) {
    return Response.json(

        { 
            message: "Validation failed",
            errors },
        { status: 400 }
    );
}

        const [userRows] = await pool.execute(
        "SELECT id, email FROM users WHERE id = ?",
        [id]
    );

if (userRows.length === 0) {
    return Response.json(
        { message: "User not found" },
        { status: 404 }
    );
}

//Check if email is taken 
if (email && email !== userRows[0].email) {

    const exists = await emailExists(email, id);

    if (exists) {
        return Response.json(
            { message: "Email already exists" },
            { status: 409 }
        );
    }
}

const updates = [];
const values = [];

//check how to make everyone bar nick and mark users

//update name 
if (name !== undefined) {

    updates.push("name = ?");
    values.push(name);
}

//update email
if (email !== undefined) {

    updates.push("email = ?");
    values.push(email);
}

//update role
if (role !== undefined) {

    updates.push("role = ?");
    values.push(role);
}
    
//update password
if (password !== undefined) {

    const hashedPassword = await bcrypt.hash(password, 10);

    updates.push("password = ?");
    values.push(hashedPassword);
}

//ensure something has changed 
if (updates.length === 0) {
    return Response.json(
        { message: "No fields to update" },
        { status: 400 }
    );
}

values.push(id);

console.log("Updates: ", updates);
console.log("Values: ", values);

const [before] = await pool.execute(
    "SELECT id, name, email, role FROM users WHERE id = ?",
    [id]
);

console.log("Before update:", before[0]);


const [result] = await pool.execute(
    `UPDATE users
     SET ${updates.join(", ")}
     WHERE id = ?`,
    values
);

console.log(result);

const [after] = await pool.execute(
    "SELECT id, name, email, role FROM users WHERE id = ?",
    [id]
);

console.log("After update:", after[0])

return Response.json(
    {
        success: true,
        message: "User updated successfully"
    }
);
   } catch (error) {

    console.error(error);

    return Response.json(
        { error: error.message },
        { status: 500 }
    );
}

}

//DELETE USER
export async function DELETE(req, { params }) {
    try {

        const { id } = await params;

                if (!idRegex.test(id)) {
                 return Response.json(
                { message: "Invalid user id" },
                { status: 400 }
            );
        }
            const [rows] = await pool.execute(
            "SELECT id, active FROM users WHERE id = ?",
            [id]
        );

        if (rows.length === 0) {
            return Response.json(
                { 
                    message: "User not found" 
                },
                { 
                    status: 404 
                }
            );
        }

        if (rows[0].active === 0) {
            return Response.json(
                {
                    message: "User is already inactive"
                },
                {
                    status: 400
                }
            );
        }

        // Soft delete user by setting active to false
        await pool.execute(
            `
            UPDATE users 
            SET active = FALSE
            WHERE id = ?
            `,
            [id]
        );

            return Response.json({
            success: true,
            message: "User deactivated successfully"
        });

        } catch (error) {

        console.error(error);

        return Response.json(
            { error: error.message },
            { status: 500 }
        );

        //need to go further with this incase a user doesnt exist respond with user doesnt exist
        // -> 400 invalid ID format
        // -> 404 User doesnt exist
        // -> user deleted successfully 
    }
}

//REACTIVATE USER patch = small change to part of the resource
export async function PATCH(req, { params }) {
    try {

        const { id } = await params;

        if (!idRegex.test(id)) {
            return Response.json(
                { message: "Invalid user id" },
                { status: 400 }
            );
        }

        const [rows] = await pool.execute(
            "SELECT id, active FROM users WHERE id = ?",
            [id]
        );

        if (rows.length === 0) {
            return Response.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        if (rows[0].active === 1) {
            return Response.json(
                { message: "User is already active" },
                { status: 400 }
            );
        }


        await pool.execute(
            `
            UPDATE users
            SET active = TRUE
            WHERE id = ?
            `,
            [id]
        );


        return Response.json({
            success: true,
            message: "User reactivated successfully"
        });


    } catch(error) {

        console.error(error);

        return Response.json(
            { error: error.message },
            { status: 500 }
        );
    }
}