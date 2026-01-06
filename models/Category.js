const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Le nom de la catégorie est requis'],
        unique: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    description: {
        type: String,
        trim: true
    },
    icon: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Créer automatiquement le slug à partir du nom
categorySchema.pre('save', function (next) {
    if (this.isModified('name')) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[éèê]/g, 'e')
            .replace(/[àâ]/g, 'a')
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    }
    next();
});

module.exports = mongoose.model('Category', categorySchema);
