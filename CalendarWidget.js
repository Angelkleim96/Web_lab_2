// js/CalendarWidget.js - класс виджета "Календарь с планированием"

class CalendarWidget extends UIComponent {
    constructor(title, id, options = {}) {
        super(title, id, options);
        
        // Состояние календаря
        this.currentDate = new Date();
        this.currentYear = this.currentDate.getFullYear();
        this.currentMonth = this.currentDate.getMonth();
        this.selectedDate = null;
        
        // Планирование задач по датам
        this.scheduledTasks = this.loadScheduledTasks();
        
        // DOM элементы
        this.calendarGrid = null;
        this.monthYearDisplay = null;
        this.tasksList = null;
        this.taskInput = null;
        
        // Для модального окна
        this.modal = null;
    }
    
    render() {
        const container = super.render();
        const contentContainer = this.getContentContainer();
        
        // Создаем основной контейнер календаря
        const calendarWrapper = document.createElement('div');
        calendarWrapper.className = 'calendar-wrapper';
        
        // Шапка календаря с навигацией
        const calendarHeader = this.createCalendarHeader();
        calendarWrapper.appendChild(calendarHeader);
        
        // Дни недели
        const weekdays = this.createWeekdaysHeader();
        calendarWrapper.appendChild(weekdays);
        
        // Сетка календаря
        this.calendarGrid = document.createElement('div');
        this.calendarGrid.className = 'calendar-grid';
        calendarWrapper.appendChild(this.calendarGrid);
        
        // Обновляем сетку
        this.renderCalendarGrid();
        
        // Панель задач для выбранной даты
        const tasksPanel = this.createTasksPanel();
        
        contentContainer.appendChild(calendarWrapper);
        contentContainer.appendChild(tasksPanel);
        
        // Создаем модальное окно для редактирования
        this.createModal();
        
        return container;
    }
    
    /**
     * Создание шапки календаря с навигацией
     */
    createCalendarHeader() {
        const header = document.createElement('div');
        header.className = 'calendar-header';
        
        const prevBtn = document.createElement('button');
        prevBtn.className = 'calendar-nav-btn';
        prevBtn.innerHTML = '◀';
        prevBtn.title = 'Предыдущий месяц';
        const prevHandler = () => this.changeMonth(-1);
        this.addEventListener(prevBtn, 'click', prevHandler);
        
        this.monthYearDisplay = document.createElement('div');
        this.monthYearDisplay.className = 'calendar-month-year';
        this.updateMonthYearDisplay();
        
        const nextBtn = document.createElement('button');
        nextBtn.className = 'calendar-nav-btn';
        nextBtn.innerHTML = '▶';
        nextBtn.title = 'Следующий месяц';
        const nextHandler = () => this.changeMonth(1);
        this.addEventListener(nextBtn, 'click', nextHandler);
        
        const todayBtn = document.createElement('button');
        todayBtn.className = 'calendar-today-btn';
        todayBtn.innerHTML = '📅 Сегодня';
        todayBtn.title = 'Перейти к сегодняшней дате';
        const todayHandler = () => this.goToToday();
        this.addEventListener(todayBtn, 'click', todayHandler);
        
        header.appendChild(prevBtn);
        header.appendChild(this.monthYearDisplay);
        header.appendChild(nextBtn);
        header.appendChild(todayBtn);
        
        return header;
    }
    
    /**
     * Создание заголовка с днями недели
     */
    createWeekdaysHeader() {
        const weekdays = document.createElement('div');
        weekdays.className = 'calendar-weekdays';
        
        const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
        days.forEach(day => {
            const daySpan = document.createElement('div');
            daySpan.className = 'calendar-weekday';
            daySpan.textContent = day;
            weekdays.appendChild(daySpan);
        });
        
        return weekdays;
    }
    
