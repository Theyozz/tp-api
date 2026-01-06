const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');

describe('Auth Endpoints', () => {
    beforeAll(async () => {
        // Se connecter à une base de données de test
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/configurateur-pc-test');
    });

    afterAll(async () => {
        // Nettoyer et fermer la connexion
        await User.deleteMany({});
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        // Nettoyer la base avant chaque test
        await User.deleteMany({});
    });

    describe('POST /api/auth/register', () => {
        it('devrait créer un nouvel utilisateur', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test User',
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.user).toHaveProperty('email', 'test@example.com');
            expect(res.body.data).toHaveProperty('token');
        });

        it('devrait refuser un email déjà utilisé', async () => {
            // Créer un premier utilisateur
            await User.create({
                name: 'Existing User',
                email: 'test@example.com',
                password: 'password123'
            });

            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test User',
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it('devrait valider les champs requis', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test User'
                    // email et password manquants
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.errors).toBeDefined();
        });
    });

    describe('POST /api/auth/login', () => {
        beforeEach(async () => {
            // Créer un utilisateur de test
            await User.create({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            });
        });

        it('devrait connecter un utilisateur avec des identifiants valides', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('token');
        });

        it('devrait refuser un mot de passe incorrect', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'wrongpassword'
                });

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        it('devrait refuser un email inexistant', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'nonexistent@example.com',
                    password: 'password123'
                });

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });

    describe('GET /api/auth/me', () => {
        let token;

        beforeEach(async () => {
            // Créer un utilisateur et obtenir le token
            const user = await User.create({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            });

            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'password123'
                });

            token = res.body.data.token;
        });

        it('devrait retourner le profil utilisateur avec un token valide', async () => {
            const res = await request(app)
                .get('/api/auth/me')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.user).toHaveProperty('email', 'test@example.com');
        });

        it('devrait refuser l\'accès sans token', async () => {
            const res = await request(app)
                .get('/api/auth/me');

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        it('devrait refuser un token invalide', async () => {
            const res = await request(app)
                .get('/api/auth/me')
                .set('Authorization', 'Bearer invalidtoken');

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });
});
