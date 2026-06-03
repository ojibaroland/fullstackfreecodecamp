let cardsEl = document.getElementById("cards-el");
let sumEl = document.getElementById("sum-el");
let messageEl = document.getElementById("message-el");
let buttonEl = document.getElementById("startbtn");
let newGameEl = document.getElementById("newbtn");
let newCardEl = document.getElementById("newcardbtn");
cardsEl.innerText = `Cards: `;
let firstCard = Math.floor(Math.random() * 12);
let secondCard = Math.floor(Math.random() * 12);
let cards = [firstCard, secondCard];
let sum = 0;
let hasBlackJack = false;
let isAlive = true;
let message = " ";
let gameEnded = false;




function newGame() {
    messageEl.innerText = "Want to play a round";
    cardsEl.innerText = `Cards: `;
    sumEl.innerText = "Sum:";
    newGameEl.style.display = "none";
}


function startGame() {
    for (i = 0; i < cards.length; i++) {
    sum += cards[i];
    cardsEl.innerText += ` ${cards[i]}`
}

    if (sum < 21) {
        message = "Do you want to draw a new card?";
        buttonEl.innerText = "START GAME";
    } else if (gameEnded) {
        firstCard = Math.floor(Math.random() * 12);
        secondCard = Math.floor(Math.random() * 12);
        sum = firstCard + secondCard;
        gameEnded = false;
        startGame();
    } else if (sum === 21) {
        message = "Wohoo! You've got Blackjack!";
        buttonEl.innerText = "REPLAY";
        hasBlackJack = true;
    } else {
        message = "You're out of the game!";
        isAlive = false;
        buttonEl.innerText = "REPLAY";
        gameEnded = true;

    }

    messageEl.innerText = message;
    newGameEl.style.display = "block";
    sumEl.innerText = `Sum: ${sum}`;
    newCardEl.style.display = "block"
    buttonEl.style.display = "none"

}

function newCard() {
    random = cards.push(Math.floor(Math.random() * 12));
    sum = 0
    for (i = 0; i < cards.length; i++) {
            sum += cards[i];
        }
    if (sum > 21) {
        message = "You're out of the game!";
        gameEnded = true;
        newGameEl.style.display = "none";
        buttonEl.style.display = "block";
        newCardEl.style.display = "none";
        cardsEl.innerText = `Cards: ${cards}`
        sumEl.innerText = `Sum: ${sum}`;
    } else if (sum === 21) {
        message = "Wohoo! You've got Blackjack!";
        messageEl.innerText = message;
        cardsEl.innerText = `Cards: ${cards}`
        buttonEl.style.display = "Block"
        newGameEl.style.display = "none";
        newCardEl.style.display = "none";
        sumEl.innerText = `Sum: ${sum}`;
    } else {
        if (sum > 21) {
            message = "You're out of the game!";
            gameEnded = true;
            newGameEl.style.display = "none";
            buttonEl.style.display = "block";
            newCardEl.style.display = "none";
        }
        messageEl.innerText = message;
        cardsEl.innerText = `Cards: ${cards}`
        sumEl.innerText = `Sum: ${sum}`;
    }


}

console.log(hasBlackJack);
console.log(isAlive);