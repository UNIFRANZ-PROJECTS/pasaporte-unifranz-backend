const { Router } = require('express');
const { check } = require('express-validator');
const { getCareers, createCareer } = require('../controllers/careers');
const { validarJWT, validarCampos } = require('../middlewares');
const { rolExists } = require("../helpers/db-validators");

const router = Router();

// Todas tienes que pasar por la validación del JWT
router.use(validarJWT);


// Obtener roles
router.get('/', getCareers);

//Crear nuevo rol
router.post(
    '/',
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check("name").custom(rolExists),
        check('abbreviation', 'La abreviatura es obligatoria').not().isEmpty(),
        check('campus', 'El campus es obligatorio').not().isEmpty(),
        check('faculty', 'La facultad es obligatoria').not().isEmpty(),
        validarCampos
    ],
    createCareer
);


module.exports = router;