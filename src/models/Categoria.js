const { Schema, model } = require('mongoose');

const CategoriaSchema = Schema({

    title: {
        type: String,
        required: true
    },
    icon: {
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

CategoriaSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});



module.exports = model('Categoria', CategoriaSchema);

