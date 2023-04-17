const { response } = require('express');
const bcrypt = require('bcryptjs');
const { UsuarioSchema } = require('../models');

const getUsers = async (req, res = response) => {

    const usuarios = await UsuarioSchema.find()
        .populate('rol', 'name')
        .populate('type_user', 'name')
        .populate('responsible', 'name')
        .populate('careerIds', 'name campus');

    res.json({
        ok: true,
        usuarios
    });
}

const createUser = async (req, res = response) => {

    const user = new UsuarioSchema(req.body);
    try {
        user.responsible = req.uid;

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(user.email, salt);


        const usuarioGuardado = await user.save();
        const usuarioConReferencias = await UsuarioSchema.findById(usuarioGuardado.id)
            .populate('rol', 'name')
            .populate('type_user', 'name')
            .populate('responsible', 'name')
            .populate('careerIds', 'name campus');

        res.json({
            ok: true,
            usuario: usuarioConReferencias
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

const updateUser = async (req, res = response) => {

    const userId = req.params.id;

    try {

        const nuevoUsuario = {
            ...req.body
        }

        const usuarioActualizado = await UsuarioSchema.findByIdAndUpdate(userId, nuevoUsuario, { new: true },);
        const usuarioConReferencias = await UsuarioSchema.findById(usuarioActualizado.id)
            .populate('rol', 'name')
            .populate('type_user', 'name')
            .populate('responsible', 'name')
            .populate('careerIds', 'name campus');

        res.json({
            ok: true,
            usuario: usuarioConReferencias
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}
const deleteUser = async (req, res = response) => {

    const userId = req.params.id;

    try {

        const nuevoUsuario = {
            ...req.body
        }

        const usuarioEliminado = await UsuarioSchema.findByIdAndUpdate(userId, nuevoUsuario, { new: true },);
        const usuarioConReferencias = await UsuarioSchema.findById(usuarioEliminado.id)
            .populate('rol', 'name')
            .populate('type_user', 'name')
            .populate('responsible', 'name')
            .populate('careerIds', 'name campus');
        res.json({
            ok: true,
            usuario: usuarioConReferencias
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
    getUsers,
    createUser,
    updateUser,
    deleteUser,
}