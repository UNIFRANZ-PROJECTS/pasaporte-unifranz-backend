const { response } = require('express');
const { PermisionSchema } = require('../models');

const getPermisions = async (req, res = response) => {

    const permisos = await PermisionSchema.find({ state: true });
    // .populate('user', 'name');

    res.json({
        ok: true,
        permisos
    });
}
const createPermision = async (req, res = response) => {

    const Permision = new PermisionSchema(req.body);

    try {

        const permisioGuardado = await Permision.save();

        res.json({
            ok: true,
            permiso: permisioGuardado
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}
module.exports = {
    getPermisions,
    createPermision,
}