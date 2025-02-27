chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'updateSummary') {
        document.getElementById('summary-content').textContent = message.content;
    }
});