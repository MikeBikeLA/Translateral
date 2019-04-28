chrome.runtime.onInstalled.addListener(function() {
	console.log("onInstalled called, loading dict");
    // chrome.storage.local.clear();
    // chrome.storage.sync.clear()
    initialize_local_bank();
    
});

chrome.runtime.onStartup.addListener(function() {
	console.log("onStartup called, loading dict");
    // chrome.storage.local.clear(); // todo: remove?
    // chrome.storage.sync.clear()
    initialize_local_bank();
    
});

function inBlacklist(url){
    if (url.includes("chrome://") || url.includes("chrome-")){
        return true; // skip chrome urls
    }
    chrome.storage.sync.get({"website_blacklist": {}}, function(website_blacklist_wrapper){
        var website_blacklist = website_blacklist_wrapper.website_blacklist;
        if (Object.keys(website_blacklist).length === 0){ return false; } // empty blacklist
        for (const keyword of website_blacklist){
            if (url.includes(keyword)) {
                return true;
            }
        }
        return false;
    });
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
	try{
	    if (changeInfo.status === "complete" && !inBlacklist(tab.url)){
	        chrome.tabs.executeScript(null, {file: "content.js"});
	    }
    } catch(exc){
    	console.error(exc);
    }
});

