const express = require('express');
const {
    createPatient,
    getPatients,
    getPatientById,
    updatePatient,
    deletePatient
} = require('../controllers/Patient');
const auth = require('../middleware/auth');
const { patientValidation } = require('../middleware/validation');
const router = express.Router();

// All routes require authentication
router.use(auth);

router.post('/', patientValidation, createPatient);
router.get('/', getPatients);
router.get('/:id', getPatientById);
router.put('/:id', updatePatient);
router.delete('/:id', deletePatient);

module.exports = router;