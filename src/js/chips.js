// セッション0.8.1 - 2025-10-17
// チップ生成機能
// 依存: なし
// 更新: 削除ボタンを左寄せに変更

// ========================================
// チップ生成ヘルパー関数
// ========================================

/**
 * タグチップを作成
 * @param {string} tagType - タグタイプ（collection/character/costume/situation）
 * @param {string} tagText - タグテキスト
 * @returns {HTMLElement|null} チップ要素（作成失敗時null）
 */
function createTagChip(tagType, tagText) {
    if (!tagText || !tagText.trim()) {
        return null;
    }
    
    const chip = document.createElement('span');
    chip.className = 'tag-chip';
    chip.contentEditable = 'false';
    chip.dataset.chipType = 'tag';
    chip.dataset.tagType = tagType;
    chip.dataset.tag = tagText;
    chip.dataset.active = 'true';
    
    // 削除ボタンを先に追加（左寄せ）
    const removeBtn = document.createElement('button');
    removeBtn.className = 'chip-remove';
    removeBtn.tabIndex = -1;
    removeBtn.textContent = '✖';
    chip.appendChild(removeBtn);
    
    // テキスト部分を後から追加
    const textSpan = document.createElement('span');
    textSpan.className = 'chip-text';
    textSpan.textContent = tagText;
    chip.appendChild(textSpan);
    
    return chip;
}

/**
 * テキストチップを作成
 * @param {string} text - テキスト内容
 * @returns {HTMLElement|null} チップ要素（作成失敗時null）
 */
function createTextChip(text) {
    if (!text || !text.trim()) {
        return null;
    }
    
    const chip = document.createElement('span');
    chip.className = 'text-chip';
    chip.contentEditable = 'false';
    chip.dataset.chipType = 'text';
    chip.dataset.text = text;
    chip.dataset.active = 'true';
    
    // 削除ボタンを先に追加（左寄せ）
    const removeBtn = document.createElement('button');
    removeBtn.className = 'chip-remove';
    removeBtn.tabIndex = -1;
    removeBtn.textContent = '✖';
    chip.appendChild(removeBtn);
    
    // テキスト部分を後から追加
    const textSpan = document.createElement('span');
    textSpan.className = 'chip-text';
    textSpan.textContent = text;
    chip.appendChild(textSpan);
    
    return chip;
}
