import {webDatabasePool} from "../../pool";

// GET /api/special-words
export async function GET() {
  let query = `
    SELECT 
      s.value
    FROM section_types s
  `;
  
  const result = await webDatabasePool.query(query);

  return new Response(JSON.stringify({
    success: true,
    section_types: result.rows
  }), {
    headers: { "Content-Type": "application/json" },
    status: 200
  });
}