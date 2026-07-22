import pool from "@/app/api/libs/db";

export async function GET(req, { params }) {
  try {

    const { id } = await params;

    console.log(id);

    const [tickets] = await pool.execute(
      `
      SELECT
        tickets.id,
        tickets.title,
        tickets.description,
        tickets.priority,
        tickets.status,
        tickets.created_at,
        tickets.updated_at,
        users.name AS created_by

      FROM tickets

      LEFT JOIN users
      ON tickets.created_by = users.id

      WHERE tickets.id = ?
      `,
      [id]
    );

    if (tickets.length === 0) {
      return Response.json(
        { message: "Ticket not found" },
        { status: 404 }
      );
    }

    return Response.json(tickets[0]);

  } catch (error) {

    console.error(error);

    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = params;

    const { title, description, priority, status } = await req.json();

    const [result] = await pool.execute(
      `
      UPDATE tickets
      SET
        title = ?,
        description = ?,
        priority = ?,
        status = ?
      WHERE id = ?
      `,
      [title, description, priority, status, id]
    );

    if (result.affectedRows === 0) {
      return Response.json(
        { message: "Ticket not found" },
        { status: 404 }
      );
    }

    return Response.json({
      message: "Ticket updated successfully"
    });

  } catch (error) {

    console.error(error);

    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    const [result] = await pool.execute(
      "DELETE FROM tickets WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return Response.json(
        { message: "Ticket not found" },
        { status: 404 }
      );
    }

    return Response.json({
      message: "Ticket deleted successfully"
    });

  } catch (error) {

    console.error(error);

    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
