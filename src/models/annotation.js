const db = require('../../config/database');

module.exports = {
/*                  GET                  */
    getAnnotation: (idUser) => {
        return new Promise((resolve, reject) => {
            db.getConnection((err, connection) => {
                if(err) { 
                    console.log(err); 
                    return; 
                }
                connection.query('SELECT * FROM Anotacion WHERE usuario_id = ?', [idUser],
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
    getAnnotations: () => {
        return new Promise((resolve, reject) => {
            db.getConnection((err, connection) => {
                if(err) { 
                    console.log(err); 
                    return; 
                }
                connection.query('SELECT * FROM Anotacion',
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
    getHappyCounterAnnotations: () => {
        return new Promise((resolve, reject) => {
            db.getConnection((err, connection) => {
                if(err) { 
                    console.log(err); 
                    return; 
                }
                connection.query(`SELECT COUNT(*) AS contador_feliz FROM Anotacion WHERE estado_animo_anotacion = 'happy'`,
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
    getSadCounterAnnotations: () => {
        return new Promise((resolve, reject) => {
            db.getConnection((err, connection) => {
                if(err) { 
                    console.log(err); 
                    return; 
                }
                connection.query(`SELECT COUNT(*) AS contador_triste FROM Anotacion WHERE estado_animo_anotacion = 'sad'`,
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
    getRegularCounterAnnotations: () => {
        return new Promise((resolve, reject) => {
            db.getConnection((err, connection) => {
                if(err) { 
                    console.log(err); 
                    return; 
                }
                connection.query(`SELECT COUNT(*) AS contador_medio FROM Anotacion WHERE estado_animo_anotacion = 'regular'`,
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
    getAnnotationsDates: () => {
        return new Promise((resolve, reject) => {
            db.getConnection((err, connection) => {
                if(err) { 
                    console.log(err); 
                    return; 
                }
                connection.query(`SELECT fecha_anotacion, COUNT(*) AS contador_anotacion
                                FROM Anotacion
                                WHERE fecha_anotacion BETWEEN date_add(NOW(), INTERVAL -7 DAY) AND NOW()
                                GROUP BY fecha_anotacion
                                ORDER BY fecha_anotacion ASC`,
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
    getDates: () => {
        return new Promise((resolve, reject) => {
            db.getConnection((err, connection) => {
                if(err) { 
                    console.log(err); 
                    return; 
                }
                connection.query(`SELECT DATE(NOW() - INTERVAL n DAY) AS date
                                FROM (
                                    SELECT 0 n
                                    UNION SELECT 1
                                    UNION SELECT 2
                                    UNION SELECT 3
                                    UNION SELECT 4
                                    UNION SELECT 5
                                    UNION SELECT 6
                                ) q
                                ORDER BY date ASC`,
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
    getAverageHappyDateSurvey: (idUser) => {
        return new Promise((resolve, reject) => {
            db.getConnection((err, connection) => {
                if(err) { 
                    console.log(err); 
                    return; 
                }
                connection.query(`SELECT AVG(datediff(fmf.fecha_maxima_feliz, fmif.fecha_minima_feliz)) AS promedio_fecha_feliz
                                FROM Anotacion, (
                                    SELECT MAX(fecha_anotacion) AS fecha_maxima_feliz
                                    FROM Anotacion
                                    WHERE estado_animo_anotacion="happy" AND usuario_id=?
                                ) fmf,
                                (
                                    SELECT MIN(fecha_anotacion) AS fecha_minima_feliz
                                    FROM Anotacion
                                    WHERE estado_animo_anotacion="happy" AND usuario_id=?
                                ) fmif
                                WHERE estado_animo_anotacion="happy"` ,
                [idUser, idUser],
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
    getAverageSadDateSurvey: (idUser) => {
        return new Promise((resolve, reject) => {
            db.getConnection((err, connection) => {
                if(err) { 
                    console.log(err); 
                    return; 
                }
                connection.query(`SELECT AVG(datediff(fmt.fecha_maxima_triste, fmit.fecha_minima_triste)) as promedio_fecha_triste
                                FROM Anotacion, (
                                    SELECT MAX(fecha_anotacion) as fecha_maxima_triste
                                    FROM Anotacion
                                    WHERE estado_animo_anotacion="sad" AND usuario_id=?
                                ) fmt,
                                (
                                    SELECT MIN(fecha_anotacion) as fecha_minima_triste
                                    FROM Anotacion
                                    WHERE estado_animo_anotacion="sad" AND usuario_id=?
                                ) fmit
                                WHERE estado_animo_anotacion="sad"` ,
                [idUser, idUser],
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
    postAnnotation: (annotationTitle, annotationDate, annotationEndPeriod, newDateSexualAct, annotation, idUser) => {
        return new Promise((resolve, reject) => {
            db.getConnection((err, connection) => {
                if(err) { 
                    console.log(err); 
                    return; 
                }
                connection.query(`INSERT INTO Anotacion (titulo_anotacion, descripcion_anotacion, fecha_anotacion, fin_periodo_anotacion, fecha_acto_sexual_anotacion, peso_actual_anotacion, estado_animo_anotacion, usuario_id)
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
                [annotationTitle, annotation.descripcion_anotacion, annotationDate, annotationEndPeriod, newDateSexualAct, annotation.peso_actual_anotacion, annotation.estado_animo_anotacion, idUser],
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
    updateAnnotation: (annotationEndPeriod, newDateSexualAct, annotation) => {
        return new Promise((resolve, reject) => {
            db.getConnection((err, connection) => {
                if(err) { 
                    console.log(err);
                    return; 
                }
                connection.query(`UPDATE Anotacion 
                                SET descripcion_anotacion=?, fin_periodo_anotacion=?, fecha_acto_sexual_anotacion=?, peso_actual_anotacion=?, estado_animo_anotacion=?   
                                WHERE id_anotacion=?`, 
                [annotation.descripcion_anotacion, annotationEndPeriod, newDateSexualAct, annotation.peso_actual_anotacion, annotation.estado_animo_anotacion, annotation.id_anotacion],
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
    deleteAnnotation: (idUser) => {
        return new Promise((resolve, reject) => {
            db.getConnection((err, connection) => {
                if(err) { 
                    console.log(err); 
                    return; 
                }
                connection.query('DELETE FROM Anotacion WHERE usuario_id = ?', [idUser],
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