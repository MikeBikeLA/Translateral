// Recursive function that takes in the next word to look for
function recurse_process_word(dict, words, index, text, element){
    if (index == words.length){
        return text;
    }
    var new_text = text; // if we find a word to replace, everything to the left of it will be trimmed
    const word = words[index];
    if (words[index] in dict){
        // candidate found
        var before_and_after = new_text.split(words[index]);
        element.insertAdjacentHTML('beforeend', before_and_after[0]);
        new_text = before_and_after[1]; // keep stuff to the right of text
        // var trans = document.createElement("SPAN");
        // trans.setAttribute("class", "translation");
        // trans.innerHTML = dict[word];
        element.insertAdjacentHTML('afterend', '<span class="translation">'+dict[word]+'字</span>');
    }
    return recurse_process_word(dict, words, index+1, new_text, element);
}

// returns the first candidate word in words
function find_first_word(dict, words){
    for (const word of words){
        if (word in dict){
            return word;
        }
    }
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
    if (words != null){
        // console.log("processing "+text);
        // delete everything to the right of the first candidate word
        // i.e. we start appending from the first candidate world
        node.nodeValue = text.split(find_first_word(dict, words))[0]; // O(n)
        // console.log("node:");
        // console.log(node);
        // console.log("nodeValue:");
        // console.log(node.nodeValue)
        recurse_process_word(dict, words, 0, text, element); // O(n)
        // for (const word of words){
        //     if (word in dict){
        //         node.nodeValue = ""; // empty out the nodeValue as we will reconstruct it
        //         var trans_wrapper = document.createElement("SPAN"); // will contain the below 3 spans
        //         var split_text = text.split(word); // everything before the word and everything after the word
        //         var pre_trans = document.createElement("SPAN");
        //         pre_trans.innerHTML = split_text[0];
        //         var post_trans = document.createElement("SPAN");
        //         post_trans.innerHTML = split_text[1];
        //         var trans = document.createElement("SPAN");
        //         trans.setAttribute("class", "translation");
        //         trans.innerHTML = dict[word];

        //         trans_wrapper.appendChild(pre_trans);
        //         trans_wrapper.appendChild(trans);
        //         trans_wrapper.appendChild(post_trans);
        //         element.replaceChild(trans_wrapper, node);
        //         // Replace 'word' with '<span class="translation">字</span>'
        //         // var element = $('<span>');
        //         // $(element).attr('class', 'translation');
        //         // $(element).html(dict[word]);

        //         console.log("node: " + node);
        //         // add mouse over functionality
        //     }
        // }
    }
    return node.nodeValue;
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
                var replacedText;
                // split text into array of words
                console.log("element:");
                console.log(element);
                replacedText = process_words(dict, node, element);
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
