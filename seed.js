const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Category = require('./models/Category');
const Component = require('./models/Component');
const Partner = require('./models/Partner');
const Configuration = require('./models/Configuration');

dotenv.config();

// Données de démonstration
const seedData = async () => {
    try {
        // Connexion à MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connecté à MongoDB');

        // Nettoyer la base de données
        await User.deleteMany({});
        await Category.deleteMany({});
        await Component.deleteMany({});
        await Partner.deleteMany({});
        await Configuration.deleteMany({});
        console.log('Base de données nettoyée');

        // Créer un administrateur
        const admin = await User.create({
            name: 'Administrateur',
            email: 'admin@configurateurpc.com',
            password: 'admin123',
            role: 'admin'
        });
        console.log('✅ Administrateur créé');

        // Créer un utilisateur de test
        const user = await User.create({
            name: 'Utilisateur Test',
            email: 'user@example.com',
            password: 'user123',
            role: 'user'
        });
        console.log('✅ Utilisateur test créé');

        // Créer des catégories
        const categories = await Category.insertMany([
            { name: 'Processeur (CPU)', description: 'Unité centrale de traitement', icon: '🔲' },
            { name: 'Carte graphique (GPU)', description: 'Carte graphique pour le rendu visuel', icon: '🎮' },
            { name: 'Mémoire RAM', description: 'Mémoire vive', icon: '💾' },
            { name: 'Stockage', description: 'Disques SSD et HDD', icon: '💿' },
            { name: 'Carte mère', description: 'Carte mère', icon: '🔌' },
            { name: 'Alimentation', description: 'Bloc d\'alimentation', icon: '⚡' },
            { name: 'Boîtier', description: 'Boîtier PC', icon: '📦' },
            { name: 'Refroidissement', description: 'Ventilateurs et watercooling', icon: '❄️' }
        ]);
        console.log('✅ Catégories créées');

        // Créer des partenaires
        const partners = await Partner.insertMany([
            {
                name: 'Amazon',
                website: 'https://www.amazon.fr',
                affiliateProgram: {
                    commissionRate: 5,
                    terms: 'Commission de 5% sur les ventes',
                    affiliateId: 'AMZ-12345'
                },
                isActive: true
            },
            {
                name: 'LDLC',
                website: 'https://www.ldlc.com',
                affiliateProgram: {
                    commissionRate: 3,
                    terms: 'Commission de 3% sur les ventes',
                    affiliateId: 'LDLC-67890'
                },
                isActive: true
            },
            {
                name: 'RueduCommerce',
                website: 'https://www.rueducommerce.fr',
                affiliateProgram: {
                    commissionRate: 4,
                    terms: 'Commission de 4% sur les ventes',
                    affiliateId: 'RDC-11111'
                },
                isActive: true
            }
        ]);
        console.log('✅ Partenaires créés');

        // Créer des composants
        const cpuCategory = categories.find(c => c.slug === 'processeur-cpu');
        const gpuCategory = categories.find(c => c.slug === 'carte-graphique-gpu');
        const ramCategory = categories.find(c => c.slug === 'memoire-ram');
        const storageCategory = categories.find(c => c.slug === 'stockage');

        const components = await Component.insertMany([
            // Processeurs
            {
                category: cpuCategory._id,
                brand: 'Intel',
                title: 'Intel Core i9-13900K',
                model: 'i9-13900K',
                description: 'Processeur Intel de 13ème génération',
                specifications: {
                    'Nombre de cœurs': '24',
                    'Nombre de threads': '32',
                    'Fréquence de base': '3.0 GHz',
                    'Fréquence turbo': '5.8 GHz',
                    'TDP': '125W'
                },
                basePrice: 599.99,
                partnerPrices: [
                    { partner: partners[0]._id, price: 589.99, inStock: true, url: 'https://amazon.fr/...' },
                    { partner: partners[1]._id, price: 599.00, inStock: true, url: 'https://ldlc.com/...' }
                ],
                isActive: true
            },
            {
                category: cpuCategory._id,
                brand: 'AMD',
                title: 'AMD Ryzen 9 7950X',
                model: '7950X',
                description: 'Processeur AMD Ryzen série 7000',
                specifications: {
                    'Nombre de cœurs': '16',
                    'Nombre de threads': '32',
                    'Fréquence de base': '4.5 GHz',
                    'Fréquence turbo': '5.7 GHz',
                    'TDP': '170W'
                },
                basePrice: 699.99,
                partnerPrices: [
                    { partner: partners[0]._id, price: 689.99, inStock: true, url: 'https://amazon.fr/...' },
                    { partner: partners[2]._id, price: 695.00, inStock: true, url: 'https://rueducommerce.fr/...' }
                ],
                isActive: true
            },
            // Cartes graphiques
            {
                category: gpuCategory._id,
                brand: 'NVIDIA',
                title: 'NVIDIA GeForce RTX 4090',
                model: 'RTX 4090',
                description: 'Carte graphique haut de gamme',
                specifications: {
                    'Mémoire': '24 GB GDDR6X',
                    'Fréquence GPU': '2.52 GHz',
                    'CUDA Cores': '16384',
                    'TDP': '450W'
                },
                basePrice: 1899.99,
                partnerPrices: [
                    { partner: partners[1]._id, price: 1899.00, inStock: true, url: 'https://ldlc.com/...' },
                    { partner: partners[2]._id, price: 1949.99, inStock: false, url: 'https://rueducommerce.fr/...' }
                ],
                isActive: true
            },
            {
                category: gpuCategory._id,
                brand: 'AMD',
                title: 'AMD Radeon RX 7900 XTX',
                model: 'RX 7900 XTX',
                description: 'Carte graphique AMD RDNA 3',
                specifications: {
                    'Mémoire': '24 GB GDDR6',
                    'Fréquence GPU': '2.5 GHz',
                    'Stream Processors': '6144',
                    'TDP': '355W'
                },
                basePrice: 999.99,
                partnerPrices: [
                    { partner: partners[0]._id, price: 989.99, inStock: true, url: 'https://amazon.fr/...' },
                    { partner: partners[1]._id, price: 999.00, inStock: true, url: 'https://ldlc.com/...' }
                ],
                isActive: true
            },
            // RAM
            {
                category: ramCategory._id,
                brand: 'Corsair',
                title: 'Corsair Vengeance DDR5 32GB',
                model: 'CMK32GX5M2D6000C36',
                description: 'Kit de 2 barrettes DDR5 16GB',
                specifications: {
                    'Capacité': '32 GB (2x16GB)',
                    'Type': 'DDR5',
                    'Fréquence': '6000 MHz',
                    'Latence': 'CL36'
                },
                basePrice: 149.99,
                partnerPrices: [
                    { partner: partners[0]._id, price: 149.99, inStock: true, url: 'https://amazon.fr/...' },
                    { partner: partners[1]._id, price: 154.90, inStock: true, url: 'https://ldlc.com/...' }
                ],
                isActive: true
            },
            // Stockage
            {
                category: storageCategory._id,
                brand: 'Samsung',
                title: 'Samsung 990 PRO 2TB',
                model: '990 PRO',
                description: 'SSD NVMe M.2 PCIe 4.0',
                specifications: {
                    'Capacité': '2 TB',
                    'Interface': 'PCIe 4.0 x4 NVMe',
                    'Lecture séquentielle': '7450 MB/s',
                    'Écriture séquentielle': '6900 MB/s',
                    'Format': 'M.2 2280'
                },
                basePrice: 189.99,
                partnerPrices: [
                    { partner: partners[0]._id, price: 179.99, inStock: true, url: 'https://amazon.fr/...' },
                    { partner: partners[1]._id, price: 189.90, inStock: true, url: 'https://ldlc.com/...' }
                ],
                isActive: true
            }
        ]);
        console.log('✅ Composants créés');

        // Créer une configuration de démonstration
        const config = await Configuration.create({
            user: user._id,
            name: 'PC Gaming Haute Performance',
            description: 'Configuration PC pour le gaming 4K',
            components: [
                {
                    component: components[1]._id, // AMD Ryzen 9 7950X
                    selectedPartner: partners[0]._id,
                    price: 689.99,
                    quantity: 1
                },
                {
                    component: components[3]._id, // AMD Radeon RX 7900 XTX
                    selectedPartner: partners[0]._id,
                    price: 989.99,
                    quantity: 1
                },
                {
                    component: components[4]._id, // Corsair RAM 32GB
                    selectedPartner: partners[0]._id,
                    price: 149.99,
                    quantity: 1
                },
                {
                    component: components[5]._id, // Samsung SSD 2TB
                    selectedPartner: partners[0]._id,
                    price: 179.99,
                    quantity: 1
                }
            ]
        });

        // Ajouter la configuration à l'utilisateur
        user.configurations.push(config._id);
        await user.save();

        console.log('✅ Configuration de démonstration créée');

        console.log('\n✨ Base de données peuplée avec succès !');
        console.log('\n📋 Comptes de test :');
        console.log('   Admin : admin@configurateurpc.com / admin123');
        console.log('   User  : user@example.com / user123');
        console.log(`\n📊 Données créées :`);
        console.log(`   - ${await User.countDocuments()} utilisateurs`);
        console.log(`   - ${await Category.countDocuments()} catégories`);
        console.log(`   - ${await Component.countDocuments()} composants`);
        console.log(`   - ${await Partner.countDocuments()} partenaires`);
        console.log(`   - ${await Configuration.countDocuments()} configurations`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur lors du peuplement de la base de données:', error);
        process.exit(1);
    }
};

seedData();
