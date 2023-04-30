const { response } = require('express');
const { EventoSchema, ClienteSchema, } = require('../models');
const ExcelJS = require('exceljs');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

const getEvents = async (req, res = response) => {

    const eventos = await EventoSchema.find()
        .populate('categoryIds')
        .populate('studentIds')
        .populate('guestIds')
        .populate('careerIds')
        .sort({ start: 1 });
    res.json({
        ok: true,
        eventos
    });
}
const getEventsByCampus = async (req, res = response) => {
    const eventos = await EventoSchema.find({ state: true })
        .populate('categoryIds')
        .populate('studentIds')
        .populate('guestIds')
        .populate('careerIds')
        .sort({ start: 1 });
    switch (req.params.id) {
        case 'lp':

            const eventlp = []
            eventos.forEach(e => {
                console.log(e.careerIds)
                if (e.careerIds.filter((e) => e.campus == 'La Paz').length > 0) {
                    eventlp.push(e)
                }
            });
            return res.json({
                ok: true,
                eventos: eventlp
            });
        case 'ea':
            const eventea = []
            eventos.forEach(e => {
                if (e.careerIds.filter((e) => e.campus == 'El Alto').length > 0) {
                    eventea.push(e)
                }
            });
            return res.json({
                ok: true,
                eventos: eventea
            });
        case 'cbba':
            const eventcbba = []
            eventos.forEach(e => {
                if (e.careerIds.filter((e) => e.campus == 'Cochabamba').length > 0) {
                    eventcbba.push(e)
                }
            });
            return res.json({
                ok: true,
                eventos: eventcbba
            });
        case 'sc':
            const eventsc = []
            eventos.forEach(e => {
                if (e.careerIds.filter((e) => e.campus == 'Santa Cruz').length > 0) {
                    eventsc.push(e)
                }
            });
            return res.json({
                ok: true,
                eventos: eventsc
            });
        default:
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({
                    errors: [{ msg: "No existe el estudiante" }]
                });
            }
            const cliente = await ClienteSchema.findById(req.params.id);
            if (!cliente) {
                return res.status(400).json({
                    errors: [{ msg: "No existe el estudiante" }]
                });
            }
            const event = []
            eventos.forEach(e => {
                if (e.careerIds.filter((e) => e.campus == cliente.sede && e.abbreviation === cliente.carrera).length > 0) {
                    event.push(e)
                }
            });
            return res.json({
                ok: true,
                eventos: event
            });
    }
}
const getChatByEvent = async (req, res = response) => {
    const evento = await EventoSchema.findById(req.params.id)
        .populate({
            path: 'messageIds',
            populate: {
                path: 'client'
            },
        });
    res.json({
        chat: evento.messageIds
    })
}
const getReportStudentsByEvent = async (req, res = response) => {

    const eventoId = req.params.id
    const evento = await EventoSchema.findById(eventoId)
        .populate('studentIds')
    // Crear un nuevo libro de Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Mi hoja de cálculo');

    // Agregar datos a la hoja de cálculo
    worksheet.columns = [
        { header: 'Id', key: 'id', width: 10 },
        { header: 'Nombre', key: 'nombre', width: 20 },
        { header: 'Apellido', key: 'apellido', width: 20 },
        { header: 'Código', key: 'codigo', width: 20 },
        { header: 'Semestre', key: 'semestre', width: 20 },
        { header: 'Carrera', key: 'carrera', width: 10 },
        { header: 'Correo', key: 'email', width: 10 },

    ];
    for await (const student of evento.studentIds) {
        worksheet.addRow({
            id: student.id,
            nombre: student.nombre,
            apellido: student.apellido,
            codigo: student.codigo,
            semestre: student.semestre,
            carrera: student.carrera,
            email: student.email,
        });
    }
    // Generar el archivo Excel en memoria
    workbook.xlsx.writeBuffer()
        .then(function (buffer) {
            const base64 = buffer.toString('base64');

            // Enviar la cadena de base64 en la respuesta
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send({
                fileName: 'example.xlsx',
                base64: base64
            });
        })
        .catch(function (error) {
            console.log('Error al generar el archivo Excel: ' + error);
            res.status(500).send('Error al generar el archivo Excel');
        });
}
const createEvent = async (req, res = response) => {

    const evento = new EventoSchema(req.body);
    console.log(req.body.archivo)
    try {
        const fs = require('fs');
        evento.user = req.uid;
        //agregar ubicación de la imagen
        // Convierte el archivo SVG en formato base64
        const file = Buffer.from(req.body.archivo, 'base64');
        fs.writeFileSync('/tmp/temp.jpg', file); // o /tmp/temp.png, dependiendo del formato
        const { secure_url } = await cloudinary.uploader.upload('/tmp/temp.jpg', { folder: 'events' });

        //modificamos y damos acceso al usuario
        evento.image = secure_url;

        const nuevoEvento = await evento.save();
        const eventoConReferencias = await EventoSchema.findById(nuevoEvento.id)
            .populate('categoryIds')
            .populate('studentIds')
            .populate('guestIds')
            .populate('careerIds')
            .sort({ start: 1 });
        return res.json({
            ok: true,
            evento: eventoConReferencias
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

const updateEvent = async (req, res = response) => {

    const eventoId = req.params.id;

    try {

        const nuevoEvento = {
            ...req.body,
        }
        if (req.files != null) {

            //agregar ubicación de la imagen
            const { tempFilePath } = req.files.archivo
            const { secure_url } = await cloudinary.uploader.upload(tempFilePath, { folder: 'events' });
            //modificamos y damos acceso al usuario
            nuevoEvento.image = secure_url;
        }
        console.log(nuevoEvento)
        const eventoActualizado = await EventoSchema.findByIdAndUpdate(eventoId, nuevoEvento, { new: true },);
        const eventoConReferencias = await EventoSchema.findById(eventoActualizado.id)
            .populate('categoryIds')
            .populate('studentIds')
            .populate('guestIds')
            .populate('careerIds')
            .sort({ start: 1 });
        res.json({
            ok: true,
            evento: eventoConReferencias
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}

const deleteEvent = async (req, res = response) => {

    const eventoId = req.params.id;

    try {

        const nuevoEvento = {
            ...req.body,
        }

        const eventoActualizado = await EventoSchema.findByIdAndUpdate(eventoId, nuevoEvento, { new: true },);
        const eventoConReferencias = await EventoSchema.findById(eventoActualizado.id)
            .populate('categoryIds')
            .populate('studentIds')
            .populate('guestIds')
            .populate('careerIds')
            .sort({ start: 1 });
        res.json({
            ok: true,
            evento: eventoConReferencias
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
    getEvents,
    getEventsByCampus,
    getChatByEvent,
    getReportStudentsByEvent,
    createEvent,
    updateEvent,
    deleteEvent
}