    /**
     * Создание панели задач для выбранной даты
     */
    createTasksPanel() {
        const panel = document.createElement('div');
        panel.className = 'calendar-tasks-panel';
        
        const title = document.createElement('div');
        title.className = 'tasks-panel-title';
        title.innerHTML = '📝 Запланированные задачи';
        
        const dateDisplay = document.createElement('div');
        dateDisplay.className = 'tasks-date-display';
        dateDisplay.id = `tasks-date-${this.id}`;
        
        this.tasksList = document.createElement('div');
        this.tasksList.className = 'tasks-list';
        
        const addTaskForm = document.createElement('div');
        addTaskForm.className = 'tasks-add-form';
        
        this.taskInput = document.createElement('input');
        this.taskInput.type = 'text';
        this.taskInput.placeholder = 'Новая задача...';
        this.taskInput.className = 'tasks-input';
        
        const addBtn = document.createElement('button');
        addBtn.className = 'tasks-add-btn';
        addBtn.innerHTML = '+ Добавить';
        const addHandler = () => this.addTaskToSelectedDate();
        this.addEventListener(addBtn, 'click', addHandler);
        
        const keyPressHandler = (e) => {
            if (e.key === 'Enter') {
                this.addTaskToSelectedDate();
            }
        };
        this.addEventListener(this.taskInput, 'keypress', keyPressHandler);
        
        addTaskForm.appendChild(this.taskInput);
        addTaskForm.appendChild(addBtn);
        
        panel.appendChild(title);
        panel.appendChild(dateDisplay);
        panel.appendChild(this.tasksList);
        panel.appendChild(addTaskForm);
        
        return panel;
    }
    
    /**
     * Обновление отображения месяца и года
     */
    updateMonthYearDisplay() {
        const monthNames = [
            'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
            'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
        ];
        this.monthYearDisplay.textContent = `${monthNames[this.currentMonth]} ${this.currentYear}`;
    }
    
    /**
     * Переключение месяца
     */
    changeMonth(delta) {
        this.currentMonth += delta;
        if (this.currentMonth < 0) {
            this.currentMonth = 11;
            this.currentYear--;
        } else if (this.currentMonth > 11) {
            this.currentMonth = 0;
            this.currentYear++;
        }
        this.updateMonthYearDisplay();
        this.renderCalendarGrid();
    }
    
    /**
     * Переход к сегодняшней дате
     */
    goToToday() {
        const today = new Date();
        this.currentYear = today.getFullYear();
        this.currentMonth = today.getMonth();
        this.selectedDate = this.formatDate(today);
        this.updateMonthYearDisplay();
        this.renderCalendarGrid();
        this.showTasksForDate(this.selectedDate);
    }
    
    /**
     * Отрисовка сетки календаря
     */
    renderCalendarGrid() {
        if (!this.calendarGrid) return;
        
        this.calendarGrid.innerHTML = '';
        
        // Получаем первый день месяца
        const firstDay = new Date(this.currentYear, this.currentMonth, 1);
        const startDayOfWeek = firstDay.getDay() || 7;
        const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
        
        // Получаем дни предыдущего месяца для заполнения
        const prevMonthDays = startDayOfWeek - 1;
        const prevMonthDate = new Date(this.currentYear, this.currentMonth, 0);
        const daysInPrevMonth = prevMonthDate.getDate();
        
        // Генерируем ячейки календаря
        for (let i = 0; i < 42; i++) {
            const cell = document.createElement('div');
            cell.className = 'calendar-cell';
            
            let dayNumber;
            let date;
            
            if (i < prevMonthDays) {
                // Дни предыдущего месяца
                dayNumber = daysInPrevMonth - prevMonthDays + i + 1;
                date = new Date(this.currentYear, this.currentMonth - 1, dayNumber);
                cell.classList.add('other-month');
            } else if (i >= prevMonthDays + daysInMonth) {
                // Дни следующего месяца
                dayNumber = i - (prevMonthDays + daysInMonth) + 1;
                date = new Date(this.currentYear, this.currentMonth + 1, dayNumber);
                cell.classList.add('other-month');
            } else {
                // Дни текущего месяца
                dayNumber = i - prevMonthDays + 1;
                date = new Date(this.currentYear, this.currentMonth, dayNumber);
                cell.classList.add('current-month');
            }
            
            const formattedDate = this.formatDate(date);
            const daySpan = document.createElement('div');
            daySpan.className = 'calendar-day-number';
            daySpan.textContent = dayNumber;
            
            cell.appendChild(daySpan);
            
            // Проверяем, есть ли задачи на эту дату
            if (this.scheduledTasks[formattedDate] && this.scheduledTasks[formattedDate].length > 0) {
                const taskIndicator = document.createElement('div');
                taskIndicator.className = 'calendar-task-indicator';
                taskIndicator.textContent = `📋 ${this.scheduledTasks[formattedDate].length}`;
                cell.appendChild(taskIndicator);
            }
            
            // Подсвечиваем выбранную дату
            if (this.selectedDate === formattedDate) {
                cell.classList.add('selected');
            }
            
            // Подсвечиваем сегодняшнюю дату
            const today = this.formatDate(new Date());
            if (formattedDate === today) {
                cell.classList.add('today');
            }
            
            // Обработчик клика
            const clickHandler = () => this.selectDate(formattedDate, date);
            this.addEventListener(cell, 'click', clickHandler);
            
            this.calendarGrid.appendChild(cell);
        }
    }
    
