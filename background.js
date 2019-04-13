chrome.runtime.onInstalled.addListener(function() {
	console.log("onInstalled called, loading dict");
    chrome.storage.local.clear();
    initialize_local_bank();
    
});

chrome.runtime.onStartup.addListener(function() {
	console.log("onStartup called, loading dict");
    chrome.storage.local.clear();
    initialize_local_bank();
    
});

console.log("background.js loaded");
