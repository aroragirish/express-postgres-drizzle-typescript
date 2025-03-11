import express from 'express';
import dotenv from 'dotenv';
import routes from './routes';
import { db } from './config/database';
import { Pool } from 'pg';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Database connection test
const testDbConnection = async () => {
  const config = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'express_api',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    ssl: false
  };

  console.log('Attempting to connect to database with config:', {
    ...config,
    password: '******' // Hide password in logs
  });

  try {
    const pool = new Pool(config);

    const client = await pool.connect();
    console.log('Successfully connected to PostgreSQL');
    const result = await client.query('SELECT NOW()');
    console.log('Database time:', result.rows[0].now);
    
    // Test if we can access the users table
    const usersTest = await client.query('SELECT COUNT(*) FROM users');
    console.log('Number of users in database:', usersTest.rows[0].count);
    
    client.release();
    await pool.end();
  } catch (err) {
    console.error('Database connection error:', err);
    console.error('Environment variables:', {
      DB_HOST: process.env.DB_HOST,
      DB_PORT: process.env.DB_PORT,
      DB_NAME: process.env.DB_NAME,
      DB_USER: process.env.DB_USER,
      DATABASE_URL: process.env.DATABASE_URL?.replace(/:[^:]*@/, ':****@') // Hide password in connection string
    });
    process.exit(1);
  }
};

app.use(express.json());

// API Routes
app.use('/api', routes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Test database connection before starting the server
testDbConnection().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}); 