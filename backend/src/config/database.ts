import knex from 'knex';

const config = {
  client: 'postgresql',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'read_detective',
    password: process.env.DB_PASSWORD || 'secret123',
    database: process.env.DB_NAME || 'read_detective',
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    directory: '../../database/migrations'
  },
  seeds: {
    directory: '../../database/seeds'
  }
};

export const db = knex(config);

export async function setupDatabase() {
  try {
    await db.raw('SELECT 1');
    console.log('Database connection established');
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
}
