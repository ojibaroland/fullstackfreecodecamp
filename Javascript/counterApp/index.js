// document.getElementById("count-el").innerText = 5;


// let count = 0;
// console.log(count)

// initialize the count as zero

let countEl = document.getElementById("count-el");
let resultEl = document.getElementById("result-el");


let count = 0;

function increment() {
    count++
    countEl.innerText = count;
}

function decrease() {
    if(count > 0){
    count--;
    countEl.innerText = count;
    } else {
        count = 0;
    }
}

function refresh() {
    count = 0;
    countEl.innerText = count;
    resultEl.innerText = "Previous Entries:"
    console.log(5)
}


function save() {
    let result = ` ${count} - `;
    resultEl.innerText += result;
}


