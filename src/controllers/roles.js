const { response } = require('express');
const { RoleSchema } = require('../models');

const getRoles = async (req, res = response) => {

    const roles = await RoleSchema.find()
        .populate('permisionIds')
        .populate('user', 'name');

    res.json({
        ok: true,
        roles
    });
}
const createRol = async (req, res = response) => {

    const rol = new RoleSchema(req.body);

    try {
        rol.user = req.uid;


        const rolGuardado = await rol.save();
        const rolConReferencias = await RoleSchema.findById(rolGuardado.id)
            .populate('permisionIds')
            .populate('user', 'name');

        res.json({
            ok: true,
            rol: rolConReferencias
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            errors: [{ msg: "Por favor hable con el administrador" }]
        });
    }
}
const updateRol = async (req, res = response) => {

    const rolId = req.params.id;

    try {
        console.log(req.body)

        const nuevoRol = {
            ...req.body
        }

        const rolActualizado = await RoleSchema.findByIdAndUpdate(rolId, nuevoRol, { new: true },);
        const rolConReferencias = await RoleSchema.findById(rolActualizado.id)
            .populate('permisionIds')
            .populate('user', 'name');

        res.json({
            ok: true,
            rol: rolConReferencias
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}
const deleteRol = async (req, res = response) => {

    const rolId = req.params.id;

    try {

        const nuevoRol = {
            ...req.body,
        }

        const rolEliminado = await RoleSchema.findByIdAndUpdate(rolId, nuevoRol, { new: true },);
        const rolConReferencias = await RoleSchema.findById(rolEliminado.id)
            .populate('permisionIds')
            .populate('user', 'name');

        res.json({
            ok: true,
            rol: rolConReferencias
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
    getRoles,
    createRol,
    updateRol,
    deleteRol
}