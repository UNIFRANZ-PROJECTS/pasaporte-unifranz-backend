const { Schema, model } = require('mongoose');
const moment = require('moment-timezone');
moment.tz.setDefault('America/La_Paz');
const EventoSchema = Schema({

    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    categoryIds: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Categoria',
            required: true
        }
    ],
    start: {
        type: Date,
        required: true,
    },
    end: {
        type: Date,
        required: true,
    },
    image: {
        type: String,
        required: true
    },
    activitieIds: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Actividad',
            required: true
        }
    ],
    careerIds: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Carrera',
            required: true
        }
    ],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    guestIds: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Invitado',
            required: true
        }
    ],
    studentIds: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Cliente',
            required: true
        }
    ],
    modality: {
        type: String,
        required: true
    },
    urlEvent: {
        type: String,
        default: null
    },
    stateEvent: {
        type: String,
        default: "proximo"
    },
    state: {
        type: Boolean,
        default: true
    },


});

EventoSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    object.start = moment(object.start).format('YYYY-MM-DD HH:mm:ss')
    object.end = moment(object.end).format('YYYY-MM-DD HH:mm:ss')
    object.categoryIds.forEach(e => {
        e.id = e._id;
        delete e._id;
        delete e.__v;
    });
    object.guestIds.forEach(e => {
        e.id = e._id;
        delete e._id;
        delete e.__v;
    });
    object.studentIds.forEach(e => {
        e.id = e._id;
        delete e._id;
        delete e.__v;
    });
    object.careerIds.forEach(e => {
        e.id = e._id;
        delete e._id;
        delete e.__v;
    });

    // object.guestIds = object.guestIds
    return object;
});



module.exports = model('Evento', EventoSchema);

