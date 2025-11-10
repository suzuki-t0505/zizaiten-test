// セッション0.8.2 - 2025-10-17
// フィルタリング統合機能
// 依存: data.js
// 更新: 無料素材表記統一（内部変数含む完全統一）

// ========================================
// 汎用フィルタリング関数
// ========================================

/**
 * 動画をフィルタリング（お気に入り・無料素材対応版、ピン止め常時表示）
 * @param {Object} selectedTags - 選択されたタグ {collection: [], character: [], costume: [], situation: []}
 * @param {Array} textChips - テキストチップ [{text: string, active: boolean}]
 * @param {boolean} isFavoriteMode - お気に入りモードかどうか
 * @param {boolean} isFreeMaterialMode - 無料素材モードかどうか
 * @returns {Array} フィルタリング結果のビデオIDリスト
 */
function filterVideos(selectedTags, textChips, isFavoriteMode = false, isFreeMaterialMode = false) {
    let filteredIds = [];
    
    // お気に入りモードの場合
    if (isFavoriteMode) {
        // お気に入り動画をベースにする
        filteredIds = [...state.favoriteVideos];
        
        // ピン止めされているコンテンツで、お気に入りに含まれていないものを追加
        state.pinnedVideos.forEach(id => {
            if (!filteredIds.includes(id)) {
                filteredIds.push(id);
            }
        });
    }
    // 無料素材モードの場合
    else if (isFreeMaterialMode) {
        // isFree: true の動画をベースにする
        Object.keys(videoDatabase).forEach(id => {
            const video = videoDatabase[id];
            if (video.isFree) {
                filteredIds.push(id);
            }
        });
        
        // ピン止めされているコンテンツで、無料素材に含まれていないものを追加
        state.pinnedVideos.forEach(id => {
            if (!filteredIds.includes(id)) {
                filteredIds.push(id);
            }
        });
    }
    // 通常のフィルタリング
    else {
        Object.keys(videoDatabase).forEach(id => {
            // ピン止めされているコンテンツは常に含める
            if (state.pinnedVideos.includes(id)) {
                filteredIds.push(id);
                return;
            }
            
            const video = videoDatabase[id];
            let matchesFilter = true;
            
            // 収録テーマタグフィルタ
            if (selectedTags.collection && selectedTags.collection.length > 0) {
                const hasCollectionMatch = selectedTags.collection.some(selectedTag => 
                    video.collectionTag === selectedTag
                );
                if (!hasCollectionMatch) matchesFilter = false;
            }
            
            // キャラクタータグフィルタ
            if (selectedTags.character && selectedTags.character.length > 0) {
                const hasCharacterMatch = selectedTags.character.some(selectedTag => 
                    video.characterTags.includes(selectedTag)
                );
                if (!hasCharacterMatch) matchesFilter = false;
            }
            
            // 衣装タグフィルタ
            if (selectedTags.costume && selectedTags.costume.length > 0) {
                const hasCostumeMatch = selectedTags.costume.some(selectedTag => 
                    video.costumeTags.includes(selectedTag)
                );
                if (!hasCostumeMatch) matchesFilter = false;
            }
            
            // シチュエーションタグフィルタ
            if (selectedTags.situation && selectedTags.situation.length > 0) {
                const hasSituationMatch = selectedTags.situation.some(selectedTag => 
                    video.situationTags.includes(selectedTag)
                );
                if (!hasSituationMatch) matchesFilter = false;
            }
            
            // フリーテキストチップフィルタ
            if (textChips && textChips.length > 0) {
                const allMatch = textChips.every(chip => {
                    const searchLower = chip.text.toLowerCase();
                    const titleMatch = video.title.toLowerCase().includes(searchLower);
                    const descMatch = video.description.toLowerCase().includes(searchLower);
                    return titleMatch || descMatch;
                });
                
                if (!allMatch) matchesFilter = false;
            }
            
            if (matchesFilter) {
                filteredIds.push(id);
            }
        });
    }
    
    // ピン止めコンテンツを最優先で先頭に配置（重複削除）
    const pinnedIds = state.pinnedVideos.filter(id => filteredIds.includes(id));
    const unpinnedIds = filteredIds.filter(id => !state.pinnedVideos.includes(id));
    
    return [...pinnedIds, ...unpinnedIds];
}

// ========================================
// タグカウント機能
// ========================================

/**
 * 各タグに含まれるコンテンツ数をカウント（お気に入り・無料素材対応版）
 * @returns {Object} カウント結果 {favorite: number, freeMaterial: number, collection: {}, character: {}, costume: {}, situation: {}}
 */
function countTagContents() {
    const counts = {
        favorite: state.favoriteVideos.length,  // お気に入り件数
        freeMaterial: 0,  // 無料素材件数
        collection: {},
        character: {},
        costume: {},
        situation: {}
    };
    
    Object.values(videoDatabase).forEach(video => {
        // 無料素材カウント
        if (video.isFree) {
            counts.freeMaterial++;
        }
        
        if (video.collectionTag) {
            counts.collection[video.collectionTag] = (counts.collection[video.collectionTag] || 0) + 1;
        }
        
        video.characterTags.forEach(tag => {
            counts.character[tag] = (counts.character[tag] || 0) + 1;
        });
        
        video.costumeTags.forEach(tag => {
            counts.costume[tag] = (counts.costume[tag] || 0) + 1;
        });
        
        video.situationTags.forEach(tag => {
            counts.situation[tag] = (counts.situation[tag] || 0) + 1;
        });
    });
    
    return counts;
}

/**
 * フィルタリング結果の件数をカウント
 * @param {Object} selectedTags - 選択されたタグ {collection: [], character: [], costume: [], situation: []}
 * @param {Array} textChips - テキストチップ [{text: string, active: boolean}]
 * @param {boolean} isFavoriteMode - お気に入りモードかどうか
 * @param {boolean} isFreeMaterialMode - 無料素材モードかどうか
 * @returns {number} フィルタリング結果の件数
 */
function countFilteredContents(selectedTags, textChips, isFavoriteMode = false, isFreeMaterialMode = false) {
    const filteredIds = filterVideos(selectedTags, textChips, isFavoriteMode, isFreeMaterialMode);
    return filteredIds.length;
}
