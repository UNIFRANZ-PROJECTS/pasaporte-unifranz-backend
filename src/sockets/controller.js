const { Socket } = require('socket.io');
const { comprobarJWT } = require('./../middlewares');


const { usuarioConectado, usuarioDesconectado, grabarMensaje } = require('../controllers/socket');




const socketController = async (socket = new Socket(), io) => {

    const usuario = await comprobarJWT(socket.handshake.query.token);
    if (!usuario) {
        return socket.disconnect();
    }
    console.log(usuario.id)
    // Cliente autenticado
    usuarioConectado(usuario.id);



    // Escuchar del cliente el mensaje-personal
    socket.on('mensaje-evento', async (payload) => {
        socket.join(`event ${payload.para}`);
        await grabarMensaje(payload, io);
    })


    socket.on('disconnect', () => {
        usuarioDesconectado(usuario.id);
    });
}



module.exports = {
    socketController
}