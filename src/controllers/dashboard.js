const { response } = require('express');
const { EventoSchema, UsuarioSchema } = require('../models');



const getDashboard = async (req, res = response) => {

    let usuario = await UsuarioSchema.findById(req.uid)
        .populate('rol', 'name')
        .populate('type_user', 'name')
        .populate('responsible', 'name')
        .populate('careerIds')
        .sort({ start: 1 });
    const carreras = [...usuario.careerIds];
    const carrerasPorCampus = carreras.reduce((acumulador, carrera) => {
        if (!acumulador[carrera.campus]) {
            acumulador[carrera.campus] = { campus: carrera.campus, carreras: [] };
        }
        acumulador[carrera.campus].carreras.push(carrera);
        return acumulador;
    }, {});

    const resultado = Object.values(carrerasPorCampus);


    const eventos = await EventoSchema.find({ state: true })
        .populate('studentIds')
        .populate('guestIds')
        .populate('careerIds');
    const upcoming = {
        'name': "proximo",
        'cantidad': eventos.filter(e => e.stateEvent == 'proximo').length
    };
    const finished = {
        'name': "terminado",
        'cantidad': eventos.filter(e => e.stateEvent == 'concluido').length
    };
    const cancel = {
        'name': "cancelado",
        'cantidad': eventos.filter(e => e.stateEvent == 'cancelado').length
    };
    const virtual = {
        'name': "virtual",
        'cantidad': eventos.filter(e => e.modality == 'virtual').length
    };
    const presencial = {
        'name': "presencial",
        'cantidad': eventos.filter(e => e.modality == 'presencial').length
    };

    const eventosPorCampusYCarrera = {};
    for (const evento of eventos) {
        for (const carrera of evento.careerIds) {
            const campus = carrera.campus;
            const abreviatura = carrera.abbreviation;
            if (!eventosPorCampusYCarrera[campus]) {
                eventosPorCampusYCarrera[campus] = {};
            }
            if (!eventosPorCampusYCarrera[campus][abreviatura]) {
                eventosPorCampusYCarrera[campus][abreviatura] = {
                    carrera: abreviatura,
                    cantidad: 0,
                    cancelado: 0,
                    proximo: 0,
                    concluido: 0
                };
            }
            const estado = evento.stateEvent;
            eventosPorCampusYCarrera[campus][abreviatura].cantidad++;
            eventosPorCampusYCarrera[campus][abreviatura][estado]++;
        }
    }
    const eventosPorCampus = [];
    for (const campus in eventosPorCampusYCarrera) {
        const carreras = Object.values(eventosPorCampusYCarrera[campus]);
        eventosPorCampus.push({
            campus: campus,
            carreras: carreras
        });
    }
    res.json({
        ok: true,
        total: eventos.length,
        countEvents: [
            upcoming,
            finished,
            cancel,
        ],
        eventosPorCampus,
        modality: [
            virtual,
            presencial,
        ],
        carrers: resultado,

    });
}

const getDashboardByFilter = async (req, res = response) => {
    const body = req.body;
    console.log(body);

    const query = {
        state: true,
        careerIds: { $in: body.carrers },
        categoryIds: { $in: body.categories },
        start: { $gte: body.start },
        end: { $lte: body.end },
        modality: { $in: body.modalities }
    };
    const eventos = await EventoSchema.find(query)
        .populate('categoryIds')
        .populate('studentIds')
        .populate('guestIds')
        .populate('careerIds')
        .sort({ start: 1 });
    const upcoming = {
        'name': "proximo",
        'cantidad': eventos.filter(e => e.stateEvent == 'proximo').length
    };
    const finished = {
        'name': "terminado",
        'cantidad': eventos.filter(e => e.stateEvent == 'concluido').length
    };
    const cancel = {
        'name': "cancelado",
        'cantidad': eventos.filter(e => e.stateEvent == 'cancelado').length
    };
    const virtual = {
        'name': "virtual",
        'cantidad': eventos.filter(e => e.modality == 'virtual').length
    };
    const presencial = {
        'name': "presencial",
        'cantidad': eventos.filter(e => e.modality == 'presencial').length
    };

    const eventosPorCampusYCarrera = {};
    for (const evento of eventos) {
        for (const carrera of evento.careerIds) {
            const campus = carrera.campus;
            const abreviatura = carrera.abbreviation;
            if (!eventosPorCampusYCarrera[campus]) {
                eventosPorCampusYCarrera[campus] = {};
            }
            if (!eventosPorCampusYCarrera[campus][abreviatura]) {
                eventosPorCampusYCarrera[campus][abreviatura] = {
                    carrera: abreviatura,
                    cantidad: 0,
                    cancelado: 0,
                    proximo: 0,
                    concluido: 0
                };
            }
            const estado = evento.stateEvent;
            eventosPorCampusYCarrera[campus][abreviatura].cantidad++;
            eventosPorCampusYCarrera[campus][abreviatura][estado]++;
        }
    }
    const eventosPorCampus = [];
    for (const campus in eventosPorCampusYCarrera) {
        const carreras = Object.values(eventosPorCampusYCarrera[campus]);
        eventosPorCampus.push({
            campus: campus,
            carreras: carreras
        });
    }
    return res.json({
        ok: true,
        total: eventos.length,
        countEvents: [
            upcoming,
            finished,
            cancel,
        ],
        eventosPorCampus,
        modality: [
            virtual,
            presencial,
        ],
    });
}
module.exports = {
    getDashboard,
    getDashboardByFilter
}