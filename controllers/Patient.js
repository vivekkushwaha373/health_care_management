const Doctor = require("../models/DocterModel");
const Patient = require("../models/PatientModel");


const createPatient = async (req, res) => {
    try {
        
        const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'dateOfBirth','gender'];
        
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({
                    success: false,
                    message: `Missing required field: ${field}`
                });
            }
        }

        const patientData = {
            ...req.body,
            createdBy: req.user.id
        };

        const patient = await Patient.create(patientData);

        res.status(201).json({
            success: true,
            message: 'Patient created successfully',
            data: patient
        });
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.errors.map(err => ({
                    field: err.path,
                    message: err.message
                }))
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error creating patient',
            error: error.message
        });
    }
};

const getPatients = async (req, res) => {
    try {
        const patients = await Patient.findAll({
            where: { createdBy: req.user.id },
    
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            message: 'Patients retrieved successfully',
            data: patients
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving patients',
            error: error.message
        });
    }
};

const getPatientById = async (req, res) => {
    try {
        const patient = await Patient.findOne({
            where: {
                id: req.params.id,
                // createdBy: req.user.id
            },
            
        });

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }

        res.json({
            success: true,
            message: 'Patient retrieved successfully',
            data: patient
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving patient',
            error: error.message
        });
    }
};

const updatePatient = async (req, res) => {
    try {
        

        const [updatedRowsCount] = await Patient.update(req.body, {
            where: {
                id: req.params.id,
               
            }
        });

        if (updatedRowsCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found or unauthorized'
            });
        }

        const updatedPatient = await Patient.findByPk(req.params.id);

        res.json({
            success: true,
            message: 'Patient updated successfully',
            data: updatedPatient
        });
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.errors.map(err => ({
                    field: err.path,
                    message: err.message
                }))
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error updating patient',
            error: error.message
        });
    }
};

const deletePatient = async (req, res) => {
    try {
        const deletedRowsCount = await Patient.destroy({
            where: {
                id: req.params.id,
                // createdBy: req.user.id
            }
        });

        if (deletedRowsCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found or unauthorized'
            });
        }

        res.json({
            success: true,
            message: 'Patient deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting patient',
            error: error.message
        });
    }
};

module.exports = {
    createPatient,
    getPatients,
    getPatientById,
    updatePatient,
    deletePatient
};
