const { Router } = require('express');

const { validarJWT, } = require('../middlewares');
const { getDashboard, getDashboardByFilter } = require('../controllers/dashboard');



const router = Router();

// Todas tienes que pasar por la validación del JWT
router.use(validarJWT);


// Obtener dashboard
router.get('/', getDashboard);

// generar filtro

router.post('/filter', getDashboardByFilter)

module.exports = router;