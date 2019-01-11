// GLOBALS
var dict = {}; // dictionary constant used in content.js

// Parses the CSV file into a table based on user settings
// Taken from @niry
// https://stackoverflow.com/questions/8493195/how-can-i-parse-a-csv-string-with-javascript-which-contains-comma-in-data
function csvToArray(text) {
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
    arrayToDict(ret);
};

// Takes in a table and populates dict with key, value pairs,
// (plus tags and romanization)
function arrayToDict(array) {
	// get locale to use from user settings
	var locale = "zh_CN"; // hardcoded to zh_CN for now
	chrome.storage.sync.get({
	    locale: "zh_CN" // default is Chinese (Simplified)
	  }, function(items) {
	    locale = items.locale;
	  });
	// figure out how to set locale properly from storage sync
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
					break;
				}
			}
		}
		// add each english word and it's translation to the dict
		dict[array[i][english_col]] = array[i][trans_col];
	}
}

// Loads the dictionary into the global dict
function load_dict(){
	// const dict = {
	// 	"banana": "香蕉",
	// 	"pineapple": "菠萝",
	// 	"apple": "苹果",
	// 	"book": "书",
	// 	"child": "小孩",
	// 	"ocean": "海"
	// }
	console.log("Fetching vocab_mini.csv");
	fetch('https://raw.githubusercontent.com/MikeBikeLA/Translateral/master/vocab.csv')
		.then(response => response.text())
		.then(text => csvToArray(text));
	// console.log(dict);
}

// Run the load_dict function

load_dict();
