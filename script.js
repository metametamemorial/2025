document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const titleScreen = document.getElementById('title-screen');
    const startBtn = document.getElementById('start-btn');
    const slideshowContainer = document.getElementById('slideshow-container');
    const uiContainer = document.getElementById('ui-container');
    const bgmElement = document.getElementById('bgm');
    const prevBtn = document.getElementById('prev-btn');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const nextBtn = document.getElementById('next-btn');
    const homeBtn = document.getElementById('home-btn');
    const muteBtn = document.getElementById('mute-btn');
    const volumeSlider = document.getElementById('volume-slider');
    const particleContainer = document.getElementById('particle-container');
    const closeBtn = document.getElementById('close-btn');
    const whiteoutDiv = document.getElementById('whiteout');
    const imageInfoDiv = document.getElementById('image-info');

    const paneA = document.getElementById('pane-a');
    const paneB = document.getElementById('pane-b');
    const fgImageA = document.getElementById('fg-image-a');
    const fgImageB = document.getElementById('fg-image-b');

    // --- Data ---
    let imagePlaylist = [];
    let randomImagePool = [];
    let currentImageIndex = 0;
    const bgmPlaylist = ["assets/bgm/0000.mp3"];

    // --- Slideshow Settings ---
    const transitionDuration = 1500;
    const slideDuration = 2000;
    const finalImageDuration = 4000;

    const mainAnimations = [
        { name: 'fade', in: 'animate-fade-in', out: 'animate-fade-out' },
        { name: 'zoom', in: 'animate-zoom-in', out: 'animate-zoom-out' },
    ];

    // --- State Variables ---
    let isPlaying = false;
    let slideshowTimeout;
    let isTransitioning = false;
    let activePane = paneA;
    let activeFgImage = fgImageA;
    let isBgmFinished = false;

    // --- Fixed Image Lists ---
    const fixedStartImages = [
        'assets/image/a/zundaZunda1030_2025-08-16_121912_1956556321895117113_01.jpg',
        'assets/image/a/zundaZunda1030_2025-08-16_121912_1956556321895117113_02.jpg',
        'assets/image/a/keroke___ro_2025-08-17_003806_1957104656624071026_03.jpg',
        'assets/image/a/cluster_jp_2025-08-18_133009_1957298949242659213_01.jpg',
        'assets/image/a/6pongimetaRADIO_2025-08-18_180001_1957366863882535243_01.jpg',
        'assets/image/a/6pongimetaRADIO_2025-06-30_210053_1939655378247237936_01.jpg',
        'assets/image/a/6pongimetaRADIO_2025-06-30_210053_1939655378247237936_02.jpg',
        'assets/image/a/kogetogame_2025-07-18_193417_1946156565687570653_01.jpg',
        'assets/image/a/sakuraba_hug_2025-07-22_002044_1947678204933853341_01.jpg'
    ];
    const fixedEndImage = 'assets/image/a/satoshikisaragi_2025-08-17_123811_1956923484199883172_01.jpg';

    // --- Core Functions ---

    function parseImageInfo(imagePath) {
        const filename = imagePath.split('/').pop();
        const parts = filename.split('_');
        if (parts.length < 3) return null;

        let account = parts[0];
        if (filename.startsWith('__')) account = `__${parts[2]}`;
        else if (filename.startsWith('_')) account = `_${parts[1]}`;

        const datePart = parts.find(p => p.match(/^\d{4}-\d{2}-\d{2}$/));
        return datePart ? { account, date: datePart } : null;
    }

    function updateImageInfo(imagePath) {
        const info = parseImageInfo(imagePath);
        if (info) {
            const accountUrl = `https://x.com/${info.account.replace(/^_+/, '')}`;
            imageInfoDiv.innerHTML = `<a href="${accountUrl}" target="_blank">@${info.account}</a><br>${info.date}`;
            imageInfoDiv.style.opacity = '1';
        } else {
            imageInfoDiv.style.opacity = '0';
        }
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function showSlide(newIndex) {
        if (isTransitioning) return;
        isTransitioning = true;
        currentImageIndex = newIndex;
        const currentImage = imagePlaylist[currentImageIndex];

        const incomingPane = (activePane === paneA) ? paneB : paneA;
        const incomingFgImage = (activeFgImage === fgImageA) ? fgImageB : fgImageA;

        incomingFgImage.src = currentImage;
        updateImageInfo(currentImage);

        incomingPane.classList.add('active');
        activePane.classList.remove('active');
        
        const animation = mainAnimations[Math.floor(Math.random() * mainAnimations.length)];
        activeFgImage.className = 'slide-fg-image';
        incomingFgImage.className = 'slide-fg-image';
        void activeFgImage.offsetWidth;
        void incomingFgImage.offsetWidth;
        activeFgImage.classList.add(animation.out);
        incomingFgImage.classList.add(animation.in);

        setTimeout(() => {
            activePane = incomingPane;
            activeFgImage = incomingFgImage;
            isTransitioning = false;
        }, transitionDuration);
    }

    function scheduleNextSlide() {
        clearTimeout(slideshowTimeout);
        if (isBgmFinished || !isPlaying) return;
        slideshowTimeout = setTimeout(() => {
            let nextIndex = currentImageIndex + 1;
            if (nextIndex >= imagePlaylist.length) {
                nextIndex = fixedStartImages.length;
            }
            showSlide(nextIndex);
            scheduleNextSlide(); 
        }, slideDuration);
    }

    function finishSlideshow() {
        isBgmFinished = true;
        clearTimeout(slideshowTimeout);
        pauseSlideshow();

        const finalPlaylist = [...imagePlaylist, fixedEndImage];
        showSlide(finalPlaylist.length - 1);
        imagePlaylist = finalPlaylist;

        setTimeout(() => {
            whiteoutDiv.style.transition = 'opacity 1.5s ease-in-out';
            whiteoutDiv.style.opacity = '1';
            setTimeout(() => {
                slideshowContainer.classList.add('hidden');
                uiContainer.classList.add('hidden');
                titleScreen.classList.remove('hidden');
                resetSlideshowState();
            }, 1500);
        }, finalImageDuration);
    }

    function playSlideshow() {
        if (isPlaying || isBgmFinished) return;
        isPlaying = true;
        playPauseBtn.textContent = '⏸️';
        bgmElement.play().catch(error => console.error("BGM Error:", error));
        scheduleNextSlide();
    }

    function pauseSlideshow() {
        if (!isPlaying) return;
        isPlaying = false;
        playPauseBtn.textContent = '▶️';
        bgmElement.pause();
        clearTimeout(slideshowTimeout);
    }

    function togglePlayPause() {
        if (isBgmFinished) return;
        if (isPlaying) pauseSlideshow();
        else playSlideshow();
    }

    function manualChangeSlide(direction) {
        if (isTransitioning || isBgmFinished) return;
        clearTimeout(slideshowTimeout);
        let nextIndex = currentImageIndex + direction;

        if (nextIndex < 0) nextIndex = imagePlaylist.length - 1;
        else if (nextIndex >= imagePlaylist.length) nextIndex = 0;
        
        showSlide(nextIndex);

        if (isPlaying) {
            scheduleNextSlide();
        }
    }

    function resetSlideshowState() {
        isPlaying = false;
        isBgmFinished = false;
        imagePlaylist = [];
        randomImagePool = [];
        currentImageIndex = 0;
        bgmElement.currentTime = 0;
        paneA.classList.remove('active');
        paneB.classList.remove('active');
        fgImageA.src = '';
        fgImageB.src = '';
        activePane = paneA;
        activeFgImage = fgImageA;
        whiteoutDiv.style.transition = 'none';
        whiteoutDiv.style.opacity = '0';
        playPauseBtn.textContent = '▶️';
        imageInfoDiv.style.opacity = '0';
        titleScreen.style.opacity = '1';
    }

    function applyAudioSettings() {
        const savedVolume = localStorage.getItem('bgmVolume');
        const isMuted = localStorage.getItem('bgmMuted') === 'true';
        let volumeValue = 0.5;
        if (savedVolume !== null) volumeValue = parseFloat(savedVolume);
        bgmElement.volume = volumeValue;
        volumeSlider.value = volumeValue;
        bgmElement.muted = isMuted;
        updateMuteButton();
    }

    function updateMuteButton() {
        if (bgmElement.muted || bgmElement.volume === 0) muteBtn.textContent = '🔇';
        else muteBtn.textContent = '🔊';
    }

    // --- Event Listeners & Initialization ---
    muteBtn.addEventListener('click', () => {
        bgmElement.muted = !bgmElement.muted;
        localStorage.setItem('bgmMuted', bgmElement.muted);
        updateMuteButton();
    });

    volumeSlider.addEventListener('input', () => {
        const newVolume = parseFloat(volumeSlider.value);
        bgmElement.volume = newVolume;
        localStorage.setItem('bgmVolume', newVolume.toString());
        if (newVolume > 0 && bgmElement.muted) {
            bgmElement.muted = false;
            localStorage.setItem('bgmMuted', 'false');
        }
        updateMuteButton();
    });

    bgmElement.addEventListener('ended', finishSlideshow);
    nextBtn.addEventListener('click', () => manualChangeSlide(1));
    prevBtn.addEventListener('click', () => manualChangeSlide(-1));
    homeBtn.addEventListener('click', () => finishSlideshow(true));
    playPauseBtn.addEventListener('click', togglePlayPause);

    startBtn.addEventListener('click', () => {
        whiteoutDiv.style.transition = 'opacity 0.5s ease-in-out';
        whiteoutDiv.style.opacity = '1';

        setTimeout(() => {
            resetSlideshowState();

            const allFixedImages = [...fixedStartImages, fixedEndImage];
            randomImagePool = originalImageFiles.filter(img => !allFixedImages.includes(img));
            shuffleArray(randomImagePool);
            imagePlaylist = [...fixedStartImages, ...randomImagePool];

            currentImageIndex = 0;
            const firstImage = imagePlaylist[currentImageIndex];
            if (!firstImage) return;

            fgImageA.src = firstImage;
            updateImageInfo(firstImage);
            fgImageB.src = '';
            paneA.classList.add('active');
            paneB.classList.remove('active');
            fgImageA.className = 'slide-fg-image animate-fade-in';
            fgImageB.className = 'slide-fg-image';
            
            activePane = fgImageA;
            activeFgImage = fgImageA;
            isTransitioning = false;

            titleScreen.classList.add('hidden');
            slideshowContainer.classList.remove('hidden');
            uiContainer.classList.remove('hidden');
            
            playSlideshow();

            setTimeout(() => {
                whiteoutDiv.style.opacity = '0';
            }, 100);

        }, 500);
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => window.close());
    }

    applyAudioSettings();
    bgmElement.src = bgmPlaylist[0];
});