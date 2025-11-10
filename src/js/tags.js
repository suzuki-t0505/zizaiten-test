// セッション0.8.2 - 2025-10-17
// タグ操作統合機能
// 依存: state.js, search.js, ui.js
// 更新: 無料素材表記統一（関数名変更: toggleFreeWeeklyTag → toggleFreeMaterialTag）

// ========================================
// 汎用タグトグル
// ========================================

/**
 * タグの選択/解除/有効無効をトグル
 * @param {string} tagType - タグタイプ（collection/character/costume/situation）
 * @param {string} tag - タグ名
 */
function toggleTag(tagType, tag) {
    const selectedKey = `selected${tagType.charAt(0).toUpperCase() + tagType.slice(1)}Tags`;
    const activeKey = `active${tagType.charAt(0).toUpperCase() + tagType.slice(1)}Tags`;
    
    const isSelected = state[selectedKey].includes(tag);
    const isActive = state[activeKey].includes(tag);
    
    if (!isSelected) {
        // 未選択 → 選択＆有効
        state[selectedKey].push(tag);
        state[activeKey].push(tag);
        insertTagChipToSearch(tagType, tag);
    } else if (isActive) {
        // 選択＆有効 → 削除
        const selectedIdx = state[selectedKey].indexOf(tag);
        if (selectedIdx > -1) {
            state[selectedKey].splice(selectedIdx, 1);
        }
        const activeIdx = state[activeKey].indexOf(tag);
        if (activeIdx > -1) {
            state[activeKey].splice(activeIdx, 1);
        }
        removeTagChipFromSearch(tagType, tag);
    } else {
        // 選択＆無効 → 有効化
        state[activeKey].push(tag);
        toggleTagChipInSearch(tagType, tag, true);
    }
    
    // UI更新
    generateThumbnails(); // ui.jsの関数
    
    if (state.currentVideo) {
        generateInfoTags(state.currentVideo); // ui.jsの関数
    }
    
    // キャラクタータグの場合はタグリストも更新
    if (tagType === 'character') {
        generateTags(); // ui.jsの関数
    }
}

// ========================================
// タグ操作（ラッパー関数）
// ========================================

function toggleCollectionTag(tag) {
    toggleTag('collection', tag);
}

function toggleCharacterTag(tag) {
    toggleTag('character', tag);
}

function toggleCostumeTag(tag) {
    toggleTag('costume', tag);
}

function toggleSituationTag(tag) {
    toggleTag('situation', tag);
}

/**
 * お気に入りタグのトグル（特別処理）
 */
function toggleFavoriteTag() {
    const tag = 'お気に入り';
    const isSelected = state.selectedCharacterTags.includes(tag);
    const isActive = state.activeCharacterTags.includes(tag);
    
    if (!isSelected) {
        // 未選択 → 選択＆有効
        state.selectedCharacterTags.push(tag);
        state.activeCharacterTags.push(tag);
        insertTagChipToSearch('character', tag);
    } else if (isActive) {
        // 選択＆有効 → 削除
        const selectedIdx = state.selectedCharacterTags.indexOf(tag);
        if (selectedIdx > -1) {
            state.selectedCharacterTags.splice(selectedIdx, 1);
        }
        const activeIdx = state.activeCharacterTags.indexOf(tag);
        if (activeIdx > -1) {
            state.activeCharacterTags.splice(activeIdx, 1);
        }
        removeTagChipFromSearch('character', tag);
    } else {
        // 選択＆無効 → 有効化
        state.activeCharacterTags.push(tag);
        toggleTagChipInSearch('character', tag, true);
    }
    
    // UI更新
    generateThumbnails();
    generateTags();
    
    if (state.currentVideo) {
        generateInfoTags(state.currentVideo);
    }
}

/**
 * 無料素材タグのトグル（特別処理）
 */
function toggleFreeMaterialTag() {
    const tag = '無料素材';
    const isSelected = state.selectedCharacterTags.includes(tag);
    const isActive = state.activeCharacterTags.includes(tag);
    
    if (!isSelected) {
        // 未選択 → 選択＆有効
        state.selectedCharacterTags.push(tag);
        state.activeCharacterTags.push(tag);
        insertTagChipToSearch('character', tag);
    } else if (isActive) {
        // 選択＆有効 → 削除
        const selectedIdx = state.selectedCharacterTags.indexOf(tag);
        if (selectedIdx > -1) {
            state.selectedCharacterTags.splice(selectedIdx, 1);
        }
        const activeIdx = state.activeCharacterTags.indexOf(tag);
        if (activeIdx > -1) {
            state.activeCharacterTags.splice(activeIdx, 1);
        }
        removeTagChipFromSearch('character', tag);
    } else {
        // 選択＆無効 → 有効化
        state.activeCharacterTags.push(tag);
        toggleTagChipInSearch('character', tag, true);
    }
    
    // UI更新
    generateThumbnails();
    generateTags();
    
    if (state.currentVideo) {
        generateInfoTags(state.currentVideo);
    }
}

