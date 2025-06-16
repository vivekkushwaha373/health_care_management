const express = require('express');
const { userValidation } = require('../middleware/validation');
const { register, login } = require('../controllers/User');
const router = express.Router();

router.post('/register', userValidation, register);
router.post('/login', [
    require('express-validator').body('email').isEmail().normalizeEmail(),
    require('express-validator').body('password').notEmpty(),
    require('../middleware/validation').handleValidationErrors
], login);

module.exports = router;