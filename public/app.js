const API_URL = 'http://localhost:3000/api';
let token = localStorage.getItem('token');
let user = JSON.parse(localStorage.getItem('user'));
let categories = [];
let components = [];
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

        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
        document.getElementById(`${tab}-tab`).classList.add('active');
    });
});

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

// Charger les composants
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
        container.innerHTML = '<p class="loading">Aucun composant trouvé</p>';
        return;
    }

    container.innerHTML = componentsList.map(comp => `
        <div class="card component-card">
            <h3>${comp.name}</h3>
            <p class="brand">${comp.brand}</p>
            <div class="specs">
                ${Object.entries(comp.specifications || {}).map(([key, value]) =>
        `<div><strong>${key}:</strong> ${value}</div>`
    ).join('')}
            </div>
            <p class="price">${comp.price} €</p>
            ${comp.stock > 0
            ? `<span style="color: var(--success);">✓ En stock (${comp.stock})</span>`
            : `<span style="color: var(--danger);">✗ Rupture de stock</span>`
        }
            <span class="category-badge">${comp.category?.name || 'N/A'}</span>
        </div>
    `).join('');
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
        container.innerHTML = '<p class="loading">Aucune configuration. Créez-en une !</p>';
        return;
    }

    container.innerHTML = configsList.map(config => `
        <div class="card">
            <h3>${config.name}</h3>
            <p class="components-count">${config.components.length} composants</p>
            <p class="price">${config.totalPrice} €</p>
            <div class="card-actions">
                <button class="btn btn-view" onclick="viewConfiguration('${config._id}')">Voir détails</button>
                <button class="btn btn-danger" onclick="deleteConfiguration('${config._id}')">Supprimer</button>
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
                <h2>${config.name}</h2>
                <h3>Composants :</h3>
                <div style="margin: 1rem 0;">
                    ${config.components.map(comp => `
                        <div class="component-item">
                            <div class="component-info">
                                <strong>${comp.name}</strong>
                                <div style="font-size: 0.9rem; color: var(--text-light);">${comp.brand}</div>
                            </div>
                            <div class="component-price">${comp.price} €</div>
                        </div>
                    `).join('')}
                </div>
                <div style="text-align: right; font-size: 1.5rem; font-weight: 700; color: var(--success);">
                    Total : ${config.totalPrice} €
                </div>
            `;

            modal.classList.add('show');
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
    document.getElementById('config-modal').classList.remove('show');
});

window.addEventListener('click', (e) => {
    const modal = document.getElementById('config-modal');
    if (e.target === modal) {
        modal.classList.remove('show');
    }
});

// Charger les composants pour la sélection
async function loadComponentSelection() {
    const container = document.getElementById('component-selection');

    categories.forEach(async (category) => {
        const categoryComponents = components.filter(c => c.category?._id === category._id);

        if (categoryComponents.length > 0) {
            const div = document.createElement('div');
            div.className = 'component-category';
            div.innerHTML = `
                <h4>${category.name}</h4>
                <select class="form-group" data-category="${category._id}">
                    <option value="">-- Sélectionner --</option>
                    ${categoryComponents.map(comp => `
                        <option value="${comp._id}" data-price="${comp.price}">
                            ${comp.name} - ${comp.brand} (${comp.price}€)
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

    try {
        const data = await apiRequest('/configurations', {
            method: 'POST',
            body: JSON.stringify({ name, components: componentIds }),
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
            showError('config-error', data.message);
        }
    } catch (error) {
        showError('config-error', 'Erreur lors de la création');
        console.error('Erreur:', error);
    }
});

function showError(id, message) {
    const div = document.getElementById(id);
    div.textContent = message;
    div.classList.add('show');
    setTimeout(() => div.classList.remove('show'), 5000);
}

function showSuccess(id, message) {
    const div = document.getElementById(id);
    div.textContent = message;
    div.classList.add('show');
    setTimeout(() => div.classList.remove('show'), 5000);
}

// Initialisation
(async function init() {
    await loadCategories();
    await loadComponents();
    await loadConfigurations();
    await loadComponentSelection();
})();
