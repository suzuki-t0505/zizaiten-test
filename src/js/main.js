// セッション0.9.0 - 2025-10-17
// メイン初期化・統合
// ESModules対応版

// CSS読み込み（読み込み順序厳守）
// 基盤
import '../css/01-reset.css';
import '../css/02-layout.css';

// コンポーネント
import '../css/03-panels.css';
import '../css/04-viewer.css';
import '../css/05-buttons.css';
import '../css/06-seekbar.css';
import '../css/07-tags.css';
import '../css/08-thumbnails.css';
import '../css/09-info.css';
import '../css/10-modal-base.css';
import '../css/11-modal-search.css';

// レスポンシブ
import '../css/12-responsive.css';
import '../css/13-responsive-sp.css';

// ユーティリティ
import '../css/14-utilities.css';

// 認証・通知UI
import '../css/15-auth.css';
import '../css/16-notifications.css';

// ヘルプポップアップ
import '../css/17-popup-help.css';

// ハンバーガーメニュー
import '../css/18-hamburger-menu.css';

// Gmail風メールスタイル
import '../demomail/mail.css';

// JavaScript読み込み（依存関係順）
import { state, viewer3D } from './state.js';
import { videoDatabase } from './data.js';
import './filtering.js';
import './modal.js';
import { generateTags, generateThumbnails, generateInfoTags, generateVariations } from './ui.js';
import './chips.js';
import './suggest.js';
import './searchinput.js';
import './modalsearch.js';
import './tagmodal.js';
import './tags.js';
import './capture.js';
import { updateListPanel, updateInfoPanel } from './panels.js';
import { init3DViewer, selectVideo } from './viewer.js';
import { initPlaybackControls, updateFrameDisplay, updateSeekbar } from './controls.js';
import { setupEventListeners } from './events.js';

// 認証・通知関連
import './auth.js';
import './notifications.js';
import './login.js';
import { initHeaderAuthUI } from './header.js';

// ヘルプポップアップ
import './help.js';

// ハンバーガーメニュー
import { initHamburgerMenu, closeHamburgerMenu } from './hamburger.js';

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