    /**
     * Выбор даты
     */
    selectDate(formattedDate, date) {
        this.selectedDate = formattedDate;
        this.renderCalendarGrid();
        this.showTasksForDate(formattedDate);
        
        // Обновляем отображение выбранной даты в панели задач
        const dateDisplay = document.querySelector(`#tasks-date-${this.id}`);
        if (dateDisplay) {
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            dateDisplay.innerHTML = `📅 ${date.toLocaleDateString('ru-RU', options)}`;
        }
    }
    
    /**
     * Отображение задач для выбранной даты
     */
    showTasksForDate(date) {
        if (!this.tasksList) return;
        
        const tasks = this.scheduledTasks[date] || [];
        
        if (tasks.length === 0) {
            this.tasksList.innerHTML = '<div class="tasks-empty">✨ Нет запланированных задач на этот день</div>';
            return;
        }
        
        this.tasksList.innerHTML = '';
        tasks.forEach((task, index) => {
            const taskItem = this.createTaskItem(task, date, index);
            this.tasksList.appendChild(taskItem);
        });
    }
    
    /**
     * Создание элемента задачи
     */
    createTaskItem(task, date, index) {
        const item = document.createElement('div');
        item.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.checked = task.completed;
        const checkboxHandler = () => this.toggleTaskStatus(date, index);
        this.addEventListener(checkbox, 'change', checkboxHandler);
        
        const taskText = document.createElement('span');
        taskText.className = 'task-text';
        taskText.textContent = task.text;
        
        const timeSpan = document.createElement('span');
        timeSpan.className = 'task-time';
        if (task.time) {
            timeSpan.textContent = task.time;
        }
        
        const editBtn = document.createElement('button');
        editBtn.className = 'task-edit-btn';
        editBtn.innerHTML = '✏️';
        editBtn.title = 'Редактировать';
        const editHandler = () => this.editTask(date, index);
        this.addEventListener(editBtn, 'click', editHandler);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'task-delete-btn';
        deleteBtn.innerHTML = '🗑';
        deleteBtn.title = 'Удалить';
        const deleteHandler = () => this.deleteTask(date, index);
        this.addEventListener(deleteBtn, 'click', deleteHandler);
        
        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'task-buttons';
        buttonsDiv.appendChild(editBtn);
        buttonsDiv.appendChild(deleteBtn);
        
        const infoDiv = document.createElement('div');
        infoDiv.className = 'task-info';
        infoDiv.appendChild(taskText);
        if (task.time) infoDiv.appendChild(timeSpan);
        
        item.appendChild(checkbox);
        item.appendChild(infoDiv);
        item.appendChild(buttonsDiv);
        
        return item;
    }
    
    /**
     * Добавление задачи к выбранной дате
     */
    addTaskToSelectedDate() {
        if (!this.selectedDate) {
            this.showNotification('Сначала выберите дату в календаре', 'warning');
            return;
        }
        
        const taskText = this.taskInput.value.trim();
        if (!taskText) {
            this.showNotification('Введите текст задачи', 'warning');
            return;
        }
        
        if (!this.scheduledTasks[this.selectedDate]) {
            this.scheduledTasks[this.selectedDate] = [];
        }
        
        this.scheduledTasks[this.selectedDate].push({
            text: taskText,
            completed: false,
            createdAt: new Date().toISOString()
        });
        
        this.saveScheduledTasks();
        this.showTasksForDate(this.selectedDate);
        this.renderCalendarGrid();
        this.taskInput.value = '';
        
        this.showNotification('Задача добавлена', 'success');
    }
    
    /**
     * Переключение статуса задачи
     */
    toggleTaskStatus(date, index) {
        if (this.scheduledTasks[date] && this.scheduledTasks[date][index]) {
            this.scheduledTasks[date][index].completed = !this.scheduledTasks[date][index].completed;
            this.saveScheduledTasks();
            this.showTasksForDate(date);
            this.renderCalendarGrid();
        }
    }
    
