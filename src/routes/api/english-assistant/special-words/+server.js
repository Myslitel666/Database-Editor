import englishAssistantPool from "../../pool";

// GET /api/special-words
export async function GET({ url }) {
  const subject = url.searchParams.get('subject');
  let params = [subject];

  let query = `
    SELECT 
      sw.value,
      sw.translate,
      sw.example_use
    FROM special_words sw
    LEFT JOIN subjects s ON sw.subject_id = s.id
    WHERE s.title = $1
    ORDER BY sw.id DESC
  `;
  
  const result = await englishAssistantPool.query(query, params);

  return new Response(JSON.stringify({
    success: true,
    special_words: result.rows
  }), {
    headers: { "Content-Type": "application/json" },
    status: 200
  });
}

export async function POST({ request }) {
    const { value, translate, example_use, subject } = await request.json();

    const result = await englishAssistantPool.query(
      `INSERT INTO Special_Words (value, translate, example_use, subject_id)
        VALUES (
            $1,
            $2,
            $3,
            (SELECT id FROM Subjects WHERE title = $4)
        )
        RETURNING *;`,
      [value,  translate, example_use, subject]
    );

    return new Response(JSON.stringify({
      success: true,
      data: result.rows[0]
    }), { status: 201 });
}

export async function DELETE({ request }) {
  const { value, subject } = await request.json();

  const result = await englishAssistantPool.query(`
    DELETE FROM special_words
        WHERE value = $1
        AND subject_id = (SELECT id FROM subjects WHERE title = $2)
        RETURNING *;`, 
    [value, subject]
  );

    return new Response(JSON.stringify({
      success: true,
      deleted: result.rows[0]
    }), { status: 200 });
}

export async function PUT({ request }) {
  const { newValue, translate, example_use, value, subject } = await request.json();

    const result = await englishAssistantPool.query(
      `UPDATE special_words
       SET value = $1,
           translate = $2,
           example_use = $3
       WHERE value = $4
         AND subject_id = (SELECT id FROM subjects WHERE title = $5)
       RETURNING *;`,
      [newValue, translate, example_use, value, subject]
    );

    return new Response(JSON.stringify({
      success: true,
      updated: result.rows[0]
    }), { status: 200 });
}