import englishAssistantPool from "../../pool";

export async function GET() {
    const result = await englishAssistantPool.query(`
      SELECT json_build_object(
        'subjects', (SELECT json_agg(s) FROM subjects s),
        'special_words', (SELECT json_agg(sw) FROM special_words sw)
      ) AS data;
    `);

    return new Response(
      JSON.stringify({
        success: true,
        data: result.rows[0].data
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200
      }
    );
}