// ========================================
// 検索入力エリア操作ヘルパー
// ========================================

/**
 * タグチップを検索エリアに追加（重複防止＋スペース追加）
 * @param {string} tagType - タグタイプ
 * @param {string} tag - タグ名
 */
function insertTagChipToSearch(tagType, tag) {
    const container = document.getElementById('searchInputArea');
    
    if (!container) {
        return;
    }
    
    // 既に同じチップが存在するかチェック（重複防止）
    const existingChips = container.querySelectorAll('.tag-chip');
    for (let chip of existingChips) {
        if (chip.dataset.tagType === tagType && chip.dataset.tag === tag) {
            return;
        }
    }
    
    // 余分なスペースをクリーンアップ（連続する複数のスペースを1つにまとめる）
    cleanupExtraSpaces(container);
    
    const chip = createTagChip(tagType, tag); // search.jsの関数
    
    if (chip) {
        container.appendChild(chip);
        container.appendChild(document.createTextNode(' '));
    }
}

/**
 * タグチップを検索エリアから削除（後続のスペースも削除）
 * @param {string} tagType - タグタイプ
 * @param {string} tag - タグ名
 */
function removeTagChipFromSearch(tagType, tag) {
    const container = document.getElementById('searchInputArea');
    const chips = container.querySelectorAll('.tag-chip');
    
    chips.forEach(chip => {
        if (chip.dataset.tagType === tagType && chip.dataset.tag === tag) {
            // チップの直後のノードを確認
            const nextNode = chip.nextSibling;
            
            // チップを削除
            chip.remove();
            
            // 直後がスペースのテキストノードなら削除
            if (nextNode && nextNode.nodeType === Node.TEXT_NODE) {
                const text = nextNode.textContent;
                // 空白のみのテキストノードなら削除
                if (text.trim() === '') {
                    nextNode.remove();
                }
            }
        }
    });
    
    // 削除後に余分なスペースをクリーンアップ
    cleanupExtraSpaces(container);
}

/**
 * タグチップのアクティブ状態をトグル
 * @param {string} tagType - タグタイプ
 * @param {string} tag - タグ名
 * @param {boolean} active - アクティブ状態
 */
function toggleTagChipInSearch(tagType, tag, active) {
    const container = document.getElementById('searchInputArea');
    const chips = container.querySelectorAll('.tag-chip');
    
    chips.forEach(chip => {
        if (chip.dataset.tagType === tagType && chip.dataset.tag === tag) {
            chip.dataset.active = active.toString();
        }
    });
}

/**
 * 余分なスペースをクリーンアップ（連続スペースを1つにまとめる、前後の空白を削除）
 * @param {HTMLElement} container - コンテナ要素
 */
function cleanupExtraSpaces(container) {
    const childNodes = Array.from(container.childNodes);
    
    childNodes.forEach((node, index) => {
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent;
            
            // 前後の空白を削除し、連続スペースを1つにまとめる
            const cleanedText = text.replace(/\s+/g, ' ');
            
            // 先頭ノードまたは末尾ノードの場合は完全に空白を削除
            if (index === 0 || index === childNodes.length - 1) {
                if (cleanedText.trim() === '') {
                    node.remove();
                    return;
                }
            }
            
            // 空白のみのノードで、前後にチップがない場合は削除
            if (cleanedText.trim() === '') {
                const prevNode = node.previousSibling;
                const nextNode = node.nextSibling;
                
                const hasPrevChip = prevNode && prevNode.nodeType === Node.ELEMENT_NODE && 
                                   (prevNode.classList?.contains('tag-chip') || prevNode.classList?.contains('text-chip'));
                const hasNextChip = nextNode && nextNode.nodeType === Node.ELEMENT_NODE && 
                                   (nextNode.classList?.contains('tag-chip') || nextNode.classList?.contains('text-chip'));
                
                // 前後ともチップがない、または片方しかない場合は削除
                if (!hasPrevChip || !hasNextChip) {
                    node.remove();
                    return;
                }
            }
            
            // テキストを更新
            if (text !== cleanedText) {
                node.textContent = cleanedText;
            }
        }
    });
}
