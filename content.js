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
        // console.log("node:");
        // console.log(node);
        // console.log("nodeValue:");
        // console.log(node.nodeValue)
        // recurse_process_word(dict, words, 0, text, element, node); // O(n)
        var after = text; // text we have yet to go through
        for (const word of words){
            // var before = node; // everything before this word, may include prior translation elements
            if (word in dict){
                // candidate found
                // console.log("found: " + word);
                var before_and_after = after.split(word); // split the text using word as delimiter
                const before = document.createTextNode(before_and_after[0]);
                result_nodes.push(before);
                // node.nodeValue += before_and_after[0]; // append stuff before this word to nodeValue
                // console.log(before_and_after[0]);
                before_and_after.shift(); // removes first element of the array
                after = ""; // clear out the old text
                for (let i = 0; i < before_and_after.length; i++){
                    // if there's multiple instances of this candidate in words, split() would've cut them out
                    if (i != 0){
                        after += word; // add the word back in
                    }
                    after += before_and_after[i];
                }
                // console.log("after: " + after);
                const trans = document.createElement("SPAN");
                trans.setAttribute("class", "translation");
                trans.innerHTML = dict[word];
                result_nodes.push(trans);
                // element.insertAdjacentHTML('afterbegin', '<span class="translation">'+dict[word]+'</span>');
                // insertAfter(trans, node);
            }
        }
        // console.log(result_nodes);
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
        // skip elements with these tags
        switch(element.tagName){
            case "HEAD":
                // console.log("found <head>");
                // continue;
            case "SCRIPT":
                // console.log("found <script>");
                // continue;
            case "STYLE":
                // console.log("found <style>");
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
    const def_window = document.createElement("DIV"); // <div>
    def_window.setAttribute("id", "def_window");
    // add child paragraphs to def_window
    const headword = document.createElement("P"); // <p>
    const hw_text = document.createTextNode("占位符"); // placeholder
    headword.appendChild(hw_text); // between <p> and </p>

    document.body.appendChild(def_window);
    console.log("def_window created");
}

// Retrieve the dict from chrome.storage and do the replacement
retrieve_dict();
create_def_window();

// This function will be called upon user mousing over the element
function mouse_over(element){
    console.log("mouse_over called");
    const def_window = document.getElementById("def_window");
    if (!def_window){
        console.log("def_window was not found in the page!");
        return;
    }
    // get location of mouse cursor
    // update the def_window information
    // make def_window visible
}

// This function will be called upon user mousing out of the element
function mouse_out(){
    // make def_window not visible
}
