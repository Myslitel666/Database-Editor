import {webDatabasePool} from "../../pool";

export async function GET() {
    const result = await webDatabasePool.query(
      "SELECT title, description, logo FROM Technologies"
    );

    return new Response(JSON.stringify({
      success: true,
      subjects: result.rows
    }), {
      headers: { "Content-Type": "application/json" },
      status: 200
    });
}

export async function POST({ request }) {
    const { title, description, logo } = await request.json();
        // Вставляем данные и возвращаем созданную запись
        const result = await webDatabasePool.query(
            'INSERT INTO Technologies (Title, Description, Logo) VALUES ($1, $2, $3) RETURNING *',
            [title, description, logo]
        );

        return new Response(JSON.stringify({
            success: true,
            data: result.rows[0]
        }), {
            headers: { 'Content-Type': 'application/json' },
            status: 201, // 201 Created
        });
}

export async function DELETE({ request }) {
  const { title } = await request.json();

  const result = await webDatabasePool.query(`
    DELETE FROM Technologies
        WHERE title = $1
        RETURNING *;`, 
    [title]
  );

  return new Response(JSON.stringify({
    success: true,
    deleted: result.rows[0]
  }), { status: 200 });
}

export async function PUT({ request }) {
  const { title, newTitle, description, logo } = await request.json();

    const result = await webDatabasePool.query(
      `UPDATE Technologies
       SET title = $2,
       description = $3,
       logo = $4
       WHERE title = $1
       RETURNING *;`,
      [newTitle, title, description, logo]
    );

    return new Response(JSON.stringify({
      success: true,
      updated: result.rows[0]
    }), { status: 200 });
}

