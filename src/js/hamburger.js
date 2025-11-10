// セッション0.9.0 - 2025-10-17
// ハンバーガーメニュー制御
// 依存: auth.js
// 機能: メニュー開閉、設定トグル（UI のみ、実際の適用は将来実装）

// ========================================
// ハンバーガーメニュー状態
// ========================================

/**
 * ハンバーガーメニュー状態オブジェクト
 */
const hamburgerState = {
    isOpen: false,
    language: 'JP',          // 'JP' | 'KO' | 'EN'
    isProViewer: false,      // PROビュアー（将来実装）
    isDarkMode: false,       // ダークモード（将来実装）
    isLeftyMode: false       // レフティモード（将来実装）
};

// ========================================
// 初期化
// ========================================

/**
 * ハンバーガーメニュー初期化
 */
function initHamburgerMenu() {
    // メニュー状態を反映
    updateHamburgerMenu();
    
    // グローバルクリックイベント設定（他のヘッダー操作時にメニューを閉じる）
    document.addEventListener('click', (e) => {
        // メニューが開いていない場合は何もしない
        if (!hamburgerState.isOpen) return;
        
        const menu = document.getElementById('hamburgerMenu');
        const backdrop = document.getElementById('hamburgerBackdrop');
        const hamburgerBtn = document.getElementById('hamburger');
        
        // クリックがメニュー内、背景、ハンバーガーボタンの場合は何もしない
        if (menu && menu.contains(e.target)) return;
        if (backdrop && backdrop.contains(e.target)) return;
        if (hamburgerBtn && hamburgerBtn.contains(e.target)) return;
        
        // それ以外（ヘッダーの他のボタン、モーダルなど）がクリックされたら閉じる
        closeHamburgerMenu();
    });
}

// ========================================
// メニュー開閉
// ========================================

/**
 * ハンバーガーメニューを開く
 */
function openHamburgerMenu() {
    const menu = document.getElementById('hamburgerMenu');
    const backdrop = document.getElementById('hamburgerBackdrop');
    
    if (!menu || !backdrop) {
        console.error('ハンバーガーメニュー要素が見つかりません');
        return;
    }
    
    menu.classList.add('open');
    backdrop.classList.add('show');
    hamburgerState.isOpen = true;
    
    // ボディのスクロールを無効化
    document.body.style.overflow = 'hidden';
    
    // メニュー内容を更新
    updateHamburgerMenu();
}

/**
 * ハンバーガーメニューを閉じる
 */
function closeHamburgerMenu() {
    const menu = document.getElementById('hamburgerMenu');
    const backdrop = document.getElementById('hamburgerBackdrop');
    
    if (!menu || !backdrop) return;
    
    menu.classList.remove('open');
    backdrop.classList.remove('show');
    hamburgerState.isOpen = false;
    
    // ボディのスクロールを復元
    document.body.style.overflow = '';
}

/**
 * ハンバーガーメニューをトグル
 */
function toggleHamburgerMenu() {
    if (hamburgerState.isOpen) {
        closeHamburgerMenu();
    } else {
        openHamburgerMenu();
    }
}

// ========================================
// メニュー内容更新
// ========================================

/**
 * ハンバーガーメニュー内容を更新
 */
function updateHamburgerMenu() {
    updateHamburgerUserInfo();
    updateLanguageButtons();
    updateProViewerUI();
    updateDarkModeUI();
    updateLeftyModeUI();
}

/**
 * ユーザー情報表示を更新
 */
function updateHamburgerUserInfo() {
    const userNameEl = document.querySelector('.hamburger-user-name');
    const planNameEl = document.querySelector('.hamburger-plan-name');
    const studioNameEl = document.querySelector('.hamburger-studio-name');
    
    if (!userNameEl || !planNameEl || !studioNameEl) return;
    
    if (isLoggedIn()) {
        // ログイン後：ユーザー情報表示
        userNameEl.textContent = getUserEmail() || 'ユーザー';
        planNameEl.textContent = getMemberTypeDisplay();
        
        // スタジオプロジェクト（将来実装）
        const projects = getStudioProjects();
        if (projects.length > 0) {
            studioNameEl.textContent = `スタジオ - ${projects[0].name}`;
            studioNameEl.style.display = 'block';
        } else {
            // スタジオがない場合は非表示
            studioNameEl.style.display = 'none';
        }
    } else {
        // 未ログイン：デフォルト表示
        userNameEl.textContent = 'ゲスト';
        planNameEl.textContent = 'フリープラン';
        // スタジオなしなので非表示
        studioNameEl.style.display = 'none';
    }
}

// ========================================
// 言語切り替え
// ========================================

/**
 * 言語を変更
 * @param {string} lang - 言語コード（'JP' | 'KO' | 'EN'）
 */
function changeLanguage(lang) {
    const validLanguages = ['JP', 'KO', 'EN'];
    if (!validLanguages.includes(lang)) return;
    
    hamburgerState.language = lang;
    updateLanguageButtons();
    
    // TODO: 実際の言語変更処理（将来実装）
    // - UIテキストの切り替え
    // - localStorageに保存
    console.log(`言語を${lang}に変更（UI反映は将来実装）`);
}

/**
 * 言語ボタンの表示を更新
 */
