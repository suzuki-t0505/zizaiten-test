// セッション0.6.2 - 2025-10-15
// 汎用モーダル制御機能
// 依存: state.js
// 更新: デバッグログ削除

// ========================================
// モーダル制御
// ========================================

/**
 * モーダルを表示
 * @param {Object} options - モーダルオプション
 * @param {string} options.title - モーダルタイトル
 * @param {string|HTMLElement} options.content - モーダルコンテンツ（HTML文字列またはDOM要素）
 * @param {string} options.size - モーダルサイズ（'small'|'medium'|'large'）デフォルト: 'medium'
 * @param {string} options.scrollType - スクロールタイプ（'vertical'|'horizontal'|'both'|'none'）デフォルト: 'both'
 * @param {Object} options.buttons - ボタン設定
 * @param {boolean} options.buttons.showCancel - キャンセルボタン表示 デフォルト: true
 * @param {string} options.buttons.cancelText - キャンセルボタンテキスト デフォルト: 'キャンセル'
 * @param {Function} options.buttons.onCancel - キャンセル時のコールバック
 * @param {boolean} options.buttons.showOk - OKボタン表示 デフォルト: true
 * @param {string} options.buttons.okText - OKボタンテキスト デフォルト: 'OK'
 * @param {Function} options.buttons.onOk - OK時のコールバック
 * @param {boolean} options.closeOnOverlay - オーバーレイクリックで閉じる デフォルト: true
 */
function showModal(options) {
    // デフォルト値
    const config = {
        title: options.title || 'モーダル',
        content: options.content || '',
        size: options.size || 'medium',
        scrollType: options.scrollType || 'both',
        buttons: {
            showCancel: options.buttons?.showCancel !== false,
            cancelText: options.buttons?.cancelText || 'キャンセル',
            onCancel: options.buttons?.onCancel || null,
            showOk: options.buttons?.showOk !== false,
            okText: options.buttons?.okText || 'OK',
            onOk: options.buttons?.onOk || null
        },
        closeOnOverlay: options.closeOnOverlay !== false
    };
    
    // 既存のモーダルを削除
    const existingModal = document.getElementById('modalOverlay');
    if (existingModal) {
        existingModal.remove();
    }
    
    // モーダルHTML作成
    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'modalOverlay';
    modalOverlay.className = 'modal-overlay';
    
    const modalContainer = document.createElement('div');
    modalContainer.className = `modal-container modal-size-${config.size}`;
    
    // ヘッダー
    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';
    
    const modalTitle = document.createElement('h2');
    modalTitle.className = 'modal-title';
    modalTitle.textContent = config.title;
    
    const modalClose = document.createElement('button');
    modalClose.className = 'modal-close';
    modalClose.textContent = '✖';
    modalClose.onclick = () => closeModal();
    
    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(modalClose);
    
    // コンテンツ
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    // スクロールタイプの設定
    if (config.scrollType === 'vertical') {
        modalContent.classList.add('scroll-vertical');
    } else if (config.scrollType === 'horizontal') {
        modalContent.classList.add('scroll-horizontal');
    } else if (config.scrollType === 'none') {
        modalContent.classList.add('scroll-none');
    }
    
    // コンテンツの挿入
    if (typeof config.content === 'string') {
        modalContent.innerHTML = config.content;
    } else if (config.content instanceof HTMLElement) {
        modalContent.appendChild(config.content);
    }
    
    // フッター
    const modalFooter = document.createElement('div');
    modalFooter.className = 'modal-footer';
    
    // ボタンが両方非表示の場合、フッター全体を非表示
    if (!config.buttons.showCancel && !config.buttons.showOk) {
        modalFooter.classList.add('hide');
    } else {
        // キャンセルボタン
        if (config.buttons.showCancel) {
            const cancelButton = document.createElement('button');
            cancelButton.className = 'modal-button-cancel';
            cancelButton.textContent = config.buttons.cancelText;
            cancelButton.onclick = () => {
                if (config.buttons.onCancel) {
                    config.buttons.onCancel();
                }
                closeModal();
            };
            modalFooter.appendChild(cancelButton);
        }
        
        // OKボタン
        if (config.buttons.showOk) {
            const okButton = document.createElement('button');
            okButton.className = 'modal-button-ok';
            okButton.textContent = config.buttons.okText;
            okButton.onclick = () => {
                if (config.buttons.onOk) {
                    const result = config.buttons.onOk();
                    // onOkがfalseを返した場合はモーダルを閉じない
                    if (result === false) return;
                }
                closeModal();
            };
            modalFooter.appendChild(okButton);
        }
    }
    
    // 組み立て
    modalContainer.appendChild(modalHeader);
    modalContainer.appendChild(modalContent);
    modalContainer.appendChild(modalFooter);
    modalOverlay.appendChild(modalContainer);
    
    // オーバーレイクリックで閉じる
    if (config.closeOnOverlay) {
        modalOverlay.onclick = (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        };
    }
    
    // DOMに追加
    document.body.appendChild(modalOverlay);
    
    // 表示アニメーション
    requestAnimationFrame(() => {
        modalOverlay.classList.add('show');
    });
}

/**
 * モーダルを閉じる
 */
function closeModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    if (!modalOverlay) return;
    
    // フェードアウト
    modalOverlay.classList.remove('show');
    
    // アニメーション完了後に削除
    setTimeout(() => {
        modalOverlay.remove();
    }, 300);
}

/**
 * モーダルのコンテンツを更新
 * @param {string|HTMLElement} content - 新しいコンテンツ
 */
function updateModalContent(content) {
    const modalContent = document.querySelector('.modal-content');
    if (!modalContent) return;
    
    if (typeof content === 'string') {
        modalContent.innerHTML = content;
    } else if (content instanceof HTMLElement) {
        modalContent.innerHTML = '';
        modalContent.appendChild(content);
    }
}

/**
 * モーダルのタイトルを更新
 * @param {string} title - 新しいタイトル
 */
function updateModalTitle(title) {
    const modalTitle = document.querySelector('.modal-title');
    if (!modalTitle) return;
    
    modalTitle.textContent = title;
}
