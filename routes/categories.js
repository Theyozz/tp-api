const express = require('express');
const { body } = require('express-validator');
const Category = require('../models/Category');
const validate = require('../middleware/validate');
const { authenticate, isAdmin } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Récupérer toutes les catégories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Liste des catégories
 */
router.get('/', async (req, res, next) => {
    try {
        const categories = await Category.find().sort({ name: 1 });

        res.json({
            success: true,
            count: categories.length,
            data: { categories }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Récupérer une catégorie par ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails de la catégorie
 *       404:
 *         description: Catégorie non trouvée
 */
router.get('/:id', async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Catégorie non trouvée'
            });
        }

        res.json({
            success: true,
            data: { category }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Créer une nouvelle catégorie (Admin uniquement)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               icon:
 *                 type: string
 *     responses:
 *       201:
 *         description: Catégorie créée avec succès
 */
router.post('/', authenticate, isAdmin, [
    body('name').trim().notEmpty().withMessage('Le nom est requis'),
    body('description').optional().trim(),
    body('icon').optional().trim(),
    validate
], async (req, res, next) => {
    try {
        const category = new Category(req.body);
        await category.save();

        res.status(201).json({
            success: true,
            message: 'Catégorie créée avec succès',
            data: { category }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Mettre à jour une catégorie (Admin uniquement)
 *     tags: [Categories]
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
 *         description: Catégorie mise à jour
 */
router.put('/:id', authenticate, isAdmin, [
    body('name').optional().trim().notEmpty().withMessage('Le nom ne peut pas être vide'),
    body('description').optional().trim(),
    body('icon').optional().trim(),
    validate
], async (req, res, next) => {
    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Catégorie non trouvée'
            });
        }

        res.json({
            success: true,
            message: 'Catégorie mise à jour avec succès',
            data: { category }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Supprimer une catégorie (Admin uniquement)
 *     tags: [Categories]
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
 *         description: Catégorie supprimée
 */
router.delete('/:id', authenticate, isAdmin, async (req, res, next) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Catégorie non trouvée'
            });
        }

        res.json({
            success: true,
            message: 'Catégorie supprimée avec succès'
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
