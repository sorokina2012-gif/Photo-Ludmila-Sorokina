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

    // Создаем модальное окно для видео
    const videoModal = document.createElement('div');
    videoModal.className = 'video-modal';
    videoModal.innerHTML = `
        <div class="video-modal-content">
            <button class="video-modal-close">&times;</button>
            <video controls></video>
        </div>
    `;
    document.body.appendChild(videoModal);

    function createGallery(category) {
        gallery.innerHTML = '';
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
                
                // Клик по фото - открытие в новой вкладке
                item.addEventListener('click', function() {
                    window.open(itemData, '_blank');
                });
                
                imageDiv.appendChild(img);
            }
            
            item.appendChild(imageDiv);
            gallery.appendChild(item);
        });
    }

    // Закрытие модального окна
    videoModal.querySelector('.video-modal-close').addEventListener('click', function() {
        videoModal.style.display = 'none';
        const video = videoModal.querySelector('video');
        video.pause();
        video.src = '';
    });

    // Закрытие по клику вне видео
    videoModal.addEventListener('click', function(e) {
        if (e.target === videoModal) {
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
