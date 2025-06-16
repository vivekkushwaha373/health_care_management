const express = require('express');
const {
    createMapping,
    getMappings,
    getDoctorsByPatient,
    deleteMapping
} = require('../controllers/PatientDocterMapping');
const auth = require('../middleware/auth');
const { body } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validation');
const router = express.Router();

// All routes require authentication
router.use(auth);

const mappingValidation = [
    body('patientId').isUUID().withMessage('Valid patient ID is required'),
    body('doctorId').isUUID().withMessage('Valid doctor ID is required'),
    body('notes').optional().trim(),
    handleValidationErrors
];

router.post('/', mappingValidation, createMapping);
router.get('/', getMappings);
router.get('/:patientId', getDoctorsByPatient);
router.delete('/:id', deleteMapping);

module.exports = router;