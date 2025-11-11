// セッション0.8.1 - 2025-10-17
// ヘッダーUI制御
// 依存: auth.js, login.js, notifications.js
// 更新: 会員登録完了通知削除、パスワード再設定フォーム追加

import { isLoggedIn, getUserEmail, getMemberTypeDisplay, getStudioProjects, performLogout } from "./auth.js";
import { getRecentNotifications, getAllNotifications, getNotificationById, markAsRead, markAllAsRead } from "./notifications.js";
import { showModal, closeModal } from "./modal.js";
import { showNotification } from "./capture.js";
import { showLoginModal, AUTH_MODAL_MODES } from "./login.js";

// ========================================
// ヘッダーUI初期化
// ========================================

/**
 * ヘッダーの認証UI初期化
 */
export function initHeaderAuthUI() {
    const headerRight = document.querySelector('.header-right');
    
    if (!headerRight) {
        console.error('ヘッダー右側エリアが見つかりません');
        return;
    }
    
    // ベルアイコン生成
    createNotificationBell(headerRight);
    
    // 初期状態の表示を更新
    updateHeaderAuthUI();
    
    // ドキュメントクリックでドロップダウンを閉じる
    document.addEventListener('click', (e) => {
        const dropdown = document.getElementById('notificationDropdown');
        const bell = document.querySelector('.notification-bell');
        
        if (dropdown && bell && !bell.contains(e.target) && !dropdown.contains(e.target)) {
            hideNotificationDropdown();
        }
    });
}

/**
 * ヘッダーの認証UI更新
 */
export function updateHeaderAuthUI() {
    const headerRight = document.querySelector('.header-right');
    
    if (!headerRight) {
        console.error('ヘッダー右側エリアが見つかりません');
        return;
    }
    
    // 既存の認証UI要素を削除
    const existingAuthUI = headerRight.querySelector('.login-button, .member-type-display');
    if (existingAuthUI) {
        existingAuthUI.remove();
    }
    
    // ログイン状態に応じてUI生成
    if (isLoggedIn()) {
        // ログイン後：会員タイプ表示
        createMemberTypeDisplay(headerRight);
    } else {
        // 未ログイン：ログインボタン
        createLoginButton(headerRight);
    }
}

// ========================================
// ログインボタン生成
// ========================================

/**
 * ログインボタンを生成
 * @param {HTMLElement} container - 挿入先コンテナ
 */
function createLoginButton(container) {
    const loginButton = document.createElement('button');
    loginButton.className = 'login-button';
    loginButton.onclick = () => showLoginModal();
    
    // PC用テキスト
    const textFull = document.createElement('span');
    textFull.className = 'login-button-text-full';
    textFull.textContent = 'Login or Register';
    
    // SP用テキスト
    const textShort = document.createElement('span');
    textShort.className = 'login-button-text-short';
    textShort.textContent = 'Login';
    
    loginButton.appendChild(textFull);
    loginButton.appendChild(textShort);
    
    // ベルアイコンの直前に挿入
    const bell = container.querySelector('.notification-bell');
    if (bell) {
        container.insertBefore(loginButton, bell.parentElement);
    } else {
        const hamburger = container.querySelector('.hamburger');
        container.insertBefore(loginButton, hamburger);
    }
}

// ========================================
// 会員タイプ表示生成
// ========================================

/**
 * 会員タイプ表示を生成
 * @param {HTMLElement} container - 挿入先コンテナ
 */
function createMemberTypeDisplay(container) {
    const memberTypeDisplay = document.createElement('div');
    memberTypeDisplay.className = 'member-type-display';
    
    // 会員タイプ名を取得
    const memberTypeName = getMemberTypeDisplay();
    memberTypeDisplay.textContent = memberTypeName;
    
    // 将来実装：ドロップダウンメニュー
    // memberTypeDisplay.onclick = () => showMemberTypeMenu();
    
    // ベルアイコンの直前に挿入
    const bell = container.querySelector('.notification-bell');
    if (bell) {
        container.insertBefore(memberTypeDisplay, bell.parentElement);
    } else {
        const hamburger = container.querySelector('.hamburger');
        container.insertBefore(memberTypeDisplay, hamburger);
    }
}

// ========================================
// ベルアイコン生成
// ========================================

/**
 * ベルアイコンを生成
 * @param {HTMLElement} container - 挿入先コンテナ
 */
function createNotificationBell(container) {
    // ベルアイコンコンテナ
    const bellContainer = document.createElement('div');
    bellContainer.style.position = 'relative';
    
    // ベルボタン
    const bell = document.createElement('button');
    bell.className = 'notification-bell';
    bell.onclick = (e) => {
        e.stopPropagation();
        toggleNotificationDropdown();
    };
    
    // ベルアイコン画像
    const bellIcon = document.createElement('img');
    bellIcon.src = 'img/notification.png';
    bellIcon.alt = '通知';
    bellIcon.className = 'notification-bell-icon';
    bell.appendChild(bellIcon);
    
    // 未読バッジ（ドット）
    const badge = document.createElement('span');
    badge.className = 'notification-badge';
    
    bell.appendChild(badge);
    bellContainer.appendChild(bell);
    
    // ドロップダウン
    const dropdown = document.createElement('div');
    dropdown.id = 'notificationDropdown';
    dropdown.className = 'notification-dropdown';
    
    bellContainer.appendChild(dropdown);
    
    // ハンバーガーメニューの直前に挿入
    const hamburger = container.querySelector('.hamburger');
    if (hamburger) {
        container.insertBefore(bellContainer, hamburger);
    } else {
        container.appendChild(bellContainer);
    }
}

