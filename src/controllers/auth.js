const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');


const loginUsuario = async (req, res = response) => {
    console.log('login', req.body)
    const { email, password } = req.body;

    try {

        const usuario = await Usuario.findOne({ email })
            // .populate('rol')
            .populate({
                path: 'rol',
                populate: {
                    path: 'permisionIds'
                },
            })
            .populate('type_user', 'name')
            .populate('responsible', 'name')
            .populate('careerIds');

        if (!usuario) {
            return res.status(400).json({
                errors: [{ msg: "El usuario no existe con ese correo" }]
            });
        }

        // Confirmar los passwords
        const validPassword = bcrypt.compareSync(password, usuario.password);

        if (!validPassword) {
            return res.status(400).json({
                errors: [{ msg: "Password incorrecto" }]
            });
        }

        // Generar JWT
        const token = await generarJWT(usuario.id, usuario.name);

        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            rol: usuario.rol.name,
            permisions: usuario.rol.permisionIds,
            type_user: usuario.type_user.name,
            careerIds: usuario.careerIds,
            token
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            errors: [{ msg: "Por favor hable con el administrador" }]
        });
    }

}


const revalidarToken = async (req, res = response) => {

    const { uid, name } = req;

    // Generar JWT
    const token = await generarJWT(uid, name);

    res.json({
        ok: true,
        token
    })
}




module.exports = {
    loginUsuario,
    revalidarToken
}