// main.js - обновленный с календарем

function initApp() {
    const dashboardContainer = document.getElementById('dashboard');
    
    if (!dashboardContainer) {
        console.error('Контейнер dashboard не найден');
        return;
    }
    
    const dashboard = new window.Dashboard(dashboardContainer);
    createControlPanel(dashboard);
    addDefaultWidgets(dashboard);
    setupEventHandlers();
    startTimeUpdate();
    
    window.dashboard = dashboard;
    
    console.log('Приложение инициализировано. Доступные виджеты:', dashboard.getAvailableWidgetTypes());
}

function createControlPanel(dashboard) {
    const panel = document.createElement('div');
    panel.className = 'dashboard-controls';
    panel.innerHTML = `
        <h2>🎮 Управление виджетами</h2>
        <div class="controls-buttons">
            <button id="addTodoBtn" class="btn btn-primary">
                ✅ Добавить список дел
            </button>
            <button id="addQuoteBtn" class="btn btn-secondary">
                💭 Добавить цитату дня
            </button>
            <button id="addCalendarBtn" class="btn btn-calendar">  <!-- НОВАЯ КНОПКА -->
                📅 Добавить календарь
            </button>
            <button id="removeLastBtn" class="btn btn-danger">
                🗑 Удалить последний
            </button>
            <button id="clearAllBtn" class="btn btn-warning">
                ⚠️ Очистить все
            </button>
        </div>
        <div class="widgets-count" id="widgetsCount">
            📊 Виджетов: 0
        </div>
    `;
    
    const container = document.querySelector('.app-container');
    const dashboardElement = document.getElementById('dashboard');
    container.insertBefore(panel, dashboardElement);
    
    const addTodoBtn = document.getElementById('addTodoBtn');
    const addQuoteBtn = document.getElementById('addQuoteBtn');
    const addCalendarBtn = document.getElementById('addCalendarBtn'); // НОВАЯ КНОПКА
    const removeLastBtn = document.getElementById('removeLastBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const widgetsCountSpan = document.getElementById('widgetsCount');
    
    if (addTodoBtn) {
        addTodoBtn.addEventListener('click', () => {
            const result = dashboard.addWidget('todo');
            if (result) {
                showNotification('Виджет "Список дел" добавлен', 'success');
                updateWidgetsCount(dashboard, widgetsCountSpan);
            }
        });
    }
    
    if (addQuoteBtn) {
        addQuoteBtn.addEventListener('click', () => {
            const result = dashboard.addWidget('quote');
            if (result) {
                showNotification('Виджет "Цитата дня" добавлен', 'success');
                updateWidgetsCount(dashboard, widgetsCountSpan);
            }
        });
    }
    
    // НОВЫЙ ОБРАБОТЧИК ДЛЯ КАЛЕНДАРЯ
    if (addCalendarBtn) {
        addCalendarBtn.addEventListener('click', () => {
            const result = dashboard.addWidget('calendar', { title: 'Мой календарь' });
            if (result) {
                showNotification('Виджет "Календарь" добавлен', 'success');
                updateWidgetsCount(dashboard, widgetsCountSpan);
            }
        });
    }
    
    if (removeLastBtn) {
        removeLastBtn.addEventListener('click', () => {
            const widgets = dashboard.getAllWidgets();
            if (widgets.length > 0) {
                const lastWidget = widgets[widgets.length - 1];
                dashboard.removeWidget(lastWidget.id);
                showNotification('Последний виджет удален', 'info');
                updateWidgetsCount(dashboard, widgetsCountSpan);
            } else {
                showNotification('Нет виджетов для удаления', 'warning');
            }
        });
    }
    
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', () => {
            if (confirm('Вы уверены, что хотите удалить все виджеты?')) {
                dashboard.removeAllWidgets();
                showNotification('Все виджеты удалены', 'warning');
                updateWidgetsCount(dashboard, widgetsCountSpan);
            }
        });
    }
    
    dashboard.container.addEventListener('dashboard:widget-removed', () => {
        updateWidgetsCount(dashboard, widgetsCountSpan);
    });
    dashboard.container.addEventListener('dashboard:widget-added', () => {
        updateWidgetsCount(dashboard, widgetsCountSpan);
    });
    
    updateWidgetsCount(dashboard, widgetsCountSpan);
}

function addDefaultWidgets(dashboard) {
    setTimeout(() => {
        dashboard.addWidget('todo', { title: 'Мои задачи' });
        dashboard.addWidget('quote', { title: 'Вдохновение' });
        dashboard.addWidget('calendar', { title: 'Планировщик' }); // ДОБАВЛЕН КАЛЕНДАРЬ ПО УМОЛЧАНИЮ
    }, 100);
}


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}