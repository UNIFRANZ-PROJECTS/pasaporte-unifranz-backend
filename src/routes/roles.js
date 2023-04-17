const { Router } = require('express');
const { check } = require('express-validator');
const { getRoles, createRol, updateRol, deleteRol } = require('../controllers/roles');
const { validarJWT, validarCampos } = require('../middlewares');
const { rolExists } = require("../helpers/db-validators");

const router = Router();

// Todas tienes que pasar por la validación del JWT
router.use(validarJWT);


// Obtener roles
router.get('/', getRoles);

//Crear nuevo rol
router.post(
    '/',
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check("name").custom(rolExists),
        validarCampos
    ],
    createRol
);
//Editar rol
router.put('/:id', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check("name").custom(rolExists),
    validarCampos
], updateRol)
//Eliminar rol
router.put('/delete/:id', deleteRol)

module.exports = router;