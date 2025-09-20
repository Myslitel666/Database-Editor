import englishAssistantPool from "../../pool";

export async function GET() {
    const result = await englishAssistantPool.query(
      "SELECT title, id FROM Subjects ORDER BY title"
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
    const { title } = await request.json();
        // Вставляем данные и возвращаем созданную запись
        const result = await englishAssistantPool.query(
            'INSERT INTO Subjects (Title) VALUES ($1) RETURNING *',
            [title]
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

  const result = await englishAssistantPool.query(`
    DELETE FROM subjects
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
  const { title, newTitle } = await request.json();

    const result = await englishAssistantPool.query(
      `UPDATE subjects
       SET title = $1
       WHERE title = $2
       RETURNING *;`,
      [newTitle, title]
    );

    return new Response(JSON.stringify({
      success: true,
      updated: result.rows[0]
    }), { status: 200 });
}

