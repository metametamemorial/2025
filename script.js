document.addEventListener('DOMContentLoaded', () => {
    const titleScreen = document.getElementById('title-screen');
    const startBtn = document.getElementById('start-btn');
    const slideshowContainer = document.getElementById('slideshow-container');
    const controls = document.getElementById('controls');

    const imageElement = document.getElementById('slide-image');
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
    let imageFiles = [...originalImageFiles]; // シャッフル用
    const bgmFile = "assets/bgm/0000.mp3";

    const animationClasses = ['fade-in-out', 'slide-left', 'slide-right', 'zoom-in', 'rotate-in'];
    const animationDuration = 1500; // CSSアニメーションのdurationと合わせる (ms)

    let currentImageIndex = 0;
    let isPlaying = false;
    let slideshowInterval;

    // 配列をシャッフルする関数 (Fisher-Yatesアルゴリズム)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function showImage(index) {
        // 現在のアニメーションクラスをすべて削除
        imageElement.className = '';

        // 新しい画像を設定
        imageElement.src = imageFiles[index];

        // ランダムなアニメーションクラスを適用
        const randomAnimation = animationClasses[Math.floor(Math.random() * animationClasses.length)];
        imageElement.classList.add(randomAnimation);

        // アニメーション終了後にクラスを削除
        imageElement.addEventListener('animationend', function handler() {
            imageElement.classList.remove(randomAnimation);
            imageElement.removeEventListener('animationend', handler);
        });
    }

    function nextImage() {
        currentImageIndex++;
        if (currentImageIndex >= imageFiles.length) {
            endSlideshow(); // 一巡したら終了処理
        } else {
            showImage(currentImageIndex);
        }
    }

    function prevImage() {
        currentImageIndex = (currentImageIndex - 1 + imageFiles.length) % imageFiles.length;
        showImage(currentImageIndex);
    }

    function playSlideshow() {
        isPlaying = true;
        playPauseBtn.textContent = '❚❚';
        bgmElement.play().catch(error => {
            console.error("BGMの再生に失敗しました:", error);
            // ユーザーに再生ボタンを押してもらうなどの代替手段を促すメッセージを表示することも可能
            // 例: alert("BGMの再生がブロックされました。手動で再生ボタンを押してください。");
        });
        // アニメーションのduration + 次の画像までの間隔
        slideshowInterval = setInterval(nextImage, animationDuration + 3500); // 1.5秒アニメーション + 3.5秒静止 = 5秒
    }

    function pauseSlideshow() {
        isPlaying = false;
        playPauseBtn.textContent = '▶';
        bgmElement.pause();
        clearInterval(slideshowInterval);
    }

    function togglePlayPause() {
        if (isPlaying) {
            pauseSlideshow();
        } else {
            playSlideshow();
        }
    }

    function endSlideshow() {
        pauseSlideshow(); // スライドショーを停止

        // BGMをフェードアウト
        let volume = bgmElement.volume;
        const fadeOutInterval = setInterval(() => {
            if (volume > 0.1) {
                volume -= 0.1;
                bgmElement.volume = volume;
            } else {
                bgmElement.pause();
                bgmElement.volume = 1; // 次回のために音量をリセット
                clearInterval(fadeOutInterval);
            }
        }, 100);

        // 画像をフェードアウト
        imageElement.style.opacity = 0;
        setTimeout(() => {
            slideshowContainer.classList.add('hidden');
            controls.classList.add('hidden');
            // タイトル画面を再表示
            titleScreen.classList.remove('hidden');
            titleScreen.style.opacity = 1;
            currentImageIndex = 0; // インデックスをリセット
            imageFiles = [...originalImageFiles]; // 画像リストをリセット
            shuffleArray(imageFiles); // 次回のためにシャッフル
        }, animationDuration); // アニメーションの時間と合わせる
    }

    // イベントリスナー
    nextBtn.addEventListener('click', nextImage);
    prevBtn.addEventListener('click', prevImage);
    playPauseBtn.addEventListener('click', togglePlayPause);

    // 初期化
    bgmElement.src = bgmFile;

    // スタートボタンのイベントリスナー
    startBtn.addEventListener('click', () => {
        // 画像リストをシャッフル
        shuffleArray(imageFiles);
        currentImageIndex = 0; // シャッフル後にインデックスをリセット

        // タイトル画面を非表示にする
        titleScreen.style.opacity = 0;
        setTimeout(() => {
            titleScreen.classList.add('hidden');
            // スライドショーとコントロールを表示する
            slideshowContainer.classList.remove('hidden');
            controls.classList.remove('hidden');
            // 最初の画像を表示し、スライドショーを開始する
            showImage(currentImageIndex);
            playSlideshow();
        }, 1000); // フェードアウトの時間と合わせる
    });
});