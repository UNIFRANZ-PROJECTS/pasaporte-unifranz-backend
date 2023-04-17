const { Router } = require('express');

const { validarJWT, } = require('../middlewares');
const { getReportByFilter, getDocumentByFilter } = require('../controllers/reports');



const router = Router();

// Todas tienes que pasar por la validación del JWT
router.use(validarJWT);


// Obtener reporte filtrado
router.post('/', getReportByFilter);

router.post('/download', getDocumentByFilter);

module.exports = router;