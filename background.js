// 删除这行导入语句
// import { config } from './config.js';

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "summarize",
    title: "中文概述",
    contexts: ["selection"]
  });
});

async function callKimiAPI(text) {
  // 从存储中获取 API Key 和提示词
  const result = await chrome.storage.sync.get(['kimiApiKey', 'customPrompt']);
  if (!result.kimiApiKey) {
    throw new Error('请先在插件选项中设置 Kimi API Key');
  }
  const prompt = result.customPrompt || "请用中文简要概括一下以下内容";
  const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${result.kimiApiKey}`
    },
    body: JSON.stringify({
      messages: [{
        role: 'user',
        content: `${prompt}: ${text}`
      }],
      model: 'moonshot-v1-8k'
    })
  });
  
  const data = await response.json();
  return data.choices[0].message.content;
}

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "summarize") {
    const selectedText = info.selectionText;
    
    try {
      // 打开侧边栏
      await chrome.sidePanel.open({ windowId: tab.windowId });
      
      // 显示加载提示
      chrome.runtime.sendMessage({
        type: 'updateSummary',
        content: '正在生成概述...'
      });
      
      const summary = await callKimiAPI(selectedText);
      
      // 更新侧边栏内容
      chrome.runtime.sendMessage({
        type: 'updateSummary',
        content: summary
      });
    } catch (error) {
      chrome.runtime.sendMessage({
        type: 'updateSummary',
        content: `获取概述失败: ${error.message}`
      });
    }
  }
});