const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Le nom du partenaire est requis'],
        unique: true,
        trim: true
    },
    website: {
        type: String,
        required: [true, 'L\'URL du site est requise'],
        trim: true,
        match: [/^https?:\/\/.+/, 'URL invalide']
    },
    logo: {
        type: String,
        trim: true
    },
    affiliateProgram: {
        commissionRate: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        },
        terms: {
            type: String,
            trim: true
        },
        affiliateId: {
            type: String,
            trim: true
        }
    },
    syncSettings: {
        apiKey: {
            type: String,
            trim: true
        },
        apiUrl: {
            type: String,
            trim: true
        },
        lastSync: {
            type: Date
        },
        autoSync: {
            type: Boolean,
            default: false
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    contactEmail: {
        type: String,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Email invalide']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Partner', partnerSchema);
