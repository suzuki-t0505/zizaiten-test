// セッション0.9.0 - 2025-10-17
// イベント登録機能（リファクタリング完了版）
// 依存: search.js, tags.js, capture.js, panels.js, viewer.js, controls.js, hamburger.js
// 更新: ハンバーガーメニューのクリックイベント追加

// ========================================
// イベントリスナー登録（統合版）
// ========================================

function setupEventListeners() {
    // ========================================
    // タブ操作（完全独立）
    // ========================================
    const infoTab = document.getElementById('infoTab');
    const listTab = document.getElementById('listTab');
    const infoTabMobile = document.getElementById('infoTabMobile');
    const listTabMobile = document.getElementById('listTabMobile');
    
    infoTab.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        state.isInfoVisible = !state.isInfoVisible;
        updateInfoPanel(); // panels.jsの関数
    };
    
    listTab.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        state.isListVisible = !state.isListVisible;
        updateListPanel(); // panels.jsの関数
    };
    
    infoTabMobile.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        state.isInfoVisible = !state.isInfoVisible;
        updateInfoPanel(); // panels.jsの関数
    };
    
    listTabMobile.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        state.isListVisible = !state.isListVisible;
        updateListPanel(); // panels.jsの関数
    };
    
    // ========================================
    // ハンバーガーメニュー（新規）
    // ========================================
    const hamburgerBtn = document.getElementById('hamburger');
    
    hamburgerBtn.onclick = () => {
        toggleHamburgerMenu(); // hamburger.jsの関数
    };
    
    // ========================================
    // その他のUI操作
    // ========================================
    const accordionIcon = document.getElementById('accordionIcon');
    const searchInputToggle = document.getElementById('searchInputToggle');
    const wideToggle = document.getElementById('wideToggle');
    const gridSizeSlider = document.getElementById('gridSizeSlider');
    const jsContent = document.getElementById('jsContent');
    const btnCapture = document.getElementById('btnCapture');
    const captureCountBadge = document.getElementById('captureCountBadge');
    const helpButton = document.getElementById('helpButton');
    
    // キャプチャボタン
    btnCapture.onclick = () => {
        captureToClipboard(); // capture.jsの関数
    };
    
    captureCountBadge.onclick = (e) => {
        e.stopPropagation();
        if (state.captureCount > 0) {
            showCaptureDownloadModal(); // capture.jsの関数
        }
    };
    
    // ヘルプボタン
    helpButton.onclick = () => {
        showHelpPopup(); // help.jsの関数
    };
    
    searchInputToggle.onclick = () => {
        const searchInputContainer = document.getElementById('searchInputContainer');
        searchInputContainer.classList.toggle('expanded');
        
        if (searchInputContainer.classList.contains('expanded')) {
            searchInputToggle.textContent = '▲';
        } else {
            searchInputToggle.textContent = '▼';
        }
    };
    
    accordionIcon.onclick = () => {
        const tagListContainer = document.getElementById('tagListContainer');
        state.isTagExpanded = !state.isTagExpanded;
        
        if (state.isTagExpanded) {
            tagListContainer.classList.add('expanded');
            accordionIcon.classList.add('open');
        } else {
            tagListContainer.classList.remove('expanded');
            accordionIcon.classList.remove('open');
        }
    };
    
    wideToggle.onclick = () => {
        state.isWideMode = !state.isWideMode;
        updateListPanel(); // panels.jsの関数
    };
    
    gridSizeSlider.oninput = (e) => {
        state.thumbnailSize = parseInt(e.target.value);
        document.documentElement.style.setProperty(
            '--thumbnail-size', 
            state.thumbnailSize + 'px'
        );
    };
    
    // ========================================
    // 3Dビューア操作
    // ========================================
    jsContent.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        toggleMode(); // viewer.jsの関数
    });
    
    jsContent.addEventListener('dblclick', (e) => {
        toggleMode(); // viewer.jsの関数
    });
    
    let lastTapTime = 0;
    const DOUBLE_TAP_DELAY = 300;
    
    jsContent.addEventListener('touchend', (e) => {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTapTime;
        
        if (tapLength < DOUBLE_TAP_DELAY && tapLength > 0) {
            e.preventDefault();
            toggleMode(); // viewer.jsの関数
            lastTapTime = 0;
        } else {
            lastTapTime = currentTime;
        }
    });
    
    // ========================================
    // 検索入力設定
    // ========================================
    setupSearchInput(); // search.jsの関数
    
    // ========================================
    // サムネイルエリアのダブルタップピン止め対応
    // ========================================
    const thumbnailGrid = document.getElementById('thumbnailGrid');
    let lastThumbnailTapTime = 0;
    let lastThumbnailTapTarget = null;
    
    thumbnailGrid.addEventListener('touchend', (e) => {
        // サムネイルアイテム自体をタップした場合のみ処理
        const thumbnail = e.target.closest('.thumbnail-item');
        if (!thumbnail) return;
        
        // ★マークをタップした場合は除外
        if (e.target.classList.contains('thumbnail-star')) return;
        
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastThumbnailTapTime;
        
        if (tapLength < DOUBLE_TAP_DELAY && tapLength > 0 && lastThumbnailTapTarget === thumbnail) {
            e.preventDefault();
            e.stopPropagation();
            
            const videoId = thumbnail.getAttribute('data-video-id');
            if (videoId) {
                togglePin(videoId); // ui.jsの関数
            }
            
            lastThumbnailTapTime = 0;
            lastThumbnailTapTarget = null;
        } else {
            lastThumbnailTapTime = currentTime;
            lastThumbnailTapTarget = thumbnail;
        }
    });
}
