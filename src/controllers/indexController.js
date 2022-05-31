const userModel = require('../models/user');
const pollModel = require('../models/poll');
const annotationModel = require('../models/annotation');
const bannerModel = require('../models/banner');
const bcrypt = require('bcryptjs');
const fs = require("fs");
const path = require('path');

module.exports = {
/*                  GET                  */
    getIndex: async (req, res) => {
        const arrayAnnotations = [];
        const arrayUsers = [];
        const arrayAnnotationsDates = [];
        const countUsers = await userModel.getCounterUsers();
        const countAnnotationsHappy = await annotationModel.getHappyCounterAnnotations();
        const countAnnotationsSad = await annotationModel.getSadCounterAnnotations();
        const countAnnotationsRegular = await annotationModel.getRegularCounterAnnotations();
        const countUnderEighteen = await pollModel.getUnderEighteenAccountant();
        const countOverEighteen = await pollModel.getOverEighteenAccountant();
        const countOverFiftyFour = await pollModel.getOverFiftyFourAccountant();
        let percentageUnderEighteen = (countUnderEighteen[0].contador_menores * 100) / countUsers[0].contador_usuarias;
        const percentageUnderEighteenString = `${percentageUnderEighteen.toFixed(2)}%`;
        percentageUnderEighteen = Number(percentageUnderEighteen.toFixed(2));
        let percentageOverEighteen = (countOverEighteen[0].contador_media * 100) / countUsers[0].contador_usuarias;
        const percentageOverEighteenString = `${percentageOverEighteen.toFixed(2)}%`;
        percentageOverEighteen = Number(percentageOverEighteen.toFixed(2));
        let percentageOverFiftyFour = (countOverFiftyFour[0].contador_mayores * 100) / countUsers[0].contador_usuarias;
        const percentageOverFiftyFourString = `${percentageOverFiftyFour.toFixed(2)}%`;
        percentageOverFiftyFour = Number(percentageOverFiftyFour.toFixed(2));
        const arrayPercentage = [percentageUnderEighteen, percentageOverEighteen, percentageOverFiftyFour];
        const arrayPercentageString = [percentageUnderEighteenString, percentageOverEighteenString, percentageOverFiftyFourString];
        const datesAnotation = await annotationModel.getAnnotationsDates();
        const datesUsers = await userModel.getUsersDates();
        const weekDate = await annotationModel.getDates();
        const countPreparatorySurvey = await pollModel.getPreparatorySurvey();
        const countBachelorSurvey = await pollModel.getBachelorSurvey();
        const countMasterSurvey = await pollModel.getMasterSurvey();
        const countDoctorateSurvey = await pollModel.getDoctorateSurvey();
        const arrayPollDegreeStudy = [
            countPreparatorySurvey[0].contador_preparatoria, 
            countBachelorSurvey[0].contador_licenciatura, 
            countMasterSurvey[0].contador_master, 
            countDoctorateSurvey[0].contador_doctorado
        ];
        for (let i = 0; i < weekDate.length; i++) {
            const elementWeekDate = weekDate[i];
            let dateString = elementWeekDate.date.toISOString().substr(0,10).replace(/(\d{4})-(\d{2})-(\d{2})/g,"$3/$2/$1");
            let booleanDates = datesAnotation.some(date => date.fecha_anotacion.getTime() === elementWeekDate.date.getTime());
            let elementAnnotation = datesAnotation.filter(date => date.fecha_anotacion.getTime() === elementWeekDate.date.getTime()).map(annotation => annotation.contador_anotacion);
            if (booleanDates) {
                arrayAnnotations.push(elementAnnotation[0]);
            } else {
                arrayAnnotations.push(0);
            }
            arrayAnnotationsDates.push(dateString);
        }
        for (let i = 0; i < weekDate.length; i++) {
            const elementWeekDate = weekDate[i];
            let booleanDates = datesUsers.some(date => date.fecha_inscripcion_usuario.getTime() === elementWeekDate.date.getTime());
            let elementUser = datesUsers.filter(date => date.fecha_inscripcion_usuario.getTime() === elementWeekDate.date.getTime()).map(user => user.contador_usuaria);
            if (booleanDates) {
                arrayUsers.push(elementUser[0]);
            } else {
                arrayUsers.push(0);
            }
        }
        res.render('index', {
            countUsers: countUsers[0],
            countAnnotationsHappy: countAnnotationsHappy[0],
            countAnnotationsSad: countAnnotationsSad[0],
            countAnnotationsRegular: countAnnotationsRegular[0],
            arrayPercentage,
            arrayPercentageString,
            arrayAnnotationsDates,
            arrayAnnotations,
            arrayUsers,
            arrayPollDegreeStudy
        });
    },
    getUser: (req, res) => {
        res.render('addUser');
    },
    getBanner: (req, res) => {
        res.render('addBanner');
    },
    getUsers: async (req, res) => {
        let resultsUsers = await userModel.getUsers();
        let resultsData = [];
        for (const resultUser of resultsUsers) {
            let resultPoll = await pollModel.getPoll(resultUser.id_usuario);
            let objectData = {
                id_usuario: resultUser.id_usuario,
                nombre_encuestada: resultPoll[0].nombre_encuestada,
                correo_usuario: resultUser.correo_usuario,
                descripcion_encuestada: resultPoll[0].descripcion_encuestada,
                password_usuario: resultUser.password_usuario,
            };
            resultsData.push(objectData);
        }
        res.render('users',{
            data: resultsData,
            name: req.session.name 
        });
    },
    getAnnotationsUsers: async (req, res) => {
        let resultsUsers = await userModel.getUsers();
        let resultAnnotationsUsers = [];
        for (const resultUser of resultsUsers) {
            let resultsAnnotations = await annotationModel.getAnnotation(resultUser.id_usuario);
            let resultPoll = await pollModel.getPoll(resultUser.id_usuario);
            let objectAnnotationUser = {};
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
                objectAnnotationUser = {
                    nombre_encuestada: resultPoll[0].nombre_encuestada,
                    correo_usuario: resultUser.correo_usuario,
                    descripcion_anotacion:  annotation.descripcion_anotacion,
                    fecha_anotacion: annotation.fecha_anotacion,
                    fin_periodo_anotacion: annotation.fin_periodo_anotacion,
                    fecha_acto_sexual_anotacion: annotation.fecha_acto_sexual_anotacion,
                    peso_actual_anotacion: annotation.peso_actual_anotacion,
                    estado_animo_anotacion: annotation.estado_animo_anotacion
                }
                resultAnnotationsUsers.push(objectAnnotationUser);
            }
        }
        res.render('annotationsUsers', {
            data: resultAnnotationsUsers
        });
    },
    getBanners: async (req, res) => {
        let resultUser = await userModel.getUser(req.session.name);
        let resultsBanners = await bannerModel.getBanners(resultUser[0].id_usuario);
        res.render('banners',{
            data: resultsBanners,
            name: req.session.name 
        });
    },
