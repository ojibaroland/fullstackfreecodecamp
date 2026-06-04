const saveButton = document.getElementById("btn");
const inputEl = document.getElementById("input-el");
const ulEl = document.getElementById("lists")
let myLeads = [];

let num = 0;

saveButton.addEventListener("click", function () {
    myLeads.push(inputEl.value);
    let listItems = "";
    // ulEl.innerHTML += listItems;
    for (i = 0; i < myLeads.length; i++) {
        listItems +=
            `<li>
               <a href="${myLeads[i]}" target="_blank">
               ${myLeads[i]} </a>
            </li>`
    }
    ulEl.innerHTML = listItems;
    inputEl.value = "";
    console.log(listItems)
})

// const containerEl = document.getElementById("container");

// containerEl.innerHTML = `<button onclick="render()">BUY</button>`

// function render() {
//     containerEl.innerHTML += `<p> Thank you for your Purchase! </p>`
// }