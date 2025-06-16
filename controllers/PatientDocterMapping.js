const Doctor = require("../models/DocterModel");
const Patient = require("../models/PatientModel");
const PatientDoctorMapping = require("../models/PatientDocterMappingModel");


const createMapping = async (req, res) => {
    try {
        const { patientId, doctorId, notes } = req.body;

        // Verify patient belongs to authenticated user
        const patient = await Patient.findOne({
            where: {
                id: patientId,
                createdBy: req.user.id
            }
        });

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found or unauthorized'
            });
        }

        // Verify doctor exists and is active
        const doctor = await Doctor.findOne({
            where: {
                id: doctorId,
                isActive: true
            }
        });

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found or inactive'
            });
        }

        // Create mapping
        const mapping = await PatientDoctorMapping.create({
            patientId,
            doctorId,
            notes
        });

        const mappingWithDetails = await PatientDoctorMapping.findByPk(mapping.id, {
            include: [
                {
                    model: Patient,
                    as: 'patient',
                    attributes: ['id', 'firstName', 'lastName']
                },
                {
                    model: Doctor,
                    as: 'doctor',
                    attributes: ['id', 'firstName', 'lastName', 'specialization']
                }
            ]
        });

        res.status(201).json({
            success: true,
            message: 'Doctor assigned to patient successfully',
            data: mappingWithDetails
        });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                success: false,
                message: 'This doctor is already assigned to this patient'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error creating mapping',
            error: error.message
        });
    }
};


const getMappings = async (req, res) => {
    try {
        const mappings = await PatientDoctorMapping.findAll({
            where: { isActive: true },
            include: [
                {
                    model: Patient,
                    as: 'patient',
                    attributes: ['id', 'firstName', 'lastName', 'email'],
                    where: { createdBy: req.user.id }
                },
                {
                    model: Doctor,
                    as: 'doctor',
                    attributes: ['id', 'firstName', 'lastName', 'specialization', 'email']
                }
            ],
            order: [['assignedDate', 'DESC']]
        });

        res.json({
            success: true,
            message: 'Mappings retrieved successfully',
            data: mappings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving mappings',
            error: error.message
        });
    }
};
  
const getDoctorsByPatient = async (req, res) => {
    try {
        const { patientId } = req.params;

        // Verify patient belongs to authenticated user
        const patient = await Patient.findOne({
            where: {
                id: patientId,
                createdBy: req.user.id
            }
        });

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found or unauthorized'
            });
        }

        const mappings = await PatientDoctorMapping.findAll({
            where: {
                patientId,
                isActive: true
            },
            include: [
                {
                    model: Doctor,
                    as: 'doctor',
                    attributes: ['id', 'firstName', 'lastName', 'specialization', 'email', 'phone']
                }
            ],
            order: [['assignedDate', 'DESC']]
        });

        res.json({
            success: true,
            message: 'Doctors for patient retrieved successfully',
            data: mappings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving doctors for patient',
            error: error.message
        });
    }
};



const deleteMapping = async (req, res) => {
    try {
        const mapping = await PatientDoctorMapping.findOne({
            where: { id: req.params.id },
            include: [{
                model: Patient,
                as: 'patient',
                where: { createdBy: req.user.id }
            }]
        });

        if (!mapping) {
            return res.status(404).json({
                success: false,
                message: 'Mapping not found or unauthorized'
            });
        }

        // Soft delete - mark as inactive
        await PatientDoctorMapping.update(
            { isActive: false },
            { where: { id: req.params.id } }
        );

        res.json({
            success: true,
            message: 'Doctor removed from patient successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting mapping',
            error: error.message
        });
    }
}

module.exports = {
    createMapping,
    getMappings,
    getDoctorsByPatient,
    deleteMapping
};