
import { cookies } from "next/headers";
import pool from "@/libs/db";

export async function getAuthenticatedUser() {

    //Get the cookies sent with the cookie request
    const cookieStore = await cookies();

    //Find the session cookie
    const session = cookieStore.get("session");

    //No cookie means the user is not logged in
    if (!session) {
        return null;
    }

    //The cookie currently contains the user's database ID 
    const userId = Number(session.value);

    //Make sure the ID is valid
    if(!Number.isInteger(userId) || userId <= 0) {
        return null;
    }

    //Find the user belonging to this session
    const [rows] = await pool.execute(

        `
        SELECT id, name, email, role, active
        FROM users
        WHERE id = ?
        AND active = TRUE
        `,
        [userId]
    );

    //User no longer exists
    if(rows.length === 0) {
        return null;
    }

    return rows[0];

}