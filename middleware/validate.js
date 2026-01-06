const { validationResult } = require('express-validator');

/**
 * Middleware pour valider les données des requêtes
 */
const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Erreur de validation',
            errors: errors.array().map(error => ({
                field: error.path || error.param,
                message: error.msg
            }))
        });
    }

    next();
};

module.exports = validate;
