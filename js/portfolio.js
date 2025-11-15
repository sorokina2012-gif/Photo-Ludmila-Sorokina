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
                preview: 'images/video/preview1.jpg',
                src: 'images/video/video2.mp4',
                title: 'Диффузер'
            },
            {
                type: 'video', 
                preview: 'images/video/preview2.jpg',
                src: 'images/video/video3.mp4',
                title: 'Кольцо на резиновое изделие'
            },
            {
                type: 'video',
                preview: 'images/video/preview3.jpg', 
                src: 'images/video/video4.mov',
                title: 'Лимонная кислота'
            },
            {
                type: 'video',
                preview: 'images/video/preview4.jpg',
                src: 'images/video/video5.mov', 
                title: 'Помельники'
            },
            {
                type: 'video',
                preview: 'images/video/preview5.jpg',
                src: 'images/video/video6.mp4',
                title: 'Шприц кондитерский'
            },
            {
                type: 'video',
                preview: 'images/video/preview6.jpg',
                src: 'images/video/video7.mov',
                title: 'Щетка малая'
            }
        ]
    };

    // Создаем модальные окна
    const videoModal = document.createElement('div');
    videoModal.className = 'video-modal';
    videoModal.innerHTML = `
        <div class="video-modal-content">
            <button class="video-modal-close">&times;</button>
            <video controls></video>
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

    function createGallery(category) {
        gallery.innerHTML = '';
        currentCategory = category;
        const items = portfolioData[category];
        
        if (!items || items.length === 0) {
            gallery.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">Загружаем работы...</p>';
            return;
        }

        items.forEach((itemData, index) => {
            const item = document.createElement('div');
            item.className = `portfolio-item ${category}`;
            
            const imageDiv = document.createElement('div');
            imageDiv.className = 'portfolio-image';
            
            if (category === 'video') {
                // Видео
                const img = document.createElement('img');
                img.src = itemData.preview;
                img.alt = itemData.title;
                img.loading = 'lazy';
                
                const playIcon = document.createElement('div');
                playIcon.className = 'video-play-icon';
                playIcon.innerHTML = '<i class="fas fa-play"></i>';
                
                const videoTitle = document.createElement('div');
                videoTitle.className = 'video-title';
                videoTitle.textContent = itemData.title;
                
                imageDiv.appendChild(img);
                imageDiv.appendChild(playIcon);
                imageDiv.appendChild(videoTitle);
                
                // Клик по видео - открытие в модальном окне
                item.addEventListener('click', function() {
                    const video = videoModal.querySelector('video');
                    video.src = itemData.src;
                    videoModal.style.display = 'flex';
                    video.play();
                });
                
            } else {
                // Фото
                const img = document.createElement('img');
                img.src = itemData;
                img.alt = `${category} фотография ${index + 1}`;
                img.loading = 'lazy';
                
                // Клик по фото - открытие в модальном окне
                item.addEventListener('click', function() {
                    currentPhotos = portfolioData[category];
                    currentPhotoIndex = index;
                    openPhotoModal();
                });
                
                imageDiv.appendChild(img);
            }
            
            item.appendChild(imageDiv);
            gallery.appendChild(item);
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

    function showNextPhoto() {
        currentPhotoIndex = (currentPhotoIndex + 1) % currentPhotos.length;
        openPhotoModal();
    }

    function showPrevPhoto() {
        currentPhotoIndex = (currentPhotoIndex - 1 + currentPhotos.length) % currentPhotos.length;
        openPhotoModal();
    }

    // Закрытие модальных окон
    videoModal.querySelector('.video-modal-close').addEventListener('click', function() {
        videoModal.style.display = 'none';
        const video = videoModal.querySelector('video');
        video.pause();
        video.src = '';
    });

    photoModal.querySelector('.photo-modal-close').addEventListener('click', closePhotoModal);

    // Навигация по фотографиям
    photoModal.querySelector('.photo-modal-next').addEventListener('click', showNextPhoto);
    photoModal.querySelector('.photo-modal-prev').addEventListener('click', showPrevPhoto);

    // Закрытие по клику вне контента
    videoModal.addEventListener('click', function(e) {
        if (e.target === videoModal) {
            videoModal.style.display = 'none';
            const video = videoModal.querySelector('video');
            video.pause();
            video.src = '';
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
            videoModal.style.display = 'none';
            const video = videoModal.querySelector('video');
            video.pause();
            video.src = '';
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
