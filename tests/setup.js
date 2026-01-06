// Configuration avant les tests
beforeAll(() => {
    // Définir les variables d'environnement pour les tests
    process.env.JWT_SECRET = 'test_secret_key_for_testing';
    process.env.JWT_EXPIRES_IN = '1h';
    process.env.NODE_ENV = 'test';
});

// Nettoyage après les tests
afterAll(async () => {
    // Attendre que toutes les opérations soient terminées
    await new Promise(resolve => setTimeout(resolve, 500));
});
