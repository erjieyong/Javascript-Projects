/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/

var scores, roundScores, activePlayer, dice1, dice2, previousDice, gamePlaying;

scores = [0, 0];
roundScores = 0;
activePlayer = 0;
gamePlaying = true;

//document.querySelector("#current-" + activePlayer).innerHTML = "<em>" + dice + "</em>";
/********
use below to read html text
var x = document.querySelector('#score-0').textContent
console.log(x);
*/
document.querySelector(".dice1").style.display = "none";
document.querySelector(".dice2").style.display = "none";

document.querySelector(".btn-roll").onclick = function() {
  if (gamePlaying) {
    dice1 = Math.floor(Math.random() * 6) + 1;
    dice2 = Math.floor(Math.random() * 6) + 1;
    document.querySelector(".dice1").style.display = "initial";
    document.querySelector(".dice2").style.display = "initial";
    document.querySelector(".dice1").src = "dice-" + dice1 + ".png";
    document.querySelector(".dice2").src = "dice-" + dice2 + ".png";
    if (dice1 === 1 || dice2 === 1) {
      roundScores = 0;
      document.querySelector(
        "#current-" + activePlayer
      ).innerHTML = roundScores;
      activePlayer = switchPlayer(activePlayer);
    } else if (dice1 === 6 && dice2 == 6){
      scores[activePlayer] = 0;
      roundScores = 0;
      document.querySelector("#score-" + activePlayer).innerHTML = 0;
      document.querySelector("#current-" + activePlayer).innerHTML = 0;
      activePlayer = switchPlayer(activePlayer);
    } else {
      roundScores = roundScores + dice1+ dice2;
      document.querySelector(
        "#current-" + activePlayer
      ).innerHTML = roundScores;
    }
  }
};
document.querySelector(".btn-hold").onclick = function() {
  if (gamePlaying) {
    winningScore = document.getElementById("winScore").value;
    scores[activePlayer] += roundScores;
    document.querySelector("#score-" + activePlayer).innerHTML =
      scores[activePlayer];
    roundScores = 0;
    document.querySelector("#current-" + activePlayer).innerHTML = roundScores;
    if (scores[activePlayer] >= winningScore) {
      document.querySelector("#name-" + activePlayer).innerHTML = "WINNER!";
      document
        .querySelector(".player-" + activePlayer + "-panel")
        .classList.add("winner");
      gamePlaying = false;
    } else {
      activePlayer = switchPlayer(activePlayer);
    }
  }
};

document.querySelector(".btn-new").onclick = function() {
  document.querySelector("#name-0").innerHTML = "Player 1";
  document.querySelector("#name-1").innerHTML = "Player 2";
  document
    .querySelector(".player-" + activePlayer + "-panel")
    .classList.remove("winner");
  document.querySelector(".btn-roll").style.display = "initial";
  document.querySelector(".btn-hold").style.display = "initial";
  scores[0] = 0;
  scores[1] = 0;
  roundScores = 0;
  document.querySelector("#score-0").innerHTML = 0;
  document.querySelector("#score-1").innerHTML = 0;
  document.querySelector("#current-0").innerHTML = 0;
  document.querySelector("#current-1").innerHTML = 0;
  gamePlaying = true;
};

function switchPlayer(activePlayer) {
  if (activePlayer === 0) {
    activePlayer = 1;
    document.querySelector(".active").classList.remove("active");
    document.querySelector(".player-1-panel").classList.add("active");
  } else {
    activePlayer = 0;
    document.querySelector(".active").classList.remove("active");
    document.querySelector(".player-0-panel").classList.add("active");
  }
  return activePlayer;
}
