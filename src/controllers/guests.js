const { response } = require('express');
const { GuestSchema } = require('../models');

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

const getGuests = async (req, res = response) => {

    const invitados = await GuestSchema.find();

    res.json({
        ok: true,
        invitados
    });
}

const createGuest = async (req, res = response) => {

    const invitado = new GuestSchema(req.body);

    console.log(req.body.archivo)
    try {


        const fs = require('fs');
        invitado.user = req.uid;
        //agregar ubicación de la imagen
        const file = Buffer.from(req.body.archivo, 'base64');
        fs.writeFileSync('/tmp/temp.jpg', file); // o /tmp/temp.png, dependiendo del formato
        const { secure_url } = await cloudinary.uploader.upload('/tmp/temp.jpg', { folder: 'guests' });
        //modificamos y damos acceso al usuario
        invitado.image = secure_url;

        const invitadoGuardado = await invitado.save();

        res.json({
            ok: true,
            invitado: invitadoGuardado
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

const updateGuest = async (req, res = response) => {

    const guestId = req.params.id;

    try {

        const nuevoGuest = {
            ...req.body
        }
        if (req.body.archivo != null) {


            // Convierte el archivo SVG en formato base64
            const fileBuffer = Buffer.from(req.body.archivo, 'base64');

            // Sube el archivo a Cloudinary como un archivo en formato "data URI"
            const { secure_url } = await cloudinary.uploader.upload(`data:image/svg+xml;base64,${fileBuffer.toString('base64')}`, {
                folder: 'guests'
            });
            //modificamos y damos acceso al usuario
            nuevoGuest.image = secure_url;
        }
        const guestActualizado = await GuestSchema.findByIdAndUpdate(guestId, nuevoGuest, { new: true },);


        res.json({
            ok: true,
            invitado: guestActualizado
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}
const deleteGuest = async (req, res = response) => {

    const guestId = req.params.id;

    try {

        const nuevoGuest = {
            ...req.body
        }

        const guestActualizado = await GuestSchema.findByIdAndUpdate(guestId, nuevoGuest, { new: true },);

        res.json({
            ok: true,
            invitado: guestActualizado
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}
module.exports = {
    getGuests,
    createGuest,
    updateGuest,
    deleteGuest,
}