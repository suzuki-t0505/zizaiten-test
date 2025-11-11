// セッション0.6.4 - 2025-10-15
// ビューア統合機能（viewer3d.js統合版）
// ESModules対応版

import { state, setViewer3D, getViewer3D } from './state.js';
import { videoDatabase } from './data.js';
import { generateInfoTags, generateVariations } from './ui.js';
import { showNotification } from './capture.js';

// ========================================
// CSS 3D ビューア初期化
// ========================================

export function init3DViewer() {
    const viewer3dSpace = document.getElementById('viewer3dSpace');
    const viewerImagePlane = document.getElementById('viewerImagePlane');
    const jsContent = document.getElementById('jsContent');
    
    // 回転状態
    let rotationX = -20;
    let rotationY = 0;
    
    // ドラッグ状態
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let startRotationX = 0;
    let startRotationY = 0;
    
    // 回転適用
    function applyRotation() {
        viewer3dSpace.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
    }
    
    // 画像更新
    function updateImage(videoId) {
        const pngPath = `img/${videoId}.png`;
        const gifPath = `img/${videoId}.gif`;
        
        viewerImagePlane.innerHTML = '';
        
        // 静止画を先に表示
        const pngImg = document.createElement('img');
        pngImg.src = pngPath;
        pngImg.alt = 'Selected Material';
        
        pngImg.onerror = () => {
            viewerImagePlane.innerHTML = '<div class="viewer-placeholder">画像が見つかりません</div>';
        };
        
        viewerImagePlane.appendChild(pngImg);
        
        // GIFが利用可能なら切り替え
        const gifImg = new Image();
        gifImg.src = gifPath;
        
        gifImg.onload = () => {
            viewerImagePlane.innerHTML = '';
            const gifElement = document.createElement('img');
            gifElement.src = gifPath;
            gifElement.alt = 'Selected Material (Animated)';
            viewerImagePlane.appendChild(gifElement);
        };
    }
    
    // マウスイベント
    jsContent.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        startRotationX = rotationX;
        startRotationY = rotationY;
        jsContent.style.cursor = 'grabbing';
    });
    
    jsContent.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        rotationY = startRotationY + deltaX * 0.5;
        rotationX = startRotationX - deltaY * 0.5;
        rotationX = Math.max(-90, Math.min(90, rotationX));
        
        applyRotation();
    });
    
    jsContent.addEventListener('mouseup', () => {
        isDragging = false;
        jsContent.style.cursor = 'grab';
    });
    
    jsContent.addEventListener('mouseleave', () => {
        isDragging = false;
        jsContent.style.cursor = 'grab';
    });
    
    // タッチイベント
    jsContent.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            isDragging = true;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            startRotationX = rotationX;
            startRotationY = rotationY;
        }
    });
    
    jsContent.addEventListener('touchmove', (e) => {
        if (!isDragging || e.touches.length !== 1) return;
        e.preventDefault();
        
        const deltaX = e.touches[0].clientX - startX;
        const deltaY = e.touches[0].clientY - startY;
        
        rotationY = startRotationY + deltaX * 0.5;
        rotationX = startRotationX - deltaY * 0.5;
        rotationX = Math.max(-90, Math.min(90, rotationX));
        
        applyRotation();
    });
    
    jsContent.addEventListener('touchend', () => {
        isDragging = false;
    });
    
    // 初期設定
    jsContent.style.cursor = 'grab';
    applyRotation();
    
    // グローバル変数に登録
    setViewer3D({ updateImage });
}

// ========================================
// ビデオ選択
// ========================================

export function selectVideo(id, autoScroll = false) {
    state.currentVideo = id;
    const video = videoDatabase[id];
    
    if (!video) return;
    
    if (!state.videoViewCounts[id]) {
        state.videoViewCounts[id] = 0;
    }
    state.videoViewCounts[id]++;
    
    // サムネイル選択状態更新
    document.querySelectorAll('.thumbnail-item').forEach(el => {
        el.classList.remove('selected');
    });
    const selectedThumbnail = document.querySelector(`.thumbnail-item[data-video-id="${id}"]`);
    if (selectedThumbnail) {
        selectedThumbnail.classList.add('selected');
        
        if (autoScroll) {
            setTimeout(() => {
                selectedThumbnail.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'center'
                });
            }, 100);
        }
    }
    
    // タイトル・説明文更新
    const jsContentTitle = document.getElementById('jsContentTitle');
    const titleText = document.getElementById('titleText');
    const descriptionText = document.getElementById('descriptionText');
    
    // jsContentTitleに★マーク付きで表示
    jsContentTitle.textContent = video.title;
    if (state.favoriteVideos.includes(id)) {
        const star = document.createElement('span');
        star.className = 'js-title-star';
        star.textContent = ' ★';
        jsContentTitle.appendChild(star);
    }
    
    titleText.textContent = video.title;
    descriptionText.textContent = video.description;
    
    // 情報パネル更新
    generateInfoTags(id);
    generateVariations(id);
    
    // 3Dビューア画像更新
    if (getViewer3D() && getViewer3D().updateImage) {
        getViewer3D().updateImage(id);
    }
}

// ========================================
// モード切り替え
// ========================================

export function toggleMode() {
    state.currentMode = state.currentMode === 'camera' ? 'lens' : 'camera';
    const modeIndicator = document.getElementById('modeIndicator');
    
    if (state.currentMode === 'camera') {
        modeIndicator.textContent = 'カメラモード';
        showNotification('カメラモードに切り替えました', 'success');
    } else {
        modeIndicator.textContent = 'レンズモード';
        showNotification('レンズモードに切り替えました', 'success');
    }
}
