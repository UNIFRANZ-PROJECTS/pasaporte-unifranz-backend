const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/users');
const { validarJWT } = require('../middlewares/validar-jwt');

const { emailExists } = require("../helpers/db-validators");
const router = Router();
// Todas tienes que pasar por la validación del JWT
router.use(validarJWT);

router.get('/', getUsers)

router.post(
    '/',
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check("email").custom(emailExists),
        check('type_user', 'El tipo de usuario es obligatorio').not().isEmpty(),
        check('rol', 'El rol es obligatorio').not().isEmpty(),
        validarCampos
    ],
    createUser
);
router.put(
    '/:id',
    updateUser
);
router.put(
    '/delete/:id',
    deleteUser
);


module.exports = router;