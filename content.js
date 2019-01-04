var elements = document.getElementsByTagName('*');

for (var i = 0; i < elements.length; i++) {
    var element = elements[i];

    for (var j = 0; j < element.childNodes.length; j++) {
        var node = element.childNodes[j];
        
        if (node.nodeType === Node.TEXT_NODE) {
            var text = node.nodeValue;
            var replacedText = text;
            for (var candidate in dict){
                var re = new RegExp(candidate, "gi");
                replacedText = replacedText.replace(re, dict[candidate]);
            }
            if (replacedText !== text) {
                element.replaceChild(document.createTextNode(replacedText), node);
            }
            
        }
        
    }
}