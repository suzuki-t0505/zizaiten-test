// セッション0.8.3 - 2025-10-17
// ヘルプポップアップ機能
// D&D可能な小型ヘルプウィンドウシステム（オーバーレイなし）

// ========================================
// グローバル変数
// ========================================
let currentHelpPage = 1;
const TOTAL_HELP_PAGES = 7;

// D&D用の変数
let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;

// ========================================
// ヘルプコンテンツデータ（全7ページ）
// ========================================
const helpPages = [
    // ページ1: 基本操作 - カメラモード
    {
        title: "基本操作 - カメラモード",
        sections: [
            {
                title: "カメラを回転させる",
                content: [
                    { pc: "マウス左ドラッグ", sp: "画面をスワイプ" }
                ]
            },
            {
                title: "カメラを平行移動（パン）する",
                content: [
                    { pc: "<kbd>Shift</kbd>＋ドラッグ、または中ボタンドラッグ", sp: "<kbd>S</kbd>ボタン＋スワイプ、または2本指スワイプ" }
                ]
            },
            {
                title: "カメラを近づける・遠ざける",
                content: [
                    { pc: "<kbd>Ctrl</kbd>＋ドラッグ（前後）", sp: "<kbd>C</kbd>ボタン＋スワイプ（前後）、またはピンチ" }
                ]
            },
            {
                title: "レンズモードに切り替え",
                content: [
                    { pc: "右クリック", sp: "プレス＆タップ" }
                ]
            }
        ]
    },
    
    // ページ2: 基本操作 - レンズモード
    {
        title: "基本操作 - レンズモード",
        sections: [
            {
                title: "視点の向きを変える",
                content: [
                    { pc: "マウス左ドラッグ", sp: "画面をスワイプ" }
                ]
            },
            {
                title: "カメラを平行移動（パン）する",
                content: [
                    { pc: "中ボタンドラッグ", sp: "2本指スワイプ" }
                ]
            },
            {
                title: "レンズのズーム倍率（FOV）を変更",
                content: [
                    { pc: "<kbd>Shift</kbd>＋ドラッグ（前後）", sp: "<kbd>S</kbd>ボタン＋スワイプ（前後）、またはピンチ" }
                ]
            },
            {
                title: "ドリーズーム効果を適用",
                content: [
                    { pc: "<kbd>Ctrl</kbd>＋ドラッグ（前後）", sp: "<kbd>C</kbd>ボタン＋スワイプ（前後）、または2本指で前後スワイプ" }
                ]
            },
            {
                title: "カメラモードに戻る",
                content: [
                    { pc: "右クリック", sp: "プレス＆タップ" }
                ]
            }
        ]
    },
    
    // ページ3: 視点の初期化
    {
        title: "視点の初期化",
        sections: [
            {
                title: "視点をリセットする",
                content: [
                    { pc: "画面左の<span class='help-highlight'>🔄リセットアイコン</span>を長押し", sp: "画面左の<span class='help-highlight'>🔄リセットアイコン</span>を長押し" },
                    { pc: "または<kbd>R</kbd>キー", sp: "" }
                ]
            }
        ],
        note: "視点操作で困ったときにご利用ください"
    },
    
    // ページ4: 再生制御・クリップボード
    {
        title: "再生制御・クリップボード",
        sections: [
            {
                title: "再生・一時停止",
                content: [
                    { pc: "画面下部の<span class='help-highlight'>▶再生ボタン</span>をクリック", sp: "画面下部の<span class='help-highlight'>▶再生ボタン</span>をタップ" },
                    { pc: "または<kbd>Z</kbd>キー", sp: "" }
                ]
            },
            {
                title: "画像をクリップボードに保存",
                content: [
                    { pc: "画面右下の<span class='help-highlight'>📷キャプチャボタン</span>をクリック", sp: "画面右下の<span class='help-highlight'>📷キャプチャボタン</span>をタップ" },
                    { pc: "または<kbd>Space</kbd>キー", sp: "" }
                ]
            }
        ],
        note: "保存した画像は作画ソフト等に貼り付けてご利用いただけます"
    },
    
    // ページ5: PROビュアーについて
    {
        title: "PROビュアーについて",
        sections: [
            {
                title: "PROアカウントでできること",
                content: [
                    { pc: "・<span class='help-highlight'>再生速度変更</span>", sp: "・<span class='help-highlight'>再生速度変更</span>" },
                    { pc: "・<span class='help-highlight'>指定コマ参照</span>", sp: "・<span class='help-highlight'>指定コマ参照</span>" },
                    { pc: "・<span class='help-highlight'>逆再生</span>", sp: "・<span class='help-highlight'>逆再生</span>" },
                    { pc: "・<span class='help-highlight'>コマ送り・コマ戻し</span>", sp: "・<span class='help-highlight'>コマ送り・コマ戻し</span>" },
                    { pc: "・<span class='help-highlight'>フィッシュアイ</span>（歪み効果）", sp: "・<span class='help-highlight'>フィッシュアイ</span>（歪み効果）" }
                ]
            }
        ],
        note: "PROアカウントのPROビュアー機能"
    },
    
    // ページ6: PROビュアー起動方法（新規）
    {
        title: "PROビュアー起動方法",
        sections: [
            {
                title: "PROビュアー立ち上げ方法",
                content: [
                    { pc: "ボタン【アイコン】をクリックします。", sp: "ボタン【アイコン】をタップします。" },
                    { pc: "切り替えメニューを承諾すると切り替わります。", sp: "切り替えメニューを承諾すると切り替わります。" }
                ]
            },
            {
                title: "PROビュアーの注意点",
                content: [
                    { pc: "PROビュアーはスマートフォン、タブレット端末ではご利用いただけません。", sp: "PROビュアーはスマートフォン、タブレット端末ではご利用いただけません。" },
                    { pc: "PROビュアーは通常ビュワーより要求スペックが高くなります。", sp: "PROビュアーは通常ビュワーより要求スペックが高くなります。" },
                    { pc: "　回線速度　下りxx MB/s 以上", sp: "　回線速度　下りxx MB/s 以上" },
                    { pc: "　メモリ　XXGB 以上", sp: "　メモリ　XXGB 以上" }
                ]
            }
        ],
        note: "※切り替え時にページがリロードされます。素材検索状況がリセットされますのでご注意ください。"
    },
    
    // ページ7: PRO機能の操作
    {
        title: "PRO機能の操作",
        sections: [
            {
                title: "フィッシュアイ（レンズモード時）",
                content: [
                    { pc: "<kbd>Ctrl</kbd>＋ドラッグ（左右）", sp: "<kbd>C</kbd>ボタン＋スワイプ（左右）、または2本指で左右スワイプ" }
                ]
            },
            {
                title: "コマ送り・コマ戻し",
                content: [
                    { pc: "画面下部の<span class='help-highlight'>◀▶ボタン</span>、または<kbd>←→</kbd>キー", sp: "画面下部の<span class='help-highlight'>◀▶ボタン</span>" }
                ]
            }
        ],
        note: "※フィッシュアイはレンズモード時のみ利用可能です"
    }
];

