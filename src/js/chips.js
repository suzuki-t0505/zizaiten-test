// セッション0.8.1 - 2025-10-17
// チップ生成機能
// ESModules対応版

export function createTagChip(tagType, tagText) {
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
    
    const removeBtn = document.createElement('button');
    removeBtn.className = 'chip-remove';
    removeBtn.tabIndex = -1;
    removeBtn.textContent = '✖';
    chip.appendChild(removeBtn);
    
    const textSpan = document.createElement('span');
    textSpan.className = 'chip-text';
    textSpan.textContent = tagText;
    chip.appendChild(textSpan);
    
    return chip;
}

export function createTextChip(text) {
    if (!text || !text.trim()) {
        return null;
    }
    
    const chip = document.createElement('span');
    chip.className = 'text-chip';
    chip.contentEditable = 'false';
    chip.dataset.chipType = 'text';
    chip.dataset.text = text;
    chip.dataset.active = 'true';
    
    const removeBtn = document.createElement('button');
    removeBtn.className = 'chip-remove';
    removeBtn.tabIndex = -1;
    removeBtn.textContent = '✖';
    chip.appendChild(removeBtn);
    
    const textSpan = document.createElement('span');
    textSpan.className = 'chip-text';
    textSpan.textContent = text;
    chip.appendChild(textSpan);
    
    return chip;
}
