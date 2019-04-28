// updates the document's num-words-learned value
function update_num_words_learned(){
    document.getElementById("num-words-learned").innerText = 
        document.getElementById("learned_words").firstChild.children.length;

    document.getElementById("inactive").innerText = 
        "Inactive: " + document.getElementById("inactive_words").firstChild.children.length;
    document.getElementById("active").innerText = 
        "Active: " + document.getElementById("active_words").firstChild.children.length;
    document.getElementById("learned").innerText = 
        "Learned: " + document.getElementById("learned_words").firstChild.children.length;
}

// returns num_rows, which are the counts for the words in [inactive, active, learned]
function create_translation_tables(){
    chrome.storage.local.get({"local_bank": {}}, function(local_bank_wrapper){
        let num_rows = [0, 0, 0]; // contains # of rows to create for each bucket

        let translations_body = document.getElementById("translations-body");
        
        // let container = document.createElement("DIV");
        // container.classList.add("container");
        // translations_body.appendChild(container);
        let row = document.createElement("DIV");
        row.classList.add("row");
        row.id = "translation-row";
        // container.appendChild(row);
        translations_body.appendChild(row)
        let col_array = [document.createElement("DIV"), document.createElement("DIV"), document.createElement("DIV")];
        for (let col of col_array){
            col.classList.add("col-sm");
            col.classList.add("pre-scrollable");
            row.appendChild(col);
        }
        // let category_array = [document.createElement("DIV"), document.createElement("DIV"), document.createElement("DIV")];
        // category_array[0].innerText = "Inactive";
        // category_array[1].innerText = "Active";
        // category_array[2].innerText = "Learned";
        // for (let i = 0; i <=2 ; i++){
        //     col_array[i].classList.add("category");
        //     col_array[i].appendChild(category_array[i]);
        // }
        // let scrollable_array = [document.createElement("DIV"), document.createElement("DIV"), document.createElement("DIV")];
        let table_array = [document.createElement("TABLE"), document.createElement("TABLE"), document.createElement("TABLE")];
        table_array[0].id = "inactive_words";
        table_array[1].id = "active_words";
        table_array[2].id = "learned_words";
        for (let table of table_array){
            table.classList.add("table-striped");
        }
        let tbody_array = [document.createElement('TBODY'), document.createElement('TBODY'), document.createElement('TBODY')];

        for (const [key, value] of Object.entries(local_bank_wrapper.local_bank)){
            // creates a new tr (table row) for this k,v pair and appends it to the corresponding tbody
            tbody_array[value.bucket].appendChild(create_tr(key, value));
            num_rows[value.bucket]++;
        }
        for (let i=0; i<=2; i++){
            table_array[i].appendChild(tbody_array[i]);
            col_array[i].appendChild(table_array[i]);
        }
        console.log("num_rows: " + num_rows);
        update_num_words_learned();
        return num_rows;
    })
}

function create_tr(key, value){
    let tr = document.createElement('TR');
    tr.id = "row_" + key;  //row_english
    td_array = [];
    if (value.bucket === 1 || value.bucket === 2){
        td_array.push(create_arrow(key, tr, value, -1));
    }
    let td_key = document.createElement('TD');
    td_key.id = "row_key_" + key; // row_key_english
    td_key.classList.add("translation-text-1");
    td_key.innerText = key;
    td_array.push(td_key);
    let td_value = document.createElement('TD');
    td_value.id = "row_value_" + key; // row_value_english
    td_value.classList.add("translation-text-2");
    td_value.innerText=value.trans;
    td_array.push(td_value);
    if (value.bucket === 0 || value.bucket === 1){
        td_array.push(create_arrow(key, tr, value, 1));
    }
    for (let td of td_array){
        tr.appendChild(td);
    }
    return tr;
}

function create_arrow(key, tr, value, direction){
    // -1 = left, 1 = right
    if (direction === -1){
        let left_td = document.createElement('TD');
        let td_left_arrow = document.createElement('BUTTON');
        td_left_arrow.id = "row_left_" + key; // row_left_english
        td_left_arrow.classList.add("arrow-button");
        td_left_arrow.innerText="<";
        td_left_arrow.onclick = function(){
            arrow_handler(tr, value, value.bucket-1);
        }
        left_td.appendChild(td_left_arrow);
        return td_left_arrow;
    }
    let right_td = document.createElement('TD');
    let td_right_arrow = document.createElement('BUTTON');
    td_right_arrow.id = "row_right_" + key;
    td_right_arrow.classList.add("arrow-button");
    td_right_arrow.innerText=">";
    td_right_arrow.onclick = function(){
        arrow_handler(tr, value, value.bucket+1);
    }
    right_td.appendChild(td_right_arrow);
    return td_right_arrow;
}

