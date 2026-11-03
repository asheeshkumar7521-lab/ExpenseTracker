// Expense Tracker - script.js
// Aapki HTML ke IDs ke hisaab se bana hai

var STORAGE_KEY = 'expense-tracker-v1';
var transactions = [];

// ---- Elements ----
var form = document.getElementById('transactionForm');
var descriptionInput = document.getElementById('description');
var amountInput = document.getElementById('amount');
var typeSelect = document.getElementById('type');
var categorySelect = document.getElementById('category');

var searchInput = document.getElementById('search');
var filterType = document.getElementById('filterType');
var filterCategory = document.getElementById('filterCategory');
var sortSelect = document.getElementById('sort');

var balanceEl = document.getElementById('balance');
var incomeEl = document.getElementById('income');
var expenseEl = document.getElementById('expense');

var listEl = document.getElementById('transactionList');
var clearAllBtn = document.getElementById('clearAll');

var formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
});

// ---- localStorage ----
function loadTransactions() {
    try {
        var saved = localStorage.getItem(STORAGE_KEY);
        transactions = saved ? JSON.parse(saved) : [];
    } catch (e) {
        transactions = [];
    }
}

function saveTransactions() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    } catch (e) {}
}

// ---- Helpers ----
function escapeHTML(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

// ---- Summary (saare transactions ka total) ----
function updateSummary() {
    var income = 0;
    var expense = 0;

    transactions.forEach(function (t) {
        if (t.type === 'income') {
            income += t.amount;
        } else {
            expense += t.amount;
        }
    });

    balanceEl.textContent = formatter.format(income - expense);
    incomeEl.textContent = formatter.format(income);
    expenseEl.textContent = formatter.format(expense);
}

// ---- Filter + Search + Sort ----
function getVisibleTransactions() {
    var query = searchInput.value.trim().toLowerCase();
    var type = filterType.value;
    var category = filterCategory.value;
    var sort = sortSelect.value;

    var result = transactions.filter(function (t) {
        var matchSearch = t.description.toLowerCase().indexOf(query) !== -1;
        var matchType = type === 'all' || t.type === type;
        var matchCategory = category === 'all' || t.category === category;
        return matchSearch && matchType && matchCategory;
    });

    result.sort(function (a, b) {
        if (sort === 'highest') return b.amount - a.amount;
        if (sort === 'lowest') return a.amount - b.amount;
        return b.id - a.id; // latest
    });

    return result;
}

// ---- Render list ----
function renderTransactions() {
    var visible = getVisibleTransactions();

    if (visible.length === 0) {
        listEl.innerHTML = '<p class="empty">No transactions found.</p>';
        return;
    }

    listEl.innerHTML = visible.map(function (t) {
        var isIncome = t.type === 'income';
        var date = new Date(t.id).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });

        return '<div class="transaction">' +
            '<div class="transaction-info">' +
                '<span class="transaction-description">' + escapeHTML(t.description) + '</span>' +
                '<span class="transaction-category">' + capitalize(t.category) + ' | ' + date + '</span>' +
            '</div>' +
            '<div class="transaction-right">' +
                '<span class="transaction-amount ' + t.type + '">' + (isIncome ? '+' : '-') + formatter.format(t.amount) + '</span>' +
                '<button class="delete-btn" data-id="' + t.id + '" type="button">Delete</button>' +
            '</div>' +
        '</div>';
    }).join('');
}

function updateUI() {
    updateSummary();
    renderTransactions();
}

// ---- Add transaction ----
form.addEventListener('submit', function (e) {
    e.preventDefault();

    var description = descriptionInput.value.trim();
    var amount = parseFloat(amountInput.value);

    if (description === '') {
        alert('Please enter a description.');
        return;
    }
    if (isNaN(amount) || amount <= 0) {
        alert('Please enter an amount greater than 0.');
        return;
    }

    transactions.push({
        id: Date.now(),
        description: description,
        amount: amount,
        type: typeSelect.value,
        category: categorySelect.value
    });

    saveTransactions();
    form.reset();
    descriptionInput.focus();
    updateUI();
});

// ---- Delete one (event delegation) ----
listEl.addEventListener('click', function (e) {
    var btn = e.target.closest('.delete-btn');
    if (!btn) return;

    var id = Number(btn.dataset.id);
    transactions = transactions.filter(function (t) {
        return t.id !== id;
    });

    saveTransactions();
    updateUI();
});

// ---- Clear all ----
clearAllBtn.addEventListener('click', function () {
    if (transactions.length === 0) return;
    if (confirm('Delete all transactions?')) {
        transactions = [];
        saveTransactions();
        updateUI();
    }
});

// ---- Filters ----
searchInput.addEventListener('input', renderTransactions);
filterType.addEventListener('change', renderTransactions);
filterCategory.addEventListener('change', renderTransactions);
sortSelect.addEventListener('change', renderTransactions);

// ---- Start ----
loadTransactions();
updateUI();