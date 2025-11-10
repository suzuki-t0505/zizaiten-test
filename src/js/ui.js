// セッション0.8.2 - 2025-10-17
// UI生成機能
// 依存: data.js, state.js, filtering.js
// 更新: 無料素材表記統一（内部変数含む完全統一）

// ========================================
// 画像エラーハンドリング共通関数
// ========================================

function createImageWithFallback(src, alt, placeholderText = 'No Image') {
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    
    img.onerror = function() {
        const parent = this.parentElement;
        if (!parent) return;
        
        this.remove();
        parent.style.background = '#ddd';
        
        const placeholder = document.createElement('div');
        placeholder.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#999;font-size:10px;text-align:center;';
        placeholder.textContent = placeholderText;
        parent.appendChild(placeholder);
    };
    
    return img;
}

// ========================================
// タグ生成（動的高さ調整対応）
// ========================================

function generateTags() {
    const tagList = document.getElementById('tagList');
    tagList.innerHTML = '';
    
    const MAX_HEIGHT = 80; // 最大高さ（3段分）
    
    // お気に入りタグを追加（お気に入りがある場合のみ）
    if (state.favoriteVideos.length > 0) {
        const favTag = document.createElement('span');
        favTag.className = 'tag-item favorite-tag';
        favTag.textContent = 'お気に入り';
        
        // お気に入りタグが選択されているか確認
        const isFavoriteSelected = state.selectedCharacterTags.includes('お気に入り');
        const isFavoriteActive = state.activeCharacterTags.includes('お気に入り');
        
        if (isFavoriteSelected) {
            if (isFavoriteActive) {
                favTag.classList.add('selected');
            } else {
                favTag.classList.add('selected-inactive');
            }
        }
        
        favTag.onclick = () => toggleFavoriteTag();
        tagList.appendChild(favTag);
    }
    
    // 無料素材タグを追加（無料素材がある場合のみ）
    const tagCounts = countTagContents();
    if (tagCounts.freeMaterial > 0) {
        const freeMaterialTag = document.createElement('span');
        freeMaterialTag.className = 'tag-item free-material-tag';
        freeMaterialTag.textContent = '無料素材';
        
        // 無料素材タグが選択されているか確認
        const isFreeMaterialSelected = state.selectedCharacterTags.includes('無料素材');
        const isFreeMaterialActive = state.activeCharacterTags.includes('無料素材');
        
        if (isFreeMaterialSelected) {
            if (isFreeMaterialActive) {
                freeMaterialTag.classList.add('selected');
            } else {
                freeMaterialTag.classList.add('selected-inactive');
            }
        }
        
        freeMaterialTag.onclick = () => toggleFreeMaterialTag();
        tagList.appendChild(freeMaterialTag);
    }
    
    // 通常タグを生成（まだ追加しない）
    const normalTags = [];
    characterTags.forEach(tag => {
        const el = document.createElement('span');
        el.className = 'tag-item';
        el.textContent = tag;
        
        if (state.selectedCharacterTags.includes(tag)) {
            if (state.activeCharacterTags.includes(tag)) {
                el.classList.add('selected');
            } else {
                el.classList.add('selected-inactive');
            }
        }
        
        el.onclick = () => toggleCharacterTag(tag);
        normalTags.push(el);
    });
    
    // 通常タグを一つずつ追加し、高さをチェック
    for (let i = 0; i < normalTags.length; i++) {
        tagList.appendChild(normalTags[i]);
        
        // 高さチェック（moreボタンの余裕を持たせる）
        if (tagList.scrollHeight > MAX_HEIGHT) {
            // 高さオーバー：最後に追加したタグを削除
            normalTags[i].remove();
            break;
        }
    }
    
    // moreボタンを追加
    const moreBtn = document.createElement('span');
    moreBtn.className = 'tag-item more-button';
    moreBtn.textContent = 'more';
    moreBtn.onclick = () => {
        showTagSearchModal();
    };
    tagList.appendChild(moreBtn);
    
    // moreボタン追加後に高さオーバーしていたら、最後の通常タグを削除
    while (tagList.scrollHeight > MAX_HEIGHT && tagList.children.length > 1) {
        // moreの前の要素を取得
        const children = Array.from(tagList.children);
        const lastNormalTag = children[children.length - 2]; // moreの1つ前
        
        if (lastNormalTag && !lastNormalTag.classList.contains('more-button')) {
            lastNormalTag.remove();
        } else {
            break;
        }
    }
}

// ========================================
// サムネイル生成（★マーク・ピンアイコン追加版）
// ========================================

