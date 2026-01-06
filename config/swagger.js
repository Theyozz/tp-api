const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'ConfigurateurPC API',
            version: '1.0.0',
            description: 'API RESTful pour la configuration de PC sur mesure',
            contact: {
                name: 'ConfigurateurPC',
                url: 'https://configurateurpc.com',
                email: 'support@configurateurpc.com'
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT'
            }
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Serveur de développement'
            },
            {
                url: 'https://api.configurateurpc.com',
                description: 'Serveur de production'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Entrez votre token JWT'
                }
            },
            schemas: {
                User: {
                    type: 'object',
                    required: ['name', 'email', 'password'],
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'ID de l\'utilisateur'
                        },
                        name: {
                            type: 'string',
                            description: 'Nom de l\'utilisateur'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'Email de l\'utilisateur'
                        },
                        role: {
                            type: 'string',
                            enum: ['user', 'admin'],
                            default: 'user',
                            description: 'Rôle de l\'utilisateur'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                },
                Category: {
                    type: 'object',
                    required: ['name'],
                    properties: {
                        _id: {
                            type: 'string'
                        },
                        name: {
                            type: 'string',
                            description: 'Nom de la catégorie'
                        },
                        slug: {
                            type: 'string',
                            description: 'Slug de la catégorie'
                        },
                        description: {
                            type: 'string'
                        },
                        icon: {
                            type: 'string',
                            description: 'URL de l\'icône'
                        }
                    }
                },
                Component: {
                    type: 'object',
                    required: ['category', 'brand', 'title', 'model', 'basePrice'],
                    properties: {
                        _id: {
                            type: 'string'
                        },
                        category: {
                            type: 'string',
                            description: 'ID de la catégorie'
                        },
                        brand: {
                            type: 'string',
                            description: 'Marque du composant'
                        },
                        title: {
                            type: 'string',
                            description: 'Titre du composant'
                        },
                        model: {
                            type: 'string',
                            description: 'Modèle du composant'
                        },
                        description: {
                            type: 'string'
                        },
                        specifications: {
                            type: 'object',
                            description: 'Spécifications techniques'
                        },
                        image: {
                            type: 'string',
                            description: 'URL de l\'image'
                        },
                        basePrice: {
                            type: 'number',
                            minimum: 0,
                            description: 'Prix de base'
                        },
                        partnerPrices: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    partner: {
                                        type: 'string'
                                    },
                                    price: {
                                        type: 'number'
                                    },
                                    url: {
                                        type: 'string'
                                    },
                                    inStock: {
                                        type: 'boolean'
                                    }
                                }
                            }
                        },
                        isActive: {
                            type: 'boolean',
                            default: true
                        }
                    }
                },
                Partner: {
                    type: 'object',
                    required: ['name', 'website'],
                    properties: {
                        _id: {
                            type: 'string'
                        },
                        name: {
                            type: 'string',
                            description: 'Nom du partenaire'
                        },
                        website: {
                            type: 'string',
                            format: 'uri',
                            description: 'Site web du partenaire'
                        },
                        logo: {
                            type: 'string'
                        },
                        affiliateProgram: {
                            type: 'object',
                            properties: {
                                commissionRate: {
                                    type: 'number',
                                    minimum: 0,
                                    maximum: 100
                                },
                                terms: {
                                    type: 'string'
                                },
                                affiliateId: {
                                    type: 'string'
                                }
                            }
                        },
                        isActive: {
                            type: 'boolean'
                        }
                    }
                },
                Configuration: {
                    type: 'object',
                    required: ['name', 'components'],
                    properties: {
                        _id: {
                            type: 'string'
                        },
                        user: {
                            type: 'string',
                            description: 'ID de l\'utilisateur'
                        },
                        name: {
                            type: 'string',
                            description: 'Nom de la configuration'
                        },
                        description: {
                            type: 'string'
                        },
                        components: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    component: {
                                        type: 'string'
                                    },
                                    selectedPartner: {
                                        type: 'string'
                                    },
                                    price: {
                                        type: 'number'
                                    },
                                    quantity: {
                                        type: 'number',
                                        default: 1
                                    }
                                }
                            }
                        },
                        totalCost: {
                            type: 'number',
                            description: 'Coût total de la configuration'
                        },
                        isPublic: {
                            type: 'boolean',
                            default: false
                        }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false
                        },
                        message: {
                            type: 'string'
                        },
                        errors: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    field: {
                                        type: 'string'
                                    },
                                    message: {
                                        type: 'string'
                                    }
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                UnauthorizedError: {
                    description: 'Token d\'authentification manquant ou invalide',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            }
                        }
                    }
                },
                ForbiddenError: {
                    description: 'Accès interdit',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            }
                        }
                    }
                },
                NotFoundError: {
                    description: 'Ressource non trouvée',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            }
                        }
                    }
                },
                ValidationError: {
                    description: 'Erreur de validation',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            }
                        }
                    }
                }
            }
        },
        tags: [
            {
                name: 'Auth',
                description: 'Endpoints d\'authentification'
            },
            {
                name: 'Users',
                description: 'Gestion des utilisateurs'
            },
            {
                name: 'Categories',
                description: 'Gestion des catégories de composants'
            },
            {
                name: 'Components',
                description: 'Gestion des composants matériels'
            },
            {
                name: 'Partners',
                description: 'Gestion des partenaires marchands'
            },
            {
                name: 'Configurations',
                description: 'Gestion des configurations PC'
            }
        ]
    },
    apis: ['./routes/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = {
    specs,
    swaggerUi
};
