const express = require('express');
const { body } = require('express-validator');
const PDFDocument = require('pdfkit');
const Configuration = require('../models/Configuration');
const Component = require('../models/Component');
const User = require('../models/User');
const validate = require('../middleware/validate');
const { authenticate, isAdmin } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/configurations:
 *   get:
 *     summary: Récupérer les configurations de l'utilisateur connecté
 *     tags: [Configurations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des configurations
 */
router.get('/', authenticate, async (req, res, next) => {
    try {
        const configurations = await Configuration.find({ user: req.user._id })
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

/**
 * @swagger
 * /api/configurations/all:
 *   get:
 *     summary: Récupérer toutes les configurations (Admin uniquement)
 *     tags: [Configurations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste de toutes les configurations
 */
router.get('/all', authenticate, isAdmin, async (req, res, next) => {
    try {
        const { user, page = 1, limit = 20 } = req.query;

        const filter = {};
        if (user) filter.user = user;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const configurations = await Configuration.find(filter)
            .populate('user', 'name email')
            .populate({
                path: 'components.component',
                populate: { path: 'category' }
            })
            .populate('components.selectedPartner')
            .limit(parseInt(limit))
            .skip(skip)
            .sort({ createdAt: -1 });

        const total = await Configuration.countDocuments(filter);

        res.json({
            success: true,
            count: configurations.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            data: { configurations }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/configurations/{id}:
 *   get:
 *     summary: Récupérer une configuration par ID
 *     tags: [Configurations]
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
 *         description: Détails de la configuration
 */
router.get('/:id', authenticate, async (req, res, next) => {
    try {
        const configuration = await Configuration.findById(req.params.id)
            .populate('user', 'name email')
            .populate({
                path: 'components.component',
                populate: { path: 'category' }
            })
            .populate('components.selectedPartner');

        if (!configuration) {
            return res.status(404).json({
                success: false,
                message: 'Configuration non trouvée'
            });
        }

        // Vérifier que l'utilisateur est propriétaire ou admin
        if (configuration.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Accès refusé'
            });
        }

        res.json({
            success: true,
            data: { configuration }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/configurations:
 *   post:
 *     summary: Créer une nouvelle configuration
 *     tags: [Configurations]
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
 *               - components
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               components:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     component:
 *                       type: string
 *                     selectedPartner:
 *                       type: string
 *                     price:
 *                       type: number
 *                     quantity:
 *                       type: number
 *     responses:
 *       201:
 *         description: Configuration créée avec succès
 */
router.post('/', authenticate, [
    body('name').trim().notEmpty().withMessage('Le nom est requis'),
    body('description').optional().trim(),
    body('components').isArray({ min: 1 }).withMessage('Au moins un composant est requis'),
    body('components.*.component').notEmpty().withMessage('L\'ID du composant est requis'),
    body('components.*.price').isFloat({ min: 0 }).withMessage('Le prix doit être un nombre positif'),
    body('components.*.quantity').optional().isInt({ min: 1 }),
    validate
], async (req, res, next) => {
    try {
        // Vérifier que tous les composants existent
        const componentIds = req.body.components.map(c => c.component);
        const components = await Component.find({ _id: { $in: componentIds } });

        if (components.length !== componentIds.length) {
            return res.status(400).json({
                success: false,
                message: 'Certains composants sont invalides'
            });
        }

        const configuration = new Configuration({
            ...req.body,
            user: req.user._id
        });

        await configuration.save();

        // Ajouter la configuration à l'utilisateur
        await User.findByIdAndUpdate(req.user._id, {
            $push: { configurations: configuration._id }
        });

        await configuration.populate({
            path: 'components.component',
            populate: { path: 'category' }
        });
        await configuration.populate('components.selectedPartner');

        res.status(201).json({
            success: true,
            message: 'Configuration créée avec succès',
            data: { configuration }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/configurations/{id}:
 *   put:
 *     summary: Mettre à jour une configuration
 *     tags: [Configurations]
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
 *         description: Configuration mise à jour
 */
router.put('/:id', authenticate, [
    body('name').optional().trim().notEmpty(),
    body('description').optional().trim(),
    body('components').optional().isArray({ min: 1 }),
    validate
], async (req, res, next) => {
    try {
        const configuration = await Configuration.findById(req.params.id);

        if (!configuration) {
            return res.status(404).json({
                success: false,
                message: 'Configuration non trouvée'
            });
        }

        // Vérifier que l'utilisateur est propriétaire ou admin
        if (configuration.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Accès refusé'
            });
        }

        Object.assign(configuration, req.body);
        await configuration.save();

        await configuration.populate({
            path: 'components.component',
            populate: { path: 'category' }
        });
        await configuration.populate('components.selectedPartner');

        res.json({
            success: true,
            message: 'Configuration mise à jour avec succès',
            data: { configuration }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/configurations/{id}:
 *   delete:
 *     summary: Supprimer une configuration
 *     tags: [Configurations]
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
 *         description: Configuration supprimée
 */
router.delete('/:id', authenticate, async (req, res, next) => {
    try {
        const configuration = await Configuration.findById(req.params.id);

        if (!configuration) {
            return res.status(404).json({
                success: false,
                message: 'Configuration non trouvée'
            });
        }

        // Vérifier que l'utilisateur est propriétaire ou admin
        if (configuration.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Accès refusé'
            });
        }

        await Configuration.findByIdAndDelete(req.params.id);

        // Retirer la configuration de l'utilisateur
        await User.findByIdAndUpdate(configuration.user, {
            $pull: { configurations: req.params.id }
        });

        res.json({
            success: true,
            message: 'Configuration supprimée avec succès'
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/configurations/{id}/calculate:
 *   get:
 *     summary: Calculer le coût total d'une configuration
 *     tags: [Configurations]
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
 *         description: Coût total calculé
 */
router.get('/:id/calculate', authenticate, async (req, res, next) => {
    try {
        const configuration = await Configuration.findById(req.params.id)
            .populate('components.component');

        if (!configuration) {
            return res.status(404).json({
                success: false,
                message: 'Configuration non trouvée'
            });
        }

        const breakdown = configuration.components.map(item => ({
            component: item.component.title,
            price: item.price,
            quantity: item.quantity,
            subtotal: item.price * item.quantity
        }));

        res.json({
            success: true,
            data: {
                breakdown,
                totalCost: configuration.totalCost
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/configurations/{id}/export-pdf:
 *   get:
 *     summary: Exporter une configuration en PDF
 *     tags: [Configurations]
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
 *         description: PDF généré
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/:id/export-pdf', authenticate, async (req, res, next) => {
    try {
        const configuration = await Configuration.findById(req.params.id)
            .populate('user', 'name email')
            .populate({
                path: 'components.component',
                populate: { path: 'category' }
            })
            .populate('components.selectedPartner');

        if (!configuration) {
            return res.status(404).json({
                success: false,
                message: 'Configuration non trouvée'
            });
        }

        // Vérifier que l'utilisateur est propriétaire ou admin
        if (configuration.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Accès refusé'
            });
        }

        // Créer le document PDF
        const doc = new PDFDocument({ margin: 50 });

        // Configurer les headers pour le téléchargement
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=configuration-${configuration._id}.pdf`);

        // Pipe le PDF vers la réponse
        doc.pipe(res);

        // En-tête
        doc.fontSize(20).text('Configuration PC - ConfigurateurPC.com', { align: 'center' });
        doc.moveDown();
        doc.fontSize(16).text(configuration.name, { align: 'center' });
        doc.moveDown(2);

        // Informations utilisateur
        doc.fontSize(12).text(`Client: ${configuration.user.name}`);
        doc.text(`Email: ${configuration.user.email}`);
        doc.text(`Date: ${new Date(configuration.createdAt).toLocaleDateString('fr-FR')}`);
        doc.moveDown(2);

        // Description
        if (configuration.description) {
            doc.fontSize(12).text('Description:', { underline: true });
            doc.fontSize(10).text(configuration.description);
            doc.moveDown(2);
        }

        // Liste des composants
        doc.fontSize(14).text('Liste des composants:', { underline: true });
        doc.moveDown();

        configuration.components.forEach((item, index) => {
            const component = item.component;
            doc.fontSize(11).text(`${index + 1}. ${component.title}`, { bold: true });
            doc.fontSize(9).text(`   Catégorie: ${component.category.name}`);
            doc.text(`   Marque: ${component.brand} - Modèle: ${component.model}`);

            if (item.selectedPartner) {
                doc.text(`   Fournisseur: ${item.selectedPartner.name}`);
            }

            doc.text(`   Quantité: ${item.quantity}`);
            doc.text(`   Prix unitaire: ${item.price.toFixed(2)} €`);
            doc.text(`   Sous-total: ${(item.price * item.quantity).toFixed(2)} €`);
            doc.moveDown();
        });

        // Total
        doc.moveDown();
        doc.fontSize(14).text(`PRIX TOTAL: ${configuration.totalCost.toFixed(2)} €`, {
            bold: true,
            align: 'right'
        });

        // Footer
        doc.moveDown(3);
        doc.fontSize(8).text('ConfigurateurPC.com - Votre partenaire pour la configuration PC sur mesure', {
            align: 'center'
        });

        // Finaliser le PDF
        doc.end();
    } catch (error) {
        next(error);
    }
});

module.exports = router;
