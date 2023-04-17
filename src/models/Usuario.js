const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    email: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String,
    },
    type_user: {
        type: Schema.Types.ObjectId,
        ref: 'TipoUsuario',
        required: [true, 'El tipo de usuario es obligatorio']
    },
    rol: {
        type: Schema.Types.ObjectId,
        ref: 'Roles',
        required: [true, 'El rol es obligatorio']
    },
    responsible: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
    },
    careerIds: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Carrera',
            required: true
        }
    ],
    valid: {
        type: Boolean,
        default: false
    },
    state: {
        type: Boolean,
        default: true
    },
});

UsuarioSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

module.exports = model('Usuario', UsuarioSchema);
