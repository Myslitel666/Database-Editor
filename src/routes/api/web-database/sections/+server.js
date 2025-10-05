import {webDatabasePool} from "../../pool";

export async function GET({ url }) {
  const technology = url.searchParams.get('technology');
  const sectionType = url.searchParams.get('section-type');
  console.log('D')
  
  const result = await webDatabasePool.query(`
    SELECT 
      s.title,
      s.position
    FROM sections s
    LEFT JOIN technologies t ON s.technology_id = t.id
    LEFT JOIN section_types st ON st.id = s.section_type_id
    WHERE t.name = $1 AND st.value = $2
    ORDER BY s.position
  `, [technology, sectionType]);

  return new Response(JSON.stringify({
    success: true,
    sections: result.rows
  }), {
    headers: { "Content-Type": "application/json" },
    status: 200
  });
}

export async function POST({ request }) {
  const { technologyName, sectionType, title, position } = await request.json();
    let insertRes;
    let finalPosition = Number(position);

    const maxPositionResult = await webDatabasePool.query(
      `SELECT MAX(position) as max_position 
        FROM sections
        WHERE technology_id = (SELECT id FROM technologies WHERE name = $1)
          AND section_type_id = (SELECT id FROM section_types WHERE value = $2)
      `,
      [technologyName, sectionType]
    );

    const maxPosition = maxPositionResult.rows[0]?.max_position;

    if (maxPosition) {
      if (Number(position) > maxPosition) {
        finalPosition = maxPosition + 1;
      }
    } else {
      finalPosition = 1;
    }

    if (finalPosition < 1) {
      insertRes = await webDatabasePool.query(
        `INSERT INTO sections (technology_id, section_type_id, title, position)
        VALUES (
          (SELECT id FROM technologies WHERE name = $1), 
          (SELECT id FROM section_types WHERE value = $2), 
          $3, 
          $4 + 1
        )
        RETURNING *`,
        [technologyName, sectionType, title, maxPosition]
        );
    } else {
      await webDatabasePool.query(
        `UPDATE sections
          SET position = position + 1
          WHERE technology_id = (SELECT id FROM technologies WHERE name = $1) 
          AND section_type_id = (SELECT id FROM section_types WHERE value = $2)
          AND position >= $3

        `,
        [technologyName, sectionType, finalPosition]
      );

      insertRes = await webDatabasePool.query(
        `INSERT INTO sections (technology_id, section_type_id, title, position)
          VALUES (
            (SELECT id FROM technologies WHERE name = $1), 
            (SELECT id FROM section_types WHERE value = $2), 
            $3, 
            $4
          )
          RETURNING *
        `,
        [technologyName, sectionType, title, finalPosition]
      );
    }

    return new Response(JSON.stringify({
      success: true,
      section: insertRes.rows[0]
    }), { status: 201 });
}

export async function DELETE({ request }) {
  const { technologyName, sectionType, title } = await request.json();

  const curPositionResult = await webDatabasePool.query(`
    SELECT position as cur_position
      FROM sections 
      WHERE technology_id = (SELECT id FROM technologies WHERE name = $1)
        AND section_type_id = (SELECT id FROM section_types WHERE value = $2)
        AND title = $3
      ;`,
    [technologyName, sectionType, title]
  );

  const curPosition = curPositionResult.rows[0]?.cur_position;

  const result = await webDatabasePool.query(`
    DELETE FROM sections
        WHERE technology_id = (SELECT id FROM technologies WHERE name = $1)
          AND section_type_id = (SELECT id FROM section_types WHERE value = $2)
          AND title = $3
          RETURNING *;`, 
    [technologyName, sectionType, title]
  );

  await webDatabasePool.query(
    `UPDATE sections
      SET position = position - 1
      WHERE technology_id = (SELECT id FROM technologies WHERE name = $1)
        AND section_type_id = (SELECT id FROM section_types WHERE value = $2)
        AND title = $3
    `,
    [technologyName, sectionType, curPosition]
  );

    return new Response(JSON.stringify({
      success: true,
      deleted: result.rows[0]
    }), { status: 200 });
}

export async function PUT({ request }) {
  const { technologyName, sectionType, title, newTitle, position } = await request.json();

  // Если нужно обновить позицию, сдвигаем остальные записи
  // Получаем текущую позицию обновляемого раздела
  const currentRes = await webDatabasePool.query(
    `SELECT position FROM sections
      WHERE technology_id = (SELECT id FROM technologies WHERE name = $1)
        AND section_type_id = (SELECT id FROM section_types WHERE value = $2)
        AND title = $3
    `,
    [technologyName, sectionType, title]
  );

  const curPosition = currentRes.rows[0].position;

  // Сдвигаем позиции, чтобы выделить место для вставки на одну из занятых
  await webDatabasePool.query(
    `UPDATE sections
      SET position = position + 1
      WHERE technology_id = (SELECT id FROM technologies WHERE name = $1)
        AND section_type_id = (SELECT id FROM section_types WHERE value = $2)
        AND (
          (position > $3 AND $4 < $3) OR  -- если двигаем вниз
          (position >= $3 AND $4 > $3)     -- если двигаем вверх
        )
    `,
    [technologyName, sectionType, position, curPosition]
  );

  // Обновляем наш section, включая позицию
  const updateRes = await webDatabasePool.query(
    `UPDATE sections
      SET position = CASE 
        WHEN $6 < $3::integer THEN $3::integer + 1  -- если двигаем вниз
        WHEN $6 >= $3::integer THEN $3 -- если двигаем вверх
      END,
      title = $5
      WHERE technology_id = (SELECT id FROM technologies WHERE name = $1)
        AND section_type_id = (SELECT id FROM section_types WHERE value = $2)
        AND title = $4`,
    [technologyName, sectionType, position, title, newTitle, curPosition]
  );

  // Возвращаем сдвинутые позиции на место
  await webDatabasePool.query(`
    UPDATE sections
      SET position = position - 1
      WHERE technology_id = (SELECT id FROM technologies WHERE name = $1)
        AND section_type_id = (SELECT id FROM section_types WHERE value = $2)
        AND (
          (position >= $4 AND $4 < $3::integer) OR  -- если двигаем вниз
          (position > $4::integer AND $4 > $3::integer)     -- если двигаем вверх
        )`,
    [technologyName, sectionType, position, curPosition]
  );

  return new Response(JSON.stringify({
    success: true,
    updated: updateRes.rows[0]
  }), { status: 200 });
}