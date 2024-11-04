document.getElementById('capture').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: captureHTML,
  });
});

function captureHTML() {
  const html = document.documentElement.outerHTML;
  fetch('http://localhost:5000/process_html', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ html }),
  })
  .then(response => response.json())
  .then(data => {
    // Send the processed data back to the popup
    chrome.runtime.sendMessage({ status: data });
  })
  .catch(error => console.error('Error:', error));
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.status) {
    const statusDiv = document.getElementById('status');
    statusDiv.innerText = JSON.stringify(request.status, null, 2);
  }
});