function generateThumbnails() {
    const thumbnailGrid = document.getElementById('thumbnailGrid');
    thumbnailGrid.innerHTML = '';
    
    // お気に入りモードかどうかチェック
    const isFavoriteMode = state.activeCharacterTags.includes('お気に入り');
    
    // 無料素材モードかどうかチェック
    const isFreeMaterialMode = state.activeCharacterTags.includes('無料素材');
    
    // フィルタリング実行（filtering.jsの関数を使用）
    const selectedTags = {
        collection: state.activeCollectionTags,
        character: state.activeCharacterTags.filter(t => t !== 'お気に入り' && t !== '無料素材'), // 特殊タグは除外
        costume: state.activeCostumeTags,
        situation: state.activeSituationTags
    };
    
    const filteredIds = filterVideos(selectedTags, state.activeTextChips, isFavoriteMode, isFreeMaterialMode);
    
    // サムネイル生成
    filteredIds.forEach(id => {
        const video = videoDatabase[id];
        
        // サムネイル要素作成
        const el = document.createElement('div');
        el.className = 'thumbnail-item';
        el.setAttribute('data-video-id', id);
        
        if (state.currentVideo === id) {
            el.classList.add('selected');
        }
        
        // シングルクリック: 選択
        el.onclick = () => selectVideo(id);
        
        // ダブルクリック: ピン止めトグル
        el.ondblclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            togglePin(id);
        };
        
        // FREEバッジ
        if (video.isFree) {
            const badge = document.createElement('div');
            badge.className = 'free-badge';
            el.appendChild(badge);
        }
        
        // ピンアイコン（ピン止めされている場合のみ）
        if (state.pinnedVideos.includes(id)) {
            const pinIcon = document.createElement('img');
            pinIcon.className = 'thumbnail-pin';
            pinIcon.src = 'img/pin.png';
            pinIcon.alt = 'Pin';
            el.appendChild(pinIcon);
        }
        
        // ★マーク（左下）
        const star = document.createElement('div');
        star.className = 'thumbnail-star';
        if (state.favoriteVideos.includes(id)) {
            star.classList.add('active');
        }
        star.textContent = '★';
        star.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(id);
        };
        el.appendChild(star);
        
        const img = createImageWithFallback(`img/${id}.gif`, video.title, 'GIF');
        el.appendChild(img);
        thumbnailGrid.appendChild(el);
    });
}

// ========================================
// バリエーション生成（ハイライト追加版）
// ========================================

function generateVariations(videoId) {
    const variationArea = document.getElementById('variationArea');
    const variationGrid = document.getElementById('variationGrid');
    variationGrid.innerHTML = '';
    
    const video = videoDatabase[videoId];
    
    if (!video || !video.variations || video.variations.length === 0) {
        variationArea.style.display = 'none';
        return;
    }
    
    variationArea.style.display = 'block';
    
    video.variations.forEach(varId => {
        const varVideo = videoDatabase[varId];
        if (!varVideo) return;
        
        const el = document.createElement('div');
        el.className = 'variation-item';
        
        // 選択中の素材をハイライト
        if (state.currentVideo === varId) {
            el.classList.add('selected');
        }
        
        el.onclick = () => selectVideo(varId);
        
        const img = createImageWithFallback(`img/${varId}.gif`, varVideo.title, 'VAR');
        el.appendChild(img);
        variationGrid.appendChild(el);
    });
}

// ========================================
// 情報タグ生成（情報パネル内、★マーク追加版）
// ========================================

function generateInfoTags(videoId) {
    const infoTags = document.getElementById('infoTags');
    const titleText = document.querySelector('.title-text');
    
    if (!infoTags) {
        return;
    }
    
    infoTags.innerHTML = '';
    
    const video = videoDatabase[videoId];
    if (!video) {
        return;
    }
    
    // Title横の★マーク
    if (titleText) {
        // 既存の★を削除
        const existingStar = titleText.querySelector('.title-star');
        if (existingStar) {
            existingStar.remove();
        }
        
        // お気に入りの場合は★を追加
        if (state.favoriteVideos.includes(videoId)) {
            const star = document.createElement('span');
            star.className = 'title-star';
            star.textContent = ' ★';
            titleText.appendChild(star);
        }
    }
    
    // 収録テーマタグ
    if (video.collectionTag) {
        const el = document.createElement('span');
        el.className = 'info-tag collection-tag';
        if (state.selectedCollectionTags.includes(video.collectionTag)) {
            if (state.activeCollectionTags.includes(video.collectionTag)) {
                el.classList.add('selected');
            } else {
                el.classList.add('selected-inactive');
            }
        }
        el.textContent = video.collectionTag;
        el.onclick = () => toggleCollectionTag(video.collectionTag);
        
        infoTags.appendChild(el);
    }
    
    // キャラクタータグ
    video.characterTags.forEach(tag => {
        const el = document.createElement('span');
        el.className = 'info-tag character-tag';
        if (state.selectedCharacterTags.includes(tag)) {
            if (state.activeCharacterTags.includes(tag)) {
                el.classList.add('selected');
            } else {
                el.classList.add('selected-inactive');
            }
        }
        el.textContent = tag;
        el.onclick = () => toggleCharacterTag(tag);
        
        infoTags.appendChild(el);
    });
    
    // 衣装タグ
    video.costumeTags.forEach(tag => {
        const el = document.createElement('span');
        el.className = 'info-tag costume-tag';
        if (state.selectedCostumeTags.includes(tag)) {
            if (state.activeCostumeTags.includes(tag)) {
                el.classList.add('selected');
            } else {
                el.classList.add('selected-inactive');
            }
        }
        el.textContent = tag;
        el.onclick = () => toggleCostumeTag(tag);
        
        infoTags.appendChild(el);
    });
    
    // シチュエーションタグ
    video.situationTags.forEach(tag => {
        const el = document.createElement('span');
        el.className = 'info-tag situation-tag';
        if (state.selectedSituationTags.includes(tag)) {
            if (state.activeSituationTags.includes(tag)) {
                el.classList.add('selected');
            } else {
                el.classList.add('selected-inactive');
            }
        }
        el.textContent = tag;
        el.onclick = () => toggleSituationTag(tag);
        
        infoTags.appendChild(el);
    });
}

