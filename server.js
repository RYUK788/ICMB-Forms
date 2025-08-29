import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';

const app = express();
const port = 3005;

app.use(cors());
app.use(express.json());

const dbConfig = {
  host: 'localhost',
  user: 'golgix',
  password: 'preciseV5',
  database: 'golgixportal',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);
console.log("✅ Database connection pool created successfully.");

// The route that handles GET requests to /api/batches
app.get('/api/batches', async (req, res) => {
  try {
    console.log('[Server] Received request for /api/batches');
    const [rows] = await pool.execute('SELECT DISTINCT batch_number FROM golgixportal.fermentation_data WHERE batch_number IS NOT NULL AND batch_number != ""');
    console.log(`[Server] Found ${rows.length} batches. Sending response.`);
    res.json(rows);
  } catch (error) {
    console.error('[Server] ❌ An error occurred:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

setInterval(() => {}, 600000);

app.listen(port, () => {
  console.log(`✅ Server is running and listening on http://localhost:${port}`);
});