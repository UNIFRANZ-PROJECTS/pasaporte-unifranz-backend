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
        default: 'https://unifranz.site/image/images/person.png',
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
    isSuperUser: {
        type: Boolean,
        default: false
    }
});

UsuarioSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    object.careerIds.forEach(e => {
        e.id = e._id;
        delete e._id;
        delete e.__v;
    });
    return object;
});

module.exports = model('Usuario', UsuarioSchema);

