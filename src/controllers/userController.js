const pollModel = require('../models/poll');
const userModel = require('../models/user');
const cycleModel = require('../models/cycle');
const annotationModel = require('../models/annotation');
const bannerModel = require('../models/banner');

module.exports = {
/*                  GET                  */
    getUserForm: (req, res) => {
        res.render('userForm');
    },
    getCycleDate: (req, res) => {
        res.render('cycleDate');
    },
    getCalendarPeriod: async (req, res) => {
        try {
            const periodDays = 28;
            let testosteroneArray = [];
            let estrogenArray = [];
            let progesteroneArray = [];
            let resultUser = await userModel.getUser(req.session.name);
            let resultAnnotation = await annotationModel.getAnnotation(resultUser[0].id_usuario);
            let arrayAnnotation = [];
            let objectAnnotation = {};
            let resultsBanners = await bannerModel.getBannersTotal();
            const averageHappyDate = await annotationModel.getAverageHappyDateSurvey(resultUser[0].id_usuario);
            const averageSadDate = await annotationModel.getAverageSadDateSurvey(resultUser[0].id_usuario);
            for (const annotation of resultAnnotation) {
                if ((annotation.fin_periodo_anotacion === null) && (annotation.fecha_acto_sexual_anotacion === null)) {
                    objectAnnotation = {
                        title: annotation.titulo_anotacion,
                        start: annotation.fecha_anotacion.toISOString().slice(0,10),
                        color: '#ff00ff',
                        description: annotation.descripcion_anotacion,
                        endPeriod: '',
                        sexualAct: '',
                        actualWeight: annotation.peso_actual_anotacion,
                        mood: annotation.estado_animo_anotacion,
                        id: annotation.id_anotacion,
                    };
                } else if (annotation.fin_periodo_anotacion === null) {
                    objectAnnotation = {
                        title: annotation.titulo_anotacion,
                        start: annotation.fecha_anotacion.toISOString().slice(0,10),
                        color: '#ff00ff',
                        description: annotation.descripcion_anotacion,
                        endPeriod: '',
                        sexualAct: annotation.fecha_acto_sexual_anotacion.toISOString().substring(0, 16),
                        actualWeight: annotation.peso_actual_anotacion,
                        mood: annotation.estado_animo_anotacion,
                        id: annotation.id_anotacion,
                    };
                } else if (annotation.fecha_acto_sexual_anotacion === null) {
                    objectAnnotation = {
                        title: annotation.titulo_anotacion,
                        start: annotation.fecha_anotacion.toISOString().slice(0,10),
                        color: '#ff00ff',
                        description: annotation.descripcion_anotacion,
                        endPeriod: annotation.fin_periodo_anotacion.toISOString().substring(0, 10),
                        sexualAct: '',
                        actualWeight: annotation.peso_actual_anotacion,
                        mood: annotation.estado_animo_anotacion,
                        id: annotation.id_anotacion,
                    };
                } else {
                    objectAnnotation = {
                        title: annotation.titulo_anotacion,
                        start: annotation.fecha_anotacion.toISOString().slice(0,10),
                        color: '#ff00ff',
                        description: annotation.descripcion_anotacion,
                        endPeriod: annotation.fin_periodo_anotacion.toISOString().substring(0, 10),
                        sexualAct: annotation.fecha_acto_sexual_anotacion.toISOString().substring(0, 16),
                        actualWeight: annotation.peso_actual_anotacion,
                        mood: annotation.estado_animo_anotacion,
                        id: annotation.id_anotacion,
                    };
                }
                arrayAnnotation.push(objectAnnotation);
            }
            let resultCycleDate = await pollModel.getCycleDate(resultUser[0].id_usuario);
            let stringDate = resultCycleDate[0].fec_ciclo.toISOString();
            let endDate = new Date(stringDate);
            endDate.setDate(endDate.getDate() + periodDays);
            let currentDay = new Date();
            let elapsedDay = (endDate - currentDay) / (1000*60*60*24);
            elapsedDay = periodDays - elapsedDay;
            elapsedDay = Math.floor(elapsedDay);
            if (elapsedDay > 0) {
                if (elapsedDay === 1) {
                    let nextElapsedDay = elapsedDay + 1;
                    let resultCycle = await cycleModel.getCycle(elapsedDay);
                    let resultCycleNextDay = await cycleModel.getCycle(nextElapsedDay);
                    testosteroneArray = [resultCycle[0].testosterona_ciclo, resultCycleNextDay[0].testosterona_ciclo];
                    estrogenArray = [resultCycle[0].estrogeno_ciclo, resultCycleNextDay[0].estrogeno_ciclo];
                    progesteroneArray = [resultCycle[0].progesterona_ciclo, resultCycleNextDay[0].progesterona_ciclo];
                } else if (elapsedDay < periodDays) {
                    let previousElapsedDay = elapsedDay - 1; 
                    let nextElapsedDay = elapsedDay + 1;
                    let resultCycle = await cycleModel.getCycle(elapsedDay);
                    let resultCyclePreviousDay = await cycleModel.getCycle(previousElapsedDay);
                    let resultCycleNextDay = await cycleModel.getCycle(nextElapsedDay);
                    testosteroneArray = [resultCyclePreviousDay[0].testosterona_ciclo, resultCycle[0].testosterona_ciclo, resultCycleNextDay[0].testosterona_ciclo];
                    estrogenArray = [resultCyclePreviousDay[0].estrogeno_ciclo, resultCycle[0].estrogeno_ciclo, resultCycleNextDay[0].estrogeno_ciclo];
                    progesteroneArray = [resultCyclePreviousDay[0].progesterona_ciclo, resultCycle[0].progesterona_ciclo, resultCycleNextDay[0].progesterona_ciclo];
                } else if (elapsedDay === periodDays) {
                    let previousElapsedDay = elapsedDay - 1;
                    let resultCycle = await cycleModel.getCycle(elapsedDay);
                    let resultCyclePreviousDay = await cycleModel.getCycle(previousElapsedDay);
                    testosteroneArray = [resultCyclePreviousDay[0].testosterona_ciclo, resultCycle[0].testosterona_ciclo];
                    estrogenArray = [resultCyclePreviousDay[0].estrogeno_ciclo, resultCycle[0].estrogeno_ciclo];
                    progesteroneArray = [resultCyclePreviousDay[0].progesterona_ciclo, resultCycle[0].progesterona_ciclo];
                }
            }
            if (resultAnnotation.length === 0) {
                res.render('calendarPeriod', {
                    elapsedDay: elapsedDay,
                    testosteroneArray: testosteroneArray,
                    estrogenArray: estrogenArray,
                    progesteroneArray: progesteroneArray,
                    periodDays: periodDays,
                    banners: resultsBanners,
                    averageHappyDate: averageHappyDate[0],
                    averageSadDate: averageSadDate[0]
                });
            } else {
                res.render('calendarPeriod', {
                    elapsedDay: elapsedDay,
                    testosteroneArray: testosteroneArray,
                    estrogenArray: estrogenArray,
                    progesteroneArray: progesteroneArray,
                    periodDays: periodDays,
                    annotation: arrayAnnotation,
                    banners: resultsBanners,
                    averageHappyDate: averageHappyDate[0],
                    averageSadDate: averageSadDate[0]
                });
            }
        } catch (error) {
            console.log(error);
        }
    },
    getAnnotations: async (req, res) => {
        let resultUser = await userModel.getUser(req.session.name);
        let resultsAnnotations = await annotationModel.getAnnotation(resultUser[0].id_usuario);
        for (const annotation of resultsAnnotations) {
            annotation.fecha_anotacion = annotation.fecha_anotacion.toISOString().substr(0,10).replace(/(\d{4})-(\d{2})-(\d{2})/g,"$3/$2/$1");
            if ((annotation.fin_periodo_anotacion === null) && (annotation.fecha_acto_sexual_anotacion === null)) {
                annotation.fin_periodo_anotacion = '';
                annotation.fecha_acto_sexual_anotacion = '';
            } else if (annotation.fin_periodo_anotacion === null) {
                annotation.fin_periodo_anotacion = '';
                let userTimezoneOffset = annotation.fecha_acto_sexual_anotacion.getTimezoneOffset() * 60000;
                annotation.fecha_acto_sexual_anotacion = new Date(annotation.fecha_acto_sexual_anotacion.getTime() + userTimezoneOffset);
                annotation.fecha_acto_sexual_anotacion = annotation.fecha_acto_sexual_anotacion.toLocaleString();
            } else if (annotation.fecha_acto_sexual_anotacion === null) {
                annotation.fin_periodo_anotacion = annotation.fin_periodo_anotacion.toISOString().substr(0,10).replace(/(\d{4})-(\d{2})-(\d{2})/g,"$3/$2/$1");
                annotation.fecha_acto_sexual_anotacion = '';
            } else {
                annotation.fin_periodo_anotacion = annotation.fin_periodo_anotacion.toISOString().substr(0,10).replace(/(\d{4})-(\d{2})-(\d{2})/g,"$3/$2/$1");
                let userTimezoneOffset = annotation.fecha_acto_sexual_anotacion.getTimezoneOffset() * 60000;
                annotation.fecha_acto_sexual_anotacion = new Date(annotation.fecha_acto_sexual_anotacion.getTime() + userTimezoneOffset);
                annotation.fecha_acto_sexual_anotacion = annotation.fecha_acto_sexual_anotacion.toLocaleString();
            }
        }
        res.render('annotations', {
            data: resultsAnnotations
        });
    },
/*                  POST                 */
    postUserForm: async (req, res) => {
        try {
            let resultUser = await userModel.getUser(req.session.name);
            await pollModel.postUserForm(req.body, resultUser[0].id_usuario);
            res.render('userForm', {
                alert: true,
                alertTitle: 'Successful',
                alertMessage: 'Data recorded successfully',
                alertIcon: 'success',
                showConfirmButton: false,
                timer: 1500,
                ruta: 'cycle-date'
            });
        } catch (error) {
            console.log(error);
            res.render('userForm', {
                alert: true,
                alertTitle: 'Error',
                alertMessage: error.message,
                alertIcon: 'error',
                showConfirmButton: true,
                timer: 1500,
                ruta: 'user-form'
            });
        }
    },
    postCycleDate: async (req, res) => {
        try {
            let cycleDate = new Date(req.body.fecha_ciclo);
            let resultUser = await userModel.getUser(req.session.name);
            await pollModel.postCycleDate(cycleDate, resultUser[0].id_usuario);
            res.render('cycleDate', {
                alert: true,
                alertTitle: 'Successful',
                alertMessage: 'Data recorded successfully',
                alertIcon: 'success',
                showConfirmButton: false,
                timer: 1500,
                ruta: 'calendar-period'
            });
        } catch (error) {
            console.log(error);
            res.render('cycleDate', {
                alert: true,
                alertTitle: 'Error',
                alertMessage: error.message,
                alertIcon: 'error',
                showConfirmButton: true,
                timer: 1500,
                ruta: 'cycle-date'
            });
        }
    },
    postCalendarPeriod: async (req, res) => {
        try {
            let annotationTitle = '<i class="nc-icon nc-notes" aria-hidden="true"></i>';
            let annotationDate = new Date(req.body.fecha_anotacion);
            let annotationEndPeriod = new Date(req.body.fin_periodo_anotacion);
            let annotationSexualAct = new Date(req.body.fecha_acto_sexual_anotacion);
            let userTimezoneOffset = annotationSexualAct.getTimezoneOffset() * 60000;
            let newDateSexualAct = new Date(annotationSexualAct.getTime() - userTimezoneOffset);
            let resultUser = await userModel.getUser(req.session.name);
            await annotationModel.postAnnotation(annotationTitle, annotationDate, annotationEndPeriod, newDateSexualAct, req.body, resultUser[0].id_usuario);
            res.redirect('/calendar-period');
        } catch (error) {
            console.log(error);
        }
    },
/*                  PUT                  */
    putCycleDate: async (req, res) => {
        res.render('editCycleDate');
    },
    updateCalendarPeriod: async (req, res) => {
        try {
            let annotationEndPeriod = new Date(req.body.fin_periodo_anotacion);
            let annotationSexualAct = new Date(req.body.fecha_acto_sexual_anotacion);
            let userTimezoneOffset = annotationSexualAct.getTimezoneOffset() * 60000;
            let newDateSexualAct = new Date(annotationSexualAct.getTime() - userTimezoneOffset);
            await annotationModel.updateAnnotation(annotationEndPeriod, newDateSexualAct, req.body);
            res.redirect('/calendar-period');
        } catch (error) {
            console.log(error);
        }
    },
    updateCycleDate: async (req, res) => {
        try {
            let cycleDate = new Date(req.body.fecha_ciclo);
            let resultUser = await userModel.getUser(req.session.name);
            await pollModel.updateCycleDate(cycleDate, resultUser[0].id_usuario);
            res.render('editCycleDate', {
                alert: true,
                alertTitle: 'Successful',
                alertMessage: 'Data recorded successfully',
                alertIcon: 'success',
                showConfirmButton: false,
                timer: 1500,
                ruta: 'calendar-period'
            });
        } catch (error) {
            console.log(error);
            res.render('editCycleDate', {
                alert: true,
                alertTitle: 'Error',
                alertMessage: error.message,
                alertIcon: 'error',
                showConfirmButton: true,
                timer: 1500,
                ruta: 'cycle-date'
            });
        }
    },
}