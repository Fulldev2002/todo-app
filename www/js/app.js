
// State
let todos = [
    { id: 1, text: 'Setup a simple JS website', completed: false },
    { id: 2, text: 'Setup Capacitor Project', completed: false },
    { id: 3, text: 'Configure GitHub Actions', completed: false },
    { id: 4, text: 'Test Jenkins Build', completed: false },
];
let currentFilter = 'all';

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    renderDate();
    renderTodos();
});

function renderDate() {
    const dateEl = document.getElementById('current-date');
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    dateEl.textContent = new Date().toLocaleDateString('en-US', options);
}

// Core Functions
function addTask(e) {
    e.preventDefault();
    const input = document.getElementById('task-input');
    const text = input.value.trim();

    if (text) {
        const newTodo = {
            id: Date.now(),
            text: text,
            completed: false
        };
        todos.unshift(newTodo);
        input.value = '';
        renderTodos();
    }
}

function toggleTask(id) {
    todos = todos.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
    );
    renderTodos();
}

function deleteTask(id) {
    todos = todos.filter(t => t.id !== id);
    renderTodos();
}

function setFilter(filter) {
    currentFilter = filter;

    // Update UI buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
            btn.classList.remove('bg-white', 'text-slate-500', 'border-slate-200');
        } else {
            btn.classList.remove('active');
            btn.classList.add('bg-white', 'text-slate-500', 'border-slate-200');
        }
    });

    renderTodos();
}

// Rendering Logic
function renderTodos() {
    const listEl = document.getElementById('todo-list');
    const countEl = document.getElementById('pending-count');
    const emptyEl = document.getElementById('empty-state');

    // Filter logic
    const filtered = todos.filter(t => {
        if (currentFilter === 'active') return !t.completed;
        if (currentFilter === 'completed') return t.completed;
        return true;
    });

    // Update pending count
    const activeCount = todos.filter(t => !t.completed).length;
    countEl.textContent = `${activeCount} Pending`;

    // Clear list
    listEl.innerHTML = '';

    if (filtered.length === 0) {
        emptyEl.classList.remove('hidden');
    } else {
        emptyEl.classList.add('hidden');

        filtered.forEach(todo => {
            const item = document.createElement('div');
            item.className = 'task-item group flex items-center gap-3 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-3';

            // Conditional Classes
            const textClass = todo.completed ? 'line-through text-slate-400' : 'text-slate-700';
            const iconClass = todo.completed ? 'text-green-500 fill-green-50' : 'text-slate-300 hover:text-indigo-500';
            const iconName = todo.completed ? 'check-circle' : 'circle';

            item.innerHTML = `
        <button onclick="toggleTask(${todo.id})" class="flex-shrink-0 transition-colors ${iconClass}">
            <i data-lucide="${iconName}" class="w-6 h-6 ${todo.completed ? 'fill-green-50' : ''}"></i>
        </button>

        <span class="flex-grow font-medium transition-all ${textClass}">
            ${todo.text}
        </span>

        <button onclick="deleteTask(${todo.id})" class="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2">
            <i data-lucide="trash-2" class="w-5 h-5"></i>
        </button>
        `;
            listEl.appendChild(item);
        });

        // Re-initialize icons for new elements
        lucide.createIcons();
    }
}