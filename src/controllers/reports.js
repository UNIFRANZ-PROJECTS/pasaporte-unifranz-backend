const { response } = require('express');
const ExcelJS = require('exceljs');
const { EventoSchema, } = require('../models');



const getReportByFilter = async (req, res = response) => {

    const body = req.body;
    console.log(body);
    const query = {
        state: true,
    };
    if (body.carrers != null) {
        query.careerIds = { $in: body.carrers };
    }
    if (body.categories != null) {
        query.categoryIds = { $in: body.categories };
    }
    if (body.start != null) {
        query.start = { $gte: body.start };
    }
    if (body.end != null) {
        query.end = { $lte: body.end };
    }
    if (body.modality != null) {
        query.modality = { $in: body.modality };
    }
    const eventos = await EventoSchema.find(query)
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
const getDocumentByFilter = async (req, res = response) => {

    const body = req.body;
    console.log(body);
    const query = {
        state: true,
    };
    if (body.carrers != null) {
        query.careerIds = { $in: body.carrers };
    }
    if (body.categories != null) {
        query.categoryIds = { $in: body.categories };
    }
    if (body.start != null) {
        query.start = { $gte: body.start };
    }
    if (body.end != null) {
        query.end = { $lte: body.end };
    }
    if (body.modality != null) {
        query.modality = { $in: body.modality };
    }
    const eventos = await EventoSchema.find(query)
        .populate('categoryIds')
        .populate('studentIds')
        .populate('guestIds')
        .populate('careerIds')
        .sort({ start: 1 });
    // Crear un nuevo libro de Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Mi hoja de cálculo');

    // Agregar datos a la hoja de cálculo
    worksheet.columns = [
        { header: 'Id', key: 'id', width: 10 },
        { header: 'Titulo', key: 'title', width: 20 },
        { header: 'Categorias', key: 'categoryIds', width: 20 },
        { header: 'Carreras', key: 'careerIds', width: 20 },
        { header: 'Expositores', key: 'guestIds', width: 20 },
        { header: 'Estudiantes', key: 'studentIds', width: 20 },
        { header: 'url Imagen', key: 'image', width: 10 },
        { header: 'Descripcion', key: 'description', width: 10 },
        { header: 'Inicio', key: 'start', width: 10 },
        { header: 'Fin', key: 'end', width: 10 },
        { header: 'Modalidad', key: 'modality', width: 10 },
        { header: 'url evento', key: 'urlEvent', width: 20 },

    ];
    for await (const evento of eventos) {
        worksheet.addRow({
            id: evento.id,
            title: evento.title,
            categoryIds: evento.categoryIds.map((e) => e.title).join(", "),
            careerIds: evento.careerIds.map((e) => `${e.abbreviation}-${e.campus}`).join(", "),
            guestIds: evento.guestIds.map((e) => `${e.first_name} ${e.last_name}`).join(", "),
            studentIds: evento.studentIds.length,
            image: evento.image,
            description: evento.description,
            start: evento.start,
            end: evento.end,
            modality: evento.modality,
            urlEvent: evento.urlEvent,
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
module.exports = {
    getReportByFilter,
    getDocumentByFilter
}