let lastHoveredElement = null;
let isEnabled = false;

// 加载设置
chrome.storage.sync.get(['enableHover'], (result) => {
    isEnabled = result.enableHover || false;
});

// 监听设置变化
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync' && changes.enableHover) {
        isEnabled = changes.enableHover.newValue;
    }
});

document.addEventListener('mouseover', (e) => {
    if (!isEnabled) return;
    
    if (lastHoveredElement) {
        lastHoveredElement.style.outline = '';
    }
    
    e.target.style.outline = '2px solid #4285f4';
    lastHoveredElement = e.target;
});

document.addEventListener('mouseout', (e) => {
    if (!isEnabled) return;
    
    if (lastHoveredElement) {
        lastHoveredElement.style.outline = '';
    }
});

document.addEventListener('click', (e) => {
    if (!isEnabled) return;
    
    if (e.altKey && lastHoveredElement) {
        e.preventDefault();
        const text = lastHoveredElement.textContent.trim();
        if (text) {
            document.getSelection().removeAllRanges();
            const range = document.createRange();
            range.selectNodeContents(lastHoveredElement);
            const selection = window.getSelection();
            selection.addRange(range);
        }
    }
});