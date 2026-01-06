const express = require('express');
const User = require('../models/User');
const Configuration = require('../models/Configuration');
const { authenticate, isAdmin } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Récupérer tous les utilisateurs (Admin uniquement)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 */
router.get('/', authenticate, isAdmin, async (req, res, next) => {
    try {
        const { search, role, page = 1, limit = 20 } = req.query;

        const filter = {};

        if (search) {
            filter.$or = [
                { name: new RegExp(search, 'i') },
                { email: new RegExp(search, 'i') }
            ];
        }

        if (role) {
            filter.role = role;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const users = await User.find(filter)
            .select('-password')
            .populate('configurations')
            .limit(parseInt(limit))
            .skip(skip)
            .sort({ createdAt: -1 });

        const total = await User.countDocuments(filter);

        res.json({
            success: true,
            count: users.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            data: { users }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Récupérer un utilisateur par ID (Admin uniquement)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails de l'utilisateur
 */
router.get('/:id', authenticate, isAdmin, async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password')
            .populate('configurations');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        res.json({
            success: true,
            data: { user }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Mettre à jour un utilisateur (Admin uniquement)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour
 */
router.put('/:id', authenticate, isAdmin, async (req, res, next) => {
    try {
        const allowedUpdates = ['name', 'email', 'role'];
        const updates = {};

        Object.keys(req.body).forEach(key => {
            if (allowedUpdates.includes(key)) {
                updates[key] = req.body[key];
            }
        });

        const user = await User.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        res.json({
            success: true,
            message: 'Utilisateur mis à jour avec succès',
            data: { user }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur (Admin uniquement)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Utilisateur supprimé
 */
router.delete('/:id', authenticate, isAdmin, async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        // Supprimer toutes les configurations de l'utilisateur
        await Configuration.deleteMany({ user: req.params.id });

        // Supprimer l'utilisateur
        await User.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Utilisateur et ses configurations supprimés avec succès'
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/users/{id}/configurations:
 *   get:
 *     summary: Récupérer les configurations d'un utilisateur (Admin uniquement)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des configurations de l'utilisateur
 */
router.get('/:id/configurations', authenticate, isAdmin, async (req, res, next) => {
    try {
        const configurations = await Configuration.find({ user: req.params.id })
            .populate({
                path: 'components.component',
                populate: { path: 'category' }
            })
            .populate('components.selectedPartner')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: configurations.length,
            data: { configurations }
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
