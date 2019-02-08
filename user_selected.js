// Saves the user_selected Set to chrome.storage.sync
function us_save(user_selected){
	chrome.storage.sync.set({"user_selected": user_selected});
}

// Adds an English key or an array of keys into the user_selected Set (asynchronous)
// Note: since this is asynchronous, multiple calls to this function within a short
// period of time will cause a race condition
// Set will ensure that no duplicate keys exist
function us_add(en){
	chrome.storage.sync.get("user_selected", function(us_wrapper) {
        let us = us_wrapper.user_selected;
        let count = 0;
		if (us == undefined){
			us = new Set();
			console.log("creating new us");
		}
		if (en.constructor === Array){
			// en is an array
			for (const key of en){
				us.add(key);
				count++;
			}
		}
		else{
			// en is just a single key
			us.add(en);
			count++;
		}
	    us_save(us);
	    // console.log("added " + count + ", us now has " + us.size + " elements");
    });
}

// Deletes an English key or an array of keys from the user_selected Set (asynchronous)
// Note: since this is asynchronous, multiple calls to this function within a short
// period of time will cause a race condition
function us_delete(en){
	chrome.storage.sync.get("user_selected", function(us_wrapper) {
        let us = us_wrapper.user_selected;
		if (us == undefined){
			return;
		}
        let count = us.size;
		if (en.constructor === Array){
			// en is an array
			for (const key of en){
				us.delete(key);
				count--;
			}
		}
		else{
			// en is just a single key
			us.delete(en);
			count--;
		}
	    us_save(us);
	    // console.log("added " + count + ", us now has " + us.size + " elements");
    });
}

// Deletes the entire user_selected Set from chrome.storage.sync (asynchronous)
function us_clear(){
	chrome.storage.sync.remove("user_selected");
}
