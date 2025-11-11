// セッション0.6.2 - 2025-10-15
// パネル制御機能
// ESModules対応版

import { state } from './state.js';

// ========================================
// パネル制御（リファクタリング版）
// ========================================

function updatePanel(panelType) {
    const wrapper = document.getElementById(`${panelType}PanelWrapper`);
    const tabDesktop = document.getElementById(`${panelType}Tab`);
    const tabMobile = document.getElementById(`${panelType}TabMobile`);
    const jsContent = document.getElementById('jsContent');
    const stateKey = `is${panelType.charAt(0).toUpperCase() + panelType.slice(1)}Visible`;
    
    if (state[stateKey]) {
        wrapper.classList.add('visible');
        tabDesktop.classList.add('active');
        tabMobile.classList.add('active');
        jsContent.classList.add(`${panelType}-visible`);
        
        if (panelType === 'list') {
            if (state.isWideMode) {
                wrapper.classList.add('fullscreen');
                jsContent.classList.remove('list-visible');
            } else {
                wrapper.classList.remove('fullscreen');
            }
        }
    } else {
        wrapper.classList.remove('visible', 'fullscreen');
        tabDesktop.classList.remove('active');
        tabMobile.classList.remove('active');
        jsContent.classList.remove(`${panelType}-visible`);
        
        if (panelType === 'list') {
            state.isWideMode = false;
        }
    }
    
    if (panelType === 'list') {
        updateWideToggle();
    }
}

export function updateListPanel() {
    updatePanel('list');
}

export function updateInfoPanel() {
    updatePanel('info');
}

function updateWideToggle() {
    const wideToggle = document.getElementById('wideToggle');
    
    if (state.isWideMode) {
        wideToggle.innerHTML = '⇤';
        wideToggle.style.background = '#b8860b';
        wideToggle.style.color = '#fff';
    } else {
        wideToggle.innerHTML = '⇔';
        wideToggle.style.background = '#f0f0f0';
        wideToggle.style.color = '#333';
    }
}
