const { Schema, model } = require('mongoose');

const EstudianteSchema = Schema({
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
    },
    codigo: {
        type: String,
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
    },
});

EstudianteSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

module.exports = model('Estudiante', EstudianteSchema);

