// セッション0.8.1 - 2025-10-17
// ログインモーダル制御
// 依存: auth.js, modal.js, notifications.js
// 更新: パスワード再設定フォーム追加

// ========================================
// モーダル表示モード
// ========================================

const AUTH_MODAL_MODES = {
    LOGIN: 'login',              // メインログイン画面
    REGISTER: 'register',        // 新規会員登録画面
    RESET_PASSWORD: 'reset',     // パスワードリセット画面（メール送信）
    NEW_PASSWORD: 'new-password', // 新しいパスワード設定画面
    EMAIL_LINK: 'email-link'     // メールリンクログイン画面
};

// ========================================
// ログインモーダル表示
// ========================================

/**
 * ログインモーダルを表示
 * @param {string} mode - 表示モード（AUTH_MODAL_MODES）
 */
function showLoginModal(mode = AUTH_MODAL_MODES.LOGIN) {
    const content = generateAuthModalContent(mode);
    const title = getAuthModalTitle(mode);
    
    showModal({
        title: title,
        content: content,
        size: 'small',
        scrollType: 'vertical',
        buttons: {
            showCancel: false,
            showOk: false
        },
        closeOnOverlay: true
    });
}

/**
 * モーダルタイトルを取得
 * @param {string} mode - 表示モード
 * @returns {string}
 */
function getAuthModalTitle(mode) {
    const titles = {
        [AUTH_MODAL_MODES.LOGIN]: 'ログイン',
        [AUTH_MODAL_MODES.REGISTER]: '新規会員登録',
        [AUTH_MODAL_MODES.RESET_PASSWORD]: 'パスワードリセット',
        [AUTH_MODAL_MODES.NEW_PASSWORD]: '新しいパスワードの設定',
        [AUTH_MODAL_MODES.EMAIL_LINK]: 'メールリンクログイン'
    };
    
    return titles[mode] || 'ログイン';
}

/**
 * モーダルコンテンツを生成
 * @param {string} mode - 表示モード
 * @returns {string}
 */
function generateAuthModalContent(mode) {
    switch (mode) {
        case AUTH_MODAL_MODES.LOGIN:
            return generateLoginContent();
        case AUTH_MODAL_MODES.REGISTER:
            return generateRegisterContent();
        case AUTH_MODAL_MODES.RESET_PASSWORD:
            return generateResetPasswordContent();
        case AUTH_MODAL_MODES.NEW_PASSWORD:
            return generateNewPasswordContent();
        case AUTH_MODAL_MODES.EMAIL_LINK:
            return generateEmailLinkContent();
        default:
            return generateLoginContent();
    }
}

// ========================================
// メインログイン画面
// ========================================

/**
 * メインログイン画面のコンテンツを生成
 * @returns {string}
 */
function generateLoginContent() {
    return `
        <form class="auth-form" id="loginForm" onsubmit="return handleLoginSubmit(event)">
            <div class="auth-form-group">
                <label class="auth-form-label" for="loginEmail">メールアドレス</label>
                <input type="email" class="auth-form-input" id="loginEmail" 
                       placeholder="example@email.com" required>
            </div>
            
            <div class="auth-form-group">
                <label class="auth-form-label" for="loginPassword">パスワード</label>
                <input type="password" class="auth-form-input" id="loginPassword" 
                       placeholder="パスワードを入力" required>
            </div>
            
            <button type="submit" class="auth-submit-button">ログイン</button>
            
            <div class="auth-links">
                <a class="auth-link" onclick="switchAuthModal('${AUTH_MODAL_MODES.REGISTER}')">
                    新規会員登録はこちら
                </a>
                <a class="auth-link" onclick="switchAuthModal('${AUTH_MODAL_MODES.EMAIL_LINK}')">
                    メールリンクでログインする
                </a>
                <a class="auth-link" onclick="switchAuthModal('${AUTH_MODAL_MODES.RESET_PASSWORD}')">
                    パスワードを忘れた場合はこちら
                </a>
            </div>
        </form>
    `;
}

