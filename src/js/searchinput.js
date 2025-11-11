// セッション0.8.1 - 2025-10-17
// 検索入力メイン制御
// 依存: state.js, filtering.js, chips.js, suggest.js, ui.js
// 更新: タグチップクリック処理の修正（closest使用）

import { state } from "./state";
import { generateThumbnails, generateInfoTags, generateTags } from "./ui";
import { hasActiveSuggestion, moveSuggestionSelection, insertActiveSuggestion, showTagSuggestions, hideSuggestions } from "./suggest";
import { countTagContents } from "./filtering";
import { createTagChip, createTextChip } from "./chips";

// ========================================
// カーソル操作ヘルパー関数
// ========================================

/**
 * カーソルを指定要素の後ろに移動
 * @param {HTMLElement} element - 対象要素
 */
function setCursorAfter(element) {
    const range = document.createRange();
    const selection = window.getSelection();
    range.setStartAfter(element);
    range.setEndAfter(element);
    selection.removeAllRanges();
    selection.addRange(range);
}

/**
 * カーソル位置にノードを挿入
 * @param {Node} node - 挿入するノード
 */
function insertAtCursor(node) {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(node);
    setCursorAfter(node);
}

/**
 * カーソル前のテキストを取得
 * @returns {string} カーソル前のテキスト
 */
function getTextBeforeCursor() {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return '';
    
    const range = selection.getRangeAt(0);
    const textNode = range.startContainer;
    
    if (textNode.nodeType !== Node.TEXT_NODE) return '';
    
    return textNode.textContent.substring(0, range.startOffset).trim();
}

/**
 * カーソル前のテキストを削除
 */
function deleteTextBeforeCursor() {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const textNode = range.startContainer;
    
    if (textNode.nodeType !== Node.TEXT_NODE) return;
    
    const textLength = range.startOffset;
    
    const deleteRange = document.createRange();
    deleteRange.setStart(textNode, 0);
    deleteRange.setEnd(textNode, textLength);
    deleteRange.deleteContents();
}

// ========================================
// 検索データ抽出
// ========================================

/**
 * 検索入力エリアからタグとテキストを抽出
 * @returns {Object} タグとテキストチップの情報
 */
function extractSearchData() {
    const container = document.getElementById('searchInputArea');
    
    if (!container) {
        return {
            tags: {
                collection: { selected: [], active: [] },
                character: { selected: [], active: [] },
                costume: { selected: [], active: [] },
                situation: { selected: [], active: [] }
            },
            textChips: []
        };
    }
    
    const tagChips = container.querySelectorAll('.tag-chip');
    const tags = {
        collection: { selected: [], active: [] },
        character: { selected: [], active: [] },
        costume: { selected: [], active: [] },
        situation: { selected: [], active: [] }
    };
    
    tagChips.forEach(chip => {
        const type = chip.dataset.tagType;
        const tag = chip.dataset.tag;
        const isActive = chip.dataset.active === 'true';
        
        tags[type].selected.push(tag);
        if (isActive) {
            tags[type].active.push(tag);
        }
    });
    
    const textChips = [];
    const textChipElements = container.querySelectorAll('.text-chip');
    textChipElements.forEach(chip => {
        const text = chip.dataset.text;
        const isActive = chip.dataset.active === 'true';
        textChips.push({ text, active: isActive });
    });
    
    return { tags, textChips };
}

// ========================================
// 既存タグとのマッチング確認
// ========================================

/**
 * テキストが既存タグと一致するか確認
 * @param {string} text - 確認するテキスト
 * @returns {Object|null} マッチした場合はタグ情報、なければnull
 */
function findMatchingTag(text) {
    const tagCounts = countTagContents(); // filtering.jsの関数
    
    if (Object.keys(tagCounts.collection).includes(text)) {
        return { type: 'collection', tag: text };
    }
    
    if (Object.keys(tagCounts.character).includes(text)) {
        return { type: 'character', tag: text };
    }
    
    if (Object.keys(tagCounts.costume).includes(text)) {
        return { type: 'costume', tag: text };
    }
    
    if (Object.keys(tagCounts.situation).includes(text)) {
        return { type: 'situation', tag: text };
    }
    
    return null;
}

