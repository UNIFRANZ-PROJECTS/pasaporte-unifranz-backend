const { response } = require('express');
const { CarreraSchema } = require('../models');

const getCareers = async (req, res = response) => {

    const carreras = await CarreraSchema.find({ state: true });

    res.json({
        ok: true,
        carreras: carreras
    });
}
const createCareer = async (req, res = response) => {

    const carrera = new CarreraSchema(req.body);

    try {


        const carreraGuardado = await carrera.save();

        res.json({
            ok: true,
            carrera: carreraGuardado
        })

    } catch (error) {
        console.log(error)

        res.status(500).json({
            errors: [{ msg: "Por favor hable con el administrador" }]
        });
    }
}

module.exports = {
    getCareers,
    createCareer,
}