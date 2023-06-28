const { response } = require('express');
const { CarreraSchema, UsuarioSchema } = require('../models');

const getCareers = async (req, res = response) => {
    console.log(req.uid)
    const user = await UsuarioSchema.findById(req.uid).populate('careerIds');
    console.log(user)
    if (user.isSuperUser) {
        const carreras = await CarreraSchema.find({ state: true });
        return res.json({
            ok: true,
            carreras: carreras
        });
    } else {
        return res.json({
            ok: true,
            carreras: user.careerIds
        });
    }

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