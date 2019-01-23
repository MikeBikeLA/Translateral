var def_window_open = false;

// Translation word mouse over behavior
function mouse_over(event){
    if (!def_window_open){
        var x = event.clientX;
        var y = event.clientY;
        console.log("x: "+x+" y: "+y);
        def_window_open = true;
    }
}

// Translation word mouse out behavior
function mouse_out(event){
    def_window_open = false;
    console.log("mouse_out");
}

// Returns a node for the translation
// trans_text: translation of the candidate word
function create_trans(trans_text){
    const trans = document.createElement("SPAN");
    trans.setAttribute("class", "translation");
    trans.innerText = trans_text;
    trans.onmousemove = mouse_over;
    trans.onmouseout = mouse_out;
    return trans;
}

// Helper function to insert a node after another one
function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

// returns the first candidate word in words
function find_first_word(dict, words){
    for (const word of words){
        if (word in dict){
            return word;
        }
    }
    return null;
}

// This function will take in a text node, find words to replace,
// and then replace those words with <div>
// dict: dictionary object
// node: the node that contains the text we wish to replace
// element: the element that has node as its child (for recurse_process_word)
function process_words(dict, node, element){
    const text = node.nodeValue;
    // split text up into words
    const words = text.match(/[a-z'\-]+/gi);
    var result_nodes = []; // we will construct our result by pushing result nodes to this array
    if (words != null){
        // console.log("processing "+text);
        if (find_first_word(dict, words) !== null){
            node.nodeValue = ""; // clear everything, we will construct node from anew
        }
        var after = text; // text we have yet to go through
        for (const word of words){
            if (word in dict){
                // candidate found
                var before_and_after = after.split(word); // split the text using word as delimiter
                const before = document.createTextNode(before_and_after[0]);
                result_nodes.push(before);
                before_and_after.shift(); // removes first element of the array
                after = ""; // clear out the old text
                for (let i = 0; i < before_and_after.length; i++){
                    // if there's multiple instances of this candidate in words, split() would've cut them out
                    if (i != 0){
                        after += word; // add the word back in
                    }
                    after += before_and_after[i];
                }
                result_nodes.push(create_trans(dict[word]));
            }
        }
    }
    return result_nodes;
}

// The main replacement algorithm
function replace(dict){
    // console.log("Dictionary has " + dict.length + " entries");
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
                continue;
        }
        for (let j = 0; j < element.childNodes.length; j++) {
            const node = element.childNodes[j];

            if (node.nodeType === Node.TEXT_NODE) {
                // console.log(text);
                // var replacedText;
                // split text into array of words
                // console.log("element:");
                // console.log(element);
                var result_nodes = process_words(dict, node, element);
                if (result_node = result_nodes.shift()){ // this assignment inside conditional is intentional
                    var previous = result_node;
                    element.replaceChild(result_node, node); // first element of result_nodes
                    // console.log("original node replaced with: "+result_node.nodeValue);
                    while (result_node = result_nodes.shift()){
                        // insertAfter or append
                        insertAfter(result_node, previous);
                        previous = result_node;
                        // console.log("appended: " + result_node);
                    }
                }
                // element.replaceChild(document.createTextNode(replacedText), node);
                // node.nodeValue = replacedText;
                // for (const candidate in dict){
                //     // regex magic (currently looks for candidate+es, candidate+s, candidate)
                //     const re = new RegExp("\\b"+candidate+"es\\b|\\b"+candidate+"s\\b|\\b"+candidate+"\\b","gi");
                //     // replaces all instances of candidate with translation in one line
                //     replacedText = replacedText.replace(re, dict[candidate]);
                //     // gets each instance of candidate and marks it for mouse over
                //     // do{
                //     //     text_to_replace = re.exec(text);
                //     //     if (text_to_replace){
                //     //         mark_word(dict, text_to_replace);
                //     //     }
                //     // } while (text_to_replace);
                // }
                // if (replacedText !== text) {
                //     element.replaceChild(document.createTextNode(replacedText), node);
                // }
            }
            
        }
    }
    console.log("Completed!");
}

// Since this content.js file will run from the start each time a new page
// is loaded, we need to retrieve_dict from chrome.storage each time
function retrieve_dict(){
    chrome.storage.sync.get("dict", function(dict_wrapper) {
        console.log("dict retrieved: " + Object.keys(dict_wrapper.dict).length + " entries")
        replace(dict_wrapper.dict);
     });
}

// Inject the definition popup window into the page (styles.css #def_window)
function create_def_window(){
    // create the def_window div
    // <div>
    //     <h2>占位符</h2><b>reading</b><br>
    //     <i>Original text:</i><p>placeholder</p>
    // </div>
    const def_window = document.createElement("DIV"); // <div>
    def_window.setAttribute("id", "def_window");
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
    // line break
    const br0 = document.createElement("BR");
    def_window.appendChild(br0);
    // orig_caption: Static caption that says "Original text:" in italics
    const orig_caption = document.createElement("I");
    const orig_caption_text = document.createTextNode("Original text: ");
    orig_caption.appendChild(orig_caption_text);
    def_window.appendChild(orig_caption);
    // original: English candidate word that was translated
    const original = document.createElement("P");
    const orig_text = document.createTextNode("placeholder");
    original.setAttribute("id", "orig_text");
    original.appendChild(orig_text);
    def_window.appendChild(original);

    document.body.appendChild(def_window);
    console.log("def_window created");
}

// Retrieve the dict from chrome.storage and do the replacement
retrieve_dict();
create_def_window();
