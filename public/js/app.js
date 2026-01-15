const API_URL = '/api';

// State
let token = localStorage.getItem('token');
let currentUser = null;
let currentListId = null;

// DOM Elements
const views = {
    login: document.getElementById('login-view'),
    register: document.getElementById('register-view'),
    dashboard: document.getElementById('dashboard-view'),
    listDetail: document.getElementById('list-detail-view')
};

// --- INIT ---
function init() {
    console.log('App init');
    if (token) {
        showView('dashboard');
        loadLists();
    } else {
        showView('login');
    }
}

// --- NAVIGATION ---
function showView(viewName) {
    Object.values(views).forEach(el => el.classList.remove('active'));
    views[viewName].classList.add('active');
}

function logout() {
    localStorage.removeItem('token');
    token = null;
    showView('login');
}

// --- API HELPER ---
async function api(endpoint, method = 'GET', body = null) {
    const headers = {
        'Content-Type': 'application/json'
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        method,
        headers,
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
    }
    return data;
}

// --- ERROR HANDLING ---
function showMessage(msg, isError = true) {
    const el = document.getElementById('message-container');
    el.textContent = msg;
    el.style.display = 'block';
    el.style.color = isError ? 'red' : 'green';
    setTimeout(() => {
        el.style.display = 'none';
    }, 3000);
}

// --- AUTHENTICATION ---
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    try {
        const data = await api('/auth/login', 'POST', { username, password });
        token = data.token;
        localStorage.setItem('token', token);
        showView('dashboard');
        loadLists();
        e.target.reset();
    } catch (err) {
        showMessage(err.message);
    }
});

document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
        await api('/auth/register', 'POST', { username, email, password });
        showMessage('Registration successful! Please login.', false);
        showView('login');
        e.target.reset();
    } catch (err) {
        showMessage(err.message);
    }
});

document.querySelectorAll('.to-register').forEach(el => el.addEventListener('click', () => showView('register')));
document.querySelectorAll('.to-login').forEach(el => el.addEventListener('click', () => showView('login')));
document.getElementById('logout-btn').addEventListener('click', logout);


// --- DASHBOARD (LISTS) ---
async function loadLists() {
    try {
        const lists = await api('/lists');
        const listContainer = document.getElementById('shopping-lists');
        listContainer.innerHTML = '';

        lists.forEach(list => {
            const el = document.createElement('div');
            el.className = 'card list-item';
            el.innerHTML = `
                <h3>${list.name}</h3>
                <span>${list.items ? list.items.length : 0} items</span>
            `;
            el.addEventListener('click', () => loadListDetails(list._id));
            listContainer.appendChild(el);
        });
    } catch (err) {
        console.error(err);
        if (err.message.includes('auth')) logout();
    }
}

document.getElementById('create-list-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    try {
        await api('/lists', 'POST', { name });
        e.target.reset();
        loadLists();
    } catch (err) {
        showMessage(err.message);
    }
});

// --- LIST DETAILS ---
async function loadListDetails(listId) {
    currentListId = listId;
    try {
        const list = await api(`/lists/${listId}`);
        document.getElementById('list-name').textContent = list.name;
        renderItems(list.items);
        showView('listDetail');
    } catch (err) {
        showMessage(err.message);
    }
}

function renderItems(items) {
    const container = document.getElementById('list-items');
    container.innerHTML = '';
    items.forEach(item => {
        const el = document.createElement('div');
        el.className = `item-row ${item.purchased ? 'purchased' : ''}`;
        el.innerHTML = `
            <div>
                <strong>${item.name}</strong> (x${item.quantity})
            </div>
            <div class="item-actions">
                <button onclick="togglePurchased('${item._id}', ${!item.purchased})">
                    ${item.purchased ? 'Undo' : 'Done'}
                </button>
                <button class="danger" onclick="deleteItem('${item._id}')">Delete</button>
            </div>
        `;
        container.appendChild(el);
    });
}

document.getElementById('add-item-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const quantity = e.target.quantity.value;

    try {
        await api('/items', 'POST', {
            name,
            quantity,
            shoppingList: currentListId
        });
        e.target.reset();
        loadListDetails(currentListId); // Reload to show new item
    } catch (err) {
        showMessage(err.message);
    }
});

document.getElementById('back-to-dashboard').addEventListener('click', () => {
    currentListId = null;
    showView('dashboard');
    loadLists();
});

// Global functions for inline onclicks
window.togglePurchased = async (itemId, status) => {
    try {
        await api(`/items/${itemId}`, 'PUT', { purchased: status });
        loadListDetails(currentListId);
    } catch (err) {
        showMessage(err.message);
    }
};

window.deleteItem = async (itemId) => {
    if (!confirm('Are you sure?')) return;
    try {
        await api(`/items/${itemId}`, 'DELETE');
        loadListDetails(currentListId);
    } catch (err) {
        showMessage(err.message);
    }
};

// Initialize
init();