/*                  POST                  */
    postUser: async (req, res) => {
        try {
            let passwordHash = await bcrypt.hash(req.body.password_usuario, 8);
            const admin = 0;
            const registeredDate = new Date();
            let cycleDate = new Date(req.body.fecha_ciclo);
            let user = await userModel.postUserRegistration(passwordHash, admin, registeredDate, req.body);
            await pollModel.postUserForm(req.body, user.insertId);
            await pollModel.postCycleDate(cycleDate, user.insertId);
            res.render('addUser', {
                alert: true,
                alertTitle: 'Successful',
                alertMessage: 'Data recorded successfully',
                alertIcon: 'success',
                showConfirmButton: false,
                timer: 1500,
                ruta: 'users',
                name: req.session.name
            });
        } catch (error) {
            console.log(error);
            res.render('addUser', {
                alert: true,
                alertTitle: 'Error',
                alertMessage: error.message,
                alertIcon: 'error',
                showConfirmButton: true,
                timer: 1500,
                ruta: 'add-user',
                name: req.session.name
            });
        }
    },
    postBanner: async (req, res) => {
        try {
            let resultUser = await userModel.getUser(req.session.name);
            let namesImages = req.files.map(file => {
                return [file.filename, resultUser[0].id_usuario]
            });
            await bannerModel.postBanner(namesImages);
            res.render('addBanner', {
                alert: true,
                alertTitle: 'Successful',
                alertMessage: 'Data recorded successfully',
                alertIcon: 'success',
                showConfirmButton: false,
                timer: 1500,
                ruta: '',
                name: req.session.name
            });
        } catch (error) {
            console.log(error);
            res.render('addBanner', {
                alert: true,
                alertTitle: 'Error',
                alertMessage: error.message,
                alertIcon: 'error',
                showConfirmButton: true,
                timer: 1500,
                ruta: 'add-banner',
                name: req.session.name
            });
        }
    },
/*                  PUT                  */
    putUser: async (req, res) => {
        let resultUser = await userModel.getUserId(req.params.id);
        let resultPoll = await pollModel.getPoll(req.params.id);
        res.render('editUser', {
            user: resultUser[0],
            poll: resultPoll[0],
            name: req.session.name
        });
    },
    updateUser: async (req, res) => {
        let idUser = req.body.id_usuario;
        let resultUser = await userModel.getUserId(idUser);
        let resultPoll = await pollModel.getPoll(idUser);
        try {
            if (req.body.password_usuario !== resultUser[0].password_usuario) {
                let newPassword = await bcrypt.hash(req.body.password_usuario, 8);
                await userModel.updateUser(newPassword, req.body);
                await pollModel.updatePoll(req.body);
            } else {
                await userModel.updateUser(req.body.password_usuario, req.body);
                await pollModel.updatePoll(req.body);
            }
            res.render('editUser', {
                alert: true,
                alertTitle: 'Successful',
                alertMessage: 'Data updated successfully',
                alertIcon: 'success',
                showConfirmButton: false,
                timer: 1500,
                ruta: 'users',
                user: resultUser[0],
                poll: resultPoll[0],
                name: req.session.name
            });
        } catch (error) {
            console.log(error);
            res.render('editUser', {
                alert: true,
                alertTitle: 'Error',
                alertMessage: error.message,
                alertIcon: 'error',
                showConfirmButton: true,
                timer: 1500,
                ruta: `edit-user/${idUser}`,
                user: resultUser[0],
                poll: resultPoll[0],
                name: req.session.name
            });
        }
    },
/*               DELETE                  */
    deleteUser: async (req, res) => {
        await pollModel.deleteCycleDate(req.params.id);
        await pollModel.deletePoll(req.params.id);
        await annotationModel.deleteAnnotation(req.params.id);
        await userModel.deleteUser(req.params.id);
        res.redirect('/users');
    },
    deleteBanner: async (req, res) => {
        let resultBanner = await bannerModel.getBanner(req.params.id);
        if (fs.existsSync(path.join(__dirname, `../public/uploads/${resultBanner[0].url_imagen_banner}`))) {
            fs.unlinkSync(path.join(__dirname, `../public/uploads/${resultBanner[0].url_imagen_banner}`));
        }
        await bannerModel.deleteBanner(req.params.id);
        res.redirect('/banners');
    }
}