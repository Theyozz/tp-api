const mongoose = require('mongoose');

const configurationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'L\'utilisateur est requis']
    },
    name: {
        type: String,
        required: [true, 'Le nom de la configuration est requis'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    components: [{
        component: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Component',
            required: true
        },
        selectedPartner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Partner'
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        quantity: {
            type: Number,
            default: 1,
            min: 1
        }
    }],
    totalCost: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    tags: [{
        type: String,
        trim: true
    }]
}, {
    timestamps: true
});

// Calculer le coût total avant de sauvegarder
configurationSchema.pre('save', function () {
    this.totalCost = this.components.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
});

// Index pour améliorer les performances
configurationSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Configuration', configurationSchema);
