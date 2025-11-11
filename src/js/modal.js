// セッション0.6.2 - 2025-10-15
// 汎用モーダル制御機能
// ESModules対応版

export function showModal(options) {
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
    
    const existingModal = document.getElementById('modalOverlay');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'modalOverlay';
    modalOverlay.className = 'modal-overlay';
    
    const modalContainer = document.createElement('div');
    modalContainer.className = `modal-container modal-size-${config.size}`;
    
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
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    if (config.scrollType === 'vertical') {
        modalContent.classList.add('scroll-vertical');
    } else if (config.scrollType === 'horizontal') {
        modalContent.classList.add('scroll-horizontal');
    } else if (config.scrollType === 'none') {
        modalContent.classList.add('scroll-none');
    }
    
    if (typeof config.content === 'string') {
        modalContent.innerHTML = config.content;
    } else if (config.content instanceof HTMLElement) {
        modalContent.appendChild(config.content);
    }
    
    const modalFooter = document.createElement('div');
    modalFooter.className = 'modal-footer';
    
    if (!config.buttons.showCancel && !config.buttons.showOk) {
        modalFooter.classList.add('hide');
    } else {
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
        
        if (config.buttons.showOk) {
            const okButton = document.createElement('button');
            okButton.className = 'modal-button-ok';
            okButton.textContent = config.buttons.okText;
            okButton.onclick = () => {
                if (config.buttons.onOk) {
                    const result = config.buttons.onOk();
                    if (result === false) return;
                }
                closeModal();
            };
            modalFooter.appendChild(okButton);
        }
    }
    
    modalContainer.appendChild(modalHeader);
    modalContainer.appendChild(modalContent);
    modalContainer.appendChild(modalFooter);
    modalOverlay.appendChild(modalContainer);
    
    if (config.closeOnOverlay) {
        modalOverlay.onclick = (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        };
    }
    
    document.body.appendChild(modalOverlay);
    
    requestAnimationFrame(() => {
        modalOverlay.classList.add('show');
    });
}

export function closeModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    if (!modalOverlay) return;
    
    modalOverlay.classList.remove('show');
    
    setTimeout(() => {
        modalOverlay.remove();
    }, 300);
}

export function updateModalContent(content) {
    const modalContent = document.querySelector('.modal-content');
    if (!modalContent) return;
    
    if (typeof content === 'string') {
        modalContent.innerHTML = content;
    } else if (content instanceof HTMLElement) {
        modalContent.innerHTML = '';
        modalContent.appendChild(content);
    }
}

export function updateModalTitle(title) {
    const modalTitle = document.querySelector('.modal-title');
    if (!modalTitle) return;
    
    modalTitle.textContent = title;
}
