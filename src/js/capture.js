// セッション0.6.2 - 2025-10-15
// キャプチャ・通知機能
// ESModules対応版

import { state } from './state.js';
import { showModal } from './modal.js';

// ========================================
// 通知表示
// ========================================

export function showNotification(message, type = 'success') {
    const container = document.getElementById('notificationContainer');
    
    container.innerHTML = '';
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    container.appendChild(notification);
    
    requestAnimationFrame(() => {
        notification.classList.add('show');
    });
    
    setTimeout(() => {
        notification.classList.remove('show');
        
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ========================================
// キャプチャー機能
// ========================================

export async function captureToClipboard() {
    if (!state.currentVideo) {
        showNotification('素材を選択してください', 'error');
        return;
    }
    
    const videoId = state.currentVideo;
    const pngPath = `img/${videoId}.png`;
    
    try {
        if (!navigator.clipboard || !navigator.clipboard.write) {
            showNotification('クリップボードにコピー ※検証バージョンでは本機能は実行できません', 'success');
            
            state.captureCount++;
            updateCaptureCountDisplay();
            
            return;
        }
        
        const response = await fetch(pngPath);
        if (!response.ok) {
            throw new Error(`画像の読み込みに失敗しました: ${response.status}`);
        }
        
        const blob = await response.blob();
        
        const clipboardItem = new ClipboardItem({
            [blob.type]: blob
        });
        
        await navigator.clipboard.write([clipboardItem]);
        
        showNotification('クリップボードにコピーしました', 'success');
        
        state.captureCount++;
        updateCaptureCountDisplay();
        
    } catch (error) {
        let errorMessage = 'クリップボードにコピー ※検証バージョンでは本機能は実行できません';
        
        if (error.message.includes('読み込みに失敗')) {
            errorMessage = '画像の読み込みに失敗しました';
        } else if (error.name === 'NotAllowedError') {
            errorMessage = 'クリップボードにコピー ※検証バージョンでは本機能は実行できません';
        }
        
        showNotification(errorMessage, 'success');
        
        state.captureCount++;
        updateCaptureCountDisplay();
    }
}

function updateCaptureCountDisplay() {
    const captureCountBadge = document.getElementById('captureCountBadge');
    
    if (state.captureCount > 0) {
        captureCountBadge.textContent = state.captureCount;
        captureCountBadge.classList.add('show');
    } else {
        captureCountBadge.classList.remove('show');
    }
}

export function showCaptureDownloadModal() {
    const content = document.createElement('div');
    content.style.textAlign = 'center';
    content.style.padding = '20px 0';
    
    const proLabel = document.createElement('div');
    proLabel.style.display = 'inline-block';
    proLabel.style.fontSize = '18px';
    proLabel.style.fontWeight = 'bold';
    proLabel.style.background = 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)';
    proLabel.style.color = '#b8860b';
    proLabel.style.letterSpacing = '3px';
    proLabel.style.padding = '8px 24px';
    proLabel.style.borderRadius = '6px';
    proLabel.style.marginBottom = '20px';
    proLabel.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
    proLabel.style.border = '1px solid rgba(184, 134, 11, 0.3)';
    proLabel.textContent = 'PRO';
    
    const text = document.createElement('p');
    text.style.fontSize = '14px';
    text.style.lineHeight = '1.8';
    text.style.marginBottom = '0';
    text.innerHTML = `${state.captureCount}枚の<br>キャプチャーを.zip形式で<br>一括ダウンロードします。`;
    
    content.appendChild(proLabel);
    content.appendChild(text);
    
    showModal({
        title: 'キャプチャー一括ダウンロード',
        content: content,
        size: 'small',
        scrollType: 'none',
        buttons: {
            showCancel: true,
            cancelText: 'キャンセル',
            showOk: true,
            okText: 'ダウンロード',
            onOk: () => {
                showNotification('本機能は検証版には実装されていません', 'success');
            }
        }
    });
}
