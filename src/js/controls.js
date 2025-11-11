// セッション0.6.2 - 2025-10-15
// 再生コントロール機能
// 依存: state.js
// 更新: デバッグログ削除

import { state } from "./state.js";

// ========================================
// フレーム表示・シークバー更新
// ========================================

// フレーム表示更新
export function updateFrameDisplay() {
    const frameDisplay = document.getElementById('frameDisplay');
    frameDisplay.textContent = `${state.currentFrame} / ${state.totalFrames}`;
}

// シークバー更新
export function updateSeekbar() {
    const percentage = ((state.currentFrame - 1) / (state.totalFrames - 1)) * 100;
    document.querySelector('.sequence-bar-progress').style.width = percentage + '%';
    document.querySelector('.sequence-bar-handle').style.left = percentage + '%';
}

// ========================================
// 再生機能
// ========================================

let playbackInterval = null;
const FPS = 24; // 24fps

// 再生コントロール初期化
export function initPlaybackControls() {
    const btnPlay = document.getElementById('btnPlay');
    const btnPrevFrame = document.getElementById('btnPrevFrame');
    const btnNextFrame = document.getElementById('btnNextFrame');
    const sequenceBar = document.getElementById('sequenceBar');
    const sequenceBarContainer = document.getElementById('sequenceBarContainer');
    
    // 再生/一時停止トグル
    btnPlay.onclick = () => {
        state.isPlaying = !state.isPlaying;
        
        if (state.isPlaying) {
            btnPlay.textContent = '⏸';
            playbackInterval = setInterval(() => {
                if (state.currentFrame < state.totalFrames) {
                    state.currentFrame++;
                } else {
                    state.currentFrame = 1;
                }
                updateFrameDisplay();
                updateSeekbar();
            }, 1000 / FPS);
        } else {
            btnPlay.textContent = '▶';
            if (playbackInterval) {
                clearInterval(playbackInterval);
                playbackInterval = null;
            }
        }
    };
    
    // コマ戻し
    btnPrevFrame.onclick = () => {
        if (state.currentFrame > 1) {
            state.currentFrame--;
        } else {
            state.currentFrame = state.totalFrames;
        }
        updateFrameDisplay();
        updateSeekbar();
    };
    
    // コマ送り
    btnNextFrame.onclick = () => {
        if (state.currentFrame < state.totalFrames) {
            state.currentFrame++;
        } else {
            state.currentFrame = 1;
        }
        updateFrameDisplay();
        updateSeekbar();
    };
    
    // シークバークリック
    sequenceBar.onclick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = clickX / rect.width;
        state.currentFrame = Math.max(1, Math.min(state.totalFrames, Math.round(percentage * state.totalFrames)));
        updateFrameDisplay();
        updateSeekbar();
    };
    
    // ========================================
    // シークバードラッグ操作（カメラ操作とのコンフリクト解消）
    // ========================================
    
    let isDraggingSeekbar = false;
    
    // マウスドラッグ対応
    sequenceBar.addEventListener('mousedown', (e) => {
        e.stopPropagation(); // カメラ操作との干渉を防ぐ
        isDraggingSeekbar = true;
        updateSeekbarPosition(e);
    });
    
    document.addEventListener('mousemove', (e) => {
        if (isDraggingSeekbar) {
            e.stopPropagation(); // カメラ操作との干渉を防ぐ
            updateSeekbarPosition(e);
        }
    });
    
    document.addEventListener('mouseup', (e) => {
        if (isDraggingSeekbar) {
            e.stopPropagation(); // カメラ操作との干渉を防ぐ
            isDraggingSeekbar = false;
        }
    });
    
    // タッチドラッグ対応
    sequenceBar.addEventListener('touchstart', (e) => {
        e.stopPropagation(); // カメラ操作との干渉を防ぐ
        isDraggingSeekbar = true;
        if (e.touches.length > 0) {
            updateSeekbarPosition(e.touches[0]);
        }
    });
    
    document.addEventListener('touchmove', (e) => {
        if (isDraggingSeekbar && e.touches.length > 0) {
            e.stopPropagation(); // カメラ操作との干渉を防ぐ
            updateSeekbarPosition(e.touches[0]);
        }
    });
    
    document.addEventListener('touchend', (e) => {
        if (isDraggingSeekbar) {
            e.stopPropagation(); // カメラ操作との干渉を防ぐ
            isDraggingSeekbar = false;
        }
    });
    
    // シークバー位置更新（共通処理）
    function updateSeekbarPosition(event) {
        const rect = sequenceBar.getBoundingClientRect();
        const clientX = event.clientX !== undefined ? event.clientX : event.pageX;
        const clickX = clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, clickX / rect.width));
        state.currentFrame = Math.max(1, Math.min(state.totalFrames, Math.round(percentage * state.totalFrames)));
        updateFrameDisplay();
        updateSeekbar();
    }
    
    // シークバーコンテナ全体でイベント伝播を停止
    sequenceBarContainer.addEventListener('mousedown', (e) => {
        e.stopPropagation();
    });
    
    sequenceBarContainer.addEventListener('touchstart', (e) => {
        e.stopPropagation();
    });
}