// ========================================
// 状態同期（検索入力エリア内のみ厳密に処理）
// ========================================

let isSyncingState = false; // MutationObserver用フラグ

/**
 * 検索入力エリアの状態をグローバルstateに同期
 */
export function syncSearchState() {
    isSyncingState = true;
    
    const container = document.getElementById('searchInputArea');
    
    if (!container) {
        return;
    }
    
    // 検索入力エリア内の直接の子要素であるテキストノードのみを処理
    const textNodesToProcess = [];
    
    for (let i = 0; i < container.childNodes.length; i++) {
        const node = container.childNodes[i];
        
        if (node.nodeType === Node.TEXT_NODE && node.parentNode === container) {
            const trimmedText = node.textContent.trim();
            
            if (trimmedText && trimmedText.length > 0) {
                textNodesToProcess.push(node);
            } else if (!trimmedText || trimmedText.length === 0) {
                node.remove();
            }
        }
    }
    
    // 生テキストをチップ化
    textNodesToProcess.forEach((textNode) => {
        const text = textNode.textContent.trim();
        
        if (textNode.parentNode?.id !== 'searchInputArea') {
            return;
        }
        
        const matched = findMatchingTag(text);
        
        let chip;
        if (matched) {
            chip = createTagChip(matched.type, matched.tag);
        } else {
            chip = createTextChip(text);
        }
        
        if (chip) {
            textNode.parentNode.replaceChild(chip, textNode);
        } else {
            textNode.remove();
        }
    });
    
    // 状態を抽出
    const { tags, textChips } = extractSearchData();
    
    state.selectedCollectionTags = tags.collection.selected;
    state.activeCollectionTags = tags.collection.active;
    state.selectedCharacterTags = tags.character.selected;
    state.activeCharacterTags = tags.character.active;
    state.selectedCostumeTags = tags.costume.selected;
    state.activeCostumeTags = tags.costume.active;
    state.selectedSituationTags = tags.situation.selected;
    state.activeSituationTags = tags.situation.active;
    
    state.textChips = textChips;
    state.activeTextChips = textChips.filter(chip => chip.active);
    
    // UI更新
    generateThumbnails(); // ui.jsの関数
    
    if (state.currentVideo) {
        generateInfoTags(state.currentVideo); // ui.jsの関数
    }
    
    generateTags(); // ui.jsの関数
    
    isSyncingState = false;
}

// ========================================
// テキスト確定処理（既存タグ自動マッチング）
// ========================================

/**
 * 現在のテキストを確定（チップ化）
 */
function finalizeCurrentText() {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) {
        return;
    }
    
    const range = selection.getRangeAt(0);
    let textNode = range.startContainer;
    
    if (textNode.nodeType !== Node.TEXT_NODE) {
        return;
    }
    
    const container = document.getElementById('searchInputArea');
    if (textNode.parentNode !== container) {
        return;
    }
    
    const text = textNode.textContent.trim();
    if (!text || text.length === 0) {
        textNode.remove();
        return;
    }
    
    const matched = findMatchingTag(text);
    
    let chip;
    if (matched) {
        chip = createTagChip(matched.type, matched.tag);
    } else {
        chip = createTextChip(text);
    }
    
    if (chip) {
        textNode.parentNode.replaceChild(chip, textNode);
        setCursorAfter(chip);
        syncSearchState();
    } else {
        textNode.remove();
    }
}

// ========================================
// チップ操作
// ========================================

/**
 * チップのクリックイベントを設定
 */
function setupChipHandlers() {
    const container = document.getElementById('searchInputArea');
    
    container.addEventListener('click', (e) => {
        // 削除ボタンのクリック処理
        if (e.target.classList.contains('chip-remove')) {
            e.preventDefault();
            e.stopPropagation();
            
            const chip = e.target.parentElement;
            chip.remove();
            
            syncSearchState();
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
            
            syncSearchState();
        }
    });
}

// ========================================
// DOM変更監視（チップ削除検知）
// ========================================

/**
 * MutationObserverを設定してチップ削除を監視
 */
