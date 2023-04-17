const { response } = require('express');
const { CategoriaSchema } = require('../models');

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

const getCategories = async (req, res = response) => {

    const categorias = await CategoriaSchema.find();
    // .populate('user', 'name');

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

    try {
        categoria.user = req.uid;
        //agregar ubicación de la imagen
        const { tempFilePath } = req.files.archivo
        const { secure_url } = await cloudinary.uploader.upload(tempFilePath, { folder: 'icons' });
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

        if (req.files != null) {

            //agregar ubicación de la imagen
            const { tempFilePath } = req.files.archivo
            const { secure_url } = await cloudinary.uploader.upload(tempFilePath, { folder: 'icons' });
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