// ========================================
// ピン止め・お気に入り操作（新規）
// ========================================

/**
 * ピン止めトグル（並べ替えなし版）
 * @param {string} id - ビデオID
 */
function togglePin(id) {
    const video = videoDatabase[id];
    if (!video) return;
    
    const isPinned = state.pinnedVideos.includes(id);
    const thumbnail = document.querySelector(`.thumbnail-item[data-video-id="${id}"]`);
    
    if (isPinned) {
        // ピン止め解除
        const index = state.pinnedVideos.indexOf(id);
        if (index > -1) {
            state.pinnedVideos.splice(index, 1);
        }
        
        // ピンアイコンを削除（アニメーション）
        if (thumbnail) {
            const pinIcon = thumbnail.querySelector('.thumbnail-pin');
            if (pinIcon) {
                pinIcon.classList.add('removing');
                setTimeout(() => {
                    pinIcon.remove();
                }, 400); // アニメーション完了後に削除
            }
        }
        
        showNotification(`"${video.title}"のピン止めを解除しました`, 'success');
    } else {
        // ピン止め
        state.pinnedVideos.push(id);
        
        // ピンアイコンを追加
        if (thumbnail) {
            const pinIcon = document.createElement('img');
            pinIcon.className = 'thumbnail-pin';
            pinIcon.src = 'img/pin.png';
            pinIcon.alt = 'Pin';
            thumbnail.appendChild(pinIcon);
        }
        
        showNotification(`"${video.title}"をピン止めしました`, 'success');
    }
    
    // 並べ替えは行わない（次のタグ操作時に自動的に並べ替わる）
}

/**
 * お気に入りトグル（並べ替えなし版、jsContentTitle★マークリアルタイム反映対応）
 * @param {string} id - ビデオID
 */
function toggleFavorite(id) {
    const video = videoDatabase[id];
    if (!video) return;
    
    const isFavorite = state.favoriteVideos.includes(id);
    const thumbnail = document.querySelector(`.thumbnail-item[data-video-id="${id}"]`);
    
    if (isFavorite) {
        // お気に入り解除
        const index = state.favoriteVideos.indexOf(id);
        if (index > -1) {
            state.favoriteVideos.splice(index, 1);
        }
        
        // ★マークを非アクティブに
        if (thumbnail) {
            const star = thumbnail.querySelector('.thumbnail-star');
            if (star) {
                star.classList.remove('active');
            }
        }
        
        // Title横の★を削除（情報パネル）
        const titleText = document.querySelector('.title-text');
        if (titleText && state.currentVideo === id) {
            const titleStar = titleText.querySelector('.title-star');
            if (titleStar) {
                titleStar.remove();
            }
        }
        
        // jsContentTitle横の★を削除（JSコンテンツ）
        const jsContentTitle = document.getElementById('jsContentTitle');
        if (jsContentTitle && state.currentVideo === id) {
            const jsTitleStar = jsContentTitle.querySelector('.js-title-star');
            if (jsTitleStar) {
                jsTitleStar.remove();
            }
        }
        
        showNotification(`"${video.title}"をお気に入りから除外しました`, 'success');
    } else {
        // お気に入り登録
        state.favoriteVideos.push(id);
        
        // ★マークをアクティブに
        if (thumbnail) {
            const star = thumbnail.querySelector('.thumbnail-star');
            if (star) {
                star.classList.add('active');
            }
        }
        
        // Title横の★を追加（情報パネル）
        const titleText = document.querySelector('.title-text');
        if (titleText && state.currentVideo === id) {
            const existingStar = titleText.querySelector('.title-star');
            if (!existingStar) {
                const star = document.createElement('span');
                star.className = 'title-star';
                star.textContent = ' ★';
                titleText.appendChild(star);
            }
        }
        
        // jsContentTitle横の★を追加（JSコンテンツ）
        const jsContentTitle = document.getElementById('jsContentTitle');
        if (jsContentTitle && state.currentVideo === id) {
            const existingJsStar = jsContentTitle.querySelector('.js-title-star');
            if (!existingJsStar) {
                const star = document.createElement('span');
                star.className = 'js-title-star';
                star.textContent = ' ★';
                jsContentTitle.appendChild(star);
            }
        }
        
        showNotification(`"${video.title}"をお気に入り登録しました`, 'success');
    }
    
    // お気に入りタグの表示/非表示を即座に更新（並べ替えはしない）
    generateTags();
}
