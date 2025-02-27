const DEFAULT_PROMPT = "请用中文简要概括一下以下内容";

document.addEventListener('DOMContentLoaded', () => {
    // 加载已保存的设置
    chrome.storage.sync.get(['kimiApiKey', 'customPrompt', 'enableHover'], (result) => {
        if (result.kimiApiKey) {
            document.getElementById('apiKey').value = result.kimiApiKey;
        }
        document.getElementById('prompt').value = result.customPrompt || DEFAULT_PROMPT;
        document.getElementById('enableHover').checked = result.enableHover || false;
    });

    // 保存按钮点击事件
    document.getElementById('save').addEventListener('click', () => {
        const apiKey = document.getElementById('apiKey').value;
        const prompt = document.getElementById('prompt').value || DEFAULT_PROMPT;
        const enableHover = document.getElementById('enableHover').checked;
        
        chrome.storage.sync.set({ 
            kimiApiKey: apiKey,
            customPrompt: prompt,
            enableHover: enableHover
        }, () => {
            const status = document.getElementById('status');
            status.style.display = 'block';
            setTimeout(() => {
                status.style.display = 'none';
            }, 2000);
        });
    });
});