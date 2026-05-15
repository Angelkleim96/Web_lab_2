// QuoteWidget.js - класс виджета "Случайная цитата"

class QuoteWidget extends UIComponent {
    // Массив цитат (хранится прямо в классе)
    static QUOTES = [
        { text: "Успех - это способность идти от неудачи к неудаче, не теряя энтузиазма.", author: "Уинстон Черчилль" },
        { text: "Единственный способ сделать отличную работу - любить то, что ты делаешь.", author: "Стив Джобс" },
        { text: "Жизнь - это то, что с тобой происходит, пока ты строишь планы.", author: "Джон Леннон" },
        { text: "Будущее зависит от того, что ты делаешь сегодня.", author: "Махатма Ганди" },
        { text: "Трудности делают характер сильнее, а ум острее.", author: "Сенека" },
        { text: "Не ждите особых моментов, создавайте их сами.", author: "Неизвестный" },
        { text: "Лучший способ предсказать будущее - создать его.", author: "Питер Друкер" },
        { text: "Встань и иди, не оглядывайся, и ты достигнешь цели.", author: "Конфуций" },
        { text: "Оптимист видит возможность в каждой опасности.", author: "Уинстон Черчилль" },
        { text: "Знание - сила.", author: "Фрэнсис Бэкон" },
        { text: "Будьте изменением, которое вы хотите видеть в мире.", author: "Махатма Ганди" },
        { text: "Ваше время ограничено, не тратьте его, живя чужой жизнью.", author: "Стив Джобс" }
    ];
    
    constructor(title, id, options = {}) {
        super(title, id, options);
        this.currentQuote = null;
        this.quoteTextElement = null;
        this.quoteAuthorElement = null;
    }
    
    /**
     * Переопределенный метод render
     */
    render() {
        const container = super.render();
        const contentContainer = this.getContentContainer();
        
        // Контейнер для цитаты
        const quoteContainer = document.createElement('div');
        quoteContainer.className = 'quote-container';
        
        this.quoteTextElement = document.createElement('div');
        this.quoteTextElement.className = 'quote-text';
        
        this.quoteAuthorElement = document.createElement('div');
        this.quoteAuthorElement.className = 'quote-author';
        
        quoteContainer.appendChild(this.quoteTextElement);
        quoteContainer.appendChild(this.quoteAuthorElement);
        
        // Кнопка обновления
        const refreshBtn = document.createElement('button');
        refreshBtn.className = 'quote-refresh-btn';
        refreshBtn.innerHTML = '🔄 Новая цитата';
        
        const refreshHandler = () => this.refreshQuote();
        this.addEventListener(refreshBtn, 'click', refreshHandler);
        
        contentContainer.appendChild(quoteContainer);
        contentContainer.appendChild(refreshBtn);
        
        // Показываем первую цитату
        this.refreshQuote();
        
        return container;
    }
    
    /**
     * Обновление цитаты (выбирает случайную из массива)
     */
    refreshQuote() {
        const randomIndex = Math.floor(Math.random() * QuoteWidget.QUOTES.length);
        this.currentQuote = QuoteWidget.QUOTES[randomIndex];
        this.displayQuote();
    }
    
    /**
     * Отображение текущей цитаты
     */
    displayQuote() {
        if (this.quoteTextElement && this.quoteAuthorElement && this.currentQuote) {
            // Анимация обновления
            this.quoteTextElement.style.opacity = '0';
            this.quoteAuthorElement.style.opacity = '0';
            
            setTimeout(() => {
                this.quoteTextElement.textContent = `"${this.currentQuote.text}"`;
                this.quoteAuthorElement.textContent = `— ${this.currentQuote.author}`;
                
                this.quoteTextElement.style.opacity = '1';
                this.quoteAuthorElement.style.opacity = '1';
            }, 200);
        }
    }
    
    /**
     * Получение текущей цитаты
     */
    getCurrentQuote() {
        return this.currentQuote ? { ...this.currentQuote } : null;
    }
    
    /**
     * Добавление новой цитаты в коллекцию
     */
    static addQuote(text, author) {
        this.QUOTES.push({ text, author });
    }
    
    /**
     * Получение всех цитат
     */
    static getAllQuotes() {
        return [...this.QUOTES];
    }
    
    /**
     * destroy - очистка
     */
    destroy() {
        this.currentQuote = null;
        this.quoteTextElement = null;
        this.quoteAuthorElement = null;
        super.destroy();
    }
}

window.QuoteWidget = QuoteWidget;