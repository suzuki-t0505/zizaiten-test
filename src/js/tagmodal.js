// セッション0.8.2 - 2025-10-17
// タグ検索システム（完全版）
// 依存: state.js, data.js, modal.js, ui.js, filtering.js, chips.js, searchinput.js, modalsearch.js
// 更新: 無料素材表記統一（内部変数含む完全統一）

// ========================================
// スペースクリーンアップ（モーダル専用）
// ========================================

/**
 * 余分なスペースをクリーンアップ（モーダル用）
 * @param {HTMLElement} container - コンテナ要素
 */
function cleanupModalExtraSpaces(container) {
    const childNodes = Array.from(container.childNodes);
    
    childNodes.forEach((node, index) => {
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent;
            
            // 連続スペースを1つにまとめる
            const cleanedText = text.replace(/\s+/g, ' ');
            
            // 先頭または末尾の空白ノードは削除
            if (index === 0 || index === childNodes.length - 1) {
                if (cleanedText.trim() === '') {
                    node.remove();
                    return;
                }
            }
            
            // 前後にチップがない空白ノードは削除
            if (cleanedText.trim() === '') {
                const prevNode = node.previousSibling;
                const nextNode = node.nextSibling;
                
                const hasPrevChip = prevNode && prevNode.nodeType === Node.ELEMENT_NODE && 
                                   (prevNode.classList?.contains('tag-chip') || prevNode.classList?.contains('text-chip'));
                const hasNextChip = nextNode && nextNode.nodeType === Node.ELEMENT_NODE && 
                                   (nextNode.classList?.contains('tag-chip') || nextNode.classList?.contains('text-chip'));
                
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

/**
 * モーダル内のチップを削除（後続のスペースも削除）
 * @param {HTMLElement} container - コンテナ要素
 * @param {string} tagType - タグタイプ
 * @param {string} tag - タグ名
 */
function removeChipFromModal(container, tagType, tag) {
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
                if (text.trim() === '') {
                    nextNode.remove();
                }
            }
        }
    });
    
    // 削除後にクリーンアップ
    cleanupModalExtraSpaces(container);
}

/**
 * モーダル内のチップを削除（タグ名のみで検索）
 * @param {HTMLElement} container - コンテナ要素
 * @param {string} tag - タグ名
 */
function removeChipByTagFromModal(container, tag) {
    const chips = container.querySelectorAll('.tag-chip');
    
    chips.forEach(chip => {
        if (chip.dataset.tag === tag) {
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
        }
    });
    
    // 削除後にクリーンアップ
    cleanupModalExtraSpaces(container);
}

// ========================================
// タグ検索モーダル（完全版 + お気に入り + 無料素材）
// ========================================

/**
 * タグ検索モーダルを表示
 */
