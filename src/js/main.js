// セッション0.9.0 - 2025-10-17
// メイン初期化・統合
// 依存: data.js, state.js, ui.js, viewer.js, controls.js, events.js, auth.js, notifications.js, header.js, hamburger.js
// 更新: ハンバーガーメニュー初期化追加

// ========================================
// 初期化実行
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // UI生成
    try {
        generateTags();
        generateThumbnails();
    } catch (e) {
        console.error('UI生成エラー:', e);
    }
    
    // 各機能初期化
    try {
        init3DViewer();
        initPlaybackControls();
        setupEventListeners();
    } catch (e) {
        console.error('機能初期化エラー:', e);
    }
    
    // ヘッダー認証UI・通知システム初期化
    try {
        initHeaderAuthUI();
    } catch (e) {
        console.error('ヘッダー認証UI初期化エラー:', e);
    }
    
    // ハンバーガーメニュー初期化（新規）
    try {
        initHamburgerMenu();
    } catch (e) {
        console.error('ハンバーガーメニュー初期化エラー:', e);
    }
    
    // パネル初期状態設定
    updateListPanel();
    updateInfoPanel();
    
    // フレーム表示初期化
    updateFrameDisplay();
    updateSeekbar();
    
    // ランダムビデオ選択
    const videoIds = Object.keys(videoDatabase);
    if (videoIds.length > 0) {
        const randomIndex = Math.floor(Math.random() * videoIds.length);
        const randomVideoId = videoIds[randomIndex];
        selectVideo(randomVideoId, true);
    }
    
    // ウィンドウリサイズ対応
    window.addEventListener('resize', () => {
        updateListPanel();
        updateInfoPanel();
    });
});
