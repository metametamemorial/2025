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
    const homeBtn = document.getElementById('home-btn');
    const muteBtn = document.getElementById('mute-btn');
    const volumeSlider = document.getElementById('volume-slider');
    const particleContainer = document.getElementById('particle-container');
    const closeBtn = document.getElementById('close-btn');
    const whiteoutDiv = document.getElementById('whiteout');

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
    const slideDuration = 2000; // 2 seconds for all images except the last
    const finalImageDuration = 4000; // 4 seconds for the last image

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

    function showSlide(newIndex, manual = false) {
        if (isTransitioning) return;
        isTransitioning = true;
        
        currentImageIndex = newIndex;

        const incomingPane = (activePane === paneA) ? paneB : paneA;
        const incomingFgImage = (activeFgImage === fgImageA) ? fgImageB : fgImageA;

        incomingFgImage.src = imagePlaylist[currentImageIndex];

        incomingPane.classList.add('active');
        activePane.classList.remove('active');
        
        const animation = mainAnimations[Math.floor(Math.random() * mainAnimations.length)];
        activeFgImage.className = 'slide-fg-image';
        incomingFgImage.className = 'slide-fg-image';
        void activeFgImage.offsetWidth;
        void incomingFgImage.offsetWidth;
        activeFgImage.classList.add(animation.out);
        incomingFgImage.classList.add(animation.in);

        if (!manual) startParticleEffect();

        setTimeout(() => {
            activePane = incomingPane;
            activeFgImage = incomingFgImage;
            isTransitioning = false;
            if (isPlaying && !manual) {
                scheduleNextSlide();
            }
        }, transitionDuration);
    }

    function scheduleNextSlide() {
        clearTimeout(slideshowTimeout);
        if (isBgmFinished) return;
        slideshowTimeout = setTimeout(() => {
            let nextIndex = currentImageIndex + 1;
            // If we are past the fixed images, loop within the random part
            if (nextIndex >= imagePlaylist.length) {
                nextIndex = fixedStartImages.length;
            }
            showSlide(nextIndex);
        }, slideDuration);
    }

    function finishSlideshow() {
        isBgmFinished = true;
        clearTimeout(slideshowTimeout);
        pauseSlideshow();

        // Show the final image
        showSlide(imagePlaylist.push(fixedEndImage) - 1, true);

        // Wait for the final image duration, then whiteout
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
        }, finalImageDuration);
    }

    function playSlideshow() {
        if (isPlaying) return;
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
        if (isPlaying) {
            pauseSlideshow();
        } else {
            playSlideshow();
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
        fgImageA.className = 'slide-fg-image';
        fgImageB.className = 'slide-fg-image';
        activePane = paneA;
        activeFgImage = fgImageA;
        whiteoutDiv.style.transition = 'none';
        whiteoutDiv.style.opacity = '0';
        playPauseBtn.textContent = '▶️';
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

    bgmElement.addEventListener('ended', finishSlideshow);

    nextBtn.addEventListener('click', () => {
        if (isBgmFinished || isTransitioning) return;
        clearTimeout(slideshowTimeout);
        let nextIndex = currentImageIndex + 1;
        if (nextIndex >= imagePlaylist.length) {
            nextIndex = fixedStartImages.length; // Loop back to random part
        }
        showSlide(nextIndex, true);
    });

    prevBtn.addEventListener('click', () => {
        if (isBgmFinished || isTransitioning || currentImageIndex <= 0) return;
        clearTimeout(slideshowTimeout);
        showSlide(currentImageIndex - 1, true);
    });

    homeBtn.addEventListener('click', () => {
        clearTimeout(slideshowTimeout);
        bgmElement.pause();
        finishSlideshow();
    });

    playPauseBtn.addEventListener('click', togglePlayPause);

    startBtn.addEventListener('click', () => {
        resetSlideshowState();

        const allFixedImages = [...fixedStartImages, fixedEndImage];
        randomImagePool = originalImageFiles.filter(img => !allFixedImages.includes(img));
        shuffleArray(randomImagePool);
        imagePlaylist = [...fixedStartImages, ...randomImagePool];

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
            
            playSlideshow();
            startParticleEffect();
        }, 1000);
    });

    // This might not work in all browsers due to security restrictions.
    if (closeBtn) {
        closeBtn.addEventListener('click', () => window.close());
    }

    // Initial setup
    applyAudioSettings();
    bgmElement.src = bgmPlaylist[0];
});