/**
 * ログインフォーム送信処理
 * @param {Event} event
 * @returns {boolean}
 */
function handleLoginSubmit(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const result = performLogin(email, password);
    
    if (result.success) {
        // ログイン成功
        closeModal();
        updateHeaderAuthUI();
        showNotification(result.message, 'success');
    } else {
        // ログイン失敗
        showNotification(result.message, 'error');
    }
    
    return false;
}

// ========================================
// 新規会員登録画面
// ========================================

/**
 * 新規会員登録画面のコンテンツを生成
 * @returns {string}
 */
function generateRegisterContent() {
    return `
        <form class="auth-form" id="registerForm" onsubmit="return handleRegisterSubmit(event)">
            <div class="auth-form-group">
                <label class="auth-form-label" for="registerEmail">メールアドレス</label>
                <input type="email" class="auth-form-input" id="registerEmail" 
                       placeholder="example@email.com" required>
            </div>
            
            <div class="auth-form-group">
                <label class="auth-form-label" for="registerPassword">パスワード</label>
                <input type="password" class="auth-form-input" id="registerPassword" 
                       placeholder="パスワードを入力" required>
            </div>
            
            <div class="auth-form-group">
                <label class="auth-form-label" for="registerPasswordConfirm">パスワード（確認用）</label>
                <input type="password" class="auth-form-input" id="registerPasswordConfirm" 
                       placeholder="パスワードを再入力" required>
                <div class="auth-form-error" id="passwordConfirmError"></div>
            </div>
            
            <div class="auth-checkbox-group">
                <input type="checkbox" class="auth-checkbox" id="agreeTerms" required>
                <label class="auth-checkbox-label" for="agreeTerms">
                    <a href="#" target="_blank">利用規約</a>に同意する
                </label>
            </div>
            
            <div class="auth-checkbox-group">
                <input type="checkbox" class="auth-checkbox" id="agreePrivacy" required>
                <label class="auth-checkbox-label" for="agreePrivacy">
                    <a href="#" target="_blank">プライバシーポリシー</a>に同意する
                </label>
            </div>
            
            <div class="auth-checkbox-group">
                <input type="checkbox" class="auth-checkbox" id="newsletter" checked>
                <label class="auth-checkbox-label" for="newsletter">
                    メールで最新情報を受け取る（メールマガジン登録）
                </label>
            </div>
            
            <div class="auth-form-message" id="registerMessage"></div>
            
            <button type="submit" class="auth-submit-button">登録</button>
            
            <div class="auth-links">
                <a class="auth-link" onclick="switchAuthModal('${AUTH_MODAL_MODES.LOGIN}')">
                    ログインはこちら
                </a>
            </div>
        </form>
    `;
}

/**
 * 新規会員登録フォーム送信処理
 * @param {Event} event
 * @returns {boolean}
 */
function handleRegisterSubmit(event) {
    event.preventDefault();
    
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const passwordConfirm = document.getElementById('registerPasswordConfirm').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    const agreePrivacy = document.getElementById('agreePrivacy').checked;
    
    // エラー表示をクリア
    clearFormError('passwordConfirmError');
    clearFormMessage('registerMessage');
    
    // パスワード一致チェック
    if (password !== passwordConfirm) {
        showFormError('passwordConfirmError', 'パスワードが一致していません');
        return false;
    }
    
    // 利用規約・プライバシーポリシー同意チェック
    if (!agreeTerms || !agreePrivacy) {
        showFormMessage('registerMessage', '利用規約とプライバシーポリシーに同意してください', 'error');
        return false;
    }
    
    // 会員登録確認メールを送信（ダミー）
    addRegistrationEmail(email);
    
    // 成功メッセージを表示
    showFormMessage('registerMessage', `${email} に確認メールを送信しました。メールをご確認ください。\n\n※このモックアップでは、画面右上のベルアイコン（🔔）から確認できます。`, 'success');
    
    // フォームを無効化
    document.getElementById('registerForm').querySelectorAll('input, button').forEach(el => {
        el.disabled = true;
    });
    
    return false;
}

