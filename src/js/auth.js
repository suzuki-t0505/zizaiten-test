// セッション0.9.0 - 2025-10-17
// 認証状態管理
// 更新: 会員タイプ表示名に「プラン」を追加

// ========================================
// 認証状態
// ========================================

/**
 * 認証状態オブジェクト
 * - isLoggedIn: ログイン状態（boolean）
 * - userEmail: ユーザーメールアドレス（string）
 * - memberType: 会員タイプ（'free' | 'starter' | 'spot' | 'pro' | 'studio'）
 * - studioProjects: スタジオプロジェクト一覧（array）※将来実装用
 */
const authState = {
    isLoggedIn: false,
    userEmail: null,
    memberType: 'free',
    studioProjects: [] // 将来実装: [{id: 'project1', name: 'プロジェクトA'}, ...]
};

// ========================================
// 認証処理（ダミー実装）
// ========================================

/**
 * ログイン処理（ダミー：常に成功）
 * @param {string} email - メールアドレス
 * @param {string} password - パスワード
 * @returns {Object} - {success: boolean, message: string}
 */
function performLogin(email, password) {
    // 入力チェック
    if (!email || !password) {
        return {
            success: false,
            message: 'メールアドレスとパスワードを入力してください。'
        };
    }
    
    // ダミー処理：常に成功
    authState.isLoggedIn = true;
    authState.userEmail = email;
    authState.memberType = 'free'; // デフォルトはフリー
    
    return {
        success: true,
        message: 'ログインに成功しました。'
    };
}

/**
 * メールリンクログイン処理（ダミー：常に成功）
 * @param {string} email - メールアドレス
 * @returns {Object} - {success: boolean, message: string}
 */
function performEmailLinkLogin(email) {
    // 入力チェック
    if (!email) {
        return {
            success: false,
            message: 'メールアドレスを入力してください。'
        };
    }
    
    // ダミー処理：メール送信シミュレーション
    return {
        success: true,
        message: `${email} にログインリンクを送信しました。メールをご確認ください。`
    };
}

/**
 * パスワードリセット処理（ダミー：常に成功）
 * @param {string} email - メールアドレス
 * @returns {Object} - {success: boolean, message: string}
 */
function performPasswordReset(email) {
    // 入力チェック
    if (!email) {
        return {
            success: false,
            message: 'メールアドレスを入力してください。'
        };
    }
    
    // ダミー処理：メール送信シミュレーション
    return {
        success: true,
        message: `${email} にパスワードリセットリンクを送信しました。メールをご確認ください。`
    };
}

/**
 * 新規会員登録処理（ダミー：常に成功）
 * @param {Object} data - 登録データ
 * @param {string} data.email - メールアドレス
 * @param {string} data.password - パスワード
 * @param {string} data.passwordConfirm - パスワード確認
 * @param {boolean} data.agreeTerms - 利用規約同意
 * @param {boolean} data.agreePrivacy - プライバシーポリシー同意
 * @param {boolean} data.newsletter - メールマガジン購読
 * @returns {Object} - {success: boolean, message: string}
 */
function performRegister(data) {
    // 入力チェック
    if (!data.email || !data.password || !data.passwordConfirm) {
        return {
            success: false,
            message: 'すべての項目を入力してください。'
        };
    }
    
    // パスワード一致チェック
    if (data.password !== data.passwordConfirm) {
        return {
            success: false,
            message: 'パスワードが一致しません。'
        };
    }
    
    // 利用規約・プライバシーポリシー同意チェック
    if (!data.agreeTerms || !data.agreePrivacy) {
        return {
            success: false,
            message: '利用規約とプライバシーポリシーに同意してください。'
        };
    }
    
    // ダミー処理：登録成功 → 自動ログイン
    authState.isLoggedIn = true;
    authState.userEmail = data.email;
    authState.memberType = 'free';
    
    return {
        success: true,
        message: '会員登録が完了しました。'
    };
}

/**
 * ログアウト処理
 */
function performLogout() {
    authState.isLoggedIn = false;
    authState.userEmail = null;
    authState.memberType = 'free';
    authState.studioProjects = [];
}

// ========================================
// 認証状態取得
// ========================================

/**
 * ログイン状態を取得
 * @returns {boolean}
 */
function isLoggedIn() {
    return authState.isLoggedIn;
}

/**
 * ユーザーメールを取得
 * @returns {string|null}
 */
function getUserEmail() {
    return authState.userEmail;
}

/**
 * 会員タイプを取得
 * @returns {string}
 */
function getMemberType() {
    return authState.memberType;
}

/**
 * 会員タイプの表示名を取得
 * @returns {string}
 */
function getMemberTypeDisplay() {
    const typeMap = {
        'free': 'フリープラン',
        'starter': 'スタータープラン',
        'spot': 'スポットプラン',
        'pro': 'プロプラン',
        'studio': 'スタジオプラン' // 将来実装: スタジオ-プロジェクト名
    };
    
    return typeMap[authState.memberType] || 'フリープラン';
}

/**
 * スタジオプロジェクト一覧を取得（将来実装用）
 * @returns {Array}
 */
function getStudioProjects() {
    return authState.studioProjects;
}

// ========================================
// 会員タイプ切り替え（将来実装用）
// ========================================

/**
 * 会員タイプを変更（将来実装用）
 * @param {string} type - 会員タイプ
 */
function setMemberType(type) {
    const validTypes = ['free', 'starter', 'spot', 'pro', 'studio'];
    if (validTypes.includes(type)) {
        authState.memberType = type;
        // ヘッダーUI更新
        if (typeof updateHeaderAuthUI === 'function') {
            updateHeaderAuthUI();
        }
    }
}

/**
 * スタジオプロジェクトを追加（将来実装用）
 * @param {Object} project - プロジェクト情報 {id, name}
 */
function addStudioProject(project) {
    if (project && project.id && project.name) {
        authState.studioProjects.push(project);
    }
}

/**
 * スタジオプロジェクトを削除（将来実装用）
 * @param {string} projectId - プロジェクトID
 */
function removeStudioProject(projectId) {
    authState.studioProjects = authState.studioProjects.filter(
        p => p.id !== projectId
    );
}