// ========================================
// 通知ドロップダウン制御
// ========================================

/**
 * 通知ドロップダウンを切り替え
 */
function toggleNotificationDropdown() {
    const dropdown = document.getElementById('notificationDropdown');
    
    if (dropdown.classList.contains('show')) {
        hideNotificationDropdown();
    } else {
        showNotificationDropdown();
    }
}

/**
 * 通知ドロップダウンを表示
 */
function showNotificationDropdown() {
    const dropdown = document.getElementById('notificationDropdown');
    const notifications = getRecentNotifications();
    
    // ドロップダウン内容生成
    dropdown.innerHTML = `
        <div class="notification-dropdown-header">
            <span class="notification-dropdown-title">通知</span>
            <button class="notification-mark-all-read" onclick="handleMarkAllAsRead()">
                すべて既読
            </button>
        </div>
        <div class="notification-dropdown-list" id="notificationDropdownList">
            ${notifications.length > 0 ? generateNotificationListHTML(notifications) : '<div class="notification-empty">通知はありません</div>'}
        </div>
        <div class="notification-dropdown-footer">
            <button class="notification-view-all" onclick="showAllNotificationsModal()">
                すべての通知を見る
            </button>
        </div>
    `;
    
    dropdown.classList.add('show');
}

/**
 * 通知ドロップダウンを非表示
 */
function hideNotificationDropdown() {
    const dropdown = document.getElementById('notificationDropdown');
    dropdown.classList.remove('show');
}

/**
 * 通知リストのHTML生成
 * @param {Array} notifications - 通知配列
 * @returns {string}
 */
function generateNotificationListHTML(notifications) {
    return notifications.map(n => `
        <div class="notification-item ${n.isRead ? '' : 'unread'}" onclick="handleNotificationClick(${n.id})">
            <span class="notification-item-dot"></span>
            <div class="notification-item-content">
                <div class="notification-item-title">${n.title}</div>
                <div class="notification-item-message">${n.message}</div>
                <div class="notification-item-time">${formatNotificationTime(n.timestamp)}</div>
            </div>
        </div>
    `).join('');
}

/**
 * 通知時刻のフォーマット
 * @param {Date} timestamp - 日時
 * @returns {string}
 */
function formatNotificationTime(timestamp) {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'たった今';
    if (minutes < 60) return `${minutes}分前`;
    if (hours < 24) return `${hours}時間前`;
    if (days < 7) return `${days}日前`;
    
    const month = timestamp.getMonth() + 1;
    const date = timestamp.getDate();
    return `${month}月${date}日`;
}

// ========================================
// 通知イベントハンドラー
// ========================================

/**
 * 通知クリック処理
 * @param {number} id - 通知ID
 */
function handleNotificationClick(id) {
    const notification = getNotificationById(id);
    
    if (!notification) return;
    
    // 既読にする
    markAsRead(id);
    
    // ドロップダウンを閉じる
    hideNotificationDropdown();
    
    // メール内容がある場合はメールモーダルを表示
    if (notification.mailContent) {
        showMailModal(notification);
    }
}

/**
 * すべて既読処理
 */
function handleMarkAllAsRead() {
    markAllAsRead();
    showNotification('すべての通知を既読にしました', 'info');
}

/**
 * すべての通知を見るモーダル表示
 */
function showAllNotificationsModal() {
    hideNotificationDropdown();
    showNotificationListModal(1);
}

/**
 * 通知一覧モーダル表示
 * @param {number} page - ページ番号（1から開始）
 */
