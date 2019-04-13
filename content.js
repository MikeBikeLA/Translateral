var def_window; // global var populated by create_def_window
var def_window_open = false;

// Toggles def window open/closed
function toggle_def_window(x, y, target){
    if (!def_window_open){
        // open
        // console.log("opening def_window");
        def_window.style.left = x+"px";
        def_window.style.top = y+"px";
        def_window.style.width = "auto";
        def_window.style.height = "auto";
        def_window.style.visibility = "visible";
        hw_text = document.getElementById("hw_text");
        hw_text.innerText = target.innerText+" "; // add a space after the headword
        orig_text = document.getElementById("orig_text");
        orig_text.innerText = target.getAttribute("data-orig");
        reading = document.getElementById("reading_text");
        reading.innerText = target.getAttribute("data-reading");
        def_window_open = true;
    }
    else{
        // close if mouse isn't over the def_window
        // console.log("closing def_window");
        def_window_open = false;
        def_window.style.visibility = "hidden";
        def_window.style.width = "0%";
        def_window.style.height = "0%";
    }
}

// Translation word mouse over behavior
function mouse_over(event){
    if (event.target == undefined){
        console.log("mouse over event had undefined target");
        return;
    }
    if (!def_window_open){
        var target = event.target;
        var domRect = target.getBoundingClientRect();
        toggle_def_window(domRect.right, domRect.bottom, event.target);
        // toggle_def_window(event.clientX, event.clientY, event.target);
    }
}

// Translation word mouse out behavior
function mouse_out(event){
    toggle_def_window();
    // console.log("mouse_out");
}

// Returns a node for the translation
// trans_text: translation of the candidate word
function create_trans(orig_text, trans_text, reading_text){
    const trans = document.createElement("SPAN");
    trans.setAttribute("class", "translation");
    trans.innerText = trans_text;
    trans.onmousemove = mouse_over;
    trans.onmouseleave = mouse_out;
    trans.setAttribute("data-orig", orig_text);
    trans.setAttribute("data-reading", reading_text);
    return trans;
}

// Helper function to insert a node after another one
function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

// returns the first candidate word in words
function find_first_word(active_dict, words){
    for (const word of words){
        if (word in active_dict){
            return word;
        }
    }
    return null;
}