function setupMutationObserver() {
    const container = document.getElementById('searchInputArea');
    
    if (!container) {
        return;
    }
    
    const observer = new MutationObserver((mutations) => {
        if (isSyncingState) {
            return;
        }
        
        let chipRemoved = false;
        
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.removedNodes.length > 0) {
                mutation.removedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.classList?.contains('tag-chip') || node.classList?.contains('text-chip')) {
                            chipRemoved = true;
                        }
                    }
                });
            }
        });
        
        if (chipRemoved) {
            isSyncingState = true;
            
            const { tags, textChips } = extractSearchData();
            
            state.selectedCollectionTags = tags.collection.selected;
            state.activeCollectionTags = tags.collection.active;
            state.selectedCharacterTags = tags.character.selected;
            state.activeCharacterTags = tags.character.active;
            state.selectedCostumeTags = tags.costume.selected;
            state.activeCostumeTags = tags.costume.active;
            state.selectedSituationTags = tags.situation.selected;
            state.activeSituationTags = tags.situation.active;
            
            state.textChips = textChips;
            state.activeTextChips = textChips.filter(chip => chip.active);
            
            generateThumbnails();
            
            if (state.currentVideo) {
                generateInfoTags(state.currentVideo);
            }
            
            generateTags();
            
            isSyncingState = false;
        }
    });
    
    observer.observe(container, {
        childList: true,
        subtree: false
    });
}

// ========================================
// バックスペース処理（シンプル化）
// ========================================

/**
 * Backspaceキーでチップを削除
 * @param {KeyboardEvent} e - キーボードイベント
 */
function handleBackspaceKey(e) {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) {
        return;
    }
    
    const range = selection.getRangeAt(0);
    const container = document.getElementById('searchInputArea');
    
    if (!range.collapsed) {
        return;
    }
    
    let targetElement = null;
    
    // ケース1: カーソルが要素の直後にある場合
    if (range.startContainer === container && range.startOffset > 0) {
        const prevNode = container.childNodes[range.startOffset - 1];
        if (prevNode && (prevNode.classList?.contains('tag-chip') || prevNode.classList?.contains('text-chip'))) {
            targetElement = prevNode;
        }
    }
    // ケース2: カーソルがテキストノードの先頭にある場合
    else if (range.startContainer.nodeType === Node.TEXT_NODE && range.startOffset === 0) {
        const textNode = range.startContainer;
        const prevSibling = textNode.previousSibling;
        
        if (prevSibling && (prevSibling.classList?.contains('tag-chip') || prevSibling.classList?.contains('text-chip'))) {
            targetElement = prevSibling;
        }
    }
    
    if (targetElement) {
        e.preventDefault();
        targetElement.remove();
    }
}

// ========================================
// 検索入力イベント
// ========================================

/**
 * 検索入力エリアの初期化（メイン関数）
 */
export function setupSearchInput() {
    const searchInputArea = document.getElementById('searchInputArea');
    
    // 入力監視（サジェスト表示）
    searchInputArea.addEventListener('input', () => {
        if (suggestionTimeout) {
            clearTimeout(suggestionTimeout);
        }
        
        suggestionTimeout = setTimeout(() => {
            const text = getTextBeforeCursor();
            showTagSuggestions(text);
        }, 300);
    });
    
    // キーボード操作
    searchInputArea.addEventListener('keydown', (e) => {
        if (hasActiveSuggestion()) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                moveSuggestionSelection('down');
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                moveSuggestionSelection('up');
            } else if (e.key === 'Enter') {
                e.preventDefault();
                insertActiveSuggestion();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                hideSuggestions();
            }
        } else {
            if (e.key === 'Enter') {
                e.preventDefault();
                finalizeCurrentText();
            } else if (e.key === 'Backspace') {
                handleBackspaceKey(e);
            }
        }
    });
    
    // フォーカスアウト時
    searchInputArea.addEventListener('blur', (e) => {
        if (hasActiveSuggestion()) {
            return;
        }
        
        const relatedTarget = e.relatedTarget;
        if (relatedTarget) {
            const isTab = relatedTarget.classList?.contains('accordion-tab');
            const isButton = relatedTarget.tagName === 'BUTTON';
            
            if (isTab || isButton) {
                return;
            }
        }
        
        setTimeout(() => {
            if (!hasActiveSuggestion()) {
                finalizeCurrentText();
            }
        }, 200);
    });
    
    setupChipHandlers();
    setupMutationObserver();
}
