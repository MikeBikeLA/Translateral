var elements = document.getElementsByTagName('*');

translations = [[/also/gi, "1"], [/known/gi, "2"], [/as/gi, "3"]]

for (var i = 0; i < elements.length; i++) {
    var element = elements[i];

    for (var j = 0; j < element.childNodes.length; j++) {
        var node = element.childNodes[j];

        if (node.nodeType === Node.TEXT_NODE) {
            var text = node.nodeValue;
            var replacedText = text
            for (var k = 0; k < translations.length; k++){                
                var replacedText = replacedText.replace(translations[k][0], translations[k][1]);
            }

            if (replacedText !== text) {
                element.replaceChild(document.createTextNode(replacedText), node);
            }
            
        }
        
    }
}