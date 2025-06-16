
const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();


exports.register = async (req, res) => {

    try {
        
        const { name, email, password } = req.body;
         
        if (!name || !email || !password) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Please provide all required fields: name, email, and password",
                }
            )
        }


        const existingUser = await User.findOne({
            where:{email}
        })

        if (existingUser) {
            return res.status(400).json(
                {
                    success: false,
                    message: "User already exists with this email",
                }
            )
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        })

        return res.status(201).json(
            {
                success: true,
                message: "User registered successfully",
                user: {
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email
                }
            }
        )
}
    catch (error) {
        console.log("Error in user registration:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error:error.message
        })
    } 
    
}


exports.login = async (req, res) => {
    
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Please provide both email and password",
                }
            )
        }

        const user = await User.findOne({
            where:{email}
        })

        if (!user) {
            return res.status(404).json(
                {
                    success: false,
                    message: "User not found",
                }
            )
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
          return res.status(401).json(
                {
                    success: false,
                    message: "Invalid password",
                }
            )    
        }

        const payload = {
            id: user.id,
            email:user.email,
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '1h',
        })

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000,

        }

        res.cookie('token', token, options);
        
        return res.status(200).json(
            {
                success: true,
                message: "Login successful",
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                },
            }
        )

    }
    catch (error) {
        console.log("Error in user login:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }

}
