const { Router } = require('express');

const { check } = require('express-validator');
const { getStudents, authStudent, createStudents, addStudentEvent } = require('../controllers/students');
const { validarJWT, validarCampos, validarArchivoSubir, validarJWTstudent } = require('../middlewares');

const router = Router();
// // Todas tienes que pasar por la validación del JWT
// router.use(validarJWT);

router.get('/',
    validarJWT,
    getStudents);

router.post(
    '/',
    [
        check("code", 'La categoria es obligatoria').not().isEmpty(),
        validarCampos
    ], authStudent);

router.post(
    '/file',
    [
        validarArchivoSubir,
        validarCampos
    ],
    validarJWT,
    createStudents,
);
router.put(
    '/add/event/:id',
    validarJWTstudent,
    addStudentEvent,
);


module.exports = router;