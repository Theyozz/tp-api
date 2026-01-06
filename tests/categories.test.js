const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Category = require('../models/Category');
const User = require('../models/User');

describe('Categories Endpoints', () => {
    let adminToken;
    let userToken;

    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/configurateur-pc-test');

        // Créer un admin
        const admin = await User.create({
            name: 'Admin',
            email: 'admin@example.com',
            password: 'password123',
            role: 'admin'
        });

        // Créer un utilisateur normal
        const user = await User.create({
            name: 'User',
            email: 'user@example.com',
            password: 'password123',
            role: 'user'
        });

        // Obtenir les tokens
        const adminRes = await request(app)
            .post('/api/auth/login')
            .send({ email: 'admin@example.com', password: 'password123' });
        adminToken = adminRes.body.data.token;

        const userRes = await request(app)
            .post('/api/auth/login')
            .send({ email: 'user@example.com', password: 'password123' });
        userToken = userRes.body.data.token;
    });

    afterAll(async () => {
        await Category.deleteMany({});
        await User.deleteMany({});
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await Category.deleteMany({});
    });

    describe('GET /api/categories', () => {
        it('devrait retourner toutes les catégories', async () => {
            await Category.create([
                { name: 'CPU', description: 'Processeurs' },
                { name: 'GPU', description: 'Cartes graphiques' }
            ]);

            const res = await request(app)
                .get('/api/categories');

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.count).toBe(2);
        });
    });

    describe('POST /api/categories', () => {
        it('devrait permettre à un admin de créer une catégorie', async () => {
            const res = await request(app)
                .post('/api/categories')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    name: 'RAM',
                    description: 'Mémoire vive'
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.category).toHaveProperty('name', 'RAM');
        });

        it('devrait refuser à un utilisateur normal de créer une catégorie', async () => {
            const res = await request(app)
                .post('/api/categories')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    name: 'RAM',
                    description: 'Mémoire vive'
                });

            expect(res.statusCode).toBe(403);
            expect(res.body.success).toBe(false);
        });

        it('devrait refuser une création sans authentification', async () => {
            const res = await request(app)
                .post('/api/categories')
                .send({
                    name: 'RAM',
                    description: 'Mémoire vive'
                });

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });

    describe('GET /api/categories/:id', () => {
        it('devrait retourner une catégorie par son ID', async () => {
            const category = await Category.create({
                name: 'CPU',
                description: 'Processeurs'
            });

            const res = await request(app)
                .get(`/api/categories/${category._id}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.category).toHaveProperty('name', 'CPU');
        });

        it('devrait retourner 404 pour une catégorie inexistante', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const res = await request(app)
                .get(`/api/categories/${fakeId}`);

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
        });
    });

    describe('PUT /api/categories/:id', () => {
        it('devrait permettre à un admin de mettre à jour une catégorie', async () => {
            const category = await Category.create({
                name: 'CPU',
                description: 'Processeurs'
            });

            const res = await request(app)
                .put(`/api/categories/${category._id}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    description: 'Processeurs modernes'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.category).toHaveProperty('description', 'Processeurs modernes');
        });
    });

    describe('DELETE /api/categories/:id', () => {
        it('devrait permettre à un admin de supprimer une catégorie', async () => {
            const category = await Category.create({
                name: 'CPU',
                description: 'Processeurs'
            });

            const res = await request(app)
                .delete(`/api/categories/${category._id}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);

            const found = await Category.findById(category._id);
            expect(found).toBeNull();
        });
    });
});
