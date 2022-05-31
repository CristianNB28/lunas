const db = require('../../config/database');

module.exports = {
/*                  GET                  */
    getCycle: (dayCycle) => {
        return new Promise((resolve, reject) => {
            db.getConnection((err, connection) => {
                if(err) { 
                    console.log(err); 
                    return; 
                }
                connection.query('SELECT * FROM Ciclo WHERE dia_ciclo = ?', [dayCycle],
                (error, rows) => {
                    connection.release();
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve(rows);
                });
            });
        });
    },
/*                  POST                 */
/*                  PUT                  */
/*               DELETE                  */
}