// ========================================
// デバイス判定
// ========================================
function getDeviceType() {
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    const isSmallScreen = window.innerWidth <= 768;
    return (isTouchDevice || isSmallScreen) ? 'sp' : 'pc';
}

// ========================================
// ヘルプポップアップ表示
// ========================================
function showHelpPopup() {
    // 既存のポップアップを削除
    const existingContainer = document.getElementById('helpPopupContainer');
    if (existingContainer) {
        existingContainer.remove();
    }
    
    // ポップアップコンテナ作成
    const container = document.createElement('div');
    container.id = 'helpPopupContainer';
    container.className = 'help-popup-container';
    
    // ヘッダー
    const header = document.createElement('div');
    header.className = 'help-popup-header';
    header.id = 'helpPopupHeader';
    
    const title = document.createElement('div');
    title.className = 'help-popup-title';
    title.textContent = 'ビュアー操作ガイド';
    
    const pageIndicator = document.createElement('div');
    pageIndicator.className = 'help-popup-page-indicator';
    pageIndicator.id = 'helpPageIndicator';
    pageIndicator.textContent = `${currentHelpPage} / ${TOTAL_HELP_PAGES}`;
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'help-popup-close';
    closeBtn.textContent = '✖';
    closeBtn.onclick = closeHelpPopup;
    
    header.appendChild(title);
    header.appendChild(pageIndicator);
    header.appendChild(closeBtn);
    
    // コンテンツエリア
    const content = document.createElement('div');
    content.className = 'help-popup-content';
    content.id = 'helpPopupContent';
    
    // フッター（ページネーション）
    const footer = document.createElement('div');
    footer.className = 'help-popup-footer';
    
    const prevBtn = document.createElement('button');
    prevBtn.className = 'help-nav-button';
    prevBtn.id = 'helpPrevBtn';
    prevBtn.textContent = '◀ 前へ';
    prevBtn.onclick = prevHelpPage;
    
    const pageDots = document.createElement('div');
    pageDots.className = 'help-page-dots';
    pageDots.id = 'helpPageDots';
    
    const nextBtn = document.createElement('button');
    nextBtn.className = 'help-nav-button';
    nextBtn.id = 'helpNextBtn';
    nextBtn.textContent = '次へ ▶';
    nextBtn.onclick = nextHelpPage;
    
    footer.appendChild(prevBtn);
    footer.appendChild(pageDots);
    footer.appendChild(nextBtn);
    
    // 組み立て
    container.appendChild(header);
    container.appendChild(content);
    container.appendChild(footer);
    
    document.body.appendChild(container);
    
    // 初期ページ表示
    renderHelpPage(currentHelpPage);
    
    // D&Dイベント設定
    setupDragAndDrop();
    
    // スワイプイベント設定
    setupSwipeEvents();
    
    // キーボードイベント設定
    setupKeyboardEvents();
    
    // 表示アニメーション
    requestAnimationFrame(() => {
        container.classList.add('show');
    });
}

