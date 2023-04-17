const { Schema, model } = require('mongoose');

const TypeUserSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    state: {
        type: Boolean,
        default: true
    },
});
TypeUserSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});


module.exports = model('TipoUsuario', TypeUserSchema);
