

// let course = {
//     title: "Learn CSS Grid",
//     lessons: 16,
//     creator: "Roland Ojiba",
//     length: 63,
//     level: 2,
//     isFree: true,
//     tags: ["html", "css", {
//         firstName: "Chibuikem"
//     }, "javascript"]
// }


// console.log(course["tags"])

// let person = {
//     name: "Roland",
//     age: 35,
//     country: "Nigeria"
// }

// function logData() {
//     return `${person.name} is ${person.age} years old and lives in ${person.country}`;
// }

// console.log(logData());

// let age = 0;

// if(age < 6) {
//     console.log("Free!");
// }else if(age >= 6 && age <= 17) {
//     console.log("Child Discounnt!");
// } else if(age >= 18 && age <= 26) {
//     console.log("Student Discount!");
// } else if(age >= 27 && age <= 66) {
//     console.log("Full price");
// } else {
//     console.log("Senior citizen discount!");
// }


// let largeCountries = ["China", "India", "USA", "Indonesia", "Pakistan"]

// for(i = 0; i < largeCountries.length; i++) {
//     console.log(largeCountries[i])
// }

// let largeCountries = ["Tuvalu", "India", "USA", "Indonesia", "Monaco"];

// largeCountries.shift();
// largeCountries.pop();
// largeCountries.unshift("China");
// largeCountries.push("Pakistan");

// console.log(largeCountries)


// let hands = ["rock", "Paper", "scissor"];

// function randomPicker() {
//     let random = Math.floor(Math.random() * hands.length);
//     return hands[random]
// }

// console.log(randomPicker())
// console.log(randomPicker())
// console.log(randomPicker())
// console.log(randomPicker())

let fighter = ["🐉","🐥","🦎","💩","🦍","🦕","🐩","🦅","🦭","🦀","🐝","🤖","🐘","🐸","🕷️","🦁"];
let password = []

for(i = 0; i < 16; i++) {
    password.push(fighter[Math.floor(Math.random() * fighter.length)])
}

console.log(password);