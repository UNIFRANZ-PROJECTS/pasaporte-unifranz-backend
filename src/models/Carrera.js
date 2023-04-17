const { Schema, model } = require('mongoose');

const CarreraSchema = Schema({

    name: {
        type: String,
        required: true
    },
    abbreviation: {
        type: String,
        required: true
    },
    campus: {
        type: String,
        required: true
    },
    faculty: {
        type: String,
        required: true
    },
    state: {
        type: Boolean,
        default: true
    },

});

CarreraSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});



module.exports = model('Carrera', CarreraSchema);
