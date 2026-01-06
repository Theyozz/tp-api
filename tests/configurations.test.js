const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Configuration = require('../models/Configuration');
const Component = require('../models/Component');
const Category = require('../models/Category');
const User = require('../models/User');

describe('Configurations Endpoints', () => {
    let userToken;
    let userId;
    let componentId;

    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/configurateur-pc-test');

        // Créer un utilisateur
        const user = await User.create({
            name: 'User',
            email: 'user@example.com',
            password: 'password123'
        });
        userId = user._id;

        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ email: 'user@example.com', password: 'password123' });
        userToken = loginRes.body.data.token;

        // Créer une catégorie et un composant
        const category = await Category.create({ name: 'CPU' });
        const component = await Component.create({
            category: category._id,
            brand: 'Intel',
            title: 'Intel Core i9',
            model: 'i9-13900K',
            basePrice: 599.99
        });
        componentId = component._id;
    });

    afterAll(async () => {
        await Configuration.deleteMany({});
        await Component.deleteMany({});
        await Category.deleteMany({});
        await User.deleteMany({});
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await Configuration.deleteMany({});
    });

    describe('POST /api/configurations', () => {
        it('devrait créer une nouvelle configuration', async () => {
            const res = await request(app)
                .post('/api/configurations')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    name: 'Ma config gaming',
                    description: 'Configuration pour jeux',
                    components: [
                        {
                            component: componentId,
                            price: 599.99,
                            quantity: 1
                        }
                    ]
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.configuration).toHaveProperty('name', 'Ma config gaming');
            expect(res.body.data.configuration.totalCost).toBe(599.99);
        });

        it('devrait calculer le coût total correctement', async () => {
            const res = await request(app)
                .post('/api/configurations')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    name: 'Test config',
                    components: [
                        {
                            component: componentId,
                            price: 599.99,
                            quantity: 2
                        }
                    ]
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.data.configuration.totalCost).toBe(1199.98);
        });

        it('devrait refuser une configuration sans composants', async () => {
            const res = await request(app)
                .post('/api/configurations')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    name: 'Test config',
                    components: []
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });

    describe('GET /api/configurations', () => {
        it('devrait retourner les configurations de l\'utilisateur', async () => {
            await Configuration.create({
                user: userId,
                name: 'Config 1',
                components: [{ component: componentId, price: 599.99, quantity: 1 }],
                totalCost: 599.99
            });

            await Configuration.create({
                user: userId,
                name: 'Config 2',
                components: [{ component: componentId, price: 599.99, quantity: 1 }],
                totalCost: 599.99
            });

            const res = await request(app)
                .get('/api/configurations')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.count).toBe(2);
        });
    });

    describe('GET /api/configurations/:id', () => {
        it('devrait retourner une configuration spécifique', async () => {
            const config = await Configuration.create({
                user: userId,
                name: 'Ma config',
                components: [{ component: componentId, price: 599.99, quantity: 1 }],
                totalCost: 599.99
            });

            const res = await request(app)
                .get(`/api/configurations/${config._id}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.configuration).toHaveProperty('name', 'Ma config');
        });

        it('devrait refuser l\'accès à une configuration d\'un autre utilisateur', async () => {
            const otherUser = await User.create({
                name: 'Other User',
                email: 'other@example.com',
                password: 'password123'
            });

            const config = await Configuration.create({
                user: otherUser._id,
                name: 'Other config',
                components: [{ component: componentId, price: 599.99, quantity: 1 }],
                totalCost: 599.99
            });

            const res = await request(app)
                .get(`/api/configurations/${config._id}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toBe(403);
            expect(res.body.success).toBe(false);
        });
    });

    describe('DELETE /api/configurations/:id', () => {
        it('devrait supprimer une configuration de l\'utilisateur', async () => {
            const config = await Configuration.create({
                user: userId,
                name: 'Config to delete',
                components: [{ component: componentId, price: 599.99, quantity: 1 }],
                totalCost: 599.99
            });

            const res = await request(app)
                .delete(`/api/configurations/${config._id}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);

            const found = await Configuration.findById(config._id);
            expect(found).toBeNull();
        });
    });
});