// ========================================
// ヘルプポップアップ閉じる
// ========================================
function closeHelpPopup() {
    const container = document.getElementById('helpPopupContainer');
    if (!container) return;
    
    container.classList.remove('show');
    
    setTimeout(() => {
        container.remove();
    }, 300);
}

// ========================================
// ページレンダリング
// ========================================
function renderHelpPage(pageNum) {
    const content = document.getElementById('helpPopupContent');
    const pageIndicator = document.getElementById('helpPageIndicator');
    const pageDots = document.getElementById('helpPageDots');
    const prevBtn = document.getElementById('helpPrevBtn');
    const nextBtn = document.getElementById('helpNextBtn');
    
    if (!content) return;
    
    const page = helpPages[pageNum - 1];
    const deviceType = getDeviceType();
    
    // コンテンツ生成
    let html = `<div class="help-page-title">${page.title}</div>`;
    
    page.sections.forEach(section => {
        html += `<div class="help-section">`;
        html += `<div class="help-section-title">${section.title}</div>`;
        
        section.content.forEach(item => {
            const text = deviceType === 'sp' ? item.sp : item.pc;
            if (!text) return; // 空の場合はスキップ
            
            // <kbd>タグを.help-operation-keyクラスに置き換え
            const processedText = text.replace(/<kbd>(.*?)<\/kbd>/g, '<span class="help-operation-key">$1</span>');
            html += `<div class="help-text">${processedText}</div>`;
        });
        
        html += `</div>`;
    });
    
    // ノート表示
    if (page.note) {
        html += `<div class="help-note">${page.note}</div>`;
    }
    
    content.innerHTML = html;
    content.scrollTop = 0; // スクロール位置をトップに
    
    // ページインジケーター更新
    pageIndicator.textContent = `${pageNum} / ${TOTAL_HELP_PAGES}`;
    
    // ページドット更新
    pageDots.innerHTML = '';
    for (let i = 1; i <= TOTAL_HELP_PAGES; i++) {
        const dot = document.createElement('div');
        dot.className = 'help-page-dot';
        if (i === pageNum) {
            dot.classList.add('active');
        }
        pageDots.appendChild(dot);
    }
    
    // ボタンの有効/無効
    prevBtn.disabled = (pageNum === 1);
    nextBtn.disabled = (pageNum === TOTAL_HELP_PAGES);
}

