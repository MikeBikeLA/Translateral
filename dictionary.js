// Saves the dict to chrome.storage
// Called when chrome.storage.sync.get() is called asynchronously
function save_dict(dict){
	chrome.storage.local.set({"dict": dict});
	console.log("saved dict (" + Object.keys(dict).length + " entries) to chrome.storage");
}

// Takes in a table and returns dict with key, value pairs
function array_to_dict(array) {
	// get locale to use from user settings
	chrome.storage.sync.get({
	    locale: "zh_CN" // default is Chinese (Simplified)
	  }, function(items) {
	    var dict = {}; // dictionary to construct and save
	    const locale = items.locale;
	    // this is an asynchronous function, so the following code will run once
	    // get() gets called at some undetermined time in the future
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
			// add each english word and it's translation to the dict
			// TODO: semicolon parsing
			const words = array[i][english_col].split(';');
			for (const word of words){
				dict[word] = { "trans": array[i][trans_col],
							   "reading": array[i][reading_col] };
				// TODO: improve plural handling
				// basic plural handling, just add s and es to the dict
				dict[word+"es"] = { "trans": array[i][trans_col],
							   		"reading": array[i][reading_col] };
			    dict[word+"s"] = { "trans": array[i][trans_col],
							   	   "reading": array[i][reading_col] };
			}
		}
		console.log("Constructed dict (" + Object.keys(dict).length + " entries)");
		save_dict(dict);
 	 });
}

// Parses the CSV file into a table based on user settings
// Taken from @niry
// https://stackoverflow.com/questions/8493195/how-can-i-parse-a-csv-string-with-javascript-which-contains-comma-in-data
function csv_to_array(text) {
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

// Loads the dictionary into chrome.storage
function load_dict(){
	console.log("Fetching vocab.csv from Github");
	fetch('https://raw.githubusercontent.com/MikeBikeLA/Translateral/master/vocab.csv')
		.then(response => response.text())
		.then(text => csv_to_array(text));
}

console.log("dictionary.js loaded");
