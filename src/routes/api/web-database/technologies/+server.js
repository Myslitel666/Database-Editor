import {webDatabasePool} from "../../pool";

export async function GET() {
    const result = await webDatabasePool.query(
      "SELECT name, description, logo FROM Technologies"
    );

    return new Response(JSON.stringify({
      success: true,
      technologies: result.rows
    }), {
      headers: { "Content-Type": "application/json" },
      status: 200
    });
}

export async function POST({ request }) {
    const { name, description, logo } = await request.json();
        // Вставляем данные и возвращаем созданную запись
        const result = await webDatabasePool.query(
            'INSERT INTO Technologies (name, Description, Logo) VALUES ($1, $2, $3) RETURNING *',
            [name, description, logo]
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
  const { name } = await request.json();

  const result = await webDatabasePool.query(`
    DELETE FROM Technologies
        WHERE name = $1
        RETURNING *;`, 
    [name]
  );

  return new Response(JSON.stringify({
    success: true,
    deleted: result.rows[0]
  }), { status: 200 });
}

export async function PUT({ request }) {
  const { name, newname, description, logo } = await request.json();

    const result = await webDatabasePool.query(
      `UPDATE Technologies
       SET name = $2,
       description = $3,
       logo = $4
       WHERE name = $1
       RETURNING *;`,
      [name, newname, description, logo]
    );

    return new Response(JSON.stringify({
      success: true,
      updated: result.rows[0]
    }), { status: 200 });
}

