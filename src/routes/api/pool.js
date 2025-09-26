import pkg from 'pg';
const { Pool } = pkg;

const englishAssistantPool = new Pool({
    connectionString: process.env.ENGLISH_ASSISTANT,
    ssl: false
});

export const webDatabasePool = new Pool({
    connectionString: process.env.WEB_DATABASE,
    ssl: false
});

export default englishAssistantPool;