const { response } = require('express');
const { CategoriaSchema } = require('../models');


const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);




const getCategories = async (req, res = response) => {

    const categorias = await CategoriaSchema.find();
    res.json({
        ok: true,
        categorias
    });
}




const getCategory = async (req, res = response) => {

    const { id } = req.params;
    const categoria = await CategoriaSchema.findById(id)
    // .populate('user', 'Usuario');
    // .populate('user', 'name');

    res.json({
        ok: true,
        categoria
    });
}

const createCategory = async (req, res = response) => {
    const categoria = new CategoriaSchema(req.body);
    console.log(req.body.archivo)
    console.log(req.uid)
    try {
        categoria.user = req.uid;
        // Convierte el archivo SVG en formato base64
        const fileBuffer = Buffer.from(req.body.archivo, 'base64');

        // Sube el archivo a Cloudinary como un archivo en formato "data URI"
        const { secure_url } = await cloudinary.uploader.upload(`data:image/svg+xml;base64,${fileBuffer.toString('base64')}`, {
            folder: 'icons'
        });
        //modificamos y damos acceso al usuario
        categoria.icon = secure_url;
        const categoriaGuardado = await categoria.save();

        res.json({
            ok: true,
            categoria: categoriaGuardado
        })


    } catch (error) {
        console.log(error)
        res.status(500).json({
            errors: [{ msg: "Por favor hable con el administrador" }]
        });
    }
}
const updateCategory = async (req, res = response) => {

    const categoryId = req.params.id;

    try {

        const nuevoCategory = {
            ...req.body
        }

        if (req.body.archivo != null) {

            // Convierte el archivo SVG en formato base64
            const fileBuffer = Buffer.from(req.body.archivo, 'base64');

            // Sube el archivo a Cloudinary como un archivo en formato "data URI"
            const { secure_url } = await cloudinary.uploader.upload(`data:image/svg+xml;base64,${fileBuffer.toString('base64')}`, {
                folder: 'icons'
            });
            //modificamos y damos acceso al usuario
            nuevoCategory.icon = secure_url;
        }

        const categoryActualizado = await CategoriaSchema.findByIdAndUpdate(categoryId, nuevoCategory, { new: true },);


        res.json({
            ok: true,
            categoria: categoryActualizado
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            errors: [{ msg: "Por favor hable con el administrador" }]
        });
    }

}
const deleteCategory = async (req, res = response) => {

    const categoryId = req.params.id;

    try {

        const nuevoCategory = {
            ...req.body
        }

        const categoryActualizado = await CategoriaSchema.findByIdAndUpdate(categoryId, nuevoCategory, { new: true },);


        res.json({
            ok: true,
            categoria: categoryActualizado
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            errors: [{ msg: "Por favor hable con el administrador" }]
        });
    }

}
module.exports = {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
}