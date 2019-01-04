var elements = document.getElementsByTagName('*');

translations = [["also", "1"], ["known", "2"], ["as", "3"]]

for (var i = 0; i < elements.length; i++) {
    var element = elements[i];

    for (var j = 0; j < element.childNodes.length; j++) {
        var node = element.childNodes[j];

        if (node.nodeType === Node.TEXT_NODE) {
            var text = node.nodeValue;
            var replacedText = text
            for (var k = 0; k < translations.length; k++){      
                var re = new RegExp(translations[k][0], "gi")          
                replacedText = replacedText.replace(re, translations[k][1]);
            }

            if (replacedText !== text) {
                element.replaceChild(document.createTextNode(replacedText), node);
            }
            
        }
        
    }
}