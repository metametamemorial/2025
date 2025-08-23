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
    const bgmPlaylist = [
        "assets/bgm/Hopeful_World.mp3",
        "assets/bgm/夏が呼んでいる.mp3",
        "assets/bgm/明日への旅路.mp3"
    ];
    let currentBgmIndex = 0;

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

    // --- Particle Themes ---
    const particleThemes = [
        {
            name: 'Heart Float',
            emojis: ['🩷', '🩵', '💜', '💙', '💚', '💛', '🧡'],
            animation: 'scale-and-float-up',
            count: 25
        },
        {
            name: 'Circle Pop',
            emojis: ['🔴', '🟠', '🟡', '🟢', '🔵', '🟣'],
            animation: 'pop',
            count: 20
        },
        {
            name: 'Square Pop',
            emojis: ['🟥', '🟧', '🟨', '🟩', '🟦', '🟪'],
            animation: 'pop-rotate',
            count: 20
        },
        {
            name: 'Celebration Float',
            emojis: ['🎈', '🌈', '🍭', '🌸', '🧭', '🏫', '🫧'],
            animation: 'floatUp',
            count: 25
        },
        {
            name: 'Space Drift',
            emojis: ['🚀', '⭐', '🪐', '🛸', '🌍', '🌙', '🌟', '☀️'],
            animation: 'drift',
            count: 15
        },
        {
            name: 'Twinkle',
            emojis: ['⭐', '✨'],
            animation: 'twinkle',
            count: 40
        }
    ];

    // --- Core Functions ---

    function parseImageInfo(imagePath) {
        const filename = imagePath.split('/').pop();
        const match = filename.match(/(.*?)_(\d{4}-\d{2}-\d{2})_/);
        return (match && match[1] && match[2]) ? { account: match[1], date: match[2] } : null;
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

    function playParticleTheme() {
        if (!particleContainer) return;
        particleContainer.innerHTML = ''; // Clear previous particles

        const theme = particleThemes[Math.floor(Math.random() * particleThemes.length)];
        const initialVisibilityThemes = ['Heart Float', 'Celebration Float', 'Space Drift'];

        for (let i = 0; i < theme.count; i++) {
            const p = document.createElement('span');
            p.className = 'particle';
            p.textContent = theme.emojis[Math.floor(Math.random() * theme.emojis.length)];

            let duration, delay;

            p.style.left = `${Math.random() * 100}vw`;
            p.style.top = `${Math.random() * 100}vh`;

            if (initialVisibilityThemes.includes(theme.name)) {
                p.style.opacity = 1;
            }

            if (theme.name === 'Heart Float') {
                duration = 6 + Math.random() * 5;
                delay = 0; // No delay
            } else if (theme.name === 'Celebration Float') {
                duration = 8 + Math.random() * 7;
                delay = 0; // No delay
                p.style.setProperty('--r-start', `${(Math.random() - 0.5) * 90}deg`);
                p.style.setProperty('--r-end', `${(Math.random() - 0.5) * 720}deg`);
            } else if (theme.name === 'Space Drift') {
                duration = 12 + Math.random() * 8;
                delay = 0; // No delay
                p.style.setProperty('--drift-y-start', `${(Math.random() - 0.5) * 20}vh`);
                p.style.setProperty('--drift-y-end', `${(Math.random() - 0.5) * 20}vh`);
            } else {
                duration = 1.5 + Math.random() * 2;
                delay = Math.random() * 1.5;
            }

            p.style.fontSize = `${18 + Math.random() * 24}px`;
            p.style.animation = `${theme.animation} ${duration}s linear ${delay}s forwards`;

            particleContainer.appendChild(p);
            p.addEventListener('animationend', () => p.remove(), { once: true });
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
        playParticleTheme(); // Play new particles with the new slide

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
            if (isPlaying) {
                scheduleNextSlide();
            }
        }, transitionDuration);
    }

    function scheduleNextSlide() {
        clearTimeout(slideshowTimeout);
        if (isBgmFinished) return;
        slideshowTimeout = setTimeout(() => {
            let nextIndex = currentImageIndex + 1;
            if (nextIndex >= imagePlaylist.length) {
                nextIndex = fixedStartImages.length;
            }
            showSlide(nextIndex);
        }, slideDuration);
    }

    function finishSlideshow(isManual = false) {
        isBgmFinished = true;
        clearTimeout(slideshowTimeout);
        pauseSlideshow();
        if (particleContainer) particleContainer.innerHTML = '';

        const performWhiteout = () => {
            whiteoutDiv.style.transition = 'opacity 1.5s ease-in-out';
            whiteoutDiv.style.opacity = '1';
            setTimeout(() => {
                slideshowContainer.classList.add('hidden');
                uiContainer.classList.add('hidden');
                titleScreen.classList.remove('hidden');
                resetSlideshowState();
            }, 1500);
        };

        if (isManual) {
            whiteoutDiv.style.transition = 'opacity 0.5s ease-in-out';
            whiteoutDiv.style.opacity = '1';
            setTimeout(() => {
                 slideshowContainer.classList.add('hidden');
                 uiContainer.classList.add('hidden');
                 titleScreen.classList.remove('hidden');
                 resetSlideshowState();
            }, 500);
        } else {
            performWhiteout();
        }
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

        if (nextIndex < 0) {
            nextIndex = imagePlaylist.length - 1;
        } else if (nextIndex >= imagePlaylist.length) {
            nextIndex = 0;
        }
        
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
        if (particleContainer) particleContainer.innerHTML = '';
        currentBgmIndex = 0;
        bgmElement.src = bgmPlaylist[currentBgmIndex];
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

    bgmElement.addEventListener('ended', () => {
        currentBgmIndex++;
        if (currentBgmIndex < bgmPlaylist.length) {
            bgmElement.src = bgmPlaylist[currentBgmIndex];
            bgmElement.play().catch(error => console.error("BGM Error:", error));
        } else {
            finishSlideshow();
        }
    });
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
            // Filter out MASA__mushi_ images and fixed images
            randomImagePool = originalImageFiles.filter(img => 
                !img.includes('MASA__mushi_') && !allFixedImages.includes(img)
            );
            shuffleArray(randomImagePool);
            imagePlaylist = [...fixedStartImages, ...randomImagePool];

            currentImageIndex = 0;
            const firstImage = imagePlaylist[currentImageIndex];
            if (!firstImage) return;

            fgImageA.src = firstImage;
            updateImageInfo(firstImage);
            playParticleTheme(); // Play particles for the first slide

            fgImageB.src = '';
            paneA.classList.add('active');
            paneB.classList.remove('active');
            fgImageA.className = 'slide-fg-image animate-fade-in';
            fgImageB.className = 'slide-fg-image';
            
            activePane = paneA;
            activeFgImage = fgImageA;
            isTransitioning = false;

            titleScreen.classList.add('hidden');
            slideshowContainer.classList.remove('hidden');
            uiContainer.classList.remove('hidden');
            
            bgmElement.src = bgmPlaylist[0];
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