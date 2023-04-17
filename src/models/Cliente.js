const { Schema, model } = require('mongoose');

const ClienteSchema = Schema({
    sede: {
        type: String,
        required: [true, 'La sede es obligatorio']
    },
    carrera: {
        type: String,
        required: [true, 'La carrera es obligatorio'],
    },
    semestre: {
        type: String,
        required: [true, 'El semestre es obligatorio']
    },
    ci: {
        type: String,
        required: [true, 'El ci es obligatorio'],
        unique: true
    },
    codigo: {
        type: String,
        required: [true, 'El código es obligatorio'],
        unique: true
    },
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    apellido: {
        type: String,
        required: [true, 'El apellido es obligatorio']
    },
    email: {
        type: String,
        required: [true, 'el correo es obligatorio'],
        unique: true
    },
});

ClienteSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

module.exports = model('Cliente', ClienteSchema);

