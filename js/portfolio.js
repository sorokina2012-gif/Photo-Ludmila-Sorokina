document.addEventListener('DOMContentLoaded', function() {
    const gallery = document.querySelector('.portfolio-gallery');
    const filterBtns = document.querySelectorAll('.filter-btn');

    // Все фотографии
    const portfolioData = {
        family: Array.from({length: 33}, (_, i) => `images/family/family-${i+1}.jpg`),
        product: Array.from({length: 99}, (_, i) => `images/product/product-${i+1}.jpg`),
        studio: Array.from({length: 25}, (_, i) => `images/studio/studio-${i+1}.jpg`),
        macro: Array.from({length: 18}, (_, i) => `images/macro/macro-${i+1}.jpg`),
        newborn: Array.from({length: 12}, (_, i) => `images/newborn/newborn-${i+1}.jpg`),
        story: Array.from({length: 13}, (_, i) => `images/story/story-${i+1}.jpg`),
        video: [
            {
                type: 'video',
                title: 'Диффузер • Ароматы',
                format: 'MP4',
                src: 'images/video/video2.mp4'
            },
            {
                type: 'video', 
                title: 'Ювелирные изделия • Элегантность',
                format: 'MP4', 
                src: 'images/video/video3.mp4'
            },
            {
                type: 'video',
                title: 'Лимонная кислота • Детали',
                format: 'MOV',
                src: 'images/video/video4.mov'
            },
            {
                type: 'video',
                title: 'Детские товары • Нежность', 
                format: 'MOV',
                src: 'images/video/video5.mov'
            },
            {
                type: 'video',
                title: 'Кондитерские инструменты • Творчество',
                format: 'MP4',
                src: 'images/video/video6.mp4'
            },
            {
                type: 'video',
                title: 'Щетки • Функциональность',
                format: 'MOV', 
                src: 'images/video/video7.mov'
            }
        ]
    };

    // Создаем модальное окно для видео
    const videoModal = document.createElement('div');
    videoModal.className = 'video-modal';
    videoModal.innerHTML = `
        <div class="video-modal-content">
            <button class="video-modal-close">&times;</button>
            <div class="video-player-container">
                <video controls playsinline>
                    Ваш браузер не поддерживает видео
                </video>
                <div class="video-fallback-message" style="display: none;">
                    <p>Видео не загружается. Пожалуйста:</p>
                    <ul>
                        <li>Конвертируйте MOV/AVI в MP4 формат</li>
                        <li>Используйте кодек H.264</li>
                        <li>Убедитесь что размер файла не более 50МБ</li>
                    </ul>
                    <button class="fallback-download-btn">Скачать видео</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(videoModal);

    const photoModal = document.createElement('div');
    photoModal.className = 'photo-modal';
    photoModal.innerHTML = `
        <div class="photo-modal-content">
            <button class="photo-modal-close">&times;</button>
            <div class="photo-modal-nav">
                <button class="photo-modal-prev"><i class="fas fa-chevron-left"></i></button>
                <button class="photo-modal-next"><i class="fas fa-chevron-right"></i></button>
            </div>
            <img src="" alt="">
            <div class="photo-modal-counter"></div>
        </div>
    `;
    document.body.appendChild(photoModal);

    let currentCategory = 'family';
    let currentPhotoIndex = 0;
    let currentPhotos = [];
    let currentVideoItem = null;

    function createGallery(category) {
        gallery.innerHTML = '';
        currentCategory = category;
        const items = portfolioData[category];
        
        if (!items || items.length === 0) {
            gallery.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">Загружаем работы...</p>';
            return;
        }

        if (category === 'video') {
            // Создаем контейнер для видео-кнопок
            const videoContainer = document.createElement('div');
            videoContainer.className = 'video-buttons-container';

            items.forEach((videoItem, index) => {
                const videoButton = document.createElement('div');
                videoButton.className = 'video-button';

                videoButton.innerHTML = `
                    <div class="video-icon">
                        <i class="fas fa-play-circle"></i>
                    </div>
                    <h3 class="video-title">${videoItem.title}</h3>
                    <div class="video-info">
                        <span class="video-format ${videoItem.format.toLowerCase()}">${videoItem.format}</span>
                        <span class="video-format-info">${getFormatInfo(videoItem.format)}</span>
                    </div>
                    <div class="video-button-overlay"></div>
                `;

                // Клик по кнопке видео
                videoButton.addEventListener('click', function() {
                    currentVideoItem = videoItem;
                    openVideoModal(videoItem);
                });

                videoContainer.appendChild(videoButton);
            });

            gallery.appendChild(videoContainer);
            
        } else {
            // Фото
            items.forEach((itemData, index) => {
                const item = document.createElement('div');
                item.className = `portfolio-item ${category}`;
                
                const imageDiv = document.createElement('div');
                imageDiv.className = 'portfolio-image';
                
                const img = document.createElement('img');
                img.src = itemData;
                img.alt = `${category} фотография ${index + 1}`;
                img.loading = 'lazy';
                
                // Обработка ошибок загрузки фото
                img.onerror = function() {
                    this.style.display = 'none';
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'error-placeholder';
                    errorDiv.innerHTML = '<i class="fas fa-image"></i><span>Изображение не найдено</span>';
                    imageDiv.appendChild(errorDiv);
                };
                
                // Клик по фото - открытие в модальном окне
                item.addEventListener('click', function() {
                    currentPhotos = portfolioData[category];
                    currentPhotoIndex = index;
                    openPhotoModal();
                });
                
                imageDiv.appendChild(img);
                item.appendChild(imageDiv);
                gallery.appendChild(item);
            });
        }
    }

    function getFormatInfo(format) {
        if (format === 'MP4') return '✓ Совместим с браузерами';
        if (format === 'MOV') return '⚠ Требует конвертации';
        return '❌ Может не работать';
    }

    function openVideoModal(videoItem) {
        const video = videoModal.querySelector('video');
        const fallbackMessage = videoModal.querySelector('.video-fallback-message');
        const downloadBtn = videoModal.querySelector('.fallback-download-btn');
        
        // Скрываем сообщение об ошибке
        fallbackMessage.style.display = 'none';
        video.style.display = 'block';
        
        // Устанавливаем источник видео
        video.src = videoItem.src;
        videoModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Обработчики событий видео
        video.onloadeddata = function() {
            console.log('✅ Видео загружено:', videoItem.src);
        };
        
        video.onerror = function() {
            console.log('❌ Ошибка видео:', videoItem.src);
            // Показываем сообщение об ошибке
            video.style.display = 'none';
            fallbackMessage.style.display = 'block';
            
            // Настраиваем кнопку скачивания
            downloadBtn.onclick = function() {
                const link = document.createElement('a');
                link.href = videoItem.src;
                link.download = videoItem.title + '.' + videoItem.format.toLowerCase();
                link.click();
            };
        };
        
        // Пытаемся воспроизвести
        video.play().catch(e => {
            console.log('Автовоспроизведение заблокировано, но видео готово');
        });
    }

    function openPhotoModal() {
        const modalImg = photoModal.querySelector('img');
        const modalCounter = photoModal.querySelector('.photo-modal-counter');
        
        modalImg.src = currentPhotos[currentPhotoIndex];
        modalCounter.textContent = `${currentPhotoIndex + 1} / ${currentPhotos.length}`;
        photoModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closePhotoModal() {
        photoModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    function closeVideoModal() {
        videoModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        const video = videoModal.querySelector('video');
        video.pause();
        video.src = '';
    }

    function showNextPhoto() {
        currentPhotoIndex = (currentPhotoIndex + 1) % currentPhotos.length;
        openPhotoModal();
    }

    function showPrevPhoto() {
        currentPhotoIndex = (currentPhotoIndex - 1 + currentPhotos.length) % currentPhotos.length;
        openPhotoModal();
    }

    // Закрытие модальных окон
    videoModal.querySelector('.video-modal-close').addEventListener('click', closeVideoModal);
    photoModal.querySelector('.photo-modal-close').addEventListener('click', closePhotoModal);

    // Навигация по фотографиям
    photoModal.querySelector('.photo-modal-next').addEventListener('click', showNextPhoto);
    photoModal.querySelector('.photo-modal-prev').addEventListener('click', showPrevPhoto);

    // Закрытие по клику вне контента
    videoModal.addEventListener('click', function(e) {
        if (e.target === videoModal) {
            closeVideoModal();
        }
    });

    photoModal.addEventListener('click', function(e) {
        if (e.target === photoModal) {
            closePhotoModal();
        }
    });

    // Навигация клавишами
    document.addEventListener('keydown', function(e) {
        if (photoModal.style.display === 'flex') {
            if (e.key === 'Escape') closePhotoModal();
            if (e.key === 'ArrowRight') showNextPhoto();
            if (e.key === 'ArrowLeft') showPrevPhoto();
        }
        if (videoModal.style.display === 'flex' && e.key === 'Escape') {
            closeVideoModal();
        }
    });

    // Обработчики фильтров
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const category = this.getAttribute('data-filter');
            createGallery(category);
        });
    });

    // Инициализация
    createGallery('family');
});
