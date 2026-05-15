// js/Dashboard.js - класс, управляющий всей панелью (коллекция виджетов)

class Dashboard {
    constructor(container) {
        if (!container) {
            throw new Error('Dashboard: контейнер не может быть пустым');
        }
        
        this.container = container;
        this.widgets = [];
        this.widgetCounter = 0;
        
        // Стилизуем контейнер
        this.container.classList.add('dashboard-container');
        
        // Регистрируем доступные типы виджетов
        this.widgetTypes = {
            'todo': {
                class: window.ToDoWidget,
                title: 'Список дел',
                icon: '✅',
                description: 'Управляйте текущими задачами'
            },
            'quote': {
                class: window.QuoteWidget,
                title: 'Цитата дня',
                icon: '💭',
                description: 'Получайте вдохновение'
            },
            'calendar': {
                class: window.CalendarWidget,
                title: 'Календарь',
                icon: '📅',
                description: 'Планируйте задачи по датам'
            }
        };
    }
    
    /**
     * Добавление виджета указанного типа
     */
    addWidget(widgetType, options = {}) {
        const WidgetConfig = this.widgetTypes[widgetType];
        
        if (!WidgetConfig) {
            console.error(`Неизвестный тип виджета: ${widgetType}`);
            console.log(`Доступные типы: ${Object.keys(this.widgetTypes).join(', ')}`);
            return null;
        }
        
        try {
            const widgetId = `${widgetType}_${Date.now()}_${++this.widgetCounter}`;
            const widgetTitle = options.title || `${WidgetConfig.title} ${this.widgets.length + 1}`;
            
            const widget = new WidgetConfig.class(widgetTitle, widgetId, options);
            
            const widgetContainer = document.createElement('div');
            widgetContainer.className = 'widget-wrapper';
            widgetContainer.setAttribute('data-widget-id', widgetId);
            widgetContainer.setAttribute('data-widget-type', widgetType);
            
            const widgetElement = widget.render();
            widgetContainer.appendChild(widgetElement);
            
            this.container.appendChild(widgetContainer);
            
            this.widgets.push({
                id: widgetId,
                type: widgetType,
                instance: widget,
                container: widgetContainer,
                addedAt: new Date()
            });
            
            widgetContainer.style.animation = 'fadeInScale 0.3s ease';
            
            console.log(`Виджет "${widgetType}" добавлен (ID: ${widgetId})`);
            
            this.dispatchEvent('widget-added', { widgetId, widgetType });
            
            return { id: widgetId, type: widgetType, instance: widget };
            
        } catch (error) {
            console.error(`Ошибка при создании виджета "${widgetType}":`, error);
            return null;
        }
    }
    
    /**
     * Удаление виджета по ID
     */
    removeWidget(widgetId) {
        const index = this.widgets.findIndex(w => w.id === widgetId);
        
        if (index === -1) {
            console.warn(`Виджет с ID ${widgetId} не найден`);
            return false;
        }
        
        const widget = this.widgets[index];
        
        try {
            if (widget.container) {
                widget.container.style.animation = 'fadeOut 0.3s ease';
                
                setTimeout(() => {
                    if (widget.instance && typeof widget.instance.destroy === 'function') {
                        widget.instance.destroy();
                    }
                    
                    if (widget.container && widget.container.parentNode) {
                        widget.container.remove();
                    }
                    
                    this.widgets.splice(index, 1);
                    console.log(`Виджет ${widgetId} удален`);
                    this.dispatchEvent('widget-removed', { widgetId });
                }, 300);
            } else {
                if (widget.instance && typeof widget.instance.destroy === 'function') {
                    widget.instance.destroy();
                }
                this.widgets.splice(index, 1);
            }
            
            return true;
            
        } catch (error) {
            console.error(`Ошибка при удалении виджета ${widgetId}:`, error);
            return false;
        }
    }
    
    /**
     * Получение всех виджетов
     */
    getAllWidgets() {
        return [...this.widgets];
    }
    
    /**
     * Получение виджета по ID
     */
    getWidget(widgetId) {
        return this.widgets.find(w => w.id === widgetId) || null;
    }
    
    /**
     * Получение виджетов по типу
     */
    getWidgetsByType(widgetType) {
        return this.widgets.filter(w => w.type === widgetType);
    }
    
    /**
     * Получение количества виджетов
     */
    getWidgetCount() {
        return this.widgets.length;
    }
    
    /**
     * Удаление всех виджетов
     */
    removeAllWidgets() {
        const widgetIds = this.widgets.map(w => w.id);
        widgetIds.forEach(id => this.removeWidget(id));
    }
    
    /**
     * Отправка события дашборда
     */
    dispatchEvent(eventName, detail) {
        const event = new CustomEvent(`dashboard:${eventName}`, { detail });
        this.container.dispatchEvent(event);
    }
    
    /**
     * Очистка дашборда
     */
    clear() {
        this.widgets.forEach(widget => {
            if (widget.container && widget.container.parentNode) {
                widget.container.remove();
            }
        });
        this.widgets = [];
        this.widgetCounter = 0;
    }
    
    /**
     * Получение доступных типов виджетов
     */
    getAvailableWidgetTypes() {
        return Object.keys(this.widgetTypes).map(type => ({
            type,
            title: this.widgetTypes[type].title,
            icon: this.widgetTypes[type].icon,
            description: this.widgetTypes[type].description
        }));
    }
}

window.Dashboard = Dashboard;