import { Pool } from 'pg';

async function init() {
  console.log('Starting database initialization...');
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('Testing database connection...');
    const client = await pool.connect();
    console.log('Successfully connected to database');

    // Create users table
    console.log('Creating users table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        password TEXT NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'user',
        two_factor_secret TEXT,
        two_factor_enabled BOOLEAN DEFAULT false,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    console.log('Users table created successfully!');

    // Verify table creation
    const result = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      );
    `);
    console.log('Users table exists:', result.rows[0].exists);

    client.release();
  } catch (error) {
    console.error('Error during database initialization:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the initialization
init().catch(console.error);

export default init; 