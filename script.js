document.addEventListener('DOMContentLoaded', () => {
    const titleScreen = document.getElementById('title-screen');
    const startBtn = document.getElementById('start-btn');
    const slideshowContainer = document.getElementById('slideshow-container');
    const controls = document.getElementById('controls');

    const imageElement = document.getElementById('slide-image-current'); // 画像要素は1つでOK
    const bgmElement = document.getElementById('bgm');
    const prevBtn = document.getElementById('prev-btn');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const nextBtn = document.getElementById('next-btn');

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
    const bgmFile = "assets/bgm/0000.mp3";

    const animationPairs = [
        { in: 'fade-in', out: 'fade-out' },
        { in: 'zoom-in', out: 'zoom-out' },
        { in: 'slide-in-left', out: 'slide-out-right' },
        { in: 'slide-in-right', out: 'slide-out-left' }
    ];
    const animationDuration = 1500; // 1.5s
    const staticDuration = 4500; // 4.5s

    let currentImageIndex = 0;
    let isPlaying = false;
    let slideshowTimeout;
    let isTransitioning = false; // アニメーション中のフラグ

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function showImage(index, direction = 'next') {
        if (isTransitioning) return;
        isTransitioning = true;

        const randomAnimation = animationPairs[Math.floor(Math.random() * animationPairs.length)];
        const animationInClass = (direction === 'next') ? randomAnimation.in : 'fade-in';   // Prevはシンプルにフェードイン
        const animationOutClass = (direction === 'next') ? randomAnimation.out : 'fade-out'; // Prevはシンプルにフェードアウト

        // 1. 画像切替
        currentImageIndex = index;
        imageElement.src = imageFiles[currentImageIndex];
        // 2. インアニメーション
        imageElement.classList.add(animationInClass);
        imageElement.classList.remove(animationOutClass);

        setTimeout(() => {
            imageElement.classList.remove(animationInClass);
            // 3. 静止表示
            setTimeout(() => {
                // 4. アウトアニメーション
                imageElement.classList.add(animationOutClass);
                setTimeout(() => {
                    imageElement.classList.remove(animationOutClass);
                    isTransitioning = false;
                    // 自動再生中なら次のタイマーをセット
                    if (isPlaying) {
                        nextImage(); // ここで次の画像へ
                    }
                }, animationDuration);
            }, staticDuration);
        }, animationDuration);
    }

    function nextImage() {
        let nextIndex = currentImageIndex + 1;
        if (nextIndex >= imageFiles.length) {
            endSlideshow();
        } else {
            showImage(nextIndex, 'next');
        }
    }

    function prevImage() {
        let prevIndex = (currentImageIndex - 1 + imageFiles.length) % imageFiles.length;
        showImage(prevIndex, 'prev');
    }

    function playSlideshow() {
        if (isPlaying) return;
        isPlaying = true;
        playPauseBtn.textContent = '❚❚';
        bgmElement.play().catch(error => console.error("BGM Error:", error));
        // 最初の画像表示を開始
        showImage(currentImageIndex, 'next');
    }

    function pauseSlideshow() {
        if (!isPlaying) return;
        isPlaying = false;
        playPauseBtn.textContent = '▶';
        bgmElement.pause();
        clearTimeout(slideshowTimeout);
    }

    function togglePlayPause() {
        if (isTransitioning) return; // アニメーション中は操作不可
        if (isPlaying) {
            pauseSlideshow();
        } else {
            playSlideshow();
        }
    }

    function endSlideshow() {
        pauseSlideshow();
        let volume = bgmElement.volume;
        const fadeOutInterval = setInterval(() => {
            if (volume > 0.1) {
                volume -= 0.1;
                bgmElement.volume = volume;
            } else {
                bgmElement.pause();
                bgmElement.volume = 1;
                clearInterval(fadeOutInterval);
            }
        }, 100);

        imageElement.classList.add('fade-out');
        setTimeout(() => {
            slideshowContainer.classList.add('hidden');
            controls.classList.add('hidden');
            titleScreen.classList.remove('hidden');
            titleScreen.style.opacity = 1;
            imageElement.classList.remove('fade-out');
            imageElement.style.opacity = 0; // 初期状態に戻す
            resetSlideshow();
        }, animationDuration);
    }

    function resetSlideshow() {
        currentImageIndex = 0;
        imageFiles = [...originalImageFiles];
        shuffleArray(imageFiles);
    }

    // --- Event Listeners & Initialization ---
    nextBtn.addEventListener('click', () => !isTransitioning && nextImage());
    prevBtn.addEventListener('click', () => !isTransitioning && prevImage());
    playPauseBtn.addEventListener('click', togglePlayPause);

    startBtn.addEventListener('click', () => {
        shuffleArray(imageFiles);
        currentImageIndex = 0;
        imageElement.src = imageFiles[currentImageIndex];

        titleScreen.style.opacity = 0;
        setTimeout(() => {
            titleScreen.classList.add('hidden');
            slideshowContainer.classList.remove('hidden');
            controls.classList.remove('hidden');
            // 最初の画像を表示（アニメーションはplaySlideshowで）
            playSlideshow();
        }, 1000);
    });

    // 初期化
    bgmElement.src = bgmFile;
    imageElement.style.opacity = 0; // 最初は非表示

    // scheduleNextImage関数は不要になったのでコメントアウト
    // function scheduleNextImage() {
    //     clearTimeout(slideshowTimeout);
    //     slideshowTimeout = setTimeout(nextImage, staticDuration);
    // }
});
