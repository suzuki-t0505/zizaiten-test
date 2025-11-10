// セッション0.6.4 - 2025-10-15
// 状態管理
// 更新: ピン止め機能、お気に入り機能追加

// ========================================
// 状態管理オブジェクト
// ========================================
const state = {
    // タグ選択状態
    selectedCharacterTags: [],
    selectedCostumeTags: [],
    selectedSituationTags: [],
    selectedCollectionTags: [],
    
    // タグ有効/無効状態
    activeCharacterTags: [],
    activeCostumeTags: [],
    activeSituationTags: [],
    activeCollectionTags: [],
    
    // フリーテキストチップ
    textChips: [],              // すべてのフリーテキストチップ: [{text: string, active: boolean}]
    activeTextChips: [],        // 有効なフリーテキストチップ: [{text: string, active: boolean}]
    
    // 検索入力エリアの状態
    searchInputHTML: '',        // contenteditable の innerHTML（保存用）
    
    // ピン止め・お気に入り（新規追加）
    pinnedVideos: [],           // ピン止めされた動画ID配列（セッション中のみ保持）
    favoriteVideos: [],         // お気に入り動画ID配列（セッション中のみ保持）
    
    // UI状態
    isTagExpanded: false,
    isListVisible: true,
    isInfoVisible: false,
    isWideMode: false,
    thumbnailSize: 60,
    isSearchInputExpanded: false,  // SP縦画面用
    
    // ビデオ・モード状態
    currentVideo: null,
    currentMode: 'camera',
    
    // 再生状態
    currentFrame: 1,
    totalFrames: 24,
    isPlaying: false,
    
    // 表示回数
    videoViewCounts: {},
    
    // キャプチャーカウント
    captureCount: 0
};

// ========================================
// グローバル変数
// ========================================
let viewer3D = null;
