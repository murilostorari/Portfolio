class ProjectCarousel {
    constructor() {
        this.currentPage = 0;
        this.container = document.querySelector('.projects-layout');
        this.cards = document.querySelectorAll('.project-card');
        this.cardsPerPage = window.innerWidth <= 768 ? 1 : 2;
        this.totalPages = Math.ceil(this.cards.length / this.cardsPerPage);

        // Variáveis para o drag
        this.isDragging = false;
        this.startPos = 0;
        this.currentTranslate = 0;
        this.prevTranslate = 0;
        this.animationID = 0;
        this.startTime = null;

        this.setupButtons();
        this.setupDots();
        this.setupKeyboardNavigation();
        this.setupTouchNavigation();
        this.setupMouseDrag();
        this.setupResizeHandler();
        this.updateSlides();
    }

    setupButtons() {
        const prevButton = document.querySelector('.carousel-button.prev');
        const nextButton = document.querySelector('.carousel-button.next');

        prevButton.addEventListener('click', () => this.navigate(-1));
        nextButton.addEventListener('click', () => this.navigate(1));
    }

    setupDots() {
        const dotsContainer = document.querySelector('.carousel-dots');
        dotsContainer.innerHTML = '';

        for (let i = 0; i < this.totalPages; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            dot.addEventListener('click', () => this.goToPage(i));
            dotsContainer.appendChild(dot);
        }

        this.dots = dotsContainer.querySelectorAll('.dot');
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.navigate(-1);
            if (e.key === 'ArrowRight') this.navigate(1);
        });
    }

    setupTouchNavigation() {
        let touchStartX = 0;
        let touchEndX = 0;

        this.container.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });

        this.container.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            if (touchStartX - touchEndX > 20) this.navigate(1);
            if (touchStartX - touchEndX < -20) this.navigate(-1);
        });
    }

    setupMouseDrag() {
        // Previne o comportamento padrão de arrastar imagens
        this.container.querySelectorAll('img').forEach(img => {
            img.addEventListener('dragstart', (e) => e.preventDefault());
        });

        // Mouse events
        this.container.addEventListener('mousedown', this.dragStart.bind(this));
        window.addEventListener('mousemove', this.drag.bind(this));
        window.addEventListener('mouseup', this.dragEnd.bind(this));

        // Previne a seleção de texto durante o drag
        this.container.addEventListener('selectstart', (e) => e.preventDefault());
    }

    dragStart(event) {
        if (event.type === 'mousedown') {
            this.startPos = event.clientX;
            this.isDragging = true;
            this.startTime = new Date();

            // Adiciona classe que remove a transição suave durante o drag
            this.container.classList.add('grabbing');

            // Cancela qualquer animação em andamento
            cancelAnimationFrame(this.animationID);
        }
    }

    drag(event) {
        if (!this.isDragging) return;

        const currentPosition = event.clientX;
        const diff = currentPosition - this.startPos;
        const containerWidth = this.container.offsetWidth;

        // Calcula o movimento em porcentagem
        const movePercent = (diff / containerWidth) * 100;

        // Aplica o movimento atual mais o movimento anterior
        const translate = this.prevTranslate + movePercent;

        // Limita o arrasto para não ultrapassar os limites
        const maxTranslate = 0;
        const minTranslate = -((this.totalPages - 1) * 100);

        if (translate <= maxTranslate && translate >= minTranslate) {
            this.currentTranslate = translate;
            this.container.style.transform = `translateX(${translate}%)`;
        }
    }

    dragEnd() {
        if (!this.isDragging) return;

        this.isDragging = false;
        this.container.classList.remove('grabbing');

        // Calcula a velocidade do movimento
        const endTime = new Date();
        const timeElapsed = endTime - this.startTime;
        const moveDistance = this.currentTranslate - this.prevTranslate;
        const velocity = Math.abs(moveDistance) / timeElapsed;

        // Define o limite de velocidade para considerar como "swipe"
        const swipeThreshold = 0.5;

        if (velocity > swipeThreshold) {
            // Se moveu para a direita
            if (moveDistance > 0) {
                this.navigate(-1);
            }
            // Se moveu para a esquerda
            else if (moveDistance < 0) {
                this.navigate(1);
            }
        } else {
            // Se o movimento foi menor que 50% do slide, volta para a posição original
            const movePercent = Math.abs(this.currentTranslate % 100);
            if (movePercent < 50) {
                this.goToPage(Math.floor(Math.abs(this.currentTranslate) / 100));
            } else {
                this.goToPage(Math.ceil(Math.abs(this.currentTranslate) / 100));
            }
        }

        this.prevTranslate = this.currentTranslate;
    }

    setupResizeHandler() {
        window.addEventListener('resize', () => {
            const newCardsPerPage = window.innerWidth <= 768 ? 1 : 2;
            if (newCardsPerPage !== this.cardsPerPage) {
                this.cardsPerPage = newCardsPerPage;
                this.totalPages = Math.ceil(this.cards.length / this.cardsPerPage);
                this.currentPage = Math.min(this.currentPage, this.totalPages - 1);
                this.setupDots();
                this.updateSlides();
            }
        });
    }

    navigate(direction) {
        let newPage = this.currentPage + direction;

        // Handle looping
        if (newPage >= this.totalPages) {
            newPage = 0; // Loop to the beginning
        } else if (newPage < 0) {
            newPage = this.totalPages - 1; // Loop to the end
        }

        this.currentPage = newPage;
        this.updateSlides();
    }

    goToPage(index) {
        if (index >= 0 && index < this.totalPages) {
            this.currentPage = index;
            this.updateSlides();
        }
    }

    updateSlides() {
        const offset = this.currentPage * -(100 / this.cardsPerPage) * this.cardsPerPage;
        this.container.style.transform = `translateX(${offset}%)`;
        this.currentTranslate = offset;
        this.prevTranslate = offset;

        // Update dots
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentPage);
        });
    }
}

// Initialize the carousel when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ProjectCarousel();
});