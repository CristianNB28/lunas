const mysql = require('mysql');
const pool =  mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    timezone: process.env.DB_TIMEZONE
});

pool.getConnection((error, callback) => {
    if (error) {
        console.log('El error de conexion es: ' + error);
        callback(true);
        return;
    }
    console.log('Conectado a la base de datos');
});

module.exports = pool;