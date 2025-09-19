import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.ENGLISH_ASSISTANT,
    ssl: false
});

export default pool;