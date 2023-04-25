const { ClienteSchema, MessageSchema, EventoSchema } = require('./../models');
// const { getGroupsByUser } = require("./group.controller");
// const jwt = require('jsonwebtoken');
const usuarioConectado = async (uid = '') => {

    const cliente = await ClienteSchema.findById(uid);
    cliente.online = true;
    await cliente.save();
    return cliente;
}

const usuarioDesconectado = async (uid = '') => {
    const cliente = await ClienteSchema.findById(uid);
    cliente.online = false;
    await cliente.save();
    return cliente;
}
// const grabarlectura = async (payload, io, uid) => {
//     try {
//         console.log('grabando-lectura');
//         // const { uid } = jwt.verify(payload.guest, process.env.SECRETORPRIVATEKEY);
//         const { code, user_id } = JSON.parse(payload.code);
//         const guest = await guestModel.findOne({
//             where: { state: 1, code: code },
//             attributes: {
//                 exclude: [
//                     "createdAt",
//                     "updatedAt",
//                 ],
//             }
//         });
//         if (!guest) return io.to(`user ${uid}`).emit('mensaje-personal', { error: true, msg: 'La invitación no es valida' });

//         if (guest.user_id == uid) return io.to(`user ${uid}`).emit('mensaje-personal', { error: true, msg: 'La invitación fue creada por usted' });

//         const userGroup = await userGroupModel.findOne({
//             where: {
//                 group_id: guest.group_id,
//                 user_id: uid,
//                 state: 1
//             }
//         })
//         console.log(userGroup)
//         if (userGroup) return io.to(`user ${uid}`).emit('mensaje-personal', { error: true, msg: 'Ya perteneces al círculo de confianza' });

//         await guestModel.update(
//             {
//                 state: 0,
//                 guest_id: uid
//             },
//             { where: { code: code } }
//         );
//         console.log('editado')
//         //reigstro entre usuario y grupo
//         const groupUser = new userGroupModel({
//             "user_id": uid,
//             "group_id": guest.group_id,
//             "reason": "guest"
//         })
//         await groupUser.save();
//         console.log('guardado')
//         // obtener mis grupos
//         let circlesTrust = await getGroupsByUser(guest.user_id);
//         let circlesTrustGuest = await getGroupsByUser(uid);
//         console.log('enviando a', user_id)
//         io.to(`user ${user_id}`).emit('mensaje-personal', { error: false, circlesTrustGuest: circlesTrust });
//         io.to(`user ${uid}`).emit('mensaje-personal', { error: false, circlesTrustGuest: circlesTrustGuest });
//         // res.json({ msg: 'Invitación aceptada', circlesTrustGuest });
//     } catch (error) {
//         console.log(error);
//     }
// }
const grabarMensaje = async (payload, io) => {
    try {
        console.log(payload)
        const Mensaje = new MessageSchema({
            text: payload.mensaje,
            client: payload.de
        });
        const mensajeGuardado = await Mensaje.save();
        const user = await ClienteSchema.findById(payload.de);
        const evento = await EventoSchema.findById(payload.para);
        // Si evento.messageIds es undefined, establece el campo en un array con el ID del mensaje guardado
        if (!evento.messageIds) {
            evento.messageIds = [mensajeGuardado._id];
        } else {
            evento.messageIds = [...evento.messageIds, mensajeGuardado._id]; // Agrega el nuevo mensaje al array de IDs existentes
        }

        // Actualiza el documento en la base de datos
        await EventoSchema.findByIdAndUpdate(payload.para, { messageIds: evento.messageIds }, { new: true });
        console.log({ user: user, msg: payload })
        return io.to(`event ${payload.para}`).emit('mensaje-evento', { user: user, msg: payload });
        // const mensaje = new Mensaje(payload);
        // await mensaje.save();

        // return true;
    } catch (error) {
        console.log(error)
        return false;
    }

}



module.exports = {
    usuarioConectado,
    usuarioDesconectado,
    grabarMensaje,
}


