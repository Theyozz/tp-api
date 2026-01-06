const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware pour vérifier le token JWT
 */
const authenticate = async (req, res, next) => {
    try {
        // Récupérer le token depuis le header Authorization
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Authentification requise. Aucun token fourni.'
            });
        }

        // Vérifier et décoder le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Rechercher l'utilisateur
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Utilisateur non trouvé.'
            });
        }

        // Attacher l'utilisateur à la requête
        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Token invalide.'
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expiré.'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Erreur d\'authentification.',
            error: error.message
        });
    }
};

/**
 * Middleware pour vérifier le rôle admin
 */
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Accès refusé. Droits administrateur requis.'
        });
    }
    next();
};

/**
 * Middleware optionnel pour l'authentification (ne bloque pas si pas de token)
 */
const optionalAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId).select('-password');
            if (user) {
                req.user = user;
                req.token = token;
            }
        }
        next();
    } catch (error) {
        // Continue sans authentification en cas d'erreur
        next();
    }
};

module.exports = {
    authenticate,
    isAdmin,
    optionalAuth
};
