// セッション0.8.1 - 2025-10-17
// モーダル内検索入力制御
// 依存: chips.js, searchinput.js
// 更新: 削除時のスペース削除対応（closest使用）

// ========================================
// モーダル内検索入力のイベント設定
// ========================================

/**
 * モーダル内検索入力エリアのイベントを設定
 * @param {HTMLElement} searchInputArea - モーダル内検索入力エリア
 * @param {Function} syncCallback - 同期コールバック関数
 */
function setupModalSearchInput(searchInputArea, syncCallback) {
    // チップ削除・トグル
    searchInputArea.addEventListener('click', (e) => {
        // 削除ボタンのクリック処理
        if (e.target.classList.contains('chip-remove')) {
            e.preventDefault();
            e.stopPropagation();
            
            const chip = e.target.parentElement;
            
            // チップの直後のノードを確認
            const nextNode = chip.nextSibling;
            
            // チップを削除
            chip.remove();
            
            // 直後がスペースのテキストノードなら削除
            if (nextNode && nextNode.nodeType === Node.TEXT_NODE) {
                const text = nextNode.textContent;
                if (text.trim() === '') {
                    nextNode.remove();
                }
            }
            
            syncCallback();
            return;
        }
        
        // チップ本体のクリック処理（修正：closest使用）
        const tagChip = e.target.closest('.tag-chip');
        const textChip = e.target.closest('.text-chip');
        const chip = tagChip || textChip;
        
        if (chip) {
            // 削除ボタン内の要素をクリックした場合は除外
            if (e.target.classList.contains('chip-remove') || e.target.closest('.chip-remove')) {
                return;
            }
            
            e.preventDefault();
            
            const isActive = chip.dataset.active === 'true';
            chip.dataset.active = (!isActive).toString();
            
            syncCallback();
        }
    });
    
    // Enter キー処理
    searchInputArea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            
            const selection = window.getSelection();
            if (selection.rangeCount === 0) return;
            
            const range = selection.getRangeAt(0);
            let textNode = range.startContainer;
            
            if (textNode.nodeType !== Node.TEXT_NODE) return;
            if (textNode.parentNode !== searchInputArea) return;
            
            const text = textNode.textContent.trim();
            if (!text || text.length === 0) {
                textNode.remove();
                return;
            }
            
            // 既存タグとマッチするか確認
            const matched = findMatchingTag(text); // searchinput.jsの関数
            
            let chip;
            if (matched) {
                chip = createTagChip(matched.type, matched.tag); // chips.jsの関数
            } else {
                chip = createTextChip(text); // chips.jsの関数
            }
            
            if (chip) {
                textNode.parentNode.replaceChild(chip, textNode);
                setCursorAfter(chip); // searchinput.jsの関数
                syncCallback();
            } else {
                textNode.remove();
            }
        } else if (e.key === 'Backspace') {
            // Backspace処理
            const selection = window.getSelection();
            if (selection.rangeCount === 0) return;
            
            const range = selection.getRangeAt(0);
            
            if (!range.collapsed) return;
            
            let targetElement = null;
            
            if (range.startContainer === searchInputArea && range.startOffset > 0) {
                const prevNode = searchInputArea.childNodes[range.startOffset - 1];
                if (prevNode && (prevNode.classList?.contains('tag-chip') || prevNode.classList?.contains('text-chip'))) {
                    targetElement = prevNode;
                }
            } else if (range.startContainer.nodeType === Node.TEXT_NODE && range.startOffset === 0) {
                const textNode = range.startContainer;
                const prevSibling = textNode.previousSibling;
                
                if (prevSibling && (prevSibling.classList?.contains('tag-chip') || prevSibling.classList?.contains('text-chip'))) {
                    targetElement = prevSibling;
                }
            }
            
            if (targetElement) {
                e.preventDefault();
                
                // チップの直後のノードを確認
                const nextNode = targetElement.nextSibling;
                
                // チップを削除
                targetElement.remove();
                
                // 直後がスペースのテキストノードなら削除
                if (nextNode && nextNode.nodeType === Node.TEXT_NODE) {
                    const text = nextNode.textContent;
                    if (text.trim() === '') {
                        nextNode.remove();
                    }
                }
                
                syncCallback();
            }
        }
    });
}
