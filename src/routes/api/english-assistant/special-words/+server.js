import englishAssistantPool from "../../pool";

export async function POST({ request }) {
    const { value, translate, example_use, subjectTitle } = await request.json();

    const result = await englishAssistantPool.query(
      `INSERT INTO Special_Words (value, translate, example_use, subject_id)
        VALUES (
            $1,
            $2,
            $3,
            (SELECT id FROM Subjects WHERE title = $4)
        )
        RETURNING *;`,
      [value,  translate, example_use, subjectTitle]
    );

    return new Response(JSON.stringify({
      success: true,
      data: result.rows[0]
    }), { status: 201 });
}