function showNotificationListModal(page = 1) {
    const allNotifications = getAllNotifications();
    const itemsPerPage = 10;
    const totalPages = Math.ceil(allNotifications.length / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageNotifications = allNotifications.slice(startIndex, endIndex);
    
    const content = `
        <div class="notification-list-container">
            ${pageNotifications.length > 0 ? generateNotificationListItemsHTML(pageNotifications) : '<div class="notification-empty">通知はありません</div>'}
        </div>
        ${totalPages > 1 ? generatePaginationHTML(page, totalPages) : ''}
    `;
    
    showModal({
        title: 'すべての通知',
        content: content,
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
 * 通知一覧アイテムのHTML生成
 * @param {Array} notifications - 通知配列
 * @returns {string}
 */
function generateNotificationListItemsHTML(notifications) {
    return notifications.map(n => `
        <div class="notification-list-item ${n.isRead ? '' : 'unread'}" onclick="handleNotificationClick(${n.id})">
            <div class="notification-list-item-header">
                <span class="notification-list-item-title">${n.title}</span>
                ${n.isRead ? '' : '<span class="notification-list-item-badge">未読</span>'}
            </div>
            <div class="notification-list-item-message">${n.message}</div>
            <div class="notification-list-item-time">${formatNotificationTime(n.timestamp)}</div>
        </div>
    `).join('');
}

/**
 * ページングHTMLの生成
 * @param {number} currentPage - 現在のページ
 * @param {number} totalPages - 総ページ数
 * @returns {string}
 */
function generatePaginationHTML(currentPage, totalPages) {
    return `
        <div class="notification-pagination">
            <button class="notification-pagination-button" 
                    ${currentPage === 1 ? 'disabled' : ''} 
                    onclick="showNotificationListModal(${currentPage - 1})">
                前へ
            </button>
            <span class="notification-pagination-info">${currentPage} / ${totalPages}</span>
            <button class="notification-pagination-button" 
                    ${currentPage === totalPages ? 'disabled' : ''} 
                    onclick="showNotificationListModal(${currentPage + 1})">
                次へ
            </button>
        </div>
    `;
}

// ========================================
// メールモーダル制御
// ========================================

/**
 * メールモーダルを表示（既存のモーダルシステムを使用）
 * @param {Object} notification - 通知オブジェクト
 */
function showMailModal(notification) {
    if (!notification.mailContent) return;
    
    const mailContent = notification.mailContent;
    
    // メール内容のHTML生成
    const content = generateMailContent(mailContent);
    
    showModal({
        title: mailContent.subject,
        content: content,
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
 * メール内容のHTML生成
 * @param {Object} mailContent - メール内容
 * @returns {string}
 */
function generateMailContent(mailContent) {
    // メール本文を処理（ボタン変換）
    const processedBody = processMailBody(mailContent.body);
    
    return `
        <div class="mail-display">
            <div class="mail-info">
                <div class="mail-from">
                    <span class="mail-label">差出人：</span>
                    <span class="mail-from-text">${mailContent.from}</span>
                </div>
                <div class="mail-date">
                    <span class="mail-label">受信日時：</span>
                    <span class="mail-date-text">${formatMailDate(new Date())}</span>
                </div>
            </div>
            <div class="mail-body">${processedBody}</div>
            ${mailContent.note ? `<div class="mail-note">${mailContent.note}</div>` : ''}
        </div>
    `;
}

/**
 * メール本文を処理（ボタン生成）
 * @param {string} body - 本文
 * @returns {string}
 */
function processMailBody(body) {
    // [BUTTON:テキスト:action] 形式をボタンに変換
    return body.replace(/\[BUTTON:([^:]+):([^\]]+)\]/g, (match, text, action) => {
        return `<button class="mail-action-button" onclick="handleMailAction('${action}')">${text}</button>`;
    });
}

/**
 * メール日時のフォーマット
 * @param {Date} date - 日時
 * @returns {string}
 */
function formatMailDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

/**
 * メール内のボタンアクション処理
 * @param {string} action - アクション名
 */
function handleMailAction(action) {
    switch (action) {
        case 'complete-registration':
            // 会員登録完了 - モーダルを閉じてログイン画面を表示（通知は削除）
            closeModal();
            showLoginModal();
            break;
        case 'reset-password':
            // パスワード再設定 - モーダルを閉じて新しいパスワード設定画面を表示
            closeModal();
            showLoginModal(AUTH_MODAL_MODES.NEW_PASSWORD);
            break;
        case 'email-login':
            // メールリンクログイン
            closeModal();
            completeEmailLogin();
            break;
        default:
            console.warn('不明なアクション:', action);
    }
}

/**
 * メールリンクログイン完了処理
 */
function completeEmailLogin() {
    // ダミーでログイン処理を実行
    const result = performLogin('user@example.com', 'dummy');
    
    if (result.success) {
        // ヘッダーUIを更新してログイン状態を表示
        updateHeaderAuthUI();
        showNotification('メールリンクからログインしました', 'success');
    } else {
        showNotification('ログインに失敗しました', 'error');
    }
}

// ========================================
// 会員タイプメニュー（将来実装用）
// ========================================

/**
 * 会員タイプメニューを表示（将来実装）
 * 
 * 実装予定内容：
 * - フリー/スターター/スポット/プロ の切り替え
 * - スタジオプロジェクト一覧表示・切り替え
 * - ログアウトボタン
 */

/**
 * ログアウト処理
 */
export function handleLogout() {
    performLogout();
    updateHeaderAuthUI();
    showNotification('ログアウトしました。', 'info');
}

// HTMLから呼ばれる関数をwindowに登録
window.handleNotificationClick = handleNotificationClick;
window.handleMarkAllAsRead = handleMarkAllAsRead;
window.showAllNotificationsModal = showAllNotificationsModal;
window.showNotificationListModal = showNotificationListModal;
window.handleMailAction = handleMailAction;

// ========================================
// ハンバーガーメニュー制御（既存機能との統合用）
// ========================================

/**
 * ハンバーガーメニュー内にログアウトボタンを追加（将来実装用）
 * 
 * ハンバーガーメニューが実装された際に、
 * ログイン中のみログアウトボタンを表示する
 */
