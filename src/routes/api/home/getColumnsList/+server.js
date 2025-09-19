import pool from "../../pool";

export async function GET({ url }) {
    // Получаем значение параметра `table` из URL
    const tableName = url.searchParams.get('table');

    // Используем параметризованный запрос, чтобы избежать SQL-инъекций
    const result = await pool.query(`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = $1;
    `, [tableName]);

    return new Response(JSON.stringify(result.rows), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
    });
}

