chrome.runtime.onInstalled.addListener(function() {
	console.log("onStartup called, loading dict");
    load_dict();
  });

console.log("background.js loaded");
