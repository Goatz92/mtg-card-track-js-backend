const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const authService = require('../services/auth.service');

exports.login = async(req, res) => {
    console.log("Login User", req.body);
    
    const { username, password } = req.body;

    try {
        const result = await User.findOne(
            {username: username},
            {username: 1, email: 1, password: 1, roles: 1}
        );
        if (!result) {
            return res.status(401).json({
                status: false,
                message: "Invalid credentials"
            });
        }
        
        const isMatch = await bcrypt.compare(password, result.password);

        if(!isMatch) {
            return res.status(401).json({
                status: false,
                message: "Invalid credentials"
            });
        }

        const token = authService.generateAccessToken(result);
        res.status(200).json({
            status: true,
            token: token,
            data: {
                username: result.username,
                email: result.email,
                roles: result.roles
            }
        });
    } catch (error) {
        console.log("Problem in logging: ", error);
        res.status(500).json({
            status: false,
            message: "Internal server error"
        });
    }
};

exports.googleLogin = async(req, res) => {
    const code = req.query.code;

    if (!code) {
        res.status(400).json({
            status: false,
            message: "No authorization code provided"
        });
    } else {
        try {
            let user = await authService.googleAuth(code);
            if (user) {
                console.log("---", user, "---");
                res.status(200).json({
                    status: true,
                    data: user
                });
            } else {
                res.status(400).json({
                    status: false,
                    message: "Google authentication failed"
                });
            }
        } catch (error) {
            console.error("Google login error:", error);
            res.status(500).json({
                status: false,
                message: "Internal server error"
            });
        }
    }
};