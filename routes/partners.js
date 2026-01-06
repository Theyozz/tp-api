const express = require('express');
const { body } = require('express-validator');
const Partner = require('../models/Partner');
const validate = require('../middleware/validate');
const { authenticate, isAdmin } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/partners:
 *   get:
 *     summary: Récupérer tous les partenaires
 *     tags: [Partners]
 *     parameters:
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Liste des partenaires
 */
router.get('/', async (req, res, next) => {
    try {
        const filter = {};

        if (req.query.active !== undefined) {
            filter.isActive = req.query.active === 'true';
        }

        const partners = await Partner.find(filter).sort({ name: 1 });

        res.json({
            success: true,
            count: partners.length,
            data: { partners }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/partners/{id}:
 *   get:
 *     summary: Récupérer un partenaire par ID
 *     tags: [Partners]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails du partenaire
 */
router.get('/:id', async (req, res, next) => {
    try {
        const partner = await Partner.findById(req.params.id);

        if (!partner) {
            return res.status(404).json({
                success: false,
                message: 'Partenaire non trouvé'
            });
        }

        res.json({
            success: true,
            data: { partner }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/partners:
 *   post:
 *     summary: Créer un nouveau partenaire (Admin uniquement)
 *     tags: [Partners]
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
 *               - website
 *     responses:
 *       201:
 *         description: Partenaire créé avec succès
 */
router.post('/', authenticate, isAdmin, [
    body('name').trim().notEmpty().withMessage('Le nom est requis'),
    body('website').trim().notEmpty().withMessage('Le site web est requis')
        .matches(/^https?:\/\/.+/).withMessage('URL invalide'),
    body('logo').optional().trim(),
    body('contactEmail').optional().isEmail().withMessage('Email invalide'),
    body('affiliateProgram.commissionRate').optional().isFloat({ min: 0, max: 100 }),
    validate
], async (req, res, next) => {
    try {
        const partner = new Partner(req.body);
        await partner.save();

        res.status(201).json({
            success: true,
            message: 'Partenaire créé avec succès',
            data: { partner }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/partners/{id}:
 *   put:
 *     summary: Mettre à jour un partenaire (Admin uniquement)
 *     tags: [Partners]
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
 *         description: Partenaire mis à jour
 */
router.put('/:id', authenticate, isAdmin, [
    body('name').optional().trim().notEmpty(),
    body('website').optional().trim().matches(/^https?:\/\/.+/).withMessage('URL invalide'),
    body('contactEmail').optional().isEmail().withMessage('Email invalide'),
    validate
], async (req, res, next) => {
    try {
        const partner = await Partner.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!partner) {
            return res.status(404).json({
                success: false,
                message: 'Partenaire non trouvé'
            });
        }

        res.json({
            success: true,
            message: 'Partenaire mis à jour avec succès',
            data: { partner }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/partners/{id}:
 *   delete:
 *     summary: Supprimer un partenaire (Admin uniquement)
 *     tags: [Partners]
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
 *         description: Partenaire supprimé
 */
router.delete('/:id', authenticate, isAdmin, async (req, res, next) => {
    try {
        const partner = await Partner.findByIdAndDelete(req.params.id);

        if (!partner) {
            return res.status(404).json({
                success: false,
                message: 'Partenaire non trouvé'
            });
        }

        res.json({
            success: true,
            message: 'Partenaire supprimé avec succès'
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
