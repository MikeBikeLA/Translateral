chrome.runtime.onInstalled.addListener(function() {
	console.log("onInstalled called, loading dict");
    chrome.storage.local.clear();
    load_dict();
    
});

chrome.runtime.onStartup.addListener(function() {
	console.log("onStartup called, loading dict");
    chrome.storage.local.clear();
    load_dict();
    
});

console.log("background.js loaded");
