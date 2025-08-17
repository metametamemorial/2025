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

    // Panes and Foreground Images
    const paneA = document.getElementById('pane-a');
    const paneB = document.getElementById('pane-b');
    const fgImageA = document.getElementById('fg-image-a');
    const fgImageB = document.getElementById('fg-image-b');

    // --- Data ---
    const imageBaseUrl = 'https://raw.githubusercontent.com/metametamemorial2025-tech/2025/main/assets/';
    let imagePlaylist = [];
    let currentImageIndex = 0;

    const bgmPlaylist = [
        "assets/bgm/0000.mp3"
    ];

    // --- Slideshow Settings ---
    const transitionDuration = 1500;
    const displayDuration = 5000;
    const mainAnimations = [
        { name: 'fade', in: 'animate-fade-in', out: 'animate-fade-out' },
        { name: 'zoom', in: 'animate-zoom-in', out: 'animate-zoom-out' },
        { name: 'blur', in: 'animate-blur-in', out: 'animate-blur-out' },
        { name: 'iris', in: 'animate-iris-in', out: 'animate-fade-out' }
    ];

    // --- Particle Effect Settings ---
    let particleInterval = null;
    const particleThemes = [
        { // A: Heart Float
            name: 'Heart Float',
            interval: 350,
            emoji: ['🩷', '🩵', '💜', '💙', '💚', '💛', '🧡'],
            generator: (emoji) => {
                const p = document.createElement('span');
                p.className = 'particle';
                p.textContent = emoji;
                p.style.left = `${Math.random() * 100}vw`;
                p.style.top = `${Math.random() * 100}vh`;
                p.style.fontSize = `${32 + Math.random() * 32}px`;
                p.style.animation = `radialOut ${1.8 + Math.random() * 1.2}s ease-out forwards`;
                return p;
            }
        },
        { // B1: Circle Pop
            name: 'Circle Pop',
            interval: 350,
            emoji: ['🔴', '🟠', '🟡', '🟢', '🔵', '🟣'],
            generator: (emoji) => {
                const p = document.createElement('span');
                p.className = 'particle';
                p.textContent = emoji;
                p.style.left = `${Math.random() * 100}vw`;
                p.style.top = `${Math.random() * 100}vh`;
                p.style.fontSize = `${15 + Math.random() * 20}px`;
                p.style.animation = `pop ${1.0 + Math.random() * 1.5}s ease-in-out forwards`;
                return p;
            }
        },
        { // B2: Square Pop
            name: 'Square Pop',
            interval: 350,
            emoji: ['🟥', '🟧', '🟨', '🟩', '🟦', '🟪'],
            generator: (emoji) => {
                const p = document.createElement('span');
                p.className = 'particle';
                p.textContent = emoji;
                p.style.left = `${Math.random() * 100}vw`;
                p.style.top = `${Math.random() * 100}vh`;
                p.style.fontSize = `${15 + Math.random() * 20}px`;
                p.style.animation = `pop ${1.0 + Math.random() * 1.5}s ease-in-out forwards`;
                return p;
            }
        },
        { // C: Celebration Float
            name: 'Celebration Float',
            interval: 400,
            emoji: ['🎈', '🌈', '✨', '🍭', '🌸', '🧭', '🏫', '🫧'],
            generator: (emoji) => {
                const p = document.createElement('span');
                p.className = 'particle';
                p.textContent = emoji;
                p.style.left = `${Math.random() * 100}vw`;
                p.style.top = `${Math.random() * 100}vh`;
                p.style.fontSize = `${30 + Math.random() * 25}px`;
                p.style.animation = `floatUp ${6 + Math.random() * 6}s linear forwards`;
                return p;
            }
        },
        { // D: Space Drift
            name: 'Space Drift',
            interval: 250,
            emoji: ['🚀', '⭐', '🪐', '🛸', '🌍', '🌙', '🌟', '☀️'],
            generator: (emoji) => {
                const p = document.createElement('span');
                p.className = 'particle';
                p.textContent = emoji;
                p.style.top = `${Math.random() * 100}vh`;
                p.style.left = `${Math.random() * 100}vw`;
                p.style.fontSize = `${20 + Math.random() * 25}px`;
                p.style.animation = `driftInSpace ${15 + Math.random() * 10}s linear forwards`;
                return p;
            }
        },
        { // E: Twinkle
            name: 'Twinkle',
            interval: 150,
            emoji: ['⭐', '✨'],
            generator: (emoji) => {
                const p = document.createElement('span');
                p.className = 'particle';
                p.textContent = emoji;
                p.style.left = `${Math.random() * 100}vw`;
                p.style.top = `${Math.random() * 100}vh`;
                p.style.fontSize = `${32 + Math.random() * 32}px`;
                p.style.animation = `twinkle ${1.0 + Math.random() * 1.0}s ease-in-out forwards`;
                return p;
            }
        }
    ];

    // --- State Variables ---
    let currentBgmIndex = 0;
    let isPlaying = false;
    let slideshowTimeout;
    let isTransitioning = false;
    let activePane = paneA;
    let activeFgImage = fgImageA;

    // --- Core Functions ---

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function getNextImage() {
        if (currentImageIndex >= imagePlaylist.length) {
            currentImageIndex = 0; // Loop back to the beginning
        }
        const imageName = imagePlaylist[currentImageIndex];
        currentImageIndex++;
        return imageBaseUrl + imageName;
    }

    function startParticleEffect() {
        stopParticleEffect();
        // particleContainerが存在しない場合は処理を中断
        if (!particleContainer) {
            console.error("particleContainer not found. Particle effect cannot start.");
            return;
        }
        const theme = particleThemes[Math.floor(Math.random() * particleThemes.length)];

        particleInterval = setInterval(() => {
            const emoji = theme.emoji[Math.floor(Math.random() * theme.emoji.length)];
            const particleElement = theme.generator(emoji);
            // particleElementがnullでないことを確認
            if (particleElement) {
                particleContainer.appendChild(particleElement);
                particleElement.addEventListener('animationend', () => {
                    particleElement.remove();
                }, { once: true });
            } else {
                console.error("Failed to create particleElement.");
            }
        }, theme.interval);
    }

    function stopParticleEffect() {
        clearInterval(particleInterval);
        particleContainer.innerHTML = '';
    }

    function switchImage() {
        if (isTransitioning || !isPlaying) return;
        isTransitioning = true;

        const incomingPane = (activePane === paneA) ? paneB : paneA;
        const outgoingPane = activePane;
        const incomingFgImage = (activeFgImage === fgImageA) ? fgImageB : fgImageA;
        const outgoingFgImage = activeFgImage;

        const nextImageSrc = getNextImage();
        incomingFgImage.src = nextImageSrc;

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
                slideshowTimeout = setTimeout(switchImage, displayDuration + transitionDuration);
            }
        }, transitionDuration);
    }

    function playSlideshow() {
        if (isPlaying) return;
        isPlaying = true;
        playPauseBtn.textContent = '❚❚';
        bgmElement.play().catch(error => console.error("BGM Error:", error));
        clearTimeout(slideshowTimeout);
        slideshowTimeout = setTimeout(switchImage, displayDuration);
    }

    function pauseSlideshow() {
        if (!isPlaying) return;
        isPlaying = false;
        playPauseBtn.textContent = '▶';
        bgmElement.pause();
        clearTimeout(slideshowTimeout);
    }

    function togglePlayPause() {
        if (isPlaying) pauseSlideshow();
        else playSlideshow();
    }

    function endSlideshow() {
        pauseSlideshow();
        stopParticleEffect();

        const whiteout = document.createElement('div');
        whiteout.style.position = 'fixed';
        whiteout.style.top = '0';
        whiteout.style.left = '0';
        whiteout.style.width = '100vw';
        whiteout.style.height = '100vh';
        whiteout.style.backgroundColor = 'white';
        whiteout.style.opacity = '0';
        whiteout.style.zIndex = '10000';
        whiteout.style.transition = 'opacity 1.5s ease-in';
        document.body.appendChild(whiteout);

        setTimeout(() => {
            whiteout.style.opacity = '1';
        }, 100);

        setTimeout(() => {
            slideshowContainer.classList.add('hidden');
            controls.classList.add('hidden');
            titleScreen.classList.remove('hidden');
            titleScreen.style.opacity = '1';
            document.body.removeChild(whiteout);
            resetSlideshowState();
        }, 2000);
    }
    
    function resetSlideshowState() {
        isPlaying = false;
        imagePlaylist = [];
        currentImageIndex = 0;
        currentBgmIndex = 0;
        bgmElement.src = bgmPlaylist[currentBgmIndex];
        
        paneA.classList.remove('active');
        paneB.classList.remove('active');
        fgImageA.className = 'slide-fg-image';
        fgImageB.className = 'slide-fg-image';
        activePane = paneA;
        activeFgImage = fgImageA;
    }

    // --- BGM and Audio Controls ---
    function playNextBgm() {
        currentBgmIndex++;
        if (currentBgmIndex >= bgmPlaylist.length) {
            endSlideshow();
        } else {
            bgmElement.src = bgmPlaylist[currentBgmIndex];
            bgmElement.play().catch(error => console.error("BGM Error:", error));
        }
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

    bgmElement.addEventListener('ended', playNextBgm);
    nextBtn.addEventListener('click', () => {
        clearTimeout(slideshowTimeout);
        switchImage();
    });
    prevBtn.addEventListener('click', () => { /* Previous button functionality might need re-evaluation */ });
    playPauseBtn.addEventListener('click', togglePlayPause);

        startBtn.addEventListener('click', () => {
        // 状態を完全にリセット
        resetSlideshowState();

        // 画像プレイリストを作成
        const startImages = ['0001.jpg', '0002.jpg', '0003.jpg'];
        let middleImages = window.allImages.filter(img => !startImages.includes(img));
        shuffleArray(middleImages);
        imagePlaylist = [...startImages, ...middleImages];

        // 1枚目の画像をセットし、アニメーションを準備
        const firstImage = getNextImage();
        fgImageA.src = firstImage;
        fgImageB.src = ''; // 念のためBは空に
        
        // paneとfgImageの状態を初期化
        paneA.classList.add('active');
        paneB.classList.remove('active');
        fgImageA.className = 'slide-fg-image'; // アニメーションクラスをリセット
        fgImageB.className = 'slide-fg-image';
        
        // 1枚目をフェードインさせる
        fgImageA.classList.add('animate-fade-in');

        activePane = paneA;
        activeFgImage = fgImageA;
        isTransitioning = false; // トランジション中でないことを明示

        // タイトル画面を非表示に
        titleScreen.style.opacity = 0;
        setTimeout(() => {
            titleScreen.classList.add('hidden');
            slideshowContainer.classList.remove('hidden');
            controls.classList.remove('hidden');

            // スライドショーを開始
            isPlaying = true;
            playPauseBtn.textContent = '❚❚';
            bgmElement.play().catch(error => console.error("BGM Error:", error));
            startParticleEffect();

            // タイマーをクリアし、次の画像への切り替えを予約
            clearTimeout(slideshowTimeout);
            slideshowTimeout = setTimeout(switchImage, displayDuration);
        }, 1000); // タイトル画面のフェードアウトを待つ
    });

    // Initial setup on page load
    applyAudioSettings();
    bgmElement.src = bgmPlaylist[currentBgmIndex];

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            window.close();
        });
    }
});
