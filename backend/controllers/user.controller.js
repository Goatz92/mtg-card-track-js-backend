const User = require('../models/user.model');
const userService = require('../services/user.service');
const bcrypt = require('bcrypt');

const logger = require('../logger/logger');

exports.findAll = async(req, res) => {
    
    try {
        const result = await userService.findAll();
        res.status(200).json({
            status: true,
            data: result
        });
        logger.info("Success in reading all users");
        logger.warn("Success in reading all users");
        logger.error("Error in reading all users");
    } catch (err) {
        console.log("Error in reading all users");
        logger.error("Error in reading all users");
        res.status(400).json({
            status: false,
            data: err
        });
    }
}

exports.findOne = async(req, res) => {
    
    let username = req.params.username;

    try {
        const result = await userService.findOne(username);
        
        if (result) {
            res.status(200).json({
                status:true,
                data: result
            });
        } else {
            res.status(404).json({
                status:false,
                data: "Error: User does not exist" 
            });
        }
    } catch (err) {
        console.log("Error: Can not find user", err)
        res.status(400).json({
            status: false,
            data: err
        });
    }
}

exports.create = async(req, res) => {
    
    let data = req.body;
    const SaltOrRounds = 10;

    let hashedPassword = "";
    if(data.password)
        hashedPassword = await bcrypt.hash(data.password, SaltOrRounds)

    const newUser = new User({
        username: data.username,
        email: data.email,
        password: hashedPassword
    });
    
    try {
        const result = await newUser.save();
        res.status(200).json({
            status: true,
            data: result
        });
    } catch (err) {
        console.log("Error: Can not create user", err);
        res.status(400).json({
            status: false,
            data: err
        });
    }
}

exports.update = async(req, res) => {
    const username = req.body.username;

    const updateUser = {
        username: req.body.username,
        email: req.body.email
    }
    
    try {
        const result = await User.findAndUpdate(
            {username: username},
            updateUser,
            {new: true}
        );
        res.status(200).json({
            status: true,
            data: result
        });
    } catch (err) {
        console.log("Error: Did not update user", err);
        res.status(400).json({
            status: false,
            data: err
        });
    }
}

exports.deleteByUsername = async(req, res) => {
    const username = req.params.username
    
    try {
        const result = await User.findAndDelete({ username: username});
        res.status(200).json({
            status: true,
            data: result
        });
    } catch (err) {
        console.log("Error: Did not delete user", err);
        res.status(400).json({
            status: false,
            data: err
        });
    }
}

exports.deleteByEmail = async(req, res) => {
    const username = req.params.username;
    const email = req.params.email;
    
    try {
        const result = await User.findAndDelete({email: email});
        res.status(200).json({
            status: true,
            data: result
        });
    } catch (err) {
        console.log("Error: Did not delete user by email");
        res.status(400).json({
            status: false,
            data: err
        });
    }
}

exports.checkDuplicateEmail = async(req, res) => {
    const email = req.params.email;

    try {
        const result = await User.findOne({email: email});

        if(result) {
            logger.info(`Email check - duplicate found: ${email}`);
            res.status(400).json({
                status: false,
                message: 'Email already exists',
                data: { email: result.email }
            });
        } else {
            logger.info(`Email check - available: ${email}`);
        return res.status(200).json({
            status: true,
            message: 'Email is available',
            data: result
            });
        }
    }catch (err) {
        logger.error('Error checking email', { 
            email, 
            error: err.message 
        });
        return res.status(500).json({
            status: false,
            message: 'Error checking email',
            error: err.message
        });
    }
}