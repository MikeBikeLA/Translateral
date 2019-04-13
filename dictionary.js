// Saves local_bank to chrome.storage.local
function save_local_bank(local_bank){
	chrome.storage.local.set({"local_bank": local_bank});
	console.log("saved local_bank (" + Object.keys(local_bank).length + " entries) to chrome.storage");
}

// Takes in a table and returns dict with key, value pairs
function array_to_dict(array) {
	// get locale to use from user settings
	chrome.storage.sync.get({
	    locale: "zh_CN" // default is Chinese (Simplified)
	  }, function(items) {
	    var local_bank = {}; // dictionary to construct and save
	    var new_entries = 0;
	    const locale = items.locale;
	    // add each english word and it's translation to the local_bank
			// TODO: semicolon parsing
			// const words = array[i][english_col].split(';');
			// local_bank[word] = { "trans": array[i][trans_col],
			// 			   "reading": array[i][reading_col],
			// 				"bucket": <inactive = 0, active = 1, learned = 2>
		    // 				"user_defined": <bool> };
			chrome.storage.local.get({"local_bank": {}}, function(data){
				for (let i = 0; i < array.length; i++) {
					// iterate through each row
					// first row is the header row
					if (i === 0){
						// find the column for the locale we want
						for (let j = 0; j < array[i].length; j++) {
							if (array[i][j] === "en_US"){
								var english_col = j;
								console.log("Found en_US in column " + english_col);
							}
							if (array[i][j] == locale){
								var trans_col = j;
								console.log("Found " + locale + " in column " + trans_col);
								var reading_col = ++j;
								console.log("Using next column as reading:" + array[i][j]);
								break;
							}
						}
						continue;
					}
					if (!(array[i][english_col] in data.local_bank)){
						local_bank[array[i][english_col]] = { "trans": array[i][trans_col],
													    "reading": array[i][reading_col],
													    "bucket": 0,
													    "user_defined": false };
					    // console.log(array[i][english_col]);
					    new_entries++;
				    }
					if (!(array[i][english_col] in data.local_bank)){
						local_bank[array[i][english_col]] = {
							"trans": array[i][trans_col],
						    "reading": array[i][reading_col],
						    "bucket": 0,
						    "user_defined": false };
					    // console.log(array[i][english_col]);
					    new_entries++;
				    }
				}

			    console.log("Added " + new_entries + " new entries to local_bank");
				if (new_entries > 0){
					save_local_bank(local_bank);
				}
			});
			
			// TODO: improve plural handling
			// basic plural handling, just add s and es to the dict
			// dict[word+"es"] = { "trans": array[i][trans_col],
			// 			   		"reading": array[i][reading_col] };
		 	//    dict[word+"s"] = { "trans": array[i][trans_col],
			// 			   	   "reading": array[i][reading_col] };
	    

 	 });
}

// Parses the CSV file into a table based on user settings
// Taken from @niry
// https://stackoverflow.com/questions/8493195/how-can-i-parse-a-csv-string-with-javascript-which-contains-comma-in-data
function csv_to_dict(text) {
	// console.log(text);
    let p = '', row = [''], ret = [row], i = 0, r = 0, s = !0, l;
    for (l of text) {
        if ('"' === l) {
            if (s && l === p) row[i] += l;
            s = !s;
        } else if (',' === l && s) l = row[++i] = '';
        else if ('\n' === l && s) {
            if ('\r' === p) row[i] = row[i].slice(0, -1);
            row = ret[++r] = [l = '']; i = 0;
        } else row[i] += l;
        p = l;
    }
    console.log("Constructed array (" + ret.length + " entries including header)");
    array_to_dict(ret);
}

// Main function: Loads github master + user-defined words into chrome.storage
function initialize_local_bank(){
	console.log("Fetching vocab.csv from Github");
	fetch('https://raw.githubusercontent.com/MikeBikeLA/Translateral/master/vocab.csv')
		.then(response => response.text())
		.then(text => csv_to_dict(text));
}

// using 'bucket' = 1 to determine active
function initialize_active_dict(){
	chrome.storage.sync.get({locale: "zh_CN"}, function(locale_wrapper){
		chrome.storage.sync.get({"active_dict": {}}, function(active_dict_wrapper){
			
		});
	})
}

function bucket_move(key, destination){
	chrome.storage.local.get({"local_bank": {}}, function(local_bank_wrapper){
		if (key in local_bank_wrapper.local_bank){
			let current_bucket = local_bank_wrapper.local_bank[key].bucket
			if (current_bucket == destination){ // no move required
				return;
			}
			if (current_bucket === 1){ // moving out of active dict
				chrome.storage.sync.get({"active_dict": {}}, function(active_dict_wrapper){
					if (key in active_dict_wrapper.active_dict){
						delete active_dict_wrapper.active_dict[key];
						console.log("Deleted " + key + " from active_dict");
					}
					else{
						// weird state, doesn't exist in active_dict even though local_dict says it should be
						weird_state_handler();
					}
				});
			}
			if (destination === 1){ // moving into active dict
				chrome.storage.sync.get({"active_dict": {}}, function(active_dict_wrapper){
					if (!(key in active_dict_wrapper.active_dict)){ // shouldn't exist
						weird_state_handler();
					}
					else{
						// add it to active dict
						active_dict_wrapper.active_dict[key] = local_bank_wrapper.local_bank[key];
						console.log("Added " + key + " to active_dict");
					}
				});
			}
			local_bank_wrapper.local_bank[key].bucket = destination;
			console.log("Moved " + key + " to " + destination);
		}
	})
}

function weird_state_handler(){
	console.log("WEIRD STATE DETECTED!!! Attempting to rebuild...");
}

console.log("dictionary.js loaded");
