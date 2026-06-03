let fighter = ["🐉","🐥","🦎","💩","🦍","🦕","🐩","🦅","🦭","🦀","🐝","🤖","🐘","🐸","🕷️","🦁"];

let stageEl = document.getElementById("stage");
let fightButton = document.getElementById("fightButton");
let num = 1

fightButton.addEventListener("click", function() {
    let random1 = Math.floor(Math.random() * fighter.length);
    let random2 = Math.floor(Math.random() * fighter.length);

    stageEl.innerText = ` ${fighter[random1]} vs ${fighter[random2]}`

})