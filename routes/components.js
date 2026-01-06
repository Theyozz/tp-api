const express = require('express');
const { body, query } = require('express-validator');
const Component = require('../models/Component');
const validate = require('../middleware/validate');
const { authenticate, isAdmin, optionalAuth } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/components:
 *   get:
 *     summary: Récupérer tous les composants avec filtres
 *     tags: [Components]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Liste des composants
 */
router.get('/', optionalAuth, async (req, res, next) => {
    try {
        const { category, brand, search, minPrice, maxPrice, page = 1, limit = 20 } = req.query;

        const filter = { isActive: true };

        if (category) filter.category = category;
        if (brand) filter.brand = new RegExp(brand, 'i');
        if (search) {
            filter.$text = { $search: search };
        }
        if (minPrice || maxPrice) {
            filter.basePrice = {};
            if (minPrice) filter.basePrice.$gte = parseFloat(minPrice);
            if (maxPrice) filter.basePrice.$lte = parseFloat(maxPrice);
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const components = await Component.find(filter)
            .populate('category')
            .populate('partnerPrices.partner')
            .limit(parseInt(limit))
            .skip(skip)
            .sort({ createdAt: -1 });

        const total = await Component.countDocuments(filter);

        res.json({
            success: true,
            count: components.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            data: { components }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/components/{id}:
 *   get:
 *     summary: Récupérer un composant par ID
 *     tags: [Components]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails du composant
 */
router.get('/:id', async (req, res, next) => {
    try {
        const component = await Component.findById(req.params.id)
            .populate('category')
            .populate('partnerPrices.partner');

        if (!component) {
            return res.status(404).json({
                success: false,
                message: 'Composant non trouvé'
            });
        }

        res.json({
            success: true,
            data: { component }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/components:
 *   post:
 *     summary: Créer un nouveau composant (Admin uniquement)
 *     tags: [Components]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - category
 *               - brand
 *               - title
 *               - model
 *               - basePrice
 *     responses:
 *       201:
 *         description: Composant créé avec succès
 */
router.post('/', authenticate, isAdmin, [
    body('category').notEmpty().withMessage('La catégorie est requise'),
    body('brand').trim().notEmpty().withMessage('La marque est requise'),
    body('title').trim().notEmpty().withMessage('Le titre est requis'),
    body('model').trim().notEmpty().withMessage('Le modèle est requis'),
    body('description').optional().trim(),
    body('specifications').optional().isObject(),
    body('image').optional().trim(),
    body('basePrice').isFloat({ min: 0 }).withMessage('Le prix doit être un nombre positif'),
    validate
], async (req, res, next) => {
    try {
        const component = new Component(req.body);
        await component.save();

        await component.populate('category');

        res.status(201).json({
            success: true,
            message: 'Composant créé avec succès',
            data: { component }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/components/{id}:
 *   put:
 *     summary: Mettre à jour un composant (Admin uniquement)
 *     tags: [Components]
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
 *         description: Composant mis à jour
 */
router.put('/:id', authenticate, isAdmin, [
    body('category').optional().notEmpty(),
    body('brand').optional().trim().notEmpty(),
    body('title').optional().trim().notEmpty(),
    body('model').optional().trim().notEmpty(),
    body('basePrice').optional().isFloat({ min: 0 }),
    validate
], async (req, res, next) => {
    try {
        const component = await Component.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('category').populate('partnerPrices.partner');

        if (!component) {
            return res.status(404).json({
                success: false,
                message: 'Composant non trouvé'
            });
        }

        res.json({
            success: true,
            message: 'Composant mis à jour avec succès',
            data: { component }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/components/{id}:
 *   delete:
 *     summary: Supprimer un composant (Admin uniquement)
 *     tags: [Components]
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
 *         description: Composant supprimé
 */
router.delete('/:id', authenticate, isAdmin, async (req, res, next) => {
    try {
        const component = await Component.findByIdAndDelete(req.params.id);

        if (!component) {
            return res.status(404).json({
                success: false,
                message: 'Composant non trouvé'
            });
        }

        res.json({
            success: true,
            message: 'Composant supprimé avec succès'
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/components/{id}/partner-prices:
 *   post:
 *     summary: Ajouter un prix partenaire à un composant (Admin uniquement)
 *     tags: [Components]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - partner
 *               - price
 *             properties:
 *               partner:
 *                 type: string
 *               price:
 *                 type: number
 *               url:
 *                 type: string
 *               inStock:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Prix partenaire ajouté
 */
router.post('/:id/partner-prices', authenticate, isAdmin, [
    body('partner').notEmpty().withMessage('Le partenaire est requis'),
    body('price').isFloat({ min: 0 }).withMessage('Le prix doit être un nombre positif'),
    body('url').optional().trim(),
    body('inStock').optional().isBoolean(),
    validate
], async (req, res, next) => {
    try {
        const component = await Component.findById(req.params.id);

        if (!component) {
            return res.status(404).json({
                success: false,
                message: 'Composant non trouvé'
            });
        }

        component.partnerPrices.push({
            ...req.body,
            lastUpdated: new Date()
        });

        await component.save();
        await component.populate('partnerPrices.partner');

        res.json({
            success: true,
            message: 'Prix partenaire ajouté avec succès',
            data: { component }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/components/{componentId}/partner-prices/{priceId}:
 *   put:
 *     summary: Mettre à jour un prix partenaire (Admin uniquement)
 *     tags: [Components]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: componentId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: priceId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Prix mis à jour
 */
router.put('/:componentId/partner-prices/:priceId', authenticate, isAdmin, async (req, res, next) => {
    try {
        const component = await Component.findById(req.params.componentId);

        if (!component) {
            return res.status(404).json({
                success: false,
                message: 'Composant non trouvé'
            });
        }

        const partnerPrice = component.partnerPrices.id(req.params.priceId);
        if (!partnerPrice) {
            return res.status(404).json({
                success: false,
                message: 'Prix partenaire non trouvé'
            });
        }

        Object.assign(partnerPrice, req.body);
        partnerPrice.lastUpdated = new Date();

        await component.save();
        await component.populate('partnerPrices.partner');

        res.json({
            success: true,
            message: 'Prix partenaire mis à jour avec succès',
            data: { component }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/components/{componentId}/partner-prices/{priceId}:
 *   delete:
 *     summary: Supprimer un prix partenaire (Admin uniquement)
 *     tags: [Components]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: componentId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: priceId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Prix supprimé
 */
router.delete('/:componentId/partner-prices/:priceId', authenticate, isAdmin, async (req, res, next) => {
    try {
        const component = await Component.findById(req.params.componentId);

        if (!component) {
            return res.status(404).json({
                success: false,
                message: 'Composant non trouvé'
            });
        }

        component.partnerPrices.pull(req.params.priceId);
        await component.save();

        res.json({
            success: true,
            message: 'Prix partenaire supprimé avec succès'
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
