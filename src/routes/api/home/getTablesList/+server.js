import pool from "../../pool";

export async function GET() {
    const result = await pool.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public';
    `);

    return new Response(JSON.stringify(result.rows), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
    });
}
