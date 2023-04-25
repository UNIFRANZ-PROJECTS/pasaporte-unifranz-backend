const { Schema, model } = require('mongoose');

const MessageSchema = Schema({
    text: {
        type: String,
        required: true
    },
    client: {
        type: Schema.Types.ObjectId,
        ref: 'Cliente',
        required: true
    },
});
MessageSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});


module.exports = model('Mensaje', MessageSchema);