function arrow_handler(rowDiv, value, dest_bucket){
    key = rowDiv.id.split("row_")[1];
    bucket_move(key, dest_bucket, function(value){ // callback function needed because this is ASYNC
        if (value == null){
            console.log("bucket_move returned null!!");
            return;
        }
        // remove this rowDiv from this table and add it to another table
        mappings = ["inactive_words", "active_words", "learned_words"];
        dest_tbody = document.getElementById(mappings[dest_bucket]).firstChild;
        rowDiv.parentNode.removeChild(rowDiv); // remove from current table
        // reconstruct a new rowDiv from scratch (for simplicity) and add it to the destination table
        dest_tbody.appendChild(create_tr(key, value));
        // update the num_words_learned
        update_num_words_learned();
    });    
}


// Create a "close" button and append it to each list item
var myNodelist = document.getElementsByTagName("LI");
var i;
for (i = 0; i < myNodelist.length; i++) {
    var span = document.createElement("SPAN");
    var txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(txt);
    myNodelist[i].appendChild(span);
}

// Click on a close button to hide the current list item
// var close = document.getElementsByClassName("close");
// var i;
// for (i = 0; i < close.length; i++) {
//     close[i].onclick = function() {
//         var div = this.parentElement;
//         div.style.display = "none";
//     }
// }

// Add a "checked" symbol when clicking on a list item
var list = document.querySelector('ul');
list.addEventListener('click', function(ev) {
    if (ev.target.tagName === 'LI') {
        ev.target.classList.toggle('checked');
    }
}, false);

// Create a new list item when clicking on the "Add" button
function newElement(text) {
    var li = document.createElement("li");
    
    if (text == null){
        var inputValue = document.getElementById("myInput").value;
        var t = document.createTextNode(inputValue);    
        if (inputValue === '') {
            alert("You must write something!");
        } else {
            document.getElementById("myUL").appendChild(li);
        }
        document.getElementById("myInput").value = "";
    }

    li.appendChild(t);
    var span = document.createElement("SPAN");
    var txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(txt);
    li.appendChild(span);


    span.addEventListener('click', function(){
        var blacklist_row = span.parentElement;
        blacklist_row.parentElement.removeChild(blacklist_row);
        update_blacklist();
    });
}

function update_blacklist(){
    blacklist_items = document.getElementById('myUL').childNodes;
    chrome.storage.sync.set({"website_blacklist": blacklist_items});  
    console.log('Updated blacklist');
}

function populate_blacklist(){
    chrome.storage.sync.get({"website_blacklist": new Array()}, function(website_blacklist_wrapper){
        let website_blacklist = website_blacklist_wrapper.website_blacklist;
        if (website_blacklist.length === 0){ return }    
        console.log(website_blacklist.length);    
        console.log(typeof website_blacklist);
        for (const website of website_blacklist){
            newElement(website);
        }
        console.log('Populated blacklist');
    });
}

function blacklist_add_and_sync(){
    newElement();
    update_blacklist();
}

document.getElementById('blacklist_add_button').addEventListener('click', blacklist_add_and_sync);



/* When the user clicks on the button, 
toggle between hiding and showing the language dropdown content */
function dropdownFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}
  
// Close the language dropdown menu if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        let dropdowns = document.getElementsByClassName("dropdown-content");
        let i;
        for (i = 0; i < dropdowns.length; i++) {
            let openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

//JS for language drop down on click
document.addEventListener('DOMContentLoaded', function() {
    let link = document.getElementById('dropdownID');
    link.addEventListener('click', function() {
        dropdownFunction();
    });
});

document.addEventListener('DOMContentLoaded', function() {
    let languageSelection = document.getElementsByClassName('dropdown-language');

    for(let i = 0; i < languageSelection.length; i++) {
        languageSelection[i].addEventListener("click", function() {
            console.log("Clicked index: " + languageSelection[i].id);
            let selectedLanguage = languageSelection[i].innerHTML;
            document.getElementById("dropdownID").innerHTML = selectedLanguage;
        });
    };
});

create_translation_tables();
populate_blacklist();
console.log("newtab.js loaded");