import englishAssistantPool from "../../pool";

// POST /api/query
export async function POST({ request }) {
        const { sql } = await request.json();

        // Выполняем запрос
        const result = await englishAssistantPool.query(sql);

        return new Response(JSON.stringify({
            rows: result.rows,
            rowCount: result.rowCount,
            command: result.command
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
}