// ========================================
// ページ移動
// ========================================
function nextHelpPage() {
    if (currentHelpPage < TOTAL_HELP_PAGES) {
        currentHelpPage++;
        renderHelpPage(currentHelpPage);
    }
}

function prevHelpPage() {
    if (currentHelpPage > 1) {
        currentHelpPage--;
        renderHelpPage(currentHelpPage);
    }
}

// ========================================
// D&D機能設定
// ========================================
function setupDragAndDrop() {
    const header = document.getElementById('helpPopupHeader');
    const container = document.getElementById('helpPopupContainer');
    
    if (!header || !container) return;
    
    // マウスイベント
    header.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
    
    // タッチイベント
    header.addEventListener('touchstart', startDragTouch);
    document.addEventListener('touchmove', dragTouch);
    document.addEventListener('touchend', stopDrag);
    
    function startDrag(e) {
        isDragging = true;
        const rect = container.getBoundingClientRect();
        dragOffsetX = e.clientX - rect.left;
        dragOffsetY = e.clientY - rect.top;
        container.classList.add('dragging');
    }
    
    function startDragTouch(e) {
        isDragging = true;
        const touch = e.touches[0];
        const rect = container.getBoundingClientRect();
        dragOffsetX = touch.clientX - rect.left;
        dragOffsetY = touch.clientY - rect.top;
        container.classList.add('dragging');
    }
    
    function drag(e) {
        if (!isDragging) return;
        
        let newX = e.clientX - dragOffsetX;
        let newY = e.clientY - dragOffsetY;
        
        // 画面外に出ないように制限
        const rect = container.getBoundingClientRect();
        const maxX = window.innerWidth - rect.width;
        const maxY = window.innerHeight - rect.height;
        
        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));
        
        container.style.left = newX + 'px';
        container.style.top = newY + 'px';
        container.style.right = 'auto';
    }
    
    function dragTouch(e) {
        if (!isDragging) return;
        
        const touch = e.touches[0];
        let newX = touch.clientX - dragOffsetX;
        let newY = touch.clientY - dragOffsetY;
        
        // 画面外に出ないように制限
        const rect = container.getBoundingClientRect();
        const maxX = window.innerWidth - rect.width;
        const maxY = window.innerHeight - rect.height;
        
        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));
        
        container.style.left = newX + 'px';
        container.style.top = newY + 'px';
        container.style.right = 'auto';
    }
    
    function stopDrag() {
        if (isDragging) {
            isDragging = false;
            container.classList.remove('dragging');
        }
    }
}

// ========================================
// キーボードイベント設定
// ========================================
function setupKeyboardEvents() {
    function handleKeydown(e) {
        const container = document.getElementById('helpPopupContainer');
        if (!container || !container.classList.contains('show')) return;
        
        if (e.key === 'Escape') {
            closeHelpPopup();
        } else if (e.key === 'ArrowLeft') {
            prevHelpPage();
        } else if (e.key === 'ArrowRight') {
            nextHelpPage();
        }
    }
    
    document.addEventListener('keydown', handleKeydown);
}

// ========================================
// スワイプイベント設定
// ========================================
function setupSwipeEvents() {
    const content = document.getElementById('helpPopupContent');
    if (!content) return;
    
    let touchStartX = 0;
    let touchStartY = 0;
    const SWIPE_THRESHOLD = 50; // 50px以上のスワイプで反応
    
    content.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });
    
    content.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        
        // 縦スクロールを優先（縦方向の移動が大きい場合はスワイプ判定しない）
        if (Math.abs(deltaY) > Math.abs(deltaX)) return;
        
        // 左スワイプ → 次へ
        if (deltaX < -SWIPE_THRESHOLD) {
            nextHelpPage();
        }
        // 右スワイプ → 前へ
        else if (deltaX > SWIPE_THRESHOLD) {
            prevHelpPage();
        }
    });
}
