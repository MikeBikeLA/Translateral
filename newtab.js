function load_new_tab(){
    chrome.storage.sync.get("dict", function(dict_wrapper) {
        var num_words_learned = Object.keys(dict_wrapper.dict).length;
        document.getElementById("num-words-learned").innerHTML = num_words_learned;
    
        console.log("NUMBER OF WORDS LEARNED");
        console.log(num_words_learned);

     });


}
load_new_tab();
console.log("newtab.js loaded");