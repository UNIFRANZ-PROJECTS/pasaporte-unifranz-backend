/*
    Event Routes
    /api/events
*/
const { Router } = require('express');
const { check } = require('express-validator');

const { isDate } = require('../helpers/isDate');
const { validarJWT, validarCampos, validarArchivoSubir } = require('../middlewares');
const { getEvents, getEventsByCampus, getChatByEvent, getReportStudentsByEvent, createEvent, updateEvent, deleteEvent } = require('../controllers/events');

const router = Router();

// Obtener eventos 
router.get('/', getEvents);

router.get('/campus/:id', getEventsByCampus);
//get chat
router.get('/messages/:id', getChatByEvent)
//report students
router.get('/report/student/:id', getReportStudentsByEvent);
// Crear un nuevo evento
router.post(
    '/',
    [
        validarArchivoSubir,
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('description', 'La description es obligatoria').not().isEmpty(),
        check('careerIds', 'La lista de carreras es obligatoria').not().isEmpty(),
        check('categoryIds', 'La lista de categorias es obligatoria').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatoria').custom(isDate),
        check('end', 'Fecha de finalización es obligatoria').custom(isDate),
        validarCampos
    ],
    validarJWT,
    createEvent
);

// Actualizar Evento
router.put(
    '/:id',
    updateEvent
);

// Borrar evento
router.delete('/:id', deleteEvent);

module.exports = router;