const { Schema, model } = require('mongoose');

const RoleSchema = Schema({
    name: {
        type: String,
        required: [true, 'El rol es obligatorio']
    },
    permisionIds: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Permiso',
            required: true
        }
    ],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    state: {
        type: Boolean,
        default: true
    },
});

RoleSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    object.permisionIds.forEach(e => {
        e.id = e._id;
        delete e._id;
        delete e.__v;
    });
    return object;
});

module.exports = model('Roles', RoleSchema);
