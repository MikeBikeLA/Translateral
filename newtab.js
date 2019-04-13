function load_new_tab(){
    chrome.storage.local.get("local_bank", function(local_bank_wrapper) {
        let num_words_learned = Object.keys(local_bank_wrapper.local_bank).length;
        document.getElementById("num-words-learned").innerHTML = num_words_learned;    
        console.log("NUMBER OF WORDS LEARNED");
        console.log(num_words_learned);
     });
}

function create_translation_tables(){
    chrome.storage.local.get({"local_bank": {}}, function(local_bank_wrapper){
        let num_rows = [0, 0, 0]; // contains # of rows to create for each bucket

        let translations_body = document.getElementById("translations_body");
        
        let container = document.createElement("DIV");
        container.classList.add("container");
        translations_body.appendChild(container);
        let row = document.createElement("DIV");
        row.classList.add("row");
        container.appendChild(row);
        let col_array = [document.createElement("DIV"), document.createElement("DIV"), document.createElement("DIV")];
        for (let col of col_array){
            col.classList.add("col-sm");
            row.appendChild(col);
        }

        let table_array = [document.createElement("TABLE"), document.createElement("TABLE"), document.createElement("TABLE")];
        table_array[0].id = "inactive_words";
        table_array[1].id = "active_words";
        table_array[2].id = "learned_words";
        for (let table of table_array){
            table.classList.add("table-striped")
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
    td_key.innerText=key;
    td_array.push(td_key);
    let td_value = document.createElement('TD');
    td_value.id = "row_value_" + key; // row_value_english
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
        let td_left_arrow = document.createElement('TD');
        td_left_arrow.id = "row_left_" + key; // row_left_english
        td_left_arrow.innerText="<";
        td_left_arrow.onclick = function(){
            arrow_handler(tr, value, value.bucket-1);
        }
        return td_left_arrow;
    }
    let td_right_arrow = document.createElement('TD');
    td_right_arrow.id = "row_right_" + key;
    td_right_arrow.innerText=">";
    td_right_arrow.onclick = function(){
        arrow_handler(tr, value, value.bucket+1);
    }
    return td_right_arrow;
}

function arrow_handler(rowDiv, value, dest_bucket){
    key = rowDiv.id.split("row_")[1];
    bucket_move(key, dest_bucket, function(data){ // callback function needed because this is ASYNC
        if (data == null){
            console.log("bucket_move returned null!!");
            break;
        }
        // remove this rowDiv from this table and add it to another table
        mappings = ["inactive_words", "active_words", "learned_words"];
        dest_tbody = document.getElementById(mappings[dest_bucket]).firstChild;
        rowDiv.parentNode.removeChild(rowDiv); // remove from current table
        // reconstruct a new rowDiv from scratch (for simplicity) and add it to the destination table
        dest_tbody.appendChild(create_tr(key, data.value));
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

//JS for drop down on click
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

load_new_tab();
create_translation_tables();
console.log("newtab.js loaded");