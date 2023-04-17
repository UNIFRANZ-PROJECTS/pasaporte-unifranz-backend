const { response } = require('express');
const { TypeUserSchema } = require('../models');

const getTypeUsers = async (req, res = response) => {

    const tiposUsuarios = await TypeUserSchema.find()
        .populate('user', 'name');

    res.json({
        ok: true,
        tiposUsuarios
    });
}
const createTypeUser = async (req, res = response) => {

    const typeUser = new TypeUserSchema(req.body);

    try {
        typeUser.user = req.uid;


        const tipoUsuarioGuardado = await typeUser.save();
        const tipoUsuarioConReferencias = await TypeUserSchema.findById(tipoUsuarioGuardado.id)
            .populate('user', 'name');

        res.json({
            ok: true,
            tipoUsuario: tipoUsuarioConReferencias
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}
const updateTypeUser = async (req, res = response) => {

    const typeUserId = req.params.id;

    try {

        const nuevoTipoUsuario = {
            ...req.body
        }

        const tipoUsuarioActualizado = await TypeUserSchema.findByIdAndUpdate(typeUserId, nuevoTipoUsuario, { new: true },);

        const tipoUsuarioConReferencias = await TypeUserSchema.findById(tipoUsuarioActualizado.id)
            .populate('user', 'name');
        res.json({
            ok: true,
            tipoUsuario: tipoUsuarioConReferencias
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}
const deleteTypeUser = async (req, res = response) => {

    const typeUserId = req.params.id;

    try {

        const nuevoTipoUsuario = {
            ...req.body
        }

        const tipoUsuarioEliminado = await TypeUserSchema.findByIdAndUpdate(typeUserId, nuevoTipoUsuario, { new: true },);

        const tipoUsuarioConReferencias = await TypeUserSchema.findById(tipoUsuarioEliminado.id)
            .populate('user', 'name');
        res.json({
            ok: true,
            tipoUsuario: tipoUsuarioConReferencias
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
    getTypeUsers,
    createTypeUser,
    updateTypeUser,
    deleteTypeUser
}