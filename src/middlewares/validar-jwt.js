const { response, request } = require('express');
const jwt = require('jsonwebtoken');


const validarJWT = async (req = request, res = response, next) => {

    const token = req.header('authorization');

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }


    try {
        const bearer = token.split(' ');
        const bearerToken = bearer[1];
        const { uid } = jwt.verify(
            bearerToken,
            process.env.SECRET_JWT_SEED_ADMIN
        );

        req.uid = uid;
        next();

    } catch (error) {

        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        })
    }

}

const validarJWTstudent = async (req = request, res = response, next) => {

    const token = req.header('authorization');

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }


    try {
        const bearer = token.split(' ');
        const bearerToken = bearer[1];
        const { uid } = jwt.verify(
            bearerToken,
            process.env.SECRET_JWT_SEED_STUDENT
        );

        req.uid = uid;
        next();

    } catch (error) {

        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        })
    }

}


module.exports = {
    validarJWT,
    validarJWTstudent
}