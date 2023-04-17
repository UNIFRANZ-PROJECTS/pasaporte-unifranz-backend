const { Schema, model } = require('mongoose');

const GuestSchema = Schema({

    first_name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    last_name: {
        type: String,
        required: [true, 'El apellido es obligatorio']
    },
    description: {
        type: String,
        required: [true, 'La descripción es obligatoria']
    },
    specialty: {
        type: String,
        required: [true, 'La especialidad es obligatoria']
    },
    image: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    state: {
        type: Boolean,
        default: true
    },
});

GuestSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

module.exports = model('Invitado', GuestSchema);
