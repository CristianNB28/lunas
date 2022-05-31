const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, '../public/uploads'));
    },
    filename: function(req, file, cb) {
        const ext = file.originalname.split('.').pop();
        cb(null, `${Date.now()}.${ext}`);
    }
});

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb("Sube solo imágenes", false);
    }
};

const upload = multer({
    storage,
    fileFilter: multerFilter
});

const uploadFiles = upload.array("images", 4);

const uploadImages = (req, res, next) => {
    uploadFiles(req, res, err => {
        if (err instanceof multer.MulterError) {
            if (err.code === "LIMIT_UNEXPECTED_FILE") {
                res.render('addBanner', {
                    alert: true,
                    alertTitle: 'Error',
                    alertMessage: err.code,
                    alertIcon: 'error',
                    showConfirmButton: true,
                    timer: 1500,
                    ruta: 'add-banner',
                    name: req.session.name
                });
            }
        } else if (err) {
            res.render('addBanner', {
                alert: true,
                alertTitle: 'Error',
                alertMessage: err.message,
                alertIcon: 'error',
                showConfirmButton: true,
                timer: 1500,
                ruta: 'add-banner',
                name: req.session.name
            });
        }
        next();
    });
};

module.exports = uploadImages;