const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PatientDoctorMapping = sequelize.define('PatientDoctorMapping', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    patientId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Patients',
            key: 'id'
        }
    },
    doctorId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Doctors',
            key: 'id'
        }
    },
    assignedDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    indexes: [
        {
            unique: true,
            fields: ['patientId', 'doctorId']
        }
    ]
});

module.exports = PatientDoctorMapping;