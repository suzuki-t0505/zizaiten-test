// セッション0.8.2 - 2025-10-17
// フィルタリング統合機能
// ESModules対応版

import { state } from './state.js';
import { videoDatabase } from './data.js';

// ========================================
// 汎用フィルタリング関数
// ========================================

export function filterVideos(selectedTags, textChips, isFavoriteMode = false, isFreeMaterialMode = false) {
    let filteredIds = [];
    
    if (isFavoriteMode) {
        filteredIds = [...state.favoriteVideos];
        state.pinnedVideos.forEach(id => {
            if (!filteredIds.includes(id)) {
                filteredIds.push(id);
            }
        });
    }
    else if (isFreeMaterialMode) {
        Object.keys(videoDatabase).forEach(id => {
            const video = videoDatabase[id];
            if (video.isFree) {
                filteredIds.push(id);
            }
        });
        
        state.pinnedVideos.forEach(id => {
            if (!filteredIds.includes(id)) {
                filteredIds.push(id);
            }
        });
    }
    else {
        Object.keys(videoDatabase).forEach(id => {
            if (state.pinnedVideos.includes(id)) {
                filteredIds.push(id);
                return;
            }
            
            const video = videoDatabase[id];
            let matchesFilter = true;
            
            if (selectedTags.collection && selectedTags.collection.length > 0) {
                const hasCollectionMatch = selectedTags.collection.some(selectedTag => 
                    video.collectionTag === selectedTag
                );
                if (!hasCollectionMatch) matchesFilter = false;
            }
            
            if (selectedTags.character && selectedTags.character.length > 0) {
                const hasCharacterMatch = selectedTags.character.some(selectedTag => 
                    video.characterTags.includes(selectedTag)
                );
                if (!hasCharacterMatch) matchesFilter = false;
            }
            
            if (selectedTags.costume && selectedTags.costume.length > 0) {
                const hasCostumeMatch = selectedTags.costume.some(selectedTag => 
                    video.costumeTags.includes(selectedTag)
                );
                if (!hasCostumeMatch) matchesFilter = false;
            }
            
            if (selectedTags.situation && selectedTags.situation.length > 0) {
                const hasSituationMatch = selectedTags.situation.some(selectedTag => 
                    video.situationTags.includes(selectedTag)
                );
                if (!hasSituationMatch) matchesFilter = false;
            }
            
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
    
    const pinnedIds = state.pinnedVideos.filter(id => filteredIds.includes(id));
    const unpinnedIds = filteredIds.filter(id => !state.pinnedVideos.includes(id));
    
    return [...pinnedIds, ...unpinnedIds];
}

export function countTagContents() {
    const counts = {
        favorite: state.favoriteVideos.length,
        freeMaterial: 0,
        collection: {},
        character: {},
        costume: {},
        situation: {}
    };
    
    Object.values(videoDatabase).forEach(video => {
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

export function countFilteredContents(selectedTags, textChips, isFavoriteMode = false, isFreeMaterialMode = false) {
    const filteredIds = filterVideos(selectedTags, textChips, isFavoriteMode, isFreeMaterialMode);
    return filteredIds.length;
}
