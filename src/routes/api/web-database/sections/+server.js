import webDatabasePool from "../../pool";

// GET /api/special-words
export async function GET({ url }) {
  const technology = url.searchParams.get('technology');
  let params = [technology];

  let query = `
    SELECT 
      s.title,
      s.position
    FROM sections s
    LEFT JOIN technologies t ON s.technology_id = t.id
    WHERE t.name = $1
    ORDER BY s.position
  `;
  
  const result = await webDatabasePool.query(query, params);

  return new Response(JSON.stringify({
    success: true,
    sections: result.rows
  }), {
    headers: { "Content-Type": "application/json" },
    status: 200
  });
}

export async function POST({ request }) {
  const { technologyName, title, position } = await request.json();
    let insertRes;

    if (position == null) {
      insertRes = await webDatabasePool.query(
        `INSERT INTO sections (technology_id, title, position)
         SELECT (SELECT id FROM technology WHERE name = $1), $2, (SELECT COUNT(*) FROM sections s LEFT JOIN technologies t ON s.technology_id = t.id WHERE t.name = $1) + 1
         FROM sections
         WHERE technology_id = (SELECT id FROM technology WHERE name = $1)
         RETURNING *`,
        [technologyName, title]
      );
    } else {
      await webDatabasePool.query(
        `UPDATE sections
         SET position = position + 1
         WHERE technology_id = (SELECT id FROM technology WHERE name = $1) AND position >= $2`,
        [technologyName, position]
      );

      insertRes = await webDatabasePool.query(
        `INSERT INTO sections (technology_id, title, position)
         VALUES ((SELECT id FROM technology WHERE name = $1), $2, $3)
         RETURNING *`,
        [technologyName, title, position]
      );
    }

    return new Response(JSON.stringify({
      success: true,
      section: insertRes.rows[0]
    }), { status: 201 });
}

export async function DELETE({ request }) {
  const { technologyName, title } = await request.json();

  const result = await webDatabasePool.query(`
    DELETE FROM sections
        WHERE title = $2
        AND technology_id = (SELECT id FROM technology WHERE name = $1)
        RETURNING *;`, 
    [technologyName, title]
  );

    return new Response(JSON.stringify({
      success: true,
      deleted: result.rows[0]
    }), { status: 200 });
}

export async function PUT({ request }) {
  const { technologyName, title, newTitle, position } = await request.json();

  // Если нужно обновить позицию, сдвигаем остальные записи
  // Получаем текущую позицию обновляемого раздела
  const currentRes = await webDatabasePool.query(
    `SELECT position FROM sections
      WHERE title = $1
        AND technology_id = (SELECT id FROM technology WHERE name = $2)`,
    [title, technologyName]
  );

  const currentPosition = currentRes.rows[0].position;

  // Сдвигаем позиции вниз, начиная с position (чтобы выделить для него место)
  await webDatabasePool.query(
    `UPDATE sections
      SET position = position + 1
      WHERE technology_id = (SELECT id FROM technology WHERE name = $1)
        AND position >= $2`,
    [technologyName, position]
  );

  // Обновляем наш section, включая позицию
  const updateRes = await webDatabasePool.query(
    `UPDATE sections
      SET position = $2,
      title = newTitle
      WHERE technology_id = (SELECT id FROM technology WHERE name = $1)
        AND title = $3`,
    [technologyName, position, title, newTitle]
  );

  // Поднимаем позиции обратно вверх, начиная с обновлённой
  await webDatabasePool.query(
    `UPDATE sections
      SET position = position - 1
      WHERE technology_id = (SELECT id FROM technology WHERE name = $1)
        AND position > $1`,
    [currentPosition]
  );

  return new Response(JSON.stringify({
    success: true,
    updated: updateRes.rows[0]
  }), { status: 200 });
}
