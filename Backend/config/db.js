import { Pool } from 'pg';
import config from './env.js';
import logger from './logger.js';

const pool = new Pool({
    user: config.db.user,
    password: config.db.password,
    host: config.db.host,
    port: config.db.port,
    database: config.db.database,
    max: config.db.maxPoolSize, // Set pool max size
    idleTimeoutMillis: 30000,      // Close idle clients after 30 seconds
    connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
});

pool.on('error', (err, client) => {
    logger.error('Unexpected error on idle PostgreSQL client', err);
  process.exit(1);
});

export async function query(text, params = []) {
  const start = Date.now();

  try {
    const result = await pool.query(text, params);

    const duration = Date.now() - start;

    logger.debug("Executed query", {
      text,
      duration,
      rows: result.rowCount,
    });

    return result;
  } catch (error) {
    logger.error("Database query failed", {
      text,
      error: error.message,
    });

    throw error;
  }
}

export function getPool() {
  return pool;
}

export async function connectDB() {
  await pool.query('SELECT 1');
  logger.info('PostgreSQL connection established');
}

export default pool;