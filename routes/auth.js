const express = require('express');
const { body } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Inscription d'un nouvel utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: Erreur de validation
 */
router.post('/register', [
    body('name').trim().notEmpty().withMessage('Le nom est requis'),
    body('email').isEmail().withMessage('Email invalide'),
    body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
    validate
], async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Cet email est déjà utilisé'
            });
        }

        // Créer l'utilisateur
        const user = new User({ name, email, password });
        await user.save();

        // Générer le token JWT
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        res.status(201).json({
            success: true,
            message: 'Utilisateur créé avec succès',
            data: {
                user: user.toJSON(),
                token
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Connexion d'un utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Connexion réussie
 *       401:
 *         description: Identifiants invalides
 */
router.post('/login', [
    body('email').isEmail().withMessage('Email invalide'),
    body('password').notEmpty().withMessage('Le mot de passe est requis'),
    validate
], async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Trouver l'utilisateur
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Email ou mot de passe incorrect'
            });
        }

        // Vérifier le mot de passe
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Email ou mot de passe incorrect'
            });
        }

        // Générer le token JWT
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        res.json({
            success: true,
            message: 'Connexion réussie',
            data: {
                user: user.toJSON(),
                token
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Récupérer le profil de l'utilisateur connecté
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil récupéré avec succès
 *       401:
 *         description: Non authentifié
 */
router.get('/me', authenticate, async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).populate('configurations');

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
 * /api/auth/me:
 *   put:
 *     summary: Mettre à jour le profil de l'utilisateur connecté
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profil mis à jour avec succès
 */
router.put('/me', authenticate, [
    body('name').optional().trim().notEmpty().withMessage('Le nom ne peut pas être vide'),
    body('email').optional().isEmail().withMessage('Email invalide'),
    validate
], async (req, res, next) => {
    try {
        const updates = {};
        if (req.body.name) updates.name = req.body.name;
        if (req.body.email) updates.email = req.body.email;

        const user = await User.findByIdAndUpdate(
            req.user._id,
            updates,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            message: 'Profil mis à jour avec succès',
            data: { user }
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