function updateLanguageButtons() {
    const buttons = document.querySelectorAll('.toggle-btn');
    
    buttons.forEach(btn => {
        const lang = btn.textContent.trim();
        if (lang === hamburgerState.language) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// ========================================
// PROビュアー切り替え
// ========================================

/**
 * PROビュアーをトグル
 */
function toggleProViewer() {
    hamburgerState.isProViewer = !hamburgerState.isProViewer;
    updateProViewerUI();
    
    // TODO: 実際のPROビュアー適用（将来実装）
    // - 高度な3D機能の有効化
    // - 追加UIの表示
    // - localStorageに保存
    console.log(`PROビュアー: ${hamburgerState.isProViewer ? 'ON' : 'OFF'}（実装は将来）`);
}

/**
 * PROビュアーUIを更新
 */
function updateProViewerUI() {
    const proViewerSwitch = document.getElementById('proViewerSwitch');
    if (!proViewerSwitch) return;
    
    if (hamburgerState.isProViewer) {
        proViewerSwitch.classList.add('active');
    } else {
        proViewerSwitch.classList.remove('active');
    }
}

// ========================================
// ダークモード切り替え
// ========================================

/**
 * ダークモードをトグル
 */
function toggleDarkMode() {
    hamburgerState.isDarkMode = !hamburgerState.isDarkMode;
    updateDarkModeUI();
    
    // TODO: 実際のダークモード適用（将来実装）
    // - CSS変数の切り替え
    // - localStorageに保存
    console.log(`ダークモード: ${hamburgerState.isDarkMode ? 'ON' : 'OFF'}（実装は将来）`);
}

/**
 * ダークモードUIを更新
 */
function updateDarkModeUI() {
    const darkModeSwitch = document.getElementById('darkModeSwitch');
    if (!darkModeSwitch) return;
    
    if (hamburgerState.isDarkMode) {
        darkModeSwitch.classList.add('active');
    } else {
        darkModeSwitch.classList.remove('active');
    }
}

// ========================================
// レフティモード切り替え
// ========================================

/**
 * レフティモードをトグル
 */
function toggleLeftyMode() {
    hamburgerState.isLeftyMode = !hamburgerState.isLeftyMode;
    updateLeftyModeUI();
    
    // TODO: 実際のレフティモード適用（将来実装）
    // - 要素の左右反転（transform: scaleX(-1) など）
    // - localStorageに保存
    console.log(`レフティモード: ${hamburgerState.isLeftyMode ? 'ON' : 'OFF'}（実装は将来）`);
}

/**
 * レフティモードUIを更新
 */
function updateLeftyModeUI() {
    const leftyModeSwitch = document.getElementById('leftyModeSwitch');
    if (!leftyModeSwitch) return;
    
    if (hamburgerState.isLeftyMode) {
        leftyModeSwitch.classList.add('active');
    } else {
        leftyModeSwitch.classList.remove('active');
    }
}

// ========================================
// ログアウト処理
// ========================================

/**
 * ログアウト処理（メニューから実行）
 */
function handleHamburgerLogout() {
    closeHamburgerMenu();
    
    // header.jsのhandleLogout()を呼び出し
    if (typeof handleLogout === 'function') {
        handleLogout();
    } else {
        // フォールバック
        performLogout();
        updateHeaderAuthUI();
        showNotification('ログアウトしました。', 'info');
    }
}

// ========================================
// モーダル表示（将来実装用）
// ========================================

/**
 * プランアップグレードモーダルを表示（将来実装）
 */
function showUpgradeModal() {
    closeHamburgerMenu();
    
    // TODO: プラン表示モーダル実装
    showModal({
        title: 'プランをアップグレード',
        content: '<p>プラン選択画面は将来実装予定です。</p>',
        size: 'medium',
        scrollType: 'vertical',
        buttons: {
            showCancel: false,
            showOk: true,
            okText: '閉じる'
        }
    });
}

/**
 * フレンド招待モーダルを表示（将来実装）
 */
function showInviteFriendModal() {
    closeHamburgerMenu();
    
    // TODO: 招待コード生成・表示
    showModal({
        title: 'フレンド招待',
        content: '<p>招待コード機能は将来実装予定です。</p>',
        size: 'medium',
        scrollType: 'vertical',
        buttons: {
            showCancel: false,
            showOk: true,
            okText: '閉じる'
        }
    });
}

/**
 * OSSライセンスモーダルを表示（将来実装）
 */
function showOSSLicenseModal() {
    closeHamburgerMenu();
    
    // TODO: ライセンス情報表示
    showModal({
        title: 'OSSライセンス表記',
        content: '<p>使用しているOSSライブラリのライセンス情報は将来実装予定です。</p>',
        size: 'large',
        scrollType: 'vertical',
        buttons: {
            showCancel: false,
            showOk: true,
            okText: '閉じる'
        }
    });
}

// ========================================
// ページ遷移（将来実装用）
// ========================================

/**
 * アカウント管理ページへ遷移（将来実装）
 */
function navigateToAccountManagement() {
    closeHamburgerMenu();
    
    // TODO: アカウント管理ページ実装
    console.log('アカウント管理ページへ遷移（将来実装）');
}

/**
 * 利用規約ページへ遷移（将来実装）
 */
function navigateToTerms() {
    closeHamburgerMenu();
    
    // TODO: 利用規約ページ実装
    console.log('利用規約ページへ遷移（将来実装）');
}

/**
 * ヘルプページへ遷移（将来実装）
 */
function navigateToHelp() {
    closeHamburgerMenu();
    
    // TODO: ヘルプページ実装
    console.log('ヘルプページへ遷移（将来実装）');
}

/**
 * 運営会社ページへ遷移（将来実装）
 */
function navigateToCompany() {
    closeHamburgerMenu();
    
    // TODO: 運営会社ページ実装
    console.log('運営会社ページへ遷移（将来実装）');
}