    /**
     * Удаление задачи
     */
    deleteTask(date, index) {
        if (confirm('Удалить эту задачу?')) {
            this.scheduledTasks[date].splice(index, 1);
            if (this.scheduledTasks[date].length === 0) {
                delete this.scheduledTasks[date];
            }
            this.saveScheduledTasks();
            this.showTasksForDate(date);
            this.renderCalendarGrid();
            this.showNotification('Задача удалена', 'info');
        }
    }
    
    /**
     * Редактирование задачи
     */
    editTask(date, index) {
        const task = this.scheduledTasks[date][index];
        this.showEditModal(task, date, index);
    }
    
    /**
     * Создание модального окна для редактирования
     */
    createModal() {
        this.modal = document.createElement('div');
        this.modal.className = 'calendar-modal';
        this.modal.style.display = 'none';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'calendar-modal-content';
        
        const modalTitle = document.createElement('h3');
        modalTitle.textContent = 'Редактировать задачу';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.id = `modal-task-input-${this.id}`;
        input.className = 'modal-task-input';
        input.placeholder = 'Текст задачи';
        
        const timeInput = document.createElement('input');
        timeInput.type = 'time';
        timeInput.id = `modal-time-input-${this.id}`;
        timeInput.className = 'modal-time-input';
        
        const buttons = document.createElement('div');
        buttons.className = 'modal-buttons';
        
        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Сохранить';
        saveBtn.className = 'modal-save-btn';
        
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Отмена';
        cancelBtn.className = 'modal-cancel-btn';
        
        buttons.appendChild(saveBtn);
        buttons.appendChild(cancelBtn);
        
        modalContent.appendChild(modalTitle);
        modalContent.appendChild(input);
        modalContent.appendChild(timeInput);
        modalContent.appendChild(buttons);
        
        this.modal.appendChild(modalContent);
        document.body.appendChild(this.modal);
        
        // Обработчики
        const saveHandler = () => this.saveEditedTask();
        const cancelHandler = () => this.closeModal();
        const closeOnOutsideClick = (e) => {
            if (e.target === this.modal) this.closeModal();
        };
        
        this.addEventListener(saveBtn, 'click', saveHandler);
        this.addEventListener(cancelBtn, 'click', cancelHandler);
        this.addEventListener(this.modal, 'click', closeOnOutsideClick);
        
        this.modalInput = input;
        this.modalTimeInput = timeInput;
    }
    
    /**
     * Показ модального окна для редактирования
     */
    showEditModal(task, date, index) {
        this.currentEditDate = date;
        this.currentEditIndex = index;
        this.modalInput.value = task.text;
        this.modalTimeInput.value = task.time || '';
        this.modal.style.display = 'flex';
    }
    
    /**
     * Сохранение отредактированной задачи
     */
    saveEditedTask() {
        if (this.currentEditDate !== undefined && this.currentEditIndex !== undefined) {
            const newText = this.modalInput.value.trim();
            if (newText) {
                this.scheduledTasks[this.currentEditDate][this.currentEditIndex].text = newText;
                this.scheduledTasks[this.currentEditDate][this.currentEditIndex].time = this.modalTimeInput.value;
                this.saveScheduledTasks();
                this.showTasksForDate(this.currentEditDate);
                this.renderCalendarGrid();
                this.showNotification('Задача обновлена', 'success');
            }
        }
        this.closeModal();
    }
    
    /**
     * Закрытие модального окна
     */
    closeModal() {
        this.modal.style.display = 'none';
        this.currentEditDate = null;
        this.currentEditIndex = null;
    }
    
    /**
     * Сохранение задач в localStorage
     */
    saveScheduledTasks() {
        localStorage.setItem(`calendar_tasks_${this.id}`, JSON.stringify(this.scheduledTasks));
    }
    
    /**
     * Загрузка задач из localStorage
     */
    loadScheduledTasks() {
        const saved = localStorage.getItem(`calendar_tasks_${this.id}`);
        return saved ? JSON.parse(saved) : {};
    }
    
    /**
     * Форматирование даты в YYYY-MM-DD
     */
    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
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
    
    destroy() {
        this.modal?.remove();
        super.destroy();
    }
}

window.CalendarWidget = CalendarWidget;