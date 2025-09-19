import englishAssistantPool from "../../pool";

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
