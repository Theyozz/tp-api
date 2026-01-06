/**
 * Middleware global de gestion des erreurs
 */
const errorHandler = (err, req, res, next) => {
    console.error('Erreur:', err);

    // Erreur de validation Mongoose
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(e => ({
            field: e.path,
            message: e.message
        }));

        return res.status(400).json({
            success: false,
            message: 'Erreur de validation',
            errors
        });
    }

    // Erreur de duplication (code 11000 de MongoDB)
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        return res.status(400).json({
            success: false,
            message: `${field} existe déjà`,
            field
        });
    }

    // Erreur de cast (ID invalide)
    if (err.name === 'CastError') {
        return res.status(400).json({
            success: false,
            message: 'ID invalide',
            field: err.path
        });
    }

    // Erreur par défaut
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Erreur serveur',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = errorHandler;
