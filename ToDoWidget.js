// ToDoWidget.js - класс виджета "Список дел"

class ToDoWidget extends UIComponent {
    constructor(title, id, options = {}) {
        super(title, id, options);
        
        // Приватные свойства
        this.todos = []; // Массив задач - свойство класса
        this.nextId = 1;
        this.storageKey = `todo_widget_${id}`;
        
        // Элементы DOM
        this.inputElement = null;
        this.listElement = null;
        this.statsElement = null;
        
        // Загружаем сохраненные задачи
        this.loadFromStorage();
    }
    
    /**
     * Переопределенный метод render
     */
    render() {
        // Вызываем родительский render для создания базовой структуры
        const container = super.render();
        
        // Получаем контейнер для контента и наполняем его
        const contentContainer = this.getContentContainer();
        
        // Создаем форму добавления
        const addForm = this.createAddForm();
        contentContainer.appendChild(addForm);
        
        // Создаем список задач
        this.listElement = document.createElement('div');
        this.listElement.className = 'todo-list';
        contentContainer.appendChild(this.listElement);
        
        // Создаем статистику
        this.statsElement = document.createElement('div');
        this.statsElement.className = 'todo-stats';
        contentContainer.appendChild(this.statsElement);
        
        // Отрисовываем список
        this.renderTodoList();
        
        return container;
    }
    
    /**
     * Создание формы добавления задачи
     */
    createAddForm() {
        const form = document.createElement('div');
        form.className = 'todo-add-form';
        
        this.inputElement = document.createElement('input');
        this.inputElement.type = 'text';
        this.inputElement.placeholder = 'Введите новую задачу...';
        this.inputElement.className = 'todo-input';
        
        const addButton = document.createElement('button');
        addButton.textContent = 'Добавить';
        addButton.className = 'todo-add-btn';
        
        // Добавляем обработчики с автоматической очисткой
        const addHandler = () => this.addTodo();
        const keyPressHandler = (e) => {
            if (e.key === 'Enter') {
                this.addTodo();
            }
        };
        
        this.addEventListener(addButton, 'click', addHandler);
        this.addEventListener(this.inputElement, 'keypress', keyPressHandler);
        
        form.appendChild(this.inputElement);
        form.appendChild(addButton);
        
        return form;
    }
    
    /**
     * Добавление задачи
     */
    addTodo() {
        const text = this.inputElement.value.trim();
        
        if (text === '') {
            this.showNotification('Введите текст задачи', 'warning');
            return;
        }
        
        const todo = {
            id: this.nextId++,
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        this.todos.push(todo);
        this.saveToStorage();
        this.renderTodoList();
        this.inputElement.value = '';
        this.inputElement.focus();
        
        this.showNotification('Задача добавлена', 'success');
    }
    
    /**
     * Удаление задачи
     */
    deleteTodo(id) {
        const index = this.todos.findIndex(todo => todo.id === id);
        if (index !== -1) {
            const deleted = this.todos.splice(index, 1)[0];
            this.saveToStorage();
            this.renderTodoList();
            this.showNotification(`Задача "${deleted.text}" удалена`, 'info');
        }
    }
    
    /**
     * Переключение статуса задачи (выполнена/не выполнена)
     */
    toggleTodo(id) {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveToStorage();
            this.renderTodoList();
            
            const status = todo.completed ? 'выполнена' : 'восстановлена';
            this.showNotification(`Задача "${todo.text}" ${status}`, 'info');
        }
    }
    
    /**
     * Отрисовка списка задач
     */
    renderTodoList() {
        if (!this.listElement) return;
        
        this.listElement.innerHTML = '';
        
        if (this.todos.length === 0) {
            const emptyMsg = document.createElement('div');
            emptyMsg.className = 'todo-empty';
            emptyMsg.textContent = '✨ Нет задач. Добавьте первую задачу!';
            this.listElement.appendChild(emptyMsg);
        } else {
            this.todos.forEach(todo => {
                const item = this.createTodoItem(todo);
                this.listElement.appendChild(item);
            });
        }
        
        this.updateStats();
    }
    
    /**
     * Создание элемента задачи
     */
    createTodoItem(todo) {
        const item = document.createElement('div');
        item.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        item.dataset.id = todo.id;
        
        // Чекбокс
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'todo-checkbox';
        checkbox.checked = todo.completed;
        const checkboxHandler = () => this.toggleTodo(todo.id);
        this.addEventListener(checkbox, 'change', checkboxHandler);
        
        // Текст задачи
        const textSpan = document.createElement('span');
        textSpan.className = 'todo-text';
        textSpan.textContent = todo.text;
        
        // Кнопка удаления
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'todo-delete-btn';
        deleteBtn.innerHTML = '🗑';
        deleteBtn.title = 'Удалить задачу';
        const deleteHandler = () => this.deleteTodo(todo.id);
        this.addEventListener(deleteBtn, 'click', deleteHandler);
        
        item.appendChild(checkbox);
        item.appendChild(textSpan);
        item.appendChild(deleteBtn);
        
        return item;
    }
    
    /**
     * Обновление статистики
     */
    updateStats() {
        if (!this.statsElement) return;
        
        const total = this.todos.length;
        const completed = this.todos.filter(t => t.completed).length;
        const pending = total - completed;
        const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
        
        this.statsElement.innerHTML = `
            <div class="stats-grid">
                <div class="stat-item">
                    <span class="stat-label">Всего</span>
                    <span class="stat-value">${total}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Выполнено</span>
                    <span class="stat-value completed">${completed}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Осталось</span>
                    <span class="stat-value pending">${pending}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Прогресс</span>
                    <span class="stat-value">${percent}%</span>
                </div>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${percent}%"></div>
            </div>
        `;
    }
    
    /**
     * Сохранение в localStorage
     */
    saveToStorage() {
        localStorage.setItem(this.storageKey, JSON.stringify({
            todos: this.todos,
            nextId: this.nextId
        }));
    }
    
    /**
     * Загрузка из localStorage
     */
    loadFromStorage() {
        const saved = localStorage.getItem(this.storageKey);
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.todos = data.todos || [];
                this.nextId = data.nextId || 1;
            } catch (e) {
                console.error('Ошибка загрузки задач:', e);
                this.todos = [];
                this.nextId = 1;
            }
        }
    }
    
    /**
     * Показ уведомления
     */
    showNotification(message, type) {
        const event = new CustomEvent('widget-notification', {
            detail: { message, type, widgetId: this.id }
        });
        document.dispatchEvent(event);
    }
    
    /**
     * Получение всех задач (для внешнего использования)
     */
    getTodos() {
        return [...this.todos];
    }
    
    /**
     * Очистка всех задач
     */
    clearAllTodos() {
        if (this.todos.length > 0 && confirm('Удалить все задачи?')) {
            this.todos = [];
            this.nextId = 1;
            this.saveToStorage();
            this.renderTodoList();
            this.showNotification('Все задачи удалены', 'warning');
        }
    }
    
    /**
     * Переопределенный destroy - дополнительная очистка
     */
    destroy() {
        // Очищаем специфичные для виджета данные
        this.todos = [];
        this.inputElement = null;
        this.listElement = null;
        this.statsElement = null;
        
        // Вызываем родительский destroy
        super.destroy();
    }
}

window.ToDoWidget = ToDoWidget;