// ========================================
// パスワードリセット画面（メール送信）
// ========================================

/**
 * パスワードリセット画面のコンテンツを生成
 * @returns {string}
 */
function generateResetPasswordContent() {
    return `
        <form class="auth-form" id="resetPasswordForm" onsubmit="return handleResetPasswordSubmit(event)">
            <div class="auth-section-description">
                登録されているメールアドレスにパスワードリセット用のリンクを送信します。
            </div>
            
            <div class="auth-form-group">
                <label class="auth-form-label" for="resetEmail">メールアドレス</label>
                <input type="email" class="auth-form-input" id="resetEmail" 
                       placeholder="example@email.com" required>
            </div>
            
            <div class="auth-form-message" id="resetMessage"></div>
            
            <button type="submit" class="auth-submit-button">送信</button>
            
            <div class="auth-links">
                <a class="auth-link" onclick="switchAuthModal('${AUTH_MODAL_MODES.LOGIN}')">
                    ログインに戻る
                </a>
            </div>
        </form>
    `;
}

/**
 * パスワードリセットフォーム送信処理
 * @param {Event} event
 * @returns {boolean}
 */
function handleResetPasswordSubmit(event) {
    event.preventDefault();
    
    const email = document.getElementById('resetEmail').value;
    
    // エラー表示をクリア
    clearFormMessage('resetMessage');
    
    // パスワードリセットメールを送信（ダミー）
    addPasswordResetEmail(email);
    
    // 成功メッセージを表示
    showFormMessage('resetMessage', `${email} にパスワードリセットリンクを送信しました。メールをご確認ください。\n\n※このモックアップでは、画面右上のベルアイコン（🔔）から確認できます。`, 'success');
    
    // フォームを無効化
    document.getElementById('resetPasswordForm').querySelectorAll('input, button').forEach(el => {
        el.disabled = true;
    });
    
    return false;
}

// ========================================
// 新しいパスワード設定画面
// ========================================

/**
 * 新しいパスワード設定画面のコンテンツを生成
 * @returns {string}
 */
function generateNewPasswordContent() {
    return `
        <form class="auth-form" id="newPasswordForm" onsubmit="return handleNewPasswordSubmit(event)">
            <div class="auth-section-description">
                新しいパスワードを設定してください。
            </div>
            
            <div class="auth-form-group">
                <label class="auth-form-label" for="newPassword">新しいパスワード</label>
                <input type="password" class="auth-form-input" id="newPassword" 
                       placeholder="新しいパスワードを入力" required>
            </div>
            
            <div class="auth-form-group">
                <label class="auth-form-label" for="newPasswordConfirm">新しいパスワード（確認用）</label>
                <input type="password" class="auth-form-input" id="newPasswordConfirm" 
                       placeholder="パスワードを再入力" required>
                <div class="auth-form-error" id="newPasswordConfirmError"></div>
            </div>
            
            <div class="auth-form-message" id="newPasswordMessage"></div>
            
            <button type="submit" class="auth-submit-button">パスワードを設定</button>
        </form>
    `;
}

/**
 * 新しいパスワード設定フォーム送信処理
 * @param {Event} event
 * @returns {boolean}
 */
function handleNewPasswordSubmit(event) {
    event.preventDefault();
    
    const newPassword = document.getElementById('newPassword').value;
    const newPasswordConfirm = document.getElementById('newPasswordConfirm').value;
    
    // エラー表示をクリア
    clearFormError('newPasswordConfirmError');
    clearFormMessage('newPasswordMessage');
    
    // パスワード一致チェック
    if (newPassword !== newPasswordConfirm) {
        showFormError('newPasswordConfirmError', 'パスワードが一致していません');
        return false;
    }
    
    // パスワード設定成功（ダミー）
    showFormMessage('newPasswordMessage', 'パスワードを設定しました。新しいパスワードでログインしてください。', 'success');
    
    // フォームを無効化
    document.getElementById('newPasswordForm').querySelectorAll('input, button').forEach(el => {
        el.disabled = true;
    });
    
    // 3秒後にログイン画面へ遷移
    setTimeout(() => {
        switchAuthModal(AUTH_MODAL_MODES.LOGIN);
    }, 3000);
    
    return false;
}

