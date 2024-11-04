chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.status) {
      // Forward the status to the popup
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { status: request.status });
      });
    }
  });
  