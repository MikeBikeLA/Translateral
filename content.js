// The main replacement algorithm
function replace(dict){
    // console.log("Dictionary has " + dict.length + " entries");
    console.log("Starting replacement algorithm");
    const elements = document.getElementsByTagName('*');
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        for (let j = 0; j < element.childNodes.length; j++) {
            const node = element.childNodes[j];

            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.nodeValue;
                let replacedText = text;
                for (const candidate in dict){
                    const re = new RegExp("\\b"+candidate+"es\\b|\\b"+candidate+"s\\b|\\b"+candidate+"\\b","gi");
                    replacedText = replacedText.replace(re, dict[candidate]);
                }
                if (replacedText !== text) {
                    element.replaceChild(document.createTextNode(replacedText), node);
                }
                
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
