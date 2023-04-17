const { Router } = require('express');
const { check } = require('express-validator');


const { validarJWT, validarCampos, validarArchivoSubir } = require('../middlewares');
const { getCategories, getCategory, createCategory, updateCategory, deleteCategory } = require('../controllers/categories');

const { categoryExists } = require("../helpers/db-validators");
const router = Router();


// Obtener categorias 
router.get('/', getCategories);
// Obtener categoria
router.get('/:id', getCategory)
// Crear una nueva categoria
router.post(
    '/',
    [
        validarArchivoSubir,
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check("title").custom(categoryExists),
        validarCampos
    ],
    validarJWT,
    createCategory
);

router.put(
    '/:id',
    [
        check('title', 'El email es obligatorio').not().isEmpty(),
        check("title").custom(categoryExists),
        validarCampos
    ],
    updateCategory
);

// eliminar categoria
router.put('/delete/:id', deleteCategory)
module.exports = router;