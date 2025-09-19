// src/routes/api/data/+server.js
import pkg from 'pg';
const { Pool } = pkg;

export async function GET() {
    // Настраиваем пул соединений, используя DATABASE_URL
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: false
        // ssl: {
        //     rejectUnauthorized: false, // Включите это для Vercel, если требуется
        // },
    });

    try {
        // Выполняем запрос к базе данных
        const result = await pool.query('SELECT current_database();');
        
        // Возвращаем результат в формате JSON
        return new Response(JSON.stringify(result.rows), {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
        });
    } catch (error) {
        console.error('Ошибка при запросе к базе данных:', error);
        
        // Возвращаем ошибку, если запрос не удался
        return new Response(JSON.stringify({ error: 'Ошибка при запросе к базе данных' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500,
        });
    } finally {
        // Закрываем пул соединений после выполнения запроса
        pool.end();
    }
}
