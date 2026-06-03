const saveButton = document.getElementById("btn");
const inputEl = document.getElementById("input-el");
const ulEl = document.getElementById("lists")
let myLeads = [];

let num = 0;

saveButton.addEventListener("click", function() {
    myLeads.push(inputEl.value);
    let listItems = `<li> ${inputEl.value} </li>`;
    ulEl.innerHTML += listItems;
    inputEl.value = " "
    // for(i=0; i<myLeads.length; i++){
    //     listItems += `<li> ${myLeads[i]} </li>`
    // }
    // inputEl.value = "";
    // ulEl.innerHTML = listItems;
    // console.log(listItems)
})

// const containerEl = document.getElementById("container");

// containerEl.innerHTML = `<button onclick="render()">BUY</button>`

// function render() {
//     containerEl.innerHTML += `<p> Thank you for your Purchase! </p>`
// }