// UIComponent.js - базовый (абстрактный) класс для всех виджетов

class UIComponent {
    constructor(title, id, options = {}) {
        // Защита от прямого создания экземпляра
        if (this.constructor === UIComponent) {
            throw new Error('UIComponent - абстрактный класс. Нельзя создавать экземпляры напрямую.');
        }
        
        this.title = title;
        this.id = id;
        this.element = null;
        this.isMinimized = options.isMinimized || false;
        this.eventListeners = []; // Хранилище для слушателей событий
    }
    
    /**
     * Основной метод рендеринга - возвращает DOM элемент
     */
    render() {
        // Создаем базовый контейнер
        const container = document.createElement('div');
        container.id = this.id;
        container.className = 'ui-component widget';
        
        // Создаем заголовок с контролами
        const header = this.createHeader();
        container.appendChild(header);
        
        // Создаем контейнер для контента
        this.contentContainer = document.createElement('div');
        this.contentContainer.className = 'widget-content-container';
        container.appendChild(this.contentContainer);
        
        // Если виджет свернут, скрываем контент
        if (this.isMinimized) {
            this.contentContainer.style.display = 'none';
        }
        
        this.element = container;
        return container;
    }
    
    /**
     * Создание заголовка с кнопками управления
     */
    createHeader() {
        const header = document.createElement('div');
        header.className = 'widget-header';
        
        const titleSpan = document.createElement('span');
        titleSpan.className = 'widget-title';
        titleSpan.textContent = this.title;
        
        const controls = document.createElement('div');
        controls.className = 'widget-controls';
        
        // Кнопка свернуть/развернуть
        const minimizeBtn = document.createElement('button');
        minimizeBtn.className = 'widget-minimize-btn';
        minimizeBtn.innerHTML = this.isMinimized ? '🗖' : '📉';
        minimizeBtn.title = this.isMinimized ? 'Развернуть' : 'Свернуть';
        const minimizeHandler = () => this.toggleMinimize();
        minimizeBtn.addEventListener('click', minimizeHandler);
        this.eventListeners.push({ element: minimizeBtn, event: 'click', handler: minimizeHandler });
        
        // Кнопка закрыть
        const closeBtn = document.createElement('button');
        closeBtn.className = 'widget-close-btn';
        closeBtn.innerHTML = '✖';
        closeBtn.title = 'Закрыть виджет';
        const closeHandler = () => this.destroy();
        closeBtn.addEventListener('click', closeHandler);
        this.eventListeners.push({ element: closeBtn, event: 'click', handler: closeHandler });
        
        controls.appendChild(minimizeBtn);
        controls.appendChild(closeBtn);
        
        header.appendChild(titleSpan);
        header.appendChild(controls);
        
        return header;
    }
    
    /**
     * Переключение состояния свернут/развернут
     */
    toggleMinimize() {
        this.isMinimized = !this.isMinimized;
        
        if (this.contentContainer) {
            this.contentContainer.style.display = this.isMinimized ? 'none' : 'block';
        }
        
        // Обновляем иконку кнопки
        const minimizeBtn = this.element?.querySelector('.widget-minimize-btn');
        if (minimizeBtn) {
            minimizeBtn.innerHTML = this.isMinimized ? '🗖' : '📉';
            minimizeBtn.title = this.isMinimized ? 'Развернуть' : 'Свернуть';
        }
        
        // Триггерим событие
        const event = new CustomEvent('widget-minimized', { 
            detail: { widgetId: this.id, isMinimized: this.isMinimized } 
        });
        document.dispatchEvent(event);
    }
    
    /**
     * Получение контейнера для контента
     */
    getContentContainer() {
        return this.contentContainer;
    }
    
    /**
     * Добавление обработчика события с автоматической очисткой
     */
    addEventListener(element, event, handler) {
        element.addEventListener(event, handler);
        this.eventListeners.push({ element, event, handler });
    }
    
    /**
     * Очистка всех слушателей событий
     */
    clearEventListeners() {
        this.eventListeners.forEach(({ element, event, handler }) => {
            element.removeEventListener(event, handler);
        });
        this.eventListeners = [];
    }
    
    /**
     * Корректное удаление виджета из DOM с очисткой слушателей
     */
    destroy() {
        // Очищаем все слушатели событий
        this.clearEventListeners();
        
        // Удаляем элемент из DOM
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        
        // Обнуляем ссылки
        this.element = null;
        this.contentContainer = null;
        
        // Триггерим событие об удалении
        const event = new CustomEvent('widget-destroyed', { 
            detail: { widgetId: this.id } 
        });
        document.dispatchEvent(event);
        
        console.log(`Виджет "${this.title}" (${this.id}) удален`);
    }
    
    /**
     * Обновление заголовка виджета
     */
    setTitle(newTitle) {
        this.title = newTitle;
        const titleElement = this.element?.querySelector('.widget-title');
        if (titleElement) {
            titleElement.textContent = newTitle;
        }
    }
    
    /**
     * Показать виджет
     */
    show() {
        if (this.element) {
            this.element.style.display = 'flex';
        }
    }
    
    /**
     * Скрыть виджет
     */
    hide() {
        if (this.element) {
            this.element.style.display = 'none';
        }
    }
}

window.UIComponent = UIComponent;