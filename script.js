document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const titleScreen = document.getElementById('title-screen');
    const startBtn = document.getElementById('start-btn');
    const slideshowContainer = document.getElementById('slideshow-container');
    const controls = document.getElementById('controls');
    const bgmElement = document.getElementById('bgm');
    const prevBtn = document.getElementById('prev-btn');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const nextBtn = document.getElementById('next-btn');
    const muteBtn = document.getElementById('mute-btn');
    const volumeSlider = document.getElementById('volume-slider');
    const particleContainer = document.getElementById('particle-container');
    const closeBtn = document.getElementById('close-btn');
    const whiteoutDiv = document.getElementById('whiteout');
    const titleImage = document.getElementById('title-image');

    const paneA = document.getElementById('pane-a');
    const paneB = document.getElementById('pane-b');
    const fgImageA = document.getElementById('fg-image-a');
    const fgImageB = document.getElementById('fg-image-b');

    // --- Data ---
    let imagePlaylist = [];
    let currentImageIndex = 0;
    const bgmPlaylist = ["assets/bgm/0000.mp3"];

    // --- Slideshow Settings ---
    const transitionDuration = 1500;
    const displayDuration = 5000;
    const finalImageDuration = 4000;

    const mainAnimations = [
        { name: 'fade', in: 'animate-fade-in', out: 'animate-fade-out' },
        { name: 'zoom', in: 'animate-zoom-in', out: 'animate-zoom-out' },
        { name: 'blur', in: 'animate-blur-in', out: 'animate-blur-out' },
        { name: 'iris', in: 'animate-iris-in', out: 'animate-fade-out' }
    ];

    // --- Particle Effect Settings ---
    let particleInterval = null;
    const particleThemes = [
        { name: 'Heart Float', interval: 350, emoji: ['🩷', '🩵', '💜', '💙', '💚', '💛', '🧡'], generator: (emoji) => { const p = document.createElement('span'); p.className = 'particle'; p.textContent = emoji; p.style.left = `${Math.random() * 100}vw`; p.style.top = `${Math.random() * 100}vh`; p.style.fontSize = `${32 + Math.random() * 32}px`; p.style.animation = `radialOut ${1.8 + Math.random() * 1.2}s ease-out forwards`; return p; } },
        { name: 'Circle Pop', interval: 350, emoji: ['🔴', '🟠', '🟡', '🟢', '🔵', '🟣'], generator: (emoji) => { const p = document.createElement('span'); p.className = 'particle'; p.textContent = emoji; p.style.left = `${Math.random() * 100}vw`; p.style.top = `${Math.random() * 100}vh`; p.style.fontSize = `${15 + Math.random() * 20}px`; p.style.animation = `pop ${1.0 + Math.random() * 1.5}s ease-in-out forwards`; return p; } },
        { name: 'Square Pop', interval: 350, emoji: ['🟥', '🟧', '🟨', '🟩', '🟦', '🟪'], generator: (emoji) => { const p = document.createElement('span'); p.className = 'particle'; p.textContent = emoji; p.style.left = `${Math.random() * 100}vw`; p.style.top = `${Math.random() * 100}vh`; p.style.fontSize = `${15 + Math.random() * 20}px`; p.style.animation = `pop ${1.0 + Math.random() * 1.5}s ease-in-out forwards`; return p; } },
        { name: 'Celebration Float', interval: 400, emoji: ['🎈', '🌈', '✨', '🍭', '🌸', '🧭', '🏫', '🫧'], generator: (emoji) => { const p = document.createElement('span'); p.className = 'particle'; p.textContent = emoji; p.style.left = `${Math.random() * 100}vw`; p.style.top = `${Math.random() * 100}vh`; p.style.fontSize = `${30 + Math.random() * 25}px`; p.style.animation = `floatUp ${6 + Math.random() * 6}s linear forwards`; return p; } },
        { name: 'Space Drift', interval: 250, emoji: ['🚀', '⭐', '🪐', '🛸', '🌍', '🌙', '🌟', '☀️'], generator: (emoji) => { const p = document.createElement('span'); p.className = 'particle'; p.textContent = emoji; p.style.top = `${Math.random() * 100}vh`; p.style.left = `${Math.random() * 100}vw`; p.style.fontSize = `${20 + Math.random() * 25}px`; p.style.animation = `driftInSpace ${15 + Math.random() * 10}s linear forwards`; return p; } },
        { name: 'Twinkle', interval: 150, emoji: ['⭐', '✨'], generator: (emoji) => { const p = document.createElement('span'); p.className = 'particle'; p.textContent = emoji; p.style.left = `${Math.random() * 100}vw`; p.style.top = `${Math.random() * 100}vh`; p.style.fontSize = `${32 + Math.random() * 32}px`; p.style.animation = `twinkle ${1.0 + Math.random() * 1.0}s ease-in-out forwards`; return p; } }
    ];

    // --- State Variables ---
    let isPlaying = false;
    let slideshowTimeout;
    let isTransitioning = false;
    let activePane = paneA;
    let activeFgImage = fgImageA;

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

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function startParticleEffect() {
        stopParticleEffect();
        if (!particleContainer) return;
        const theme = particleThemes[Math.floor(Math.random() * particleThemes.length)];
        particleInterval = setInterval(() => {
            const emoji = theme.emoji[Math.floor(Math.random() * theme.emoji.length)];
            const particleElement = theme.generator(emoji);
            if (particleElement) {
                particleContainer.appendChild(particleElement);
                particleElement.addEventListener('animationend', () => particleElement.remove(), { once: true });
            }
        }, theme.interval);
    }

    function stopParticleEffect() {
        clearInterval(particleInterval);
        if(particleContainer) particleContainer.innerHTML = '';
    }

    function showNextSlide() {
        if (isTransitioning || !isPlaying) return;

        currentImageIndex++;

        if (currentImageIndex >= imagePlaylist.length) {
            // This should not happen as the last image is handled separately
            endSlideshow(true); // Force immediate end
            return;
        }

        isTransitioning = true;

        const incomingPane = (activePane === paneA) ? paneB : paneA;
        const outgoingPane = activePane;
        const incomingFgImage = (activeFgImage === fgImageA) ? fgImageB : fgImageA;
        const outgoingFgImage = activeFgImage;

        incomingFgImage.src = imagePlaylist[currentImageIndex];

        incomingPane.classList.add('active');
        outgoingPane.classList.remove('active');
        startParticleEffect();

        const animation = mainAnimations[Math.floor(Math.random() * mainAnimations.length)];
        outgoingFgImage.className = 'slide-fg-image';
        incomingFgImage.className = 'slide-fg-image';
        void outgoingFgImage.offsetWidth;
        void incomingFgImage.offsetWidth;
        outgoingFgImage.classList.add(animation.out);
        incomingFgImage.classList.add(animation.in);

        setTimeout(() => {
            activePane = incomingPane;
            activeFgImage = incomingFgImage;
            isTransitioning = false;
            if (isPlaying) {
                const duration = (currentImageIndex === imagePlaylist.length - 1) ? finalImageDuration : displayDuration + transitionDuration;
                slideshowTimeout = setTimeout(showNextSlide, duration);
            }
        }, transitionDuration);

        if (currentImageIndex === imagePlaylist.length - 1) {
            pauseSlideshow(); // Stop automatic transitions
            setTimeout(() => endSlideshow(false), finalImageDuration); // Start end sequence after 4s
        }
    }

    function endSlideshow(immediate = false) {
        pauseSlideshow();
        stopParticleEffect();
        
        const whiteoutDelay = immediate ? 0 : 100;

        setTimeout(() => {
            whiteoutDiv.style.transition = 'opacity 1.5s ease-in-out';
            whiteoutDiv.style.opacity = '1';
            setTimeout(() => {
                slideshowContainer.classList.add('hidden');
                controls.classList.add('hidden');
                titleScreen.classList.remove('hidden');
                titleScreen.style.opacity = '1';
                resetSlideshowState();
            }, 1500); // Wait for whiteout transition
        }, whiteoutDelay);
    }

    function playSlideshow() {
        if (isPlaying) return;
        isPlaying = true;
        playPauseBtn.textContent = '❚❚';
        bgmElement.play().catch(error => console.error("BGM Error:", error));
        clearTimeout(slideshowTimeout);
        showNextSlide();
    }

    function pauseSlideshow() {
        if (!isPlaying) return;
        isPlaying = false;
        playPauseBtn.textContent = '▶';
        bgmElement.pause();
        clearTimeout(slideshowTimeout);
    }

    function togglePlayPause() {
        if (currentImageIndex === imagePlaylist.length - 1) return; // No play/pause on final image
        if (isPlaying) {
            pauseSlideshow();
        } else {
            isPlaying = true;
            playPauseBtn.textContent = '❚❚';
            bgmElement.play().catch(error => console.error("BGM Error:", error));
            slideshowTimeout = setTimeout(showNextSlide, displayDuration);
        }
    }

    function resetSlideshowState() {
        isPlaying = false;
        imagePlaylist = [];
        currentImageIndex = 0;
        bgmElement.currentTime = 0;
        paneA.classList.remove('active');
        paneB.classList.remove('active');
        fgImageA.src = '';
        fgImageB.src = '';
        fgImageA.className = 'slide-fg-image';
        fgImageB.className = 'slide-fg-image';
        activePane = paneA;
        activeFgImage = fgImageA;
        whiteoutDiv.style.transition = 'none';
        whiteoutDiv.style.opacity = '0';
    }

    function applyAudioSettings() {
        const savedVolume = localStorage.getItem('bgmVolume');
        const isMuted = localStorage.getItem('bgmMuted') === 'true';
        let volumeValue = 0.1;
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
        bgmElement.currentTime = 0;
        bgmElement.play();
    });

    nextBtn.addEventListener('click', () => {
        if (currentImageIndex < imagePlaylist.length - 1) {
            clearTimeout(slideshowTimeout);
            showNextSlide();
        }
    });

    prevBtn.addEventListener('click', () => { /* Not implemented */ });
    playPauseBtn.addEventListener('click', togglePlayPause);

    startBtn.addEventListener('click', () => {
        resetSlideshowState();

        const allFixedImages = [...fixedStartImages, fixedEndImage];
        let randomImages = originalImageFiles.filter(img => !allFixedImages.includes(img));
        shuffleArray(randomImages);
        imagePlaylist = [...fixedStartImages, ...randomImages, fixedEndImage];

        currentImageIndex = 0;
        const firstImage = imagePlaylist[currentImageIndex];
        if (!firstImage) return;

        fgImageA.src = firstImage;
        fgImageB.src = '';
        paneA.classList.add('active');
        paneB.classList.remove('active');
        fgImageA.className = 'slide-fg-image animate-fade-in';
        fgImageB.className = 'slide-fg-image';
        
        activePane = paneA;
        activeFgImage = fgImageA;
        isTransitioning = false;

        titleScreen.style.opacity = 0;
        setTimeout(() => {
            titleScreen.classList.add('hidden');
            slideshowContainer.classList.remove('hidden');
            controls.classList.remove('hidden');
            
            isPlaying = true;
            playPauseBtn.textContent = '❚❚';
            bgmElement.play().catch(error => console.error("BGM Error:", error));
            startParticleEffect();

            slideshowTimeout = setTimeout(showNextSlide, displayDuration);
        }, 1000);
    });

    applyAudioSettings();
    bgmElement.src = bgmPlaylist[0];

    if (closeBtn) {
        closeBtn.addEventListener('click', () => window.close());
    }
});

// This should be populated by generate-image-list.js
const originalImageFiles = [];