// ========================================
// メールリンクログイン画面
// ========================================

/**
 * メールリンクログイン画面のコンテンツを生成
 * @returns {string}
 */
function generateEmailLinkContent() {
    return `
        <form class="auth-form" id="emailLinkForm" onsubmit="return handleEmailLinkSubmit(event)">
            <div class="auth-section-description">
                登録されているメールアドレスにログイン用のリンクを送信します。
            </div>
            
            <div class="auth-form-group">
                <label class="auth-form-label" for="emailLinkEmail">メールアドレス</label>
                <input type="email" class="auth-form-input" id="emailLinkEmail" 
                       placeholder="example@email.com" required>
            </div>
            
            <div class="auth-form-message" id="emailLinkMessage"></div>
            
            <button type="submit" class="auth-submit-button">送信</button>
            
            <div class="auth-links">
                <a class="auth-link" onclick="switchAuthModal('${AUTH_MODAL_MODES.LOGIN}')">
                    ログインに戻る
                </a>
            </div>
        </form>
    `;
}

/**
 * メールリンクログインフォーム送信処理
 * @param {Event} event
 * @returns {boolean}
 */
function handleEmailLinkSubmit(event) {
    event.preventDefault();
    
    const email = document.getElementById('emailLinkEmail').value;
    
    // エラー表示をクリア
    clearFormMessage('emailLinkMessage');
    
    // メールリンクログインメールを送信（ダミー）
    addEmailLinkLoginEmail(email);
    
    // 成功メッセージを表示
    showFormMessage('emailLinkMessage', `${email} にログインリンクを送信しました。メールをご確認ください。\n\n※このモックアップでは、画面右上のベルアイコン（🔔）から確認できます。`, 'success');
    
    // フォームを無効化
    document.getElementById('emailLinkForm').querySelectorAll('input, button').forEach(el => {
        el.disabled = true;
    });
    
    return false;
}

// ========================================
// フォーム内エラー・メッセージ表示
// ========================================

/**
 * フォーム内エラーを表示
 * @param {string} elementId - 表示先要素ID
 * @param {string} message - エラーメッセージ
 */
function showFormError(elementId, message) {
    const el = document.getElementById(elementId);
    if (el) {
        el.textContent = message;
        el.style.display = 'block';
    }
}

/**
 * フォーム内エラーをクリア
 * @param {string} elementId - 対象要素ID
 */
function clearFormError(elementId) {
    const el = document.getElementById(elementId);
    if (el) {
        el.textContent = '';
        el.style.display = 'none';
    }
}

/**
 * フォーム内メッセージを表示
 * @param {string} elementId - 表示先要素ID
 * @param {string} message - メッセージ
 * @param {string} type - メッセージタイプ（'success'|'error'|'info'）
 */
function showFormMessage(elementId, message, type = 'info') {
    const el = document.getElementById(elementId);
    if (el) {
        el.textContent = message;
        el.className = `auth-form-message ${type}`;
        el.style.display = 'block';
    }
}

/**
 * フォーム内メッセージをクリア
 * @param {string} elementId - 対象要素ID
 */
function clearFormMessage(elementId) {
    const el = document.getElementById(elementId);
    if (el) {
        el.textContent = '';
        el.style.display = 'none';
    }
}

// ========================================
// モーダル切り替え
// ========================================

/**
 * 認証モーダル内でモードを切り替え
 * @param {string} mode - 表示モード
 */
function switchAuthModal(mode) {
    const content = generateAuthModalContent(mode);
    const title = getAuthModalTitle(mode);
    
    updateModalContent(content);
    updateModalTitle(title);
}
