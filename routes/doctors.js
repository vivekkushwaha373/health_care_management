const express = require('express');
const {
    createDoctor,
    getDoctors,
    getDoctorById,
    updateDoctor,
    deleteDoctor
} = require('../controllers/Docter');
const auth = require('../middleware/auth');
const { doctorValidation } = require('../middleware/validation');
const router = express.Router();

// All routes require authentication
router.use(auth);

router.post('/', doctorValidation, createDoctor);
router.get('/', getDoctors);
router.get('/:id', getDoctorById);
router.put('/:id', doctorValidation, updateDoctor);
router.delete('/:id', deleteDoctor);

module.exports = router;