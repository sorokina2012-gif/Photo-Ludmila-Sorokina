// main.js - Полный код для JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Плавный скролл для якорных ссылок
    const smoothScroll = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    };

    // Анимация появления элементов при скролле
    const animateOnScroll = () => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Элементы для анимации
        const animatedElements = document.querySelectorAll('.collection-card, .about-container, .stat, .contact-btn');
        
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease';
            observer.observe(el);
        });
    };

    // Фиксированная навигация с изменением прозрачности
    const stickyNavigation = () => {
        const nav = document.querySelector('.main-nav');
        const hero = document.querySelector('.hero-main');
        
        if (nav && hero) {
            window.addEventListener('scroll', () => {
                const heroHeight = hero.offsetHeight;
                const scrolled = window.pageYOffset;
                
                if (scrolled > heroHeight - 100) {
                    nav.style.background = 'rgba(255, 255, 255, 0.98)';
                    nav.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
                } else {
                    nav.style.background = 'rgba(255, 255, 255, 0.95)';
                    nav.style.boxShadow = 'none';
                }
            });
        }
    };

    // Предзагрузка изображений для плавного отображения
    const preloadImages = () => {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            const src = img.getAttribute('src');
            if (src) {
                const image = new Image();
                image.src = src;
            }
        });
    };

    // Обработка кликов по кнопкам контактов
    const contactButtonsHandler = () => {
        const contactButtons = document.querySelectorAll('.contact-btn');
        
        contactButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                // Можно добавить аналитику или дополнительную логику
                console.log('Клик по контакту:', this.textContent.trim());
            });
        });
    };

    // Анимация ховера для карточек коллекций
    const enhanceCardHover = () => {
        const cards = document.querySelectorAll('.collection-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(-5px) scale(1)';
            });
        });
    };

    // Обработчик для мобильного меню (если будет добавлено)
    const mobileMenuHandler = () => {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');
        
        if (mobileMenuBtn && navLinks) {
            mobileMenuBtn.addEventListener('click', function() {
                navLinks.classList.toggle('active');
                this.classList.toggle('active');
            });

            // Закрытие меню при клике на ссылку
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.addEventListener('click', function() {
                    navLinks.classList.remove('active');
                    mobileMenuBtn.classList.remove('active');
                });
            });
        }
    };

    // Оптимизация производительности при скролле
    const optimizeScrollPerformance = () => {
        let ticking = false;
        
        const updateOnScroll = () => {
            // Логика для обновления при скролле
            ticking = false;
        };
        
        window.addEventListener('scroll', function() {
            if (!ticking) {
                requestAnimationFrame(updateOnScroll);
                ticking = true;
            }
        });
    };

    // Инициализация всех функций
    const init = () => {
        smoothScroll();
        animateOnScroll();
        stickyNavigation();
        preloadImages();
        contactButtonsHandler();
        enhanceCardHover();
        mobileMenuHandler();
        optimizeScrollPerformance();
        
        console.log('Сайт Людмилы Сорокиной загружен успешно!');
    };

    // Запуск инициализации
    init();
});

// Дополнительные утилиты
const PortfolioUtils = {
    // Форматирование номера телефона
    formatPhoneNumber: (phone) => {
        return phone.replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, '+$1 ($2) $3-$4-$5');
    },
    
    // Проверка поддержки WebP
    supportsWebP: () => {
        return new Promise((resolve) => {
            const webP = new Image();
            webP.src = 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==';
            webP.onload = webP.onerror = function() {
                resolve(webP.height === 1);
            };
        });
    },
    
    // Ленивая загрузка изображений
    lazyLoadImages: () => {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img.lazy').forEach(img => {
            imageObserver.observe(img);
        });
    }
};

// Обработчики ошибок
window.addEventListener('error', function(e) {
    console.error('Произошла ошибка:', e.error);
});

// Обработчик загрузки страницы
window.addEventListener('load', function() {
    // Добавляем класс загрузки для плавного появления
    document.body.classList.add('loaded');
    
    // Скрываем прелоадер если есть
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 1000);
    }
});

// API для взаимодействия с портфолио (можно расширить)
const PortfolioAPI = {
    // Фильтрация работ
    filterWorks: (category) => {
        // Логика фильтрации для страницы портфолио
        console.log('Фильтрация по категории:', category);
    },
    
    // Загрузка дополнительных работ
    loadMoreWorks: (page) => {
        // Логика подгрузки работ
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true, page: page + 1 });
            }, 500);
        });
    },
    
    // Открытие модального окна с работой
    openWorkModal: (workId) => {
        // Логика открытия модального окна
        console.log('Открытие работы:', workId);
    }
};

// Экспорт для использования в других скриптах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PortfolioUtils, PortfolioAPI };
}
