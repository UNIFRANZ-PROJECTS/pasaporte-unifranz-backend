/*
    Event Routes
    /api/events
*/
const { Router } = require('express');
const { check } = require('express-validator');

const { isDate } = require('../helpers/isDate');
const { validarJWT, validarCampos, validarArchivoSubir } = require('../middlewares');
const { getGuests, createGuest, updateGuest, deleteGuest, } = require('../controllers/guests');

const router = Router();

// Obtener eventos 
router.get('/', getGuests);

// Crear un nuevo evento
router.post(
    '/',
    [
        validarArchivoSubir,
        check('first_name', 'El nombre es obligatorio').not().isEmpty(),
        check('last_name', 'El apellido es obligatorio').not().isEmpty(),
        check('description', 'La description es obligatoria').not().isEmpty(),
        check('specialty', 'La especialidad es obligatorio').not().isEmpty(),
        validarCampos
    ],
    validarJWT,
    createGuest
);
// editar tipo de usuario
router.put('/:id',
    [
        check('first_name', 'El nombre es obligatorio').not().isEmpty(),
        check('last_name', 'El apellido es obligatorio').not().isEmpty(),
        check('description', 'La description es obligatoria').not().isEmpty(),
        check('specialty', 'La especialidad es obligatorio').not().isEmpty(),
        validarCampos
    ], updateGuest
)

// eliminar expositor
router.put('/delete/:id', deleteGuest)
module.exports = router;