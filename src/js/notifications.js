// セッション0.8.0 - 2025-10-17
// お知らせ通知管理システム
// 新規作成: ベルアイコン通知の状態管理
// 注意: 既存のshowNotification（画面トースト通知）とは別物

// ========================================
// お知らせ通知の状態管理
// ========================================

/**
 * お知らせ通知オブジェクト
 * - id: 通知ID（ユニーク）
 * - type: 通知タイプ（'email' | 'system' | 'info'）
 * - title: 通知タイトル
 * - message: 通知メッセージ（短文）
 * - timestamp: 受信日時（Date）
 * - isRead: 既読フラグ
 * - mailContent: メール内容（type='email'の場合のみ）
 */
const notificationState = {
    notifications: [],
    nextId: 1
};

// ========================================
// 通知の追加
// ========================================

/**
 * お知らせ通知を追加
 * @param {Object} data - 通知データ
 * @param {string} data.type - 通知タイプ
 * @param {string} data.title - タイトル
 * @param {string} data.message - メッセージ
 * @param {Object} data.mailContent - メール内容（任意）
 * @returns {number} - 追加された通知のID
 */
function addNotification(data) {
    const notification = {
        id: notificationState.nextId++,
        type: data.type || 'info',
        title: data.title || '新しい通知',
        message: data.message || '',
        timestamp: new Date(),
        isRead: false,
        mailContent: data.mailContent || null
    };
    
    notificationState.notifications.unshift(notification); // 最新を先頭に
    updateNotificationBadge();
    
    return notification.id;
}

/**
 * 会員登録確認メールを追加
 * @param {string} email - ユーザーメールアドレス
 */
function addRegistrationEmail(email) {
    addNotification({
        type: 'email',
        title: '【ZIZAITEN】会員登録の確認',
        message: '会員登録の確認メールが届きました',
        mailContent: {
            from: 'ZIZAITEN運営 <noreply@zizaiten.com>',
            subject: '【ZIZAITEN】会員登録の確認',
            body: `${email} 様

ZIZAITENへの会員登録ありがとうございます。
以下のボタンをクリックして登録を完了してください。

[BUTTON:登録を完了する:complete-registration]

このメールに心当たりがない場合は、このメールを無視してください。

──────────────────────
ZIZAITEN運営チーム
https://zizaiten.example.com
──────────────────────`,
            note: '※ 検証用メールイメージです。実際のサービスではご利用者様の登録メールに配信される内容となります。'
        }
    });
}

/**
 * パスワードリセットメールを追加
 * @param {string} email - ユーザーメールアドレス
 */
function addPasswordResetEmail(email) {
    addNotification({
        type: 'email',
        title: '【ZIZAITEN】パスワードリセット',
        message: 'パスワードリセットメールが届きました',
        mailContent: {
            from: 'ZIZAITEN運営 <noreply@zizaiten.com>',
            subject: '【ZIZAITEN】パスワードリセット',
            body: `${email} 様

パスワードリセットのリクエストを受け付けました。
以下のボタンをクリックしてパスワードを再設定してください。

[BUTTON:パスワードを再設定する:reset-password]

このリクエストに心当たりがない場合は、このメールを無視してください。

──────────────────────
ZIZAITEN運営チーム
https://zizaiten.example.com
──────────────────────`,
            note: '※ 検証用メールイメージです。実際のサービスではご利用者様の登録メールに配信される内容となります。'
        }
    });
}

/**
 * メールリンクログインメールを追加
 * @param {string} email - ユーザーメールアドレス
 */
function addEmailLinkLoginEmail(email) {
    addNotification({
        type: 'email',
        title: '【ZIZAITEN】ログインリンク',
        message: 'ログインリンクが届きました',
        mailContent: {
            from: 'ZIZAITEN運営 <noreply@zizaiten.com>',
            subject: '【ZIZAITEN】ログインリンク',
            body: `${email} 様

ログインリクエストを受け付けました。
以下のボタンをクリックしてログインしてください。

[BUTTON:ログインする:email-login]

このリクエストに心当たりがない場合は、このメールを無視してください。

──────────────────────
ZIZAITEN運営チーム
https://zizaiten.example.com
──────────────────────`,
            note: '※ 検証用メールイメージです。実際のサービスではご利用者様の登録メールに配信される内容となります。'
        }
    });
}

// ========================================
// 通知の取得
// ========================================

/**
 * すべての通知を取得
 * @returns {Array}
 */
function getAllNotifications() {
    return notificationState.notifications;
}

/**
 * 未読通知を取得
 * @returns {Array}
 */
function getUnreadNotifications() {
    return notificationState.notifications.filter(n => !n.isRead);
}

/**
 * 通知をIDで取得
 * @param {number} id - 通知ID
 * @returns {Object|null}
 */
function getNotificationById(id) {
    return notificationState.notifications.find(n => n.id === id) || null;
}

/**
 * ドロップダウン表示用の最新5件を取得
 * @returns {Array}
 */
function getRecentNotifications() {
    return notificationState.notifications.slice(0, 5);
}

// ========================================
// 通知の既読管理
// ========================================

/**
 * 通知を既読にする
 * @param {number} id - 通知ID
 */
function markAsRead(id) {
    const notification = getNotificationById(id);
    if (notification) {
        notification.isRead = true;
        updateNotificationBadge();
        updateNotificationDropdown();
    }
}

/**
 * すべての通知を既読にする
 */
function markAllAsRead() {
    notificationState.notifications.forEach(n => n.isRead = true);
    updateNotificationBadge();
    updateNotificationDropdown();
}

/**
 * 通知を削除
 * @param {number} id - 通知ID
 */
function deleteNotification(id) {
    notificationState.notifications = notificationState.notifications.filter(
        n => n.id !== id
    );
    updateNotificationBadge();
    updateNotificationDropdown();
}

// ========================================
// UI更新
// ========================================

/**
 * 通知バッジ（ドット）を更新
 */
function updateNotificationBadge() {
    const badge = document.querySelector('.notification-badge');
    if (!badge) return;
    
    const unreadCount = getUnreadNotifications().length;
    
    if (unreadCount > 0) {
        badge.classList.add('show');
    } else {
        badge.classList.remove('show');
    }
}

/**
 * 通知ドロップダウンを更新
 */
function updateNotificationDropdown() {
    const dropdown = document.getElementById('notificationDropdown');
    if (!dropdown || !dropdown.classList.contains('show')) return;
    
    // ドロップダウンが開いていれば再生成
    showNotificationDropdown();
}
