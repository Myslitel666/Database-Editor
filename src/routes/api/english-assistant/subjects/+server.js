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
