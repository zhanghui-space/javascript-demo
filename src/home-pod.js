import './style/home-pod.styl';
const images = [
    "https://i.scdn.co/image/ab67616d0000b273a91c10fe9472d9bd89802e5a",
    "https://i.scdn.co/image/ab67616d0000b273ddd26d1997184e42771eecc4",
    "https://cdn-images.dzcdn.net/images/cover/9efccf2fa7ee03e66a84ccf3feafc27b/0x1900-000000-80-0-0.jpg"
];

const gradients = [
    "linear-gradient(49deg, #2b3d47, #a81a0c, #3233af, #ce7209)",
    "linear-gradient(49deg, #8707f6, #23445e, #139037, #3717ff)",
    "linear-gradient(49deg, #edb851, #8a5e2a, #6a3f1d, #d1a94a)",
];

const songTitles = ["Enough for you", "Worst Behavior", "Selfish"];
const artistNames = ["Olivia Rodrigo", "Drake", "Justin Timberlake"];

let currentIndex = 0;

const singerImg = document.querySelector('.singer');
const gradientBackground = document.querySelector('.gradient-background.main');
const overlayGradientBackground = document.querySelector('.gradient-background.overlay');
const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');
const songInfo = document.querySelector('.song-info');
const songTitle = document.querySelector('.song-title');
const artistName = document.querySelector('.artist-name');

function updateContent(index) {
    singerImg.classList.add('fade-out');
    setTimeout(() => {
        singerImg.src = images[index];
        singerImg.classList.remove('fade-out');
        singerImg.classList.add('fade-in');
        setTimeout(() => {
            singerImg.classList.remove('fade-in');
        }, 300);
    }, 300);

    songInfo.classList.add('hide');
    setTimeout(() => {
        songTitle.textContent = songTitles[index];
        artistName.textContent = artistNames[index];
        songInfo.classList.remove('hide');
        songInfo.classList.add('show');
        setTimeout(() => {
            songInfo.classList.remove('show');
        }, 500);
    }, 300);

    gradientBackground.style.background = gradients[index];
    gradientBackground.style.backgroundSize = "240% 240%";
    gradientBackground.style.transition = "background 0.5s ease-in-out, background-size 0.5s ease-in-out";

    overlayGradientBackground.style.background = gradients[index];
    overlayGradientBackground.style.backgroundSize = "240% 240%";
    overlayGradientBackground.style.transition = "background 0.5s ease-in-out, background-size 0.5s ease-in-out";
}

prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateContent(currentIndex);
});

nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % images.length;
    updateContent(currentIndex);
});





const canvas = document.getElementById('texture-canvas');
const ctx = canvas.getContext('2d');

// --- 参数配置 (对应 HomePod 纹理) ---
const CONFIG = {
    count: 180,             // 圆环数量（增加密度）
    circleColor: '#d8d9da', // 圆环颜色
    lineWidth: 0.5,         // 线宽
    opacity: 0.18,          // 透明度
    scale: 0.75             // 整体缩放比例，用于适配屏幕
};

function draw() {
    // 1. 设置画布尺寸
    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    // 2. 确定尺寸逻辑
    // 取屏幕较短边的一半作为基准半径
    const baseSize = Math.min(W, H) * CONFIG.scale; 
    const orbitRadius = baseSize / 2; // 轨道半径 (圆心分布的位置)
    const ringRadius = orbitRadius * 0.14; // 圆环半径

    const centerX = W / 2;
    const centerY = H / 2;

    // 3. 绘制干涉纹理
    ctx.strokeStyle = CONFIG.circleColor;
    ctx.lineWidth = CONFIG.lineWidth;
    ctx.globalAlpha = CONFIG.opacity;
    
    // 关键逻辑：循环 N 次，沿圆周分布圆环
    for (let i = 0; i < CONFIG.count; i++) {
        // 计算当前圆环的圆心位置
        // 角度从 0 到 2PI 均匀分布
        const angle = (i / CONFIG.count) * (Math.PI * 2);

        // 极坐标转换：计算圆心 (x, y)
        const x = centerX + Math.cos(angle) * orbitRadius;
        const y = centerY + Math.sin(angle) * orbitRadius;

        // 绘制圆环
        ctx.beginPath();
        ctx.arc(x, y, ringRadius, 0, Math.PI * 2);
        ctx.stroke();
    }

    // 4. 添加微妙的中心高光
    ctx.globalAlpha = 0.02;
    const radialGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, Math.min(W, H) * 0.3
    );
    radialGradient.addColorStop(0, '#ffffff');
    radialGradient.addColorStop(1, 'transparent');
    ctx.fillStyle = radialGradient;
    ctx.fillRect(0, 0, W, H);

    // 重置全局透明度
    ctx.globalAlpha = 1.0;
}

// 初始化并监听窗口调整
draw();
window.addEventListener('resize', draw);
