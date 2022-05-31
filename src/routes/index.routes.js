const express = require('express');
const router = express.Router();

// Controllers
const indexController = require('../controllers/indexController');
const loginController = require('../controllers/loginController');
const userController = require('../controllers/userController');

// Middlewares
const requireAuth = require('../middlewares/authMiddleware');
const upload = require('../middlewares/multerMiddleware');

// Index Controller (Admin)
router.get('/', requireAuth, indexController.getIndex);
router.get('/add-user', requireAuth, indexController.getUser);
router.post('/add-user', requireAuth, indexController.postUser);
router.get('/users', requireAuth, indexController.getUsers);
router.post('/remove-user/:id', requireAuth, indexController.deleteUser);
router.get('/edit-user/:id', requireAuth, indexController.putUser);
router.post('/update-user', requireAuth, indexController.updateUser);
router.get('/add-banner', requireAuth, indexController.getBanner);
router.post('/add-banner', requireAuth, upload, indexController.postBanner);
router.get('/banners', requireAuth, indexController.getBanners);
router.post('/remove-banner/:id', requireAuth, indexController.deleteBanner);
router.get('/annotations-users', requireAuth, indexController.getAnnotationsUsers);

// User Controller
router.get('/user-form', requireAuth, userController.getUserForm);
router.post('/user-form', requireAuth, userController.postUserForm);
router.get('/cycle-date', requireAuth, userController.getCycleDate);
router.post('/cycle-date', requireAuth, userController.postCycleDate);
router.get('/edit-cycle-date', requireAuth, userController.putCycleDate);
router.post('/update-cycle-date', requireAuth, userController.updateCycleDate);
router.get('/calendar-period', requireAuth, userController.getCalendarPeriod);
router.post('/calendar-period', requireAuth, userController.postCalendarPeriod);
router.post('/update-calendar-period', requireAuth, userController.updateCalendarPeriod);
router.get('/annotations', requireAuth, userController.getAnnotations);

// Login Controller
router.get('/login', loginController.getLogin);
router.post('/auth', loginController.postLogin);
router.get('/signup', loginController.getUserRegistration);
router.post('/signup', loginController.postUserRegistration);
router.get('/logout-admin', loginController.getLogoutAdmin);
router.get('/logout-user', loginController.getLogoutUser);

module.exports = router;