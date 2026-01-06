const API_URL = 'http://localhost:3000/api';
let token = localStorage.getItem('token');
let user = JSON.parse(localStorage.getItem('user'));
let categories = [];
let components = [];
let allComponents = [];
let configurations = [];
let selectedComponents = {};

// Vérifier l'authentification
if (!token) {
    window.location.href = 'index.html';
}

// Afficher le nom de l'utilisateur
document.getElementById('user-name').textContent = `👤 ${user.name}`;

// Déconnexion
document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
});

// Gestion des onglets
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;

        // Reset all buttons to inactive state
        document.querySelectorAll('.tab-btn').forEach(b => {
            b.classList.remove('text-indigo-400', 'border-indigo-400');
            b.classList.add('text-gray-400', 'hover:text-indigo-400', 'hover:border-indigo-400');
        });
        
        // Set the clicked button to active state
        btn.classList.add('text-indigo-400', 'border-indigo-400');
        btn.classList.remove('text-gray-400', 'hover:text-indigo-400', 'hover:border-indigo-400');

        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
        document.getElementById(`${tab}-tab`).classList.add('active');
    });
});

// Set initial active tab
document.querySelector('.tab-btn[data-tab="configurations"]').classList.add('text-indigo-400', 'border-indigo-400');
document.querySelector('.tab-btn[data-tab="configurations"]').classList.remove('text-gray-400', 'hover:text-indigo-400', 'hover:border-indigo-400');


// Fonction helper pour les requêtes API
async function apiRequest(endpoint, options = {}) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers,
        },
    });

    if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'index.html';
        return;
    }

    return await response.json();
}

// Charger les catégories
async function loadCategories() {
    try {
        const data = await apiRequest('/categories');
        if (data && data.success && Array.isArray(data.data)) {
            categories = data.data;

            // Remplir le filtre des catégories
            const select = document.getElementById('category-filter');
            select.innerHTML = '<option value="">Toutes les catégories</option>'; // Clear previous options
            categories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat._id;
                option.textContent = cat.name;
                select.appendChild(option);
            });
        } else {
            console.error('Format de données invalide pour les catégories:', data);
        }
    } catch (error) {
        console.error('Erreur:', error);
    }
}

// Charger les composants (pour l'affichage et le filtrage)
async function loadComponents(categoryId = '') {
    try {
        const endpoint = categoryId ? `/components?category=${categoryId}` : '/components';
        const data = await apiRequest(endpoint);

        if (data && data.success && Array.isArray(data.data)) {
            components = data.data;
            displayComponents(components);
        } else {
            console.error('Format de données invalide pour les composants:', data);
            displayComponents([]);
        }
    } catch (error) {
        console.error('Erreur:', error);
        displayComponents([]);
    }
}

