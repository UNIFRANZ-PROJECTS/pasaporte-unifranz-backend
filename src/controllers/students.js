const { response } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { EstudianteSchema, ClienteSchema, EventoSchema } = require('../models');
const { generarJWTstudent } = require('../helpers/jwt');
const ExcelJS = require('exceljs');
const workbook = new ExcelJS.Workbook();
const getStudents = async (req, res = response) => {
    console.log('obtener a todos los estudiantes')
    const estudiantes = await EstudianteSchema.find();
    console.log(estudiantes)
    res.json({
        ok: true,
        estudiantes
    });
}



const authStudent = async (req, res = response) => {
    const { code } = req.body;
    try {
        const cliente = await ClienteSchema.findOne({ codigo: code });

        if (cliente) {

            const token = await generarJWTstudent(cliente.id, cliente.codigo);
            return res.json({
                ok: true,
                uid: cliente.id,
                name: cliente.nombre,
                cliente: cliente,
                admin: false,
                token,
            })
        }

        const usuario = await EstudianteSchema.findOne({ codigo: code });

        if (!usuario) {
            return res.status(400).json({
                errors: [{ msg: "Lamentablemente no pudimos encontrarte" }]
            });
        }
        // guardamos en la nueva tabla
        const newCliente = new ClienteSchema();
        newCliente.sede = usuario.sede;
        newCliente.carrera = usuario.carrera;
        newCliente.semestre = usuario.semestre;
        newCliente.ci = usuario.ci;
        newCliente.codigo = usuario.codigo;
        newCliente.nombre = usuario.nombre;
        newCliente.apellido = usuario.apellido;
        newCliente.email = usuario.email;
        await newCliente.save();
        // Generar JWT
        const token = await generarJWTstudent(newCliente.id, newCliente.codigo);
        return res.json({
            ok: true,
            uid: newCliente.id,
            name: newCliente.nombre,
            cliente: newCliente,
            admin: false,
            token,
        })


    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}


const createStudents = async (req, res = response) => {

    // const user = new UsuarioSchema(req.body);
    try {
        const { tempFilePath } = req.files.archivo
        await EstudianteSchema.deleteMany({})
        workbook.xlsx.readFile(tempFilePath)
            .then((value) => {
                const worksheet = value.worksheets[0];
                const rows = worksheet.getRows(2, worksheet.rowCount);
                const estudiantes = [];

                rows.forEach((row) => {
                    if (row.values.some(value => value !== null)) {
                        const estudiante = new EstudianteSchema();
                        estudiante.sede = row.getCell(1).value;
                        estudiante.carrera = row.getCell(2).value;
                        estudiante.semestre = row.getCell(3).value;
                        estudiante.ci = typeof row.getCell(8).value != "object" ? row.getCell(4).value : row.getCell(5).value.substring(3);
                        estudiante.codigo = row.getCell(5).value;
                        estudiante.nombre = row.getCell(6).value;
                        estudiante.apellido = row.getCell(7).value;
                        estudiante.email = typeof row.getCell(8).value != "object" ? row.getCell(8).value : `cbbe.${row.getCell(6).value.replace(/\s+/g, '')}.${row.getCell(7).value.replace(/\s+/g, '')}@unifranz.edu.bo`;
                        estudiantes.push(estudiante);
                    }
                });

                EstudianteSchema.insertMany(estudiantes)
                    .then(() => {
                        return res.json({
                            ok: true,
                        });
                    })
                    .catch((error) => {
                        console.log(error)
                        res.status(500).json({
                            ok: false,
                            msg: 'Por favor hable con el administrador'
                        });
                    });
            })
            .catch((error) => {
                console.log(error)
                res.status(500).json({
                    ok: false,
                    msg: 'Por favor hable con el administrador'
                });
            });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}
const addStudentEvent = async (req, res = response) => {

    const eventoId = req.params.id;

    try {
        console.log(req.uid)
        console.log('evento id', eventoId)
        const evento = await EventoSchema.findById(eventoId)
        console.log(evento)
        if (evento.studentIds.filter((e) => e == req.uid).length > 0) {
            return res.status(400).json({
                errors: [{ msg: "Ya perteneces a este evento" }]
            });
        }
        let listStudents = [...evento.studentIds, req.uid]
        evento.studentIds = listStudents

        await EventoSchema.findByIdAndUpdate(eventoId, evento, { new: true },);
        // const eventoConReferencias = await EventoSchema.findById(eventoEditado.id)
        //     .populate('categoryIds')
        //     .populate('studentIds')
        //     .populate('guestIds')
        //     .populate('careerIds');
        res.json({
            ok: true,
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}
module.exports = {
    getStudents,
    authStudent,
    createStudents,
    addStudentEvent,
}