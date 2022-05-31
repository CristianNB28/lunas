const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel = require('../models/user');

const maxAge = 3*24*60*60;
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: maxAge
    });
}

module.exports = {
/*                  GET                  */
    getLogin: (req, res) => {
        res.render('login');
    },
    getLogoutAdmin: (req, res) => {
        res.cookie('jwt', '', { maxAge: 1 });
        req.session.destroy(() => {
            res.redirect('/');
        });
    },
    getLogoutUser: (req, res) => {
        res.cookie('jwt', '', { maxAge: 1 });
        req.session.destroy(() => {
            res.redirect('/user-form');
        });
    },
    getUserRegistration: (req, res) => {
        res.render('signup');
    },
/*                  POST                  */
    postLogin: async (req, res) => {
        let resultsUser = await userModel.getUser(req.body.correo_usuario);
        if (resultsUser[0] === undefined) {
            try {
                throw new Error('Error, email/username or password not found');
            } catch (error) {
                console.log(error);
                res.render('login', {
                    alert: true,
                    alertTitle: 'Error',
                    alertMessage: 'Email/username or password not found',
                    alertIcon: 'error',
                    showConfirmButton: true,
                    timer: 1500,
                    ruta: 'login'
                });
            }
        } else {
            if (!(await bcrypt.compare(req.body.password_usuario, resultsUser[0].password_usuario))) {
                try {
                    throw new Error('Error, wrong password');
                } catch (error) {
                    console.log(error);
                    res.render('login', {
                        alert: true,
                        alertTitle: 'Error',
                        alertMessage: 'Wrong password',
                        alertIcon: 'error',
                        showConfirmButton: true,
                        timer: 1500,
                        ruta: 'login'
                    });
                }
            } else {
                try {
                    if (resultsUser[0].administrador_boolean === 1) {
                        const token = createToken(resultsUser[0].id_usuario);
                        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
                        req.session.name = req.body.correo_usuario;
                        res.render('login', {
                            alert: true,
                            alertTitle: 'Welcome admin',
                            alertMessage: 'Successfully logged in',
                            alertIcon: 'success',
                            showConfirmButton: false,
                            timer: 1500,
                            ruta: ''
                        });
                    } else {
                        const token = createToken(resultsUser[0].id_usuario);
                        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
                        req.session.name = req.body.correo_usuario;
                        res.render('login', {
                            alert: true,
                            alertTitle: 'Welcome user',
                            alertMessage: 'Successfully logged in',
                            alertIcon: 'success',
                            showConfirmButton: false,
                            timer: 1500,
                            ruta: 'calendar-period'
                        });
                    }
                } catch (error) {
                    console.log(error);
                    res.render('login', {
                        alert: true,
                        alertTitle: 'Error',
                        alertMessage: error.message,
                        alertIcon: 'error',
                        showConfirmButton: true,
                        timer: 1500,
                        ruta: 'login'
                    })
                }
            }
        }
    },
    postUserRegistration: async (req, res) => {
        if (req.body.password_usuario === req.body.password_confirm) {
            try {
                let passwordHash = await bcrypt.hash(req.body.password_usuario, 8);
                const admin = 0;
                const registeredDate = new Date();
                let resultUser = await userModel.postUserRegistration(passwordHash, admin, registeredDate, req.body);
                const token = createToken(resultUser.insertId);
                res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
                req.session.name = req.body.correo_usuario;
                res.render('signup', {
                    alert: true,
                    alertTitle: 'Successful',
                    alertMessage: 'User data was successfully registered',
                    alertIcon: 'success',
                    showConfirmButton: false,
                    timer: 1500,
                    ruta: 'user-form'
                });
            } catch (error) {
                console.log(error);
                res.render('signup', {
                    alert: true,
                    alertTitle: 'Error',
                    alertMessage: error.message,
                    alertIcon: 'error',
                    showConfirmButton: true,
                    timer: 1500,
                    ruta: 'signup'
                });
            }
        } else {
            try {
                throw new Error('Error, the passwords are not the same');
            } catch (error) {
                console.log(error);
                res.render('signup', {
                    alert: true,
                    alertTitle: 'Error',
                    alertMessage: 'Passwords are not the same',
                    alertIcon: 'error',
                    showConfirmButton: true,
                    timer: 1500,
                    ruta: 'signup'
                });
            }
        }
    },
}