# Healthcare Management System

A comprehensive healthcare management API built with Node.js, Express, and PostgreSQL for managing patients, doctors, and their relationships.

## Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=healthcare_db
DB_USER=postgres
DB_PASSWORD=23637213
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_complex
JWT_EXPIRES_IN=7d
PORT=3000
NODE_ENV=development
```

## API Testing with Postman

**Base URL:** `http://localhost:3000/api`

### Authentication

#### Register User
- **POST** `/auth/register`
- **Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
- **POST** `/auth/login`
- **Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Patients
*Requires Authorization header: `Bearer <token>`*

#### Create Patient
- **POST** `/patients`
- **Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "phone": "1234567890",
  "dateOfBirth": "1990-01-01",
  "gender": "female",
  "address": "123 Main St",
  "medicalHistory": "No known allergies"
}
```

#### Other Patient Operations
- **GET** `/patients` - Get all patients
- **GET** `/patients/:id` - Get patient by ID
- **PUT** `/patients/:id` - Update patient
- **DELETE** `/patients/:id` - Delete patient

### Doctors
*Requires Authorization header: `Bearer <token>`*

#### Create Doctor
- **POST** `/doctors`
- **Body:**
```json
{
  "firstName": "Dr. John",
  "lastName": "Wilson",
  "email": "dr.wilson@example.com",
  "phone": "9876543210",
  "specialization": "Cardiology",
  "licenseNumber": "MD123456",
  "experience": 10,
  "qualification": "MBBS, MD"
}
```

#### Other Doctor Operations
- **GET** `/doctors` - Get all doctors
- **GET** `/doctors/:id` - Get doctor by ID
- **PUT** `/doctors/:id` - Update doctor
- **DELETE** `/doctors/:id` - Delete doctor



### Patient-Doctor Mappings
*Requires Authorization header: `Bearer <token>`*

#### Create Mapping
- **POST** `/mappings`
- **Body:**
```json
{
  "patientId": "patient-uuid",
  "doctorId": "doctor-uuid",
  "notes": "Initial consultation"
}
```

#### Other Mapping Operations
- **GET** `/mappings` - Get all mappings
- **GET** `/mappings/:patientId` - Get mappings by patient ID
- **DELETE** `/mappings/:id` - Delete mapping

## Features

- ✅ JWT Authentication
- ✅ User Registration and Login
- ✅ Patient CRUD operations
- ✅ Doctor CRUD operations
- ✅ Patient-Doctor mapping
- ✅ Input validation
- ✅ Error handling
- ✅ Security headers
- ✅ CORS support
- ✅ Database relationships
- ✅ Soft delete for doctors
- ✅ Authorization checks
- ✅ UUID primary keys
- ✅ Password hashing

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- Input validation and sanitization
- SQL injection prevention (Sequelize ORM)
- Security headers with Helmet
- CORS configuration
- Authorization checks for user-specific data

## Database Schema

### Tables
- **Users** - id, name, email, password, timestamps
- **Patients** - id, personal details, createdBy, timestamps
- **Doctors** - id, professional details, isActive, timestamps
- **PatientDoctorMappings** - id, patientId, doctorId, assignedDate, isActive, notes, timestamps

## Error Handling

The API handles the following error types:
- Validation errors
- Database errors
- Authentication errors
- Not found errors
- Server errors

## POSTMAN TESTING IS DONE

![POSTMAN TESTING COMPLETED](/public/images/postmantesting.png)