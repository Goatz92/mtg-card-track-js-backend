const jwt = require('jsonwebtoken');
const authService = require('../services/auth.service');
const logger = require('../logger/logger');

function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) {
        logger.warn('Access attempt without token');
        return res.status(401).json({ 
            status: false,
             message: "Access denied. No token provided"
        });
    }

    const result = authService.verifyAccessToken(token);

    if(result.verified) {
        req.user = result.data
        logger.debug('Token verified', { userId: req.user.id });
        next();
    } else {
        logger.warn('Invalid token attempt', { error: result.data });
        return res.status(403).json({ 
            status: false, 
            data: result.data,
        });
    }
}

function verifyRoles(allowedRole) {
    return (req, res, next) => {
        if((!req.user || !req.user.roles)) {
            logger.warn('Access attempt without roles');
            return res.status(403).json({ 
                status: false, 
                data: "Access denied: No role found"
            });
        }

        const userRoles = req.user.roles;
        const hasPermission = userRoles.includes(allowedRole);

        if(!hasPermission) {
            logger.warn('Insufficient permissions', { 
                userRoles, 
                requiredRoles: allowedRoles 
            });
            return res.status(403).json({
                status: false,
                data: "Access denied: insufficient permissions"});
        }

        next();
    }
}

module.exports = { verifyToken, verifyRoles }