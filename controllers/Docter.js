const Doctor = require("../models/DocterModel");
const Patient = require("../models/PatientModel");

const createDoctor = async (req, res) => {
    try {

        const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'specialization', 'licenseNumber'];

        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({
                    success: false,
                    message: `Missing required field: ${field}`
                });
            }
        }
        
        const doctorData = {
            ...req.body,
            createdBy: req.user.id
        };

        const doctor = await Doctor.create(doctorData);

        res.status(201).json({
            success: true,
            message: 'Doctor created successfully',
            data: doctor
        });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                success: false,
                message: 'Doctor with this email or license number already exists'
            });
        }

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
            message: 'Error creating doctor',
            error: error.message
        });
    }
};

const getDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.findAll({
            where: { isActive: true },
            // include: [{
            //     model: Patient,
            //     as: 'patients',
            //     attributes: ['id', 'firstName', 'lastName'],
            //     through: { attributes: [] }
            // }],
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            message: 'Doctors retrieved successfully',
            data: doctors
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving doctors',
            error: error.message
        });
    }
};

const getDoctorById = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({
            where: {
                id: req.params.id,
                isActive: true
            },
            include: [{
                model: Patient,
                as: 'patients',
                attributes: ['id', 'firstName', 'lastName', 'email', 'phone'],
                through: { attributes: ['assignedDate', 'notes'] }
            }]
        });

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        res.json({
            success: true,
            message: 'Doctor retrieved successfully',
            data: doctor
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving doctor',
            error: error.message
        });
    }
};

const updateDoctor = async (req, res) => {
    try {
        const [updatedRowsCount] = await Doctor.update(req.body, {
            where: { id: req.params.id }
        });

        if (updatedRowsCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        const updatedDoctor = await Doctor.findByPk(req.params.id);

        res.json({
            success: true,
            message: 'Doctor updated successfully',
            data: updatedDoctor
        });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                success: false,
                message: 'Doctor with this email or license number already exists'
            });
        }

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
            message: 'Error updating doctor',
            error: error.message
        });
    }
};

const deleteDoctor = async (req, res) => {
    try {
        // Soft delete - mark as inactive
        const deletedRowsCount = await Doctor.destroy(
          
            {
                where: {
                    id: req.params.id 
                    
                }
            }
        );

        if (deletedRowsCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        res.json({
            success: true,
            message: 'Doctor deactivated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting doctor',
            error: error.message
        });
    }
};

module.exports = {
    createDoctor,
    getDoctors,
    getDoctorById,
    updateDoctor,
    deleteDoctor
};