// This function will take in a text node, find words to replace,
// and then replace those words with <div>
// active_dict: active dictionary object
// node: the node that contains the text we wish to replace
// element: the element that has node as its child
// returns the result nodes
function process_words(expanded_dict, node, element){
    const text = node.nodeValue;
    // split text up into words
    const words = text.match(/[a-z'\-]+/gi);
    var result_nodes = []; // we will construct our result by pushing result nodes to this array
    var desensitized_dict = desensitize(expanded_dict);
    if (words != null && find_first_word(desensitized_dict, words) !== null){
        // console.log(node.nodeValue);
        node.nodeValue = ""; // clear everything, we will construct node from anew
        var after_text = text; // text we have yet to go through
        for (const word of words){
            // var regex = new RegExp("\\b"+word+"\\b|\\b"+word+"s\\b|\\b"+word+"es\\b","i");
            // todo: instead of having plurals in the dictionary, do the plural detection here
            word_regex = new RegExp("\\b"+word+"\\b", 'i');
            if (word in desensitized_dict){
                // candidate found
                var before_and_after = after_text.split(word_regex); // split the text using word as delimiter
                // console.log(before_and_after);
                const before = document.createTextNode(before_and_after[0]);
                result_nodes.push(before);
                before_and_after.shift(); // removes first element of the array
                after_text = ""; // clear out the old text
                for (let i = 0; i < before_and_after.length; i++){
                    // if there's multiple instances of this candidate in words, split() would've cut them out
                    if (i != 0){
                        after_text += word; // add the word back in
                    }
                    after_text += before_and_after[i];
                }
                result_nodes.push(create_trans(word, desensitized_dict[word]["trans"], desensitized_dict[word]["reading"]));
            }
        }
        const after = document.createTextNode(after_text); // node version of after_text
        result_nodes.push(after);
    }
    return result_nodes;
}

// returns a dict with each key of expanded_dict as upper and lower case
function desensitize(expanded_dict){
    desensitized_dict = {}
    for (let [key, value] of Object.entries(expanded_dict)){
        if (key.charAt(0) == key.charAt(0).toUpperCase() && key.charAt(1) == key.charAt(1).toLowerCase()){
            // Uppercase (and second character is lowercase), add this and the lowercase version
            desensitized_dict[key] = value;
            desensitized_dict[key.toLowerCase()] = value;
        }
        else if (key.charAt(0) == key.charAt(0).toLowerCase()){
            // Key is lowercase, add this and the uppercase version
            desensitized_dict[key] = value;
            key = key.charAt(0).toUpperCase() + key.slice(1);
            desensitized_dict[key] = value;
        }
        else{
            // Just add the one key that was in expanded dict
            desensitized_dict[key] = value;
        }
    }
    return desensitized_dict;
}

// The main replacement algorithm
function replace(active_dict){
    console.log("Starting replacement algorithm");
    const elements = document.getElementsByTagName('*');
    for (let i = 0; i < elements.length; i++) {
        var element = elements[i];
        // skip/ignore elements with these tags
        switch(element.tagName){
            case "HEAD":
            case "TITLE":
            case "CODE":
            case "SCRIPT":
            case "STYLE":
            case "PRE":
            case "BASE":
            case "DATA":
            case "RT":
            case "RTC":
            case "RUBY":
            case "VAR":
            case "TIME":
            case "OBJECT":
            case "PARAM":
            case "SOURCE":
            case "EMBED":
            case "IFRAME":
            case "CITE":
            case "BLOCKQUOTE":
                continue;
        }
        for (let j = 0; j < element.childNodes.length; j++) {
            const node = element.childNodes[j];

            if (node.nodeType === Node.TEXT_NODE) {
                // split text into separate nodes
                var result_nodes = process_words(active_dict, node, element);
                if (result_node = result_nodes.shift()){ // this assignment inside conditional is intentional
                    var previous = result_node;
                    element.replaceChild(result_node, node); // first element of result_nodes
                    while (result_node = result_nodes.shift()){
                        // insertAfter or append
                        insertAfter(result_node, previous);
                        previous = result_node;
                    }
                }
            }
            
        }
    }
    console.log("Completed!");
}

// Since this content.js file will run from the start each time a new page
// is loaded, we need to retrieve_dict from chrome.storage each time
function retrieve_active_dict(){
    chrome.storage.sync.get({"active_dict": {}}, function(active_dict_wrapper) {
        var active_dict = active_dict_wrapper.active_dict;
        console.log("active_dict retrieved: " + Object.keys(active_dict).length + " entries");
        var expanded_dict = {};
        // loop through all active dict keys, separate them by semicolon, and add them to expanded_dict
        for (const [key, value] of Object.entries(active_dict)){
            const words = key.split(';');
            for (const word of words){
                expanded_dict[word] = value;
            }
        }
        console.log("expanded_dict generated: " + Object.keys(expanded_dict).length + " entries");
        replace(expanded_dict);
        return;
     });
}

// Inject the definition popup window into the page (styles.css #def_window)
function create_def_window(){
    // create the def_window div
    // <div>
    //     <h2>占位符</h2><b>reading</b><br>
    //     <i>Original text:</i><p>placeholder</p>
    // </div>
    def_window = document.createElement("DIV"); // <div>
    def_window.setAttribute("id", "def_window");
    def_window.setAttribute("class", "def_window");
    // headword: the translated vocabulary
    const headword = document.createElement("H2"); // <h2>
    const hw_text = document.createTextNode("占位符"); // placeholder
    headword.setAttribute("id", "hw_text");
    headword.appendChild(hw_text); // between <h2> and </h2>
    def_window.appendChild(headword);
    // reading: pinyin, romaji, etc.
    const reading = document.createElement("B"); // <b>
    const reading_text = document.createTextNode("pinyin");
    reading.setAttribute("id", "reading_text");
    reading.appendChild(reading_text);
    def_window.appendChild(reading);
    // wrap the following in a div
    const orig_div = document.createElement("DIV");
    // orig_caption: Static caption that says "Original text:" in italics
    const orig_caption = document.createElement("I");
    const orig_caption_text = document.createTextNode("Original text: ");
    orig_caption.appendChild(orig_caption_text);
    orig_div.appendChild(orig_caption);
    // original: English candidate word that was translated
    const original = document.createElement("SPAN");
    const orig_text = document.createTextNode("placeholder");
    original.setAttribute("id", "orig_text");
    original.appendChild(orig_text);
    orig_div.appendChild(original);
    def_window.appendChild(orig_div);
    def_window.style.visibility = "hidden";
    def_window.style.width = "0%";
    def_window.style.height = "0%";
    document.body.appendChild(def_window);
    console.log("def_window created");
}

// Retrieve the active_dict from chrome.storage and do the replacement
retrieve_active_dict();
create_def_window();
