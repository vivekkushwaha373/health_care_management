const User = require('./UserModel');
const Patient = require('./PatientModel');
const PatientDoctorMapping = require('./PatientDocterMappingModel');
const Doctor = require('./DocterModel');

// Define associations
User.hasMany(Patient, { foreignKey: 'createdBy', as: 'patients' });
User.hasMany(Doctor, { foreignKey: 'createdBy', as: 'doctors' });

Patient.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
Doctor.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

Patient.belongsToMany(Doctor, {
    through: PatientDoctorMapping,
    foreignKey: 'patientId',
    otherKey: 'doctorId',
    as: 'doctors'
});

Doctor.belongsToMany(Patient, {
    through: PatientDoctorMapping,
    foreignKey: 'doctorId',
    otherKey: 'patientId',
    as: 'patients'
});

PatientDoctorMapping.belongsTo(Patient, { foreignKey: 'patientId', as: 'patient' });
PatientDoctorMapping.belongsTo(Doctor, { foreignKey: 'doctorId', as: 'doctor' });

module.exports = {
    User,
    Patient,
    Doctor,
    PatientDoctorMapping
};