function load_new_tab(){
    chrome.storage.sync.get("dict", function(dict_wrapper) {
        var num_words_learned = Object.keys(dict_wrapper.dict).length;
        document.getElementById("num-words-learned").innerHTML = num_words_learned;
    
        console.log("NUMBER OF WORDS LEARNED");
        console.log(num_words_learned);
     });
}

/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function dropdownFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}
  
// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

//JS for drop down on click
document.addEventListener('DOMContentLoaded', function() {
    var link = document.getElementById('dropdownID');
    link.addEventListener('click', function() {
        dropdownFunction();
    });
});

document.addEventListener('DOMContentLoaded', function() {
    var languageSelection = document.getElementsByClassName('dropdown-language');

    for(let i = 0; i < languageSelection.length; i++) {
        languageSelection[i].addEventListener("click", function() {
            console.log("Clicked index: " + languageSelection[i].id);
            var selectedLanguage = languageSelection[i].innerHTML;
            document.getElementById("dropdownID").innerHTML = selectedLanguage;
        });
    };
});

load_new_tab();
console.log("newtab.js loaded");