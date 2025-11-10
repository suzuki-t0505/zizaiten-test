// セッション0.7.0 - 2025-10-15
// サジェスト機能（入力補完）
// 依存: state.js, filtering.js, chips.js
// 新規作成: search.jsから分離

// ========================================
// サジェスト機能（キーボード操作対応）
// ========================================

let suggestionTimeout = null;
let currentSuggestionIndex = -1;

/**
 * タグサジェストを表示
 * @param {string} inputText - 入力中のテキスト
 */
function showTagSuggestions(inputText) {
    if (!inputText || inputText.length === 0) {
        hideSuggestions();
        return;
    }
    
    const tagCounts = countTagContents(); // filtering.jsの関数
    const allTags = [];
    
    Object.keys(tagCounts.collection).forEach(tag => {
        allTags.push({ type: 'collection', tag, count: tagCounts.collection[tag] });
    });
    Object.keys(tagCounts.character).forEach(tag => {
        allTags.push({ type: 'character', tag, count: tagCounts.character[tag] });
    });
    Object.keys(tagCounts.costume).forEach(tag => {
        allTags.push({ type: 'costume', tag, count: tagCounts.costume[tag] });
    });
    Object.keys(tagCounts.situation).forEach(tag => {
        allTags.push({ type: 'situation', tag, count: tagCounts.situation[tag] });
    });
    
    const matches = allTags.filter(item => 
        item.tag.includes(inputText)
    ).slice(0, 10);
    
    if (matches.length === 0) {
        hideSuggestions();
        return;
    }
    
    renderSuggestions(matches);
}

/**
 * サジェストUIを生成
 * @param {Array} matches - マッチしたタグの配列
 */
function renderSuggestions(matches) {
    const container = document.getElementById('searchSuggestions');
    container.innerHTML = '';
    
    matches.forEach((item, index) => {
        const el = document.createElement('div');
        el.className = 'suggestion-item';
        el.dataset.tagType = item.type;
        el.dataset.tag = item.tag;
        el.textContent = `${item.tag} (${item.count})`;
        
        if (index === 0) {
            el.classList.add('active');
            currentSuggestionIndex = 0;
        }
        
        el.onclick = () => insertSuggestedTag(item.tag, item.type);
        
        container.appendChild(el);
    });
    
    container.classList.add('show');
}

/**
 * サジェストを非表示
 */
function hideSuggestions() {
    const container = document.getElementById('searchSuggestions');
    container.classList.remove('show');
    container.innerHTML = '';
    currentSuggestionIndex = -1;
}

/**
 * サジェストが表示中か判定
 * @returns {boolean} 表示中ならtrue
 */
function hasActiveSuggestion() {
    const container = document.getElementById('searchSuggestions');
    return container.classList.contains('show');
}

/**
 * サジェスト選択を上下キーで移動
 * @param {string} direction - 'up'または'down'
 */
function moveSuggestionSelection(direction) {
    const container = document.getElementById('searchSuggestions');
    const items = container.querySelectorAll('.suggestion-item');
    
    if (items.length === 0) return;
    
    if (currentSuggestionIndex >= 0 && currentSuggestionIndex < items.length) {
        items[currentSuggestionIndex].classList.remove('active');
    }
    
    if (direction === 'down') {
        currentSuggestionIndex = (currentSuggestionIndex + 1) % items.length;
    } else if (direction === 'up') {
        currentSuggestionIndex = (currentSuggestionIndex - 1 + items.length) % items.length;
    }
    
    items[currentSuggestionIndex].classList.add('active');
}

/**
 * 選択中のサジェストを確定
 */
function insertActiveSuggestion() {
    const container = document.getElementById('searchSuggestions');
    const items = container.querySelectorAll('.suggestion-item');
    
    if (currentSuggestionIndex >= 0 && currentSuggestionIndex < items.length) {
        const activeItem = items[currentSuggestionIndex];
        const tagType = activeItem.dataset.tagType;
        const tag = activeItem.dataset.tag;
        insertSuggestedTag(tag, tagType);
    }
}

/**
 * サジェストからタグチップを挿入
 * @param {string} tagText - タグテキスト
 * @param {string} tagType - タグタイプ
 */
function insertSuggestedTag(tagText, tagType) {
    const container = document.getElementById('searchInputArea');
    
    // 生のテキストノードを全て削除
    const textNodesToRemove = [];
    for (let i = 0; i < container.childNodes.length; i++) {
        const node = container.childNodes[i];
        if (node.nodeType === Node.TEXT_NODE && node.parentNode === container) {
            textNodesToRemove.push(node);
        }
    }
    
    textNodesToRemove.forEach(textNode => {
        textNode.remove();
    });
    
    // チップを追加
    const chip = createTagChip(tagType, tagText);
    
    if (chip) {
        container.appendChild(chip);
        container.appendChild(document.createTextNode(' '));
        
        // カーソルを末尾に移動
        const range = document.createRange();
        const selection = window.getSelection();
        range.selectNodeContents(container);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
    }
    
    hideSuggestions();
    syncSearchState(); // searchinput.jsの関数（外部依存）
}
