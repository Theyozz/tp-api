const mongoose = require('mongoose');

const componentSchema = new mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'La catégorie est requise']
    },
    brand: {
        type: String,
        required: [true, 'La marque est requise'],
        trim: true
    },
    title: {
        type: String,
        required: [true, 'Le titre est requis'],
        trim: true
    },
    model: {
        type: String,
        required: [true, 'Le modèle est requis'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    specifications: {
        type: Map,
        of: String,
        default: {}
    },
    image: {
        type: String,
        trim: true
    },
    basePrice: {
        type: Number,
        required: [true, 'Le prix de base est requis'],
        min: [0, 'Le prix ne peut pas être négatif']
    },
    partnerPrices: [{
        partner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Partner'
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        url: {
            type: String,
            trim: true
        },
        inStock: {
            type: Boolean,
            default: true
        },
        lastUpdated: {
            type: Date,
            default: Date.now
        }
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index pour améliorer les performances de recherche
componentSchema.index({ category: 1, brand: 1 });
componentSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Component', componentSchema);
