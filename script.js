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

    // Panes and their images
    const paneA = document.getElementById('pane-a');
    const paneA_bg = paneA.querySelector('.slide-bg-image');
    const paneA_fg = paneA.querySelector('.slide-fg-image');
    const paneB = document.getElementById('pane-b');
    const paneB_bg = paneB.querySelector('.slide-bg-image');
    const paneB_fg = paneB.querySelector('.slide-fg-image');

    // --- Data ---
    const originalImageFiles = [ // 元の画像リストを保持
        "assets/image/a/0009.jpg", "assets/image/a/0010.jpg", "assets/image/a/0005.PNG",
        "assets/image/a/0004.PNG", "assets/image/a/0003.PNG", "assets/image/a/00002.PNG",
        "assets/image/a/0001.png", "assets/image/a/0011.png", "assets/image/a/0012.png",
        "assets/image/a/0013.png", "assets/image/a/0014.png", "assets/image/a/0015.png",
        "assets/image/a/0016.png", "assets/image/a/0017.png", "assets/image/a/0018.png",
        "assets/image/a/0019.png", "assets/image/a/0020.png", "assets/image/a/0021.png",
        "assets/image/a/0022.png", "assets/image/a/0023.png", "assets/image/a/0024.png",
        "assets/image/a/0025.png", "assets/image/a/0026.png", "assets/image/a/0027.png",
        "assets/image/a/0028.png", "assets/image/a/0029.png", "assets/image/a/0030.png",
        "assets/image/a/0031.png", "assets/image/a/0032.png", "assets/image/a/0033.png",
        "assets/image/a/0034.png", "assets/image/a/0035.png", "assets/image/a/0036.png",
        "assets/image/a/0037.png", "assets/image/a/0038.png", "assets/image/a/0039.png",
        "assets/image/a/0040.png", "assets/image/a/0041.png", "assets/image/a/0042.png",
        "assets/image/a/0043.png", "assets/image/a/0044.png", "assets/image/a/0045.png",
        "assets/image/a/0046.png", "assets/image/a/0047.png", "assets/image/a/0048.png",
        "assets/image/a/0049.png", "assets/image/a/0050.png", "assets/image/a/0051.png",
        "assets/image/a/0052.png", "assets/image/a/0053.png", "assets/image/a/0054.png",
        "assets/image/a/0055.jpg", "assets/image/a/0056.jpg", "assets/image/a/0057.jpg",
        "assets/image/a/0058.jpg", "assets/image/a/0059.png", "assets/image/a/0060.jpg",
        "assets/image/a/0061.jpg", "assets/image/a/0062.jpg", "assets/image/a/0063.jpg",
        "assets/image/a/0064.jpg", "assets/image/a/0065.jpg", "assets/image/a/0066.jpg",
        "assets/image/a/0067.jpg", "assets/image/a/0068.jpg", "assets/image/a/0069.jpg",
        "assets/image/a/0070.jpg", "assets/image/a/0071.jpg", "assets/image/a/0072.jpg",
        "assets/image/a/0073.jpg", "assets/image/a/0074.jpg", "assets/image/a/0075.jpg",
        "assets/image/a/0076.jpg", "assets/image/a/0077.png", "assets/image/a/0078.png",
        "assets/image/a/0079.png", "assets/image/a/0080.png", "assets/image/a/0081.png",
        "assets/image/a/0082.png", "assets/image/a/0083.png", "assets/image/a/0084.png",
        "assets/image/a/0085.png", "assets/image/a/0086.png", "assets/image/a/0087.png",
        "assets/image/a/0088.png", "assets/image/a/0089.png", "assets/image/a/0090.png",
        "assets/image/a/0091.png", "assets/image/a/0092.png", "assets/image/a/0093.png",
        "assets/image/a/0094.png", "assets/image/a/0095.png", "assets/image/a/0096.png",
        "assets/image/a/0097.png", "assets/image/a/0098.png", "assets/image/a/0099.png",
        "assets/image/a/0100.png"
    ];
    let imageFiles = [...originalImageFiles];
    const bgmFiles = [
        "assets/bgm/Hopeful_World.mp3",
        "assets/bgm/明日への旅路.mp3",
        "assets/bgm/夏が呼んでいる.mp3"
    ];

    // --- Slideshow Settings ---
    const transitionDuration = 1500; 
    const displayDuration = 5000;
    const animations = [
        { name: 'fade', in: 'animate-fade-in', out: 'animate-fade-out' },
        { name: 'zoom', in: 'animate-zoom-in', out: 'animate-zoom-out' },
        { name: 'blur', in: 'animate-blur-in', out: 'animate-blur-out' },
        { name: 'iris', in: 'animate-iris-in', out: 'animate-fade-out' } // Iris reveals, fade out old
    ];

    // --- State Variables ---
    let currentImageIndex = 0;
    let currentBgmIndex = 0;
    let isPlaying = false;
    let slideshowInterval;
    let isTransitioning = false;
    let activePane = paneA;

    // --- Core Functions ---

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function switchImage(nextIndex) {
        if (isTransitioning) return;
        isTransitioning = true;

        if (nextIndex >= imageFiles.length) nextIndex = 0;
        if (nextIndex < 0) nextIndex = imageFiles.length - 1;
        currentImageIndex = nextIndex;

        const incomingPane = (activePane === paneA) ? paneB : paneA;
        const outgoingPane = activePane;
        
        // Load new images into incoming pane
        const newImgSrc = imageFiles[currentImageIndex];
        incomingPane.querySelector('.slide-bg-image').src = newImgSrc;
        incomingPane.querySelector('.slide-fg-image').src = newImgSrc;

        const animation = animations[Math.floor(Math.random() * animations.length)];

        // Apply animations
        incomingPane.className = 'slide-pane';
        outgoingPane.className = 'slide-pane';
        void incomingPane.offsetWidth; // Force reflow
        void outgoingPane.offsetWidth;

        incomingPane.classList.add(animation.in);
        outgoingPane.classList.add(animation.out);

        // After transition, clean up
        setTimeout(() => {
            outgoingPane.className = 'slide-pane';
            activePane = incomingPane;
            isTransitioning = false;
        }, transitionDuration);
    }

    function nextImage() { switchImage(currentImageIndex + 1); }
    function prevImage() { switchImage(currentImageIndex - 1); }

    function playSlideshow() {
        if (isPlaying) return;
        isPlaying = true;
        playPauseBtn.textContent = '❚❚';
        bgmElement.play().catch(error => console.error("BGM Error:", error));
        clearInterval(slideshowInterval);
        slideshowInterval = setInterval(nextImage, displayDuration + transitionDuration);
    }

    function pauseSlideshow() {
        if (!isPlaying) return;
        isPlaying = false;
        playPauseBtn.textContent = '▶';
        bgmElement.pause();
        clearInterval(slideshowInterval);
    }

    function togglePlayPause() {
        if (isPlaying) pauseSlideshow();
        else playSlideshow();
    }
    
    function resetSlideshow(shouldShuffle = true) {
        pauseSlideshow();
        currentImageIndex = 0;
        if (shouldShuffle) {
            imageFiles = [...originalImageFiles];
            shuffleArray(imageFiles);
        }
        
        // Reset panes
        paneA.className = 'slide-pane';
        paneB.className = 'slide-pane';
        activePane = paneA;
        const firstImg = imageFiles[0];
        paneA_bg.src = firstImg;
        paneA_fg.src = firstImg;
        paneA.classList.add('animate-fade-in'); // Fade in the first image
        
        currentBgmIndex = 0;
        bgmElement.src = bgmFiles[currentBgmIndex];
    }

    // --- BGM and Audio Controls ---
    function playNextBgm() {
        currentBgmIndex = (currentBgmIndex + 1) % bgmFiles.length;
        bgmElement.src = bgmFiles[currentBgmIndex];
        bgmElement.play().catch(error => console.error("BGM Error:", error));
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
    nextBtn.addEventListener('click', nextImage);
    prevBtn.addEventListener('click', prevImage);
    playPauseBtn.addEventListener('click', togglePlayPause);

    startBtn.addEventListener('click', () => {
        resetSlideshow(true);
        titleScreen.style.opacity = 0;
        setTimeout(() => {
            titleScreen.classList.add('hidden');
            slideshowContainer.classList.remove('hidden');
            controls.classList.remove('hidden');
            playSlideshow();
        }, 1000);
    });

    // Initial setup on page load
    applyAudioSettings();
    bgmElement.src = bgmFiles[currentBgmIndex];
});