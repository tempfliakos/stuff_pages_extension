chrome.browserAction.onClicked.addListener(function(tab) {
    // Send a message to the active tab
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      var activeTab = tabs[0];
      console.log('wqeqweqwe')
      chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
    });
  });