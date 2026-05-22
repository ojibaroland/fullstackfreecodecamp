

let firstCard = 10;
let secondCard = 11;
let sum = firstCard + secondCard;
let hasBlackJack = false;
let isAlive = true;
let message = " ";

console.log(sum);

if (sum < 21) {
    message = "Do you want to draw a new card?";
} else if(sum > 21) {
    message = "You're out of the game!";
    isAlive = false;
} else {
    message = "Wohoo! You've got Blackjack!";
    hasBlackJack = true;
}


console.log(hasBlackJack);
console.log(isAlive);
console.log(message);