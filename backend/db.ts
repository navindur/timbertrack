import mysql from 'mysql2';

// Create the MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',    // The MySQL host (localhost if running locally)
  user: 'root',         // MySQL username
  password: 'root',     // MySQL password (ensure this is correct)
  database: 'timbertrack', // Database name
  waitForConnections: true,  // Allow waiting for available connections
  connectionLimit: 10,   // Maximum number of connections in the pool
  queueLimit: 0          // No limit on connection requests waiting
});

// Wrap the pool with a promise-based API
const promisePool = pool.promise();

// Export the promisePool object so you can query the DB in other files
export default promisePool;