function showTagSearchModal() {
    const tagCounts = countTagContents(); // filtering.jsの関数を使用
    
    // モーダル内の一時的な選択状態
    const tempSelectedTags = {
        favorite: false,  // お気に入り選択状態
        freeMaterial: false,  // 無料素材選択状態
        collection: [],
        character: [],
        costume: [],
        situation: []
    };
    
    const tempTextChips = [];
    
    // 結果カウントを更新する関数
    function updateResultCount() {
        const isFavoriteMode = tempSelectedTags.favorite;
        const isFreeMaterialMode = tempSelectedTags.freeMaterial;
        const count = countFilteredContents(tempSelectedTags, tempTextChips, isFavoriteMode, isFreeMaterialMode); // filtering.jsの関数を使用
        const countElement = document.getElementById('modalTagResultCount');
        if (countElement) {
            countElement.textContent = count;
        }
        
        // すべてのタグの数量を更新
        updateAllTagCounts();
    }
    
    // すべてのタグの数量を動的に更新する関数
    function updateAllTagCounts() {
        const modalContent = document.querySelector('.modal-content');
        if (!modalContent) return;
        
        const tagItems = modalContent.querySelectorAll('.modal-tag-item');
        
        tagItems.forEach(item => {
            const tagType = item.dataset.tagType;
            const tag = item.dataset.tag;
            
            // お気に入りタグの場合は特別処理
            if (tagType === 'favorite') {
                const countSpan = item.querySelector('.modal-tag-count');
                if (countSpan) {
                    countSpan.textContent = `(${tagCounts.favorite})`;
                }
                
                if (tagCounts.favorite === 0 && !tempSelectedTags.favorite) {
                    item.classList.add('grayed-out');
                } else {
                    item.classList.remove('grayed-out');
                }
                return;
            }
            
            // 無料素材タグの場合は特別処理
            if (tagType === 'freeMaterial') {
                const countSpan = item.querySelector('.modal-tag-count');
                if (countSpan) {
                    countSpan.textContent = `(${tagCounts.freeMaterial})`;
                }
                
                if (tagCounts.freeMaterial === 0 && !tempSelectedTags.freeMaterial) {
                    item.classList.add('grayed-out');
                } else {
                    item.classList.remove('grayed-out');
                }
                return;
            }
            
            // このタグ「のみ」を選択した場合の結果数を計算
            const testTags = {
                collection: [...tempSelectedTags.collection],
                character: [...tempSelectedTags.character],
                costume: [...tempSelectedTags.costume],
                situation: [...tempSelectedTags.situation]
            };
            
            // 同じカテゴリの選択をクリアして、このタグだけを設定
            testTags[tagType] = [tag];
            
            const count = countFilteredContents(testTags, tempTextChips, false, false); // filtering.jsの関数を使用
            
            // 数量表示を更新
            const countSpan = item.querySelector('.modal-tag-count');
            if (countSpan) {
                countSpan.textContent = `(${count})`;
            }
            
            // 数量0の場合はグレーアウト（ただし選択・操作は可能）
            const isSelected = tempSelectedTags[tagType].includes(tag);
            if (count === 0 && !isSelected) {
                item.classList.add('grayed-out');
            } else {
                item.classList.remove('grayed-out');
            }
        });
    }
    
    // モーダル内検索入力からデータを抽出
    function extractModalSearchData() {
        const container = document.getElementById('modalSearchInputArea');
        
        if (!container) {
            return {
                tags: {
                    collection: [],
                    character: [],
                    costume: [],
                    situation: []
                },
                textChips: []
            };
        }
        
        const tagChips = container.querySelectorAll('.tag-chip');
        const tags = {
            collection: [],
            character: [],
            costume: [],
            situation: []
        };
        
        tagChips.forEach(chip => {
            const type = chip.dataset.tagType;
            const tag = chip.dataset.tag;
            
            // お気に入り・無料素材タグは除外
            if (tag !== 'お気に入り' && tag !== '無料素材') {
                tags[type].push(tag);
            }
        });
        
        const textChips = [];
        const textChipElements = container.querySelectorAll('.text-chip');
        textChipElements.forEach(chip => {
            const text = chip.dataset.text;
            textChips.push({ text, active: true });
        });
        
        return { tags, textChips };
    }
    
    // モーダル内検索入力にチップを追加
    function insertChipToModal(chipElement) {
        const container = document.getElementById('modalSearchInputArea');
        if (!container) return;
        
        // 追加前にクリーンアップ
        cleanupModalExtraSpaces(container);
        
        container.appendChild(chipElement);
        container.appendChild(document.createTextNode(' '));
        
        // スクロールを最下部に
        container.scrollTop = container.scrollHeight;
    }
    
    // モーダル内検索入力を同期
    function syncModalSearchInput() {
        const { tags, textChips } = extractModalSearchData();
        
        tempSelectedTags.collection = tags.collection;
        tempSelectedTags.character = tags.character;
        tempSelectedTags.costume = tags.costume;
        tempSelectedTags.situation = tags.situation;
        
        tempTextChips.length = 0;
        textChips.forEach(chip => tempTextChips.push(chip));
        
        // タグリストのDOM要素も同期（チップ削除時に選択解除）
        const modalContent = document.querySelector('.modal-content');
        if (modalContent) {
            const tagItems = modalContent.querySelectorAll('.modal-tag-item');
            
            tagItems.forEach(item => {
                const tagType = item.dataset.tagType;
                const tag = item.dataset.tag;
                
                if (tagType === 'favorite' || tagType === 'freeMaterial') {
                    // 特殊タグの同期は別処理
                    return;
                }
                
                // tempSelectedTagsに含まれているかチェック
                if (tempSelectedTags[tagType].includes(tag)) {
                    item.classList.add('selected');
                } else {
                    item.classList.remove('selected');
                }
            });
        }
        
        updateResultCount();
    }
    
    // コンテンツ作成
    const content = document.createElement('div');
    
    // モーダル検索入力エリア
    const searchInputContainer = document.createElement('div');
    searchInputContainer.className = 'modal-search-input-container';
    searchInputContainer.style.cssText = 'margin-bottom: 16px; border: 1px solid #ddd; border-radius: 4px; padding: 8px; background: #fff; max-height: 150px; overflow-y: auto;';
    
    const searchInputArea = document.createElement('div');
    searchInputArea.id = 'modalSearchInputArea';
    searchInputArea.className = 'search-input-area';
    searchInputArea.contentEditable = 'true';
    searchInputArea.setAttribute('data-placeholder', 'タグまたはテキストで検索');
    searchInputArea.style.cssText = 'min-height: 30px; max-height: none; border: none; padding: 0;';
    
    searchInputContainer.appendChild(searchInputArea);
    content.appendChild(searchInputContainer);
    
    // 既存の検索入力エリアの内容をコピー
    const mainSearchInputArea = document.getElementById('searchInputArea');
    if (mainSearchInputArea) {
        const existingChips = mainSearchInputArea.querySelectorAll('.tag-chip, .text-chip');
        existingChips.forEach(chip => {
            const clonedChip = chip.cloneNode(true);
            searchInputArea.appendChild(clonedChip);
            searchInputArea.appendChild(document.createTextNode(' '));
            
            // tempSelectedTagsとtempTextChipsに追加
            if (chip.classList.contains('tag-chip')) {
                const tagType = chip.dataset.tagType;
                const tag = chip.dataset.tag;
                
                // お気に入り・無料素材タグは特別処理
                if (tag === 'お気に入り') {
                    tempSelectedTags.favorite = true;
                } else if (tag === '無料素材') {
                    tempSelectedTags.freeMaterial = true;
                } else if (!tempSelectedTags[tagType].includes(tag)) {
                    tempSelectedTags[tagType].push(tag);
                }
            } else if (chip.classList.contains('text-chip')) {
                const text = chip.dataset.text;
                tempTextChips.push({ text, active: true });
            }
        });
    }
    
    // 結果表示エリア
    const resultArea = document.createElement('div');
    resultArea.className = 'modal-tag-result';
    resultArea.innerHTML = `
        <span class="modal-tag-result-text">抽出結果: <span class="modal-tag-result-count" id="modalTagResultCount">48</span> 件</span>
        <button class="modal-tag-clear" id="modalTagClear">クリア</button>
    `;
    content.appendChild(resultArea);
    
    // カテゴリ作成関数
    function createCategory(title, tagType, tags) {
        const category = document.createElement('div');
        category.className = 'modal-tag-category expanded';
        
        const header = document.createElement('div');
        header.className = 'modal-tag-category-header';
        
        const titleEl = document.createElement('h3');
        titleEl.className = 'modal-tag-category-title';
        titleEl.textContent = title;
        
        const icon = document.createElement('span');
        icon.className = 'modal-tag-category-icon';
        icon.textContent = '▼';
        
        header.appendChild(titleEl);
        header.appendChild(icon);
        
        header.onclick = () => {
            category.classList.toggle('expanded');
        };
        
        const contentEl = document.createElement('div');
        contentEl.className = 'modal-tag-category-content';
        
        const grid = document.createElement('div');
        grid.className = 'modal-tag-grid';
        
        tags.forEach(tag => {
            const item = document.createElement('div');
            item.className = 'modal-tag-item';
            item.setAttribute('data-tag-type', tagType);
            item.setAttribute('data-tag', tag);
            
            const tagName = document.createElement('span');
            tagName.textContent = tag;
            
            const count = document.createElement('span');
            count.className = 'modal-tag-count';
            
            if (tagType === 'favorite') {
                count.textContent = `(${tagCounts.favorite})`;
            } else if (tagType === 'freeMaterial') {
                count.textContent = `(${tagCounts.freeMaterial})`;
            } else {
                count.textContent = `(${tagCounts[tagType][tag] || 0})`;
            }
            
            item.appendChild(tagName);
            item.appendChild(count);
            
            // 既に選択されている場合は selected クラスを追加
            if (tagType === 'favorite' && tempSelectedTags.favorite) {
                item.classList.add('selected');
            } else if (tagType === 'freeMaterial' && tempSelectedTags.freeMaterial) {
                item.classList.add('selected');
            } else if (tagType !== 'favorite' && tagType !== 'freeMaterial' && tempSelectedTags[tagType].includes(tag)) {
                item.classList.add('selected');
            }
            
            item.onclick = () => {
                if (tagType === 'favorite') {
                    // お気に入りタグのトグル
                    tempSelectedTags.favorite = !tempSelectedTags.favorite;
                    
                    if (tempSelectedTags.favorite) {
                        item.classList.add('selected');
                        const chip = createTagChip('character', 'お気に入り');
                        if (chip) {
                            insertChipToModal(chip);
                        }
                    } else {
                        item.classList.remove('selected');
                        removeChipByTagFromModal(searchInputArea, 'お気に入り');
                    }
                } else if (tagType === 'freeMaterial') {
                    // 無料素材タグのトグル
                    tempSelectedTags.freeMaterial = !tempSelectedTags.freeMaterial;
                    
                    if (tempSelectedTags.freeMaterial) {
                        item.classList.add('selected');
                        const chip = createTagChip('character', '無料素材');
                        if (chip) {
                            insertChipToModal(chip);
                        }
                    } else {
                        item.classList.remove('selected');
                        removeChipByTagFromModal(searchInputArea, '無料素材');
                    }
                } else {
                    // 通常タグのトグル
                    const idx = tempSelectedTags[tagType].indexOf(tag);
                    if (idx > -1) {
                        // 選択解除 → チップを削除
                        tempSelectedTags[tagType].splice(idx, 1);
                        item.classList.remove('selected');
                        removeChipFromModal(searchInputArea, tagType, tag);
                    } else {
                        // 選択 → チップを追加
                        tempSelectedTags[tagType].push(tag);
                        item.classList.add('selected');
                        
                        const chip = createTagChip(tagType, tag);
                        if (chip) {
                            insertChipToModal(chip);
                        }
                    }
                }
                
                updateResultCount();
            };
            
            grid.appendChild(item);
        });
        
        contentEl.appendChild(grid);
        category.appendChild(header);
        category.appendChild(contentEl);
        
        return category;
    }
    
    // その他カテゴリを追加（お気に入り + 無料素材）
    const otherTags = [];
    if (state.favoriteVideos.length > 0) {
        otherTags.push({ type: 'favorite', label: 'お気に入り' });
    }
    if (tagCounts.freeMaterial > 0) {
        otherTags.push({ type: 'freeMaterial', label: '無料素材' });
    }
    
    if (otherTags.length > 0) {
        const category = document.createElement('div');
        category.className = 'modal-tag-category expanded';
        
        const header = document.createElement('div');
        header.className = 'modal-tag-category-header';
        
        const titleEl = document.createElement('h3');
        titleEl.className = 'modal-tag-category-title';
        titleEl.textContent = 'その他';
        
        const icon = document.createElement('span');
        icon.className = 'modal-tag-category-icon';
        icon.textContent = '▼';
        
        header.appendChild(titleEl);
        header.appendChild(icon);
        
        header.onclick = () => {
            category.classList.toggle('expanded');
        };
        
        const contentEl = document.createElement('div');
        contentEl.className = 'modal-tag-category-content';
        
        const grid = document.createElement('div');
        grid.className = 'modal-tag-grid';
        
        otherTags.forEach(({ type, label }) => {
            const item = document.createElement('div');
            item.className = 'modal-tag-item';
            item.setAttribute('data-tag-type', type);
            item.setAttribute('data-tag', label);
            
            const tagName = document.createElement('span');
            tagName.textContent = label;
            
            const count = document.createElement('span');
            count.className = 'modal-tag-count';
            
            if (type === 'favorite') {
                count.textContent = `(${tagCounts.favorite})`;
            } else if (type === 'freeMaterial') {
                count.textContent = `(${tagCounts.freeMaterial})`;
            }
            
            item.appendChild(tagName);
            item.appendChild(count);
            
            // 既に選択されている場合は selected クラスを追加
            if (type === 'favorite' && tempSelectedTags.favorite) {
                item.classList.add('selected');
            } else if (type === 'freeMaterial' && tempSelectedTags.freeMaterial) {
                item.classList.add('selected');
            }
            
            item.onclick = () => {
                if (type === 'favorite') {
                    // お気に入りタグのトグル
                    tempSelectedTags.favorite = !tempSelectedTags.favorite;
                    
                    if (tempSelectedTags.favorite) {
                        item.classList.add('selected');
                        const chip = createTagChip('character', 'お気に入り');
                        if (chip) {
                            insertChipToModal(chip);
                        }
                    } else {
                        item.classList.remove('selected');
                        removeChipByTagFromModal(searchInputArea, 'お気に入り');
                    }
                } else if (type === 'freeMaterial') {
                    // 無料素材タグのトグル
                    tempSelectedTags.freeMaterial = !tempSelectedTags.freeMaterial;
                    
                    if (tempSelectedTags.freeMaterial) {
                        item.classList.add('selected');
                        const chip = createTagChip('character', '無料素材');
                        if (chip) {
                            insertChipToModal(chip);
                        }
                    } else {
                        item.classList.remove('selected');
                        removeChipByTagFromModal(searchInputArea, '無料素材');
                    }
                }
                
                updateResultCount();
            };
            
            grid.appendChild(item);
        });
        
        contentEl.appendChild(grid);
        category.appendChild(header);
        category.appendChild(contentEl);
        
        content.appendChild(category);
    }
    
    // 収録テーマカテゴリ
    const collectionTags = Object.keys(tagCounts.collection).sort((a, b) => {
        return tagCounts.collection[b] - tagCounts.collection[a];
    });
    content.appendChild(createCategory('収録テーマ', 'collection', collectionTags));
    
    // キャラクターカテゴリ
    const characterTagsSorted = Object.keys(tagCounts.character).sort((a, b) => {
        return tagCounts.character[b] - tagCounts.character[a];
    });
    content.appendChild(createCategory('キャラクター', 'character', characterTagsSorted));
    
    // シチュエーションカテゴリ
    const situationTagsSorted = Object.keys(tagCounts.situation).sort((a, b) => {
        return tagCounts.situation[b] - tagCounts.situation[a];
    });
    content.appendChild(createCategory('シチュエーション', 'situation', situationTagsSorted));
    
    // 服装・小道具カテゴリ
    const costumeTagsSorted = Object.keys(tagCounts.costume).sort((a, b) => {
        return tagCounts.costume[b] - tagCounts.costume[a];
    });
    content.appendChild(createCategory('服装・小道具', 'costume', costumeTagsSorted));
    
    // モーダル表示
    showModal({
        title: 'タグ検索',
        content: content,
        size: 'medium',
        scrollType: 'vertical',
        buttons: {
            showCancel: true,
            cancelText: 'キャンセル',
            showOk: true,
            okText: '適用',
            onOk: () => {
                // 検索入力エリアをクリア
                const mainSearchInput = document.getElementById('searchInputArea');
                mainSearchInput.innerHTML = '';
                
                // 既存のタグをすべてクリア
                state.selectedCollectionTags = [];
                state.selectedCharacterTags = [];
                state.selectedCostumeTags = [];
                state.selectedSituationTags = [];
                state.activeCollectionTags = [];
                state.activeCharacterTags = [];
                state.activeCostumeTags = [];
                state.activeSituationTags = [];
                state.textChips = [];
                state.activeTextChips = [];
                
                // モーダル内検索入力の内容を通常画面にコピー
                const modalChips = searchInputArea.querySelectorAll('.tag-chip, .text-chip');
                modalChips.forEach(chip => {
                    const clonedChip = chip.cloneNode(true);
                    mainSearchInput.appendChild(clonedChip);
                    mainSearchInput.appendChild(document.createTextNode(' '));
                });
                
                // 状態を同期
                const { tags, textChips } = extractModalSearchData();
                
                state.selectedCollectionTags = [...tags.collection];
                state.selectedCharacterTags = [...tags.character];
                state.selectedCostumeTags = [...tags.costume];
                state.selectedSituationTags = [...tags.situation];
                state.activeCollectionTags = [...tags.collection];
                state.activeCharacterTags = [...tags.character];
                state.activeCostumeTags = [...tags.costume];
                state.activeSituationTags = [...tags.situation];
                
                // お気に入り・無料素材タグを追加
                if (tempSelectedTags.favorite) {
                    state.selectedCharacterTags.push('お気に入り');
                    state.activeCharacterTags.push('お気に入り');
                }
                if (tempSelectedTags.freeMaterial) {
                    state.selectedCharacterTags.push('無料素材');
                    state.activeCharacterTags.push('無料素材');
                }
                
                state.textChips = textChips.map(chip => ({ ...chip }));
                state.activeTextChips = textChips.filter(chip => chip.active).map(chip => ({ ...chip }));
                
                // UI更新
                generateTags();
                generateThumbnails();
                
                if (state.currentVideo) {
                    generateInfoTags(state.currentVideo);
                }
            }
        }
    });
    
    // モーダル内検索入力のイベント設定
    setupModalSearchInput(searchInputArea, syncModalSearchInput); // modalsearch.jsの関数
    
    // クリアボタンのイベント設定
    const clearButton = document.getElementById('modalTagClear');
    if (clearButton) {
        clearButton.onclick = () => {
            // 検索入力エリアをクリア
            searchInputArea.innerHTML = '';
            
            // 一時選択状態をクリア
            tempSelectedTags.favorite = false;
            tempSelectedTags.freeMaterial = false;
            tempSelectedTags.collection = [];
            tempSelectedTags.character = [];
            tempSelectedTags.costume = [];
            tempSelectedTags.situation = [];
            tempTextChips.length = 0;
            
            // すべてのタグの選択を解除
            content.querySelectorAll('.modal-tag-item.selected').forEach(item => {
                item.classList.remove('selected');
            });
            
            updateResultCount();
        };
    }
    
    // 初回結果カウント更新
    updateResultCount();
}
