import pool from "@/libs/db";
import { cookies } from "next/headers";

export async function GET() {

    try {

        const [tickets] = await pool.execute(
            `
            SELECT
                tickets.id,
                tickets.title,
                tickets.description,
                tickets.priority,
                tickets.status,
                tickets.created_at,
                users.name AS created_by

            FROM tickets

            LEFT JOIN users
            ON tickets.created_by = users.id

            ORDER BY tickets.created_at DESC
            `
        );


        return Response.json(tickets);


    } catch(error){

        console.error(error);

        return Response.json(
            {
                error:error.message
            },
            {
                status:500
            }
        );

    }

}

export async function POST(req) {

    try {

        const cookieStore = await cookies();

        const session = cookieStore.get("session");

        if (!session) {
            return Response.json(
                {
                    message: "Please log in."
                },
                {
                    status: 401
                }
            );
        }

        const {
            title,
            description,
            priority,
        } = await req.json();

        const created_by = Number(session.value)


        // Basic validation
        if(!title || !description){

            return Response.json(
                {
                    error:"Title and description are required"
                },
                {
                    status:400
                }
            );

        }

        const [result] = await pool.execute(
            `
            INSERT INTO tickets 
            (title, description, priority, created_by)
            VALUES (?, ?, ?, ?)
            `,
            [
                title,
                description,
                priority || "LOW",
                created_by
            ]
        );


        return Response.json(
            {
                message:"Ticket created successfully",
                ticketId: result.insertId
            },
            {
                status:201
            }
        );


    } catch(error){

        console.error(error);

        return Response.json(
            {
                error:error.message
            },
            {
                status:500
            }
        );

    }

}