// Afficher les composants
function displayComponents(componentsList) {
    const container = document.getElementById('components-list');

    if (!Array.isArray(componentsList) || componentsList.length === 0) {
        container.innerHTML = '<p class="text-gray-400 col-span-full text-center">Aucun composant trouvé</p>';
        return;
    }

    container.innerHTML = componentsList.map(comp => {
        const bestPrice = comp.partnerPrices?.length > 0
            ? Math.min(...comp.partnerPrices.map(p => p.price))
            : comp.basePrice;

        const isInStock = comp.partnerPrices?.some(p => p.inStock);

        return `
        <div class="bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col transition duration-300 hover:bg-gray-700 hover:-translate-y-1">
            <div class="flex-grow">
                <span class="inline-block bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">${comp.category?.name || 'N/A'}</span>
                <h3 class="text-xl font-bold text-white">${comp.title}</h3>
                <p class="text-sm text-gray-400 mb-4">${comp.brand}</p>
                <div class="text-sm text-gray-300 space-y-1 mb-4">
                    ${Object.entries(comp.specifications || {}).map(([key, value]) =>
                `<div><span class="font-semibold text-gray-400">${key}:</span> ${value}</div>`
            ).join('')}
                </div>
            </div>
            <div class="flex-shrink-0 mt-auto">
                <p class="text-3xl font-bold text-green-400 mb-2">${bestPrice.toFixed(2)} €</p>
                ${isInStock
                ? `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-900 text-green-300">✓ En stock</span>`
                : `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-red-900 text-red-300">✗ Rupture de stock</span>`
            }
            </div>
        </div>
    `}).join('');
}

// Filtrer par catégorie
document.getElementById('category-filter').addEventListener('change', (e) => {
    loadComponents(e.target.value);
});

// Charger les configurations
async function loadConfigurations() {
    try {
        const data = await apiRequest('/configurations');

        if (data && data.success && Array.isArray(data.data)) {
            configurations = data.data;
            displayConfigurations(configurations);
        } else {
            console.error('Format de données invalide pour les configurations:', data);
            displayConfigurations([]);
        }
    } catch (error) {
        console.error('Erreur:', error);
        displayConfigurations([]);
    }
}

// Afficher les configurations
function displayConfigurations(configsList) {
    const container = document.getElementById('configurations-list');

    if (!Array.isArray(configsList) || configsList.length === 0) {
        container.innerHTML = '<p class="text-gray-400 col-span-full text-center">Aucune configuration. Créez-en une !</p>';
        return;
    }

    container.innerHTML = configsList.map(config => `
        <div class="bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col justify-between transition duration-300 hover:bg-gray-700 hover:-translate-y-1">
            <div>
                <h3 class="text-2xl font-bold text-white mb-2">${config.name}</h3>
                <p class="text-gray-400 mb-4">${config.components.length} composants</p>
            </div>
            <div class="mt-4">
                <p class="text-3xl font-bold text-green-400 mb-4">${config.totalCost.toFixed(2)} €</p>
                <div class="flex space-x-2">
                    <button class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300" onclick="viewConfiguration('${config._id}')">Voir détails</button>
                    <button class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300" onclick="deleteConfiguration('${config._id}')">Supprimer</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Voir une configuration
async function viewConfiguration(configId) {
    try {
        const data = await apiRequest(`/configurations/${configId}`);

        if (data.success) {
            const config = data.data;
            const modal = document.getElementById('config-modal');
            const modalBody = document.getElementById('modal-body');

            modalBody.innerHTML = `
                <h2 class="text-3xl font-bold text-white mb-4">${config.name}</h2>
                <p class="text-gray-400 mb-6">${config.description || ''}</p>
                <h3 class="text-xl font-semibold text-white mb-4">Composants :</h3>
                <div class="space-y-3">
                    ${config.components.map(comp => `
                        <div class="flex justify-between items-center bg-gray-700 p-3 rounded-lg">
                            <div>
                                <strong class="text-white">${comp.component.title}</strong>
                                <div class="text-sm text-gray-400">${comp.component.brand}</div>
                            </div>
                            <div class="text-lg font-semibold text-gray-300">${comp.price.toFixed(2)} €</div>
                        </div>
                    `).join('')}
                </div>
                <div class="text-right text-2xl font-bold text-green-400 mt-6">
                    Total : ${config.totalCost.toFixed(2)} €
                </div>
            `;

            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }
    } catch (error) {
        console.error('Erreur:', error);
    }
}

// Supprimer une configuration
async function deleteConfiguration(configId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette configuration ?')) {
        return;
    }

    try {
        const data = await apiRequest(`/configurations/${configId}`, {
            method: 'DELETE',
        });

        if (data.success) {
            loadConfigurations();
        }
    } catch (error) {
        console.error('Erreur:', error);
    }
}

// Fermer le modal
document.querySelector('.close').addEventListener('click', () => {
    const modal = document.getElementById('config-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
});

window.addEventListener('click', (e) => {
    const modal = document.getElementById('config-modal');
    if (e.target === modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
});

// Charger les composants pour la sélection
async function loadComponentSelection() {
    const container = document.getElementById('component-selection');
    container.innerHTML = ''; // Toujours effacer pour reconstruire

    categories.forEach(category => {
        const categoryComponents = allComponents.filter(c => c.category?._id === category._id);

        if (categoryComponents.length > 0) {
            const div = document.createElement('div');
            div.innerHTML = `
                <label for="select-${category._id}" class="block text-sm font-medium text-gray-300 mb-2">${category.name}</label>
                <select id="select-${category._id}" data-category="${category._id}" class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                    <option value="">-- Sélectionner --</option>
                    ${categoryComponents.map(comp => `
                        <option value="${comp._id}" data-price="${comp.basePrice}">
                            ${comp.title} - ${comp.brand} (${comp.basePrice.toFixed(2)}€)
                        </option>
                    `).join('')}
                </select>
            `;

            container.appendChild(div);

            // Écouter les changements
            div.querySelector('select').addEventListener('change', updateTotalPrice);
        }
    });
}

// Mettre à jour le prix total
function updateTotalPrice() {
    let total = 0;
    selectedComponents = {};

    document.querySelectorAll('#component-selection select').forEach(select => {
        if (select.value) {
            selectedComponents[select.dataset.category] = select.value;
            const option = select.options[select.selectedIndex];
            total += parseFloat(option.dataset.price);
        }
    });

    document.getElementById('total-price').textContent = total.toFixed(2);
}

// Créer une configuration
document.getElementById('config-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('config-name').value;
    const componentIds = Object.values(selectedComponents);

    if (componentIds.length === 0) {
        showError('config-error', 'Veuillez sélectionner au moins un composant');
        return;
    }

    // Construire la structure de données attendue par le backend
    const componentsPayload = componentIds.map(id => {
        const component = allComponents.find(c => c._id === id);
        return {
            component: id,
            price: component.basePrice, // Utiliser le basePrice pour le moment
            quantity: 1
        };
    });

    try {
        const data = await apiRequest('/configurations', {
            method: 'POST',
            body: JSON.stringify({ name, components: componentsPayload }),
        });

        if (data.success) {
            showSuccess('config-success', 'Configuration créée avec succès !');
            document.getElementById('config-form').reset();
            updateTotalPrice();

            // Recharger les configurations
            loadConfigurations();

            // Retourner à l'onglet configurations après 2 secondes
            setTimeout(() => {
                document.querySelector('[data-tab="configurations"]').click();
            }, 2000);
        } else {
            showError('config-error', data.message || 'Une erreur est survenue');
        }
    } catch (error) {
        showError('config-error', 'Erreur lors de la création');
        console.error('Erreur:', error);
    }
});

function showError(id, message) {
    const div = document.getElementById(id);
    div.textContent = message;
    div.classList.remove('hidden');
    setTimeout(() => div.classList.add('hidden'), 5000);
}

function showSuccess(id, message) {
    const div = document.getElementById(id);
    div.textContent = message;
    div.classList.remove('hidden');
    setTimeout(() => div.classList.add('hidden'), 5000);
}

// Initialisation
(async function init() {
    await loadCategories();

    // Charger tous les composants une seule fois pour la sélection
    const data = await apiRequest('/components');
    if (data && data.success && Array.isArray(data.data)) {
        allComponents = data.data;
        // Afficher la liste initiale non filtrée dans l'onglet Composants
        displayComponents(allComponents); 
    }

    await loadConfigurations();
    await loadComponentSelection();

    // Ajouter un écouteur d'événement pour reconstruire les sélections si on clique sur l'onglet
    document.querySelector('[data-tab="new-config"]').addEventListener('click', loadComponentSelection);
})();
