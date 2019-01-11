// The main replacement algorithm
// PRE: const dict (dictionary.js) is populated
function replace(){
    console.log("Dictionary has " + dict.length + " entries");
    console.log(dict);
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
}

// Run the main function
replace();
