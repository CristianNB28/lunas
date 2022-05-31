const db = require('../../config/database');

module.exports = {
/*                  GET                  */
    getCycleDate: (idUser) => {
        return new Promise((resolve, reject) => {
            db.getConnection((err, connection) => {
                if(err) { 
                    console.log(err); 
                    return; 
                }
                connection.query('SELECT * FROM Fecha_Ciclo WHERE usuario_id = ?', 
                [idUser],
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
    getPoll: (idUser) => {
        return new Promise((resolve, reject) => {
            db.getConnection((err, connection) => {
                if(err) { 
                    console.log(err); 
                    return; 
                }
                connection.query('SELECT * FROM Encuesta WHERE usuario_id = ?',
                [idUser],
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
    getUnderEighteenAccountant: () => {
        return new Promise((resolve, reject) => {
            db.getConnection((err, connection) => {
                if(err) { 
                    console.log(err); 
                    return; 
                }
                connection.query(`SELECT COUNT(*) AS contador_menores FROM Encuesta WHERE edad_encuestada = 'Under 18 years old'` ,
                [],
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
    getOverEighteenAccountant: () => {
        return new Promise((resolve, reject) => {
            db.getConnection((err, connection) => {
                if(err) { 
                    console.log(err); 
                    return; 
                }
                connection.query(`SELECT COUNT(*) AS contador_media 
                                FROM Encuesta 
                                WHERE edad_encuestada = '18 to 24 years old' OR
                                edad_encuestada = '25 to 34 years old' OR
                                edad_encuestada = '35 to 44 years old' OR
                                edad_encuestada = '45 to 54 years old'`,
                [],
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
    getOverFiftyFourAccountant: () => {
        return new Promise((resolve, reject) => {
            db.getConnection((err, connection) => {
                if(err) { 
                    console.log(err); 
                    return; 
                }
                connection.query(`SELECT COUNT(*) AS contador_mayores FROM Encuesta WHERE edad_encuestada = 'Over 54 years old'` ,
                [],
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
    getPreparatorySurvey: () => {
        return new Promise((resolve, reject) => {
            db.getConnection((err, connection) => {
                if(err) { 
                    console.log(err); 
                    return; 
                }
                connection.query(`SELECT COUNT(*) AS contador_preparatoria FROM Encuesta WHERE nivel_escolar_encuestada = 'Preparatory'` ,
                [],
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
    getBachelorSurvey: () => {
        return new Promise((resolve, reject) => {
            db.getConnection((err, connection) => {
                if(err) { 
                    console.log(err); 
                    return; 
                }
                connection.query(`SELECT COUNT(*) AS contador_licenciatura FROM Encuesta WHERE nivel_escolar_encuestada = "Bachelor's Degree"` ,
                [],
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
    getMasterSurvey: () => {
        return new Promise((resolve, reject) => {
            db.getConnection((err, connection) => {
                if(err) { 
                    console.log(err); 
                    return; 
                }
                connection.query(`SELECT COUNT(*) AS contador_master FROM Encuesta WHERE nivel_escolar_encuestada = "Master's Degree"` ,
                [],
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
    getDoctorateSurvey: () => {
        return new Promise((resolve, reject) => {
            db.getConnection((err, connection) => {
                if(err) { 
                    console.log(err); 
                    return; 
                }
                connection.query(`SELECT COUNT(*) AS contador_doctorado FROM Encuesta WHERE nivel_escolar_encuestada = 'Doctorate'` ,
                [],
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
    postUserForm: (poll, idUser) => {
        return new Promise((resolve, reject) => {
            db.getConnection((err, connection) => {
                if(err) { 
                    console.log(err); 
                    return; 
                }
                connection.query(`INSERT INTO Encuesta (nombre_encuestada, edad_encuestada, nivel_escolar_encuestada, situacion_laboral_encuestada, descripcion_encuestada, usuario_id)
                                VALUES (?, ?, ?, ?, ?, ?)`, 
                [poll.nombre_encuestada, poll.edad_encuestada, poll.nivel_escolar_encuestada, poll.situacion_laboral_encuestada, poll.descripcion_encuestada, idUser], 
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
    postCycleDate: (date, idUser) => {
        return new Promise((resolve, reject) => {
            db.getConnection((err, connection) => {
                if(err) { 
                    console.log(err); 
                    return; 
                }
                connection.query(`INSERT INTO Fecha_Ciclo (fec_ciclo, usuario_id)
                                VALUES (?, ?)`, 
                [date, idUser], 
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
/*                  PUT                  */
    updatePoll: (poll) => {
        return new Promise((resolve, reject) => {
            db.getConnection((err, connection) => {
                if(err) { 
                    console.log(err); 
                    return; 
                }
                connection.query(`UPDATE Encuesta 
                                SET nombre_encuestada=?, edad_encuestada=?, nivel_escolar_encuestada=?, situacion_laboral_encuestada=?, descripcion_encuestada=?    
                                WHERE usuario_id=?`, 
                [poll.nombre_encuestada, poll.edad_encuestada, poll.nivel_escolar_encuestada, poll.situacion_laboral_encuestada, poll.descripcion_encuestada, poll.id_usuario], 
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
    updateCycleDate: (date, idUser) => {
        return new Promise((resolve, reject) => {
            db.getConnection((err, connection) => {
                if(err) { 
                    console.log(err); 
                    return; 
                }
                connection.query(`UPDATE Fecha_Ciclo 
                                SET fec_ciclo=?   
                                WHERE usuario_id=?`, 
                [date, idUser], 
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
/*               DELETE                  */
    deletePoll: (idUser) => {
        return new Promise((resolve, reject) => {
            db.getConnection((err, connection) => {
                if(err) { 
                    console.log(err); 
                    return; 
                }
                connection.query('DELETE FROM Encuesta WHERE usuario_id = ?', [idUser],
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
    deleteCycleDate: (idUser) => {
        return new Promise((resolve, reject) => {
            db.getConnection((err, connection) => {
                if(err) { 
                    console.log(err); 
                    return; 
                }
                connection.query('DELETE FROM Fecha_Ciclo WHERE usuario_id = ?', [idUser],
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
}