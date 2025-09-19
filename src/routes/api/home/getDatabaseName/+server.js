import pool from "../../pool";

export async function GET() {
    const result = await pool.query('SELECT current_database();');
    const dbName = result.rows[0]?.current_database;

    return new Response(JSON.stringify({ database: dbName }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
    });
}
