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
            { name: 'Processeur (CPU)', slug: 'processeur-cpu', description: 'Unité centrale de traitement', icon: '🔲' },
            { name: 'Carte graphique (GPU)', slug: 'carte-graphique-gpu', description: 'Carte graphique pour le rendu visuel', icon: '🎮' },
            { name: 'Mémoire RAM', slug: 'memoire-ram', description: 'Mémoire vive', icon: '💾' },
            { name: 'Stockage', slug: 'stockage', description: 'Disques SSD et HDD', icon: '💿' },
            { name: 'Carte mère', slug: 'carte-mere', description: 'Carte mère', icon: '🔌' },
            { name: 'Alimentation', slug: 'alimentation', description: 'Bloc d\'alimentation', icon: '⚡' },
            { name: 'Boîtier', slug: 'boitier', description: 'Boîtier PC', icon: '📦' },
            { name: 'Refroidissement', slug: 'refroidissement', description: 'Ventilateurs et watercooling', icon: '❄️' }
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
        const carteMereCategory = categories.find(c => c.slug === 'carte-mere');
        const alimentationCategory = categories.find(c => c.slug === 'alimentation');
        const boitierCategory = categories.find(c => c.slug === 'boitier');
        const refroidissementCategory = categories.find(c => c.slug === 'refroidissement');

        const components = await Component.insertMany([
            // Processeurs
            {
                category: cpuCategory._id,
                brand: 'Intel',
                title: 'Intel Core i9-13900K',
                model: 'i9-13900K',
                description: 'Processeur Intel de 13ème génération pour le gaming extrême et la création de contenu.',
                specifications: { 'Nombre de cœurs': '24', 'Nombre de threads': '32', 'Fréquence de base': '3.0 GHz', 'Fréquence turbo': '5.8 GHz', 'TDP': '125W' },
                basePrice: 599.99,
                partnerPrices: [ { partner: partners[0]._id, price: 589.99, inStock: true, url: 'https://amazon.fr/...' }, { partner: partners[1]._id, price: 599.00, inStock: true, url: 'https://ldlc.com/...' } ],
                isActive: true
            },
            {
                category: cpuCategory._id,
                brand: 'AMD',
                title: 'AMD Ryzen 9 7950X',
                model: '7950X',
                description: 'Le processeur ultime pour les créateurs et les joueurs exigeants.',
                specifications: { 'Nombre de cœurs': '16', 'Nombre de threads': '32', 'Fréquence de base': '4.5 GHz', 'Fréquence turbo': '5.7 GHz', 'TDP': '170W' },
                basePrice: 699.99,
                partnerPrices: [ { partner: partners[0]._id, price: 689.99, inStock: true, url: 'https://amazon.fr/...' }, { partner: partners[2]._id, price: 695.00, inStock: true, url: 'https://rueducommerce.fr/...' } ],
                isActive: true
            },
            {
                category: cpuCategory._id,
                brand: 'Intel',
                title: 'Intel Core i5-13600K',
                model: 'i5-13600K',
                description: 'Excellent rapport performance/prix pour le gaming en haute résolution.',
                specifications: { 'Nombre de cœurs': '14', 'Nombre de threads': '20', 'Fréquence de base': '3.5 GHz', 'Fréquence turbo': '5.1 GHz', 'TDP': '125W' },
                basePrice: 319.99,
                partnerPrices: [ { partner: partners[0]._id, price: 315.99, inStock: true, url: 'https://amazon.fr/...' }, { partner: partners[1]._id, price: 324.90, inStock: true, url: 'https://ldlc.com/...' } ],
                isActive: true
            },
            // Cartes graphiques
            {
                category: gpuCategory._id,
                brand: 'NVIDIA',
                title: 'NVIDIA GeForce RTX 4090',
                model: 'RTX 4090',
                description: 'La carte graphique la plus puissante pour le jeu en 4K et au-delà.',
                specifications: { 'Mémoire': '24 GB GDDR6X', 'Fréquence GPU': '2.52 GHz', 'CUDA Cores': '16384', 'TDP': '450W' },
                basePrice: 1899.99,
                partnerPrices: [ { partner: partners[1]._id, price: 1899.00, inStock: true, url: 'https://ldlc.com/...' }, { partner: partners[2]._id, price: 1949.99, inStock: false, url: 'https://rueducommerce.fr/...' } ],
                isActive: true
            },
            {
                category: gpuCategory._id,
                brand: 'AMD',
                title: 'AMD Radeon RX 7900 XTX',
                model: 'RX 7900 XTX',
                description: 'Hautes performances pour le gaming en 4K avec la technologie RDNA 3.',
                specifications: { 'Mémoire': '24 GB GDDR6', 'Fréquence GPU': '2.5 GHz', 'Stream Processors': '6144', 'TDP': '355W' },
                basePrice: 999.99,
                partnerPrices: [ { partner: partners[0]._id, price: 989.99, inStock: true, url: 'https://amazon.fr/...' }, { partner: partners[1]._id, price: 999.00, inStock: true, url: 'https://ldlc.com/...' } ],
                isActive: true
            },
            {
                category: gpuCategory._id,
                brand: 'NVIDIA',
                title: 'NVIDIA GeForce RTX 4070 Ti',
                model: 'RTX 4070 Ti',
                description: 'Idéale pour le gaming en 1440p avec des taux de rafraîchissement élevés.',
                specifications: { 'Mémoire': '12 GB GDDR6X', 'Fréquence GPU': '2.61 GHz', 'CUDA Cores': '7680', 'TDP': '285W' },
                basePrice: 899.99,
                partnerPrices: [ { partner: partners[0]._id, price: 889.99, inStock: true, url: 'https://amazon.fr/...' }, { partner: partners[1]._id, price: 899.90, inStock: false, url: 'https://ldlc.com/...' } ],
                isActive: true
            },
            // Mémoire RAM
            {
                category: ramCategory._id,
                brand: 'Corsair',
                title: 'Corsair Vengeance DDR5 32GB (2x16GB) 6000MHz',
                model: 'CMK32GX5M2B6000C36',
                description: 'Kit de mémoire DDR5 haute performance pour les plateformes Intel et AMD.',
                specifications: { 'Capacité': '32 GB (2x16GB)', 'Type': 'DDR5', 'Fréquence': '6000 MHz', 'Latence': 'CL36' },
                basePrice: 149.99,
                partnerPrices: [ { partner: partners[0]._id, price: 149.99, inStock: true, url: 'https://amazon.fr/...' }, { partner: partners[1]._id, price: 154.90, inStock: true, url: 'https://ldlc.com/...' } ],
                isActive: true
            },
            {
                category: ramCategory._id,
                brand: 'G.Skill',
                title: 'G.Skill Trident Z5 RGB 32GB (2x16GB) 6400MHz',
                model: 'F5-6400J3239G16GX2-TZ5RK',
                description: 'Mémoire DDR5 avec éclairage RGB personnalisable et performances extrêmes.',
                specifications: { 'Capacité': '32 GB (2x16GB)', 'Type': 'DDR5', 'Fréquence': '6400 MHz', 'Latence': 'CL32' },
                basePrice: 179.99,
                partnerPrices: [ { partner: partners[1]._id, price: 179.90, inStock: true, url: 'https://ldlc.com/...' }, { partner: partners[2]._id, price: 182.50, inStock: true, url: 'https://rueducommerce.fr/...' } ],
                isActive: true
            },
            // Stockage
            {
                category: storageCategory._id,
                brand: 'Samsung',
                title: 'Samsung 990 PRO 2TB',
                model: 'MZ-V9P2T0BW',
                description: 'SSD NVMe M.2 PCIe 4.0 offrant des vitesses de lecture/écriture de pointe.',
                specifications: { 'Capacité': '2 TB', 'Interface': 'PCIe 4.0 x4 NVMe', 'Lecture séquentielle': '7450 MB/s', 'Écriture séquentielle': '6900 MB/s', 'Format': 'M.2 2280' },
                basePrice: 189.99,
                partnerPrices: [ { partner: partners[0]._id, price: 179.99, inStock: true, url: 'https://amazon.fr/...' }, { partner: partners[1]._id, price: 189.90, inStock: true, url: 'https://ldlc.com/...' } ],
                isActive: true
            },
            {
                category: storageCategory._id,
                brand: 'Crucial',
                title: 'Crucial P5 Plus 1TB',
                model: 'CT1000P5PSSD8',
                description: 'SSD NVMe M.2 PCIe 4.0 performant pour les jeux et applications.',
                specifications: { 'Capacité': '1 TB', 'Interface': 'PCIe 4.0 x4 NVMe', 'Lecture séquentielle': '6600 MB/s', 'Écriture séquentielle': '5000 MB/s', 'Format': 'M.2 2280' },
                basePrice: 94.99,
                partnerPrices: [ { partner: partners[0]._id, price: 92.99, inStock: true, url: 'https://amazon.fr/...' }, { partner: partners[2]._id, price: 95.99, inStock: true, url: 'https://rueducommerce.fr/...' } ],
                isActive: true
            },
            // Cartes mères
            {
                category: carteMereCategory._id,
                brand: 'ASUS',
                title: 'ASUS ROG STRIX Z790-E GAMING WIFI II',
                model: 'ROG STRIX Z790-E GAMING WIFI II',
                description: 'Carte mère haut de gamme pour processeurs Intel, avec WiFi 7 et PCIe 5.0.',
                specifications: { 'Socket': 'LGA 1700', 'Chipset': 'Intel Z790', 'Format': 'ATX', 'Mémoire': 'DDR5', 'Ports M2': '5' },
                basePrice: 499.99,
                partnerPrices: [ { partner: partners[1]._id, price: 499.90, inStock: true, url: 'https://ldlc.com/...' } ],
                isActive: true
            },
            {
                category: carteMereCategory._id,
                brand: 'MSI',
                title: 'MSI MAG B760 TOMAHAWK WIFI',
                model: 'MAG B760 TOMAHAWK WIFI',
                description: 'Carte mère milieu de gamme pour processeurs Intel, excellent rapport qualité-prix.',
                specifications: { 'Socket': 'LGA 1700', 'Chipset': 'Intel B760', 'Format': 'ATX', 'Mémoire': 'DDR5', 'Ports M2': '3' },
                basePrice: 219.99,
                partnerPrices: [ { partner: partners[0]._id, price: 215.99, inStock: true, url: 'https://amazon.fr/...' } ],
                isActive: true
            },
            // Alimentations
            {
                category: alimentationCategory._id,
                brand: 'Corsair',
                title: 'Corsair RM1000e (2023)',
                model: 'RM1000e',
                description: 'Alimentation 1000W 80+ Gold, entièrement modulaire et silencieuse.',
                specifications: { 'Puissance': '1000W', 'Certification': '80 PLUS Gold', 'Modularité': 'Entièrement modulaire', 'Format': 'ATX' },
                basePrice: 179.99,
                partnerPrices: [ { partner: partners[1]._id, price: 179.90, inStock: true, url: 'https://ldlc.com/...' } ],
                isActive: true
            },
            // Boîtiers
            {
                category: boitierCategory._id,
                brand: 'Lian Li',
                title: 'Lian Li Lancool 216',
                model: 'Lancool 216',
                description: 'Boîtier moyen tour axé sur le flux d\'air avec deux ventilateurs de 160mm inclus.',
                specifications: { 'Format': 'Moyen tour', 'Compatibilité carte mère': 'E-ATX, ATX, Micro-ATX, Mini-ITX', 'Couleur': 'Noir' },
                basePrice: 109.99,
                partnerPrices: [ { partner: partners[2]._id, price: 109.90, inStock: true, url: 'https://rueducommerce.fr/...' } ],
                isActive: true
            },
            // Refroidissement
            {
                category: refroidissementCategory._id,
                brand: 'Noctua',
                title: 'Noctua NH-D15 chromax.black',
                model: 'NH-D15 chromax.black',
                description: 'Ventirad double tour haute performance, entièrement noir.',
                specifications: { 'Format': 'Double tour', 'Ventilateurs': '2x 140mm NF-A15', 'Compatibilité sockets': 'Intel LGA1700, AMD AM5', 'Couleur': 'Noir' },
                basePrice: 119.90,
                partnerPrices: [ { partner: partners[0]._id, price: 119.90, inStock: true, url: 'https://amazon.fr/...' } ],
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
