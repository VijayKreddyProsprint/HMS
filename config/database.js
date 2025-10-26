

const mysql = require('mysql2');

// Create connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'nexuxrdbserver.mysql.database.azure.com',
    user: process.env.DB_USER || 'nexuxradmin',
    password: process.env.DB_PASSWORD || 'Portal123!',
    database: process.env.DB_NAME || 'HMS',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

// Get promise-based connection
const promisePool = pool.promise();

// Test database connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error(' Database connection failed:', err.message);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.');
        }
    } else {
        console.log(' Database connected successfully');
        console.log(` Database: ${process.env.DB_NAME}`);
        connection.release();
    }
});

// Handle pool errors
pool.on('error', (err) => {
    console.error(' Unexpected database error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.error('Database connection was closed. Reconnecting...');
    } else {
        throw err;
    }
});


module.exports = promisePool;
