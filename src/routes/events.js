/*
    Event Routes
    /api/events
*/
const { Router } = require('express');
const { check } = require('express-validator');

const { isDate } = require('../helpers/isDate');
const { validarJWT, validarCampos, validarArchivoSubir } = require('../middlewares');
const { getEvents, getEventsAdmin, getEventsByCampus, getReportStudentsByEvent, createEvent, updateEvent, deleteEvent } = require('../controllers/events');

const router = Router();

// Obtener eventos 
router.get('/', getEvents);
router.get('/admin', validarJWT, getEventsAdmin);

router.get('/campus/:id', getEventsByCampus);
//report students
router.get('/admin/report/student/:id', validarJWT, getReportStudentsByEvent);
// Crear un nuevo evento
router.post(
    '/admin',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('description', 'La description es obligatoria').not().isEmpty(),
        check('careerIds', 'La lista de carreras es obligatoria').not().isEmpty(),
        check('categoryIds', 'La lista de categorias es obligatoria').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatoria').custom(isDate),
        check('end', 'Fecha de finalización es obligatoria').custom(isDate),
        check('archivo', 'El archivo es obligatorio').not().isEmpty(),
        validarCampos
    ],
    validarJWT,
    createEvent
);

// Actualizar Evento
router.put(
    '/admin/:id',
    validarJWT,
    updateEvent
);

// Borrar evento
router.delete('/:id', deleteEvent);

module.exports = router;