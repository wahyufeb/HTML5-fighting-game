// rectangle collision detection
function rectangleCollision({ rect1, rect2 }) {
  return (
    rect1.attackBox.position.x + rect1.attackBox.width >= rect2.position.x &&
    rect1.attackBox.position.x <= rect2.position.x + rect2.width &&
    rect1.attackBox.position.y + rect1.attackBox.height >= rect2.position.y &&
    rect1.attackBox.position.y <= rect2.position.y + rect2.height
  );
}

// show result
function showResult({ message }) {
  document.querySelector(".result-indicator").style.backgroundColor =
    "rgba(0,0,0,0.8)";
  document.querySelector(".result-indicator").innerHTML = message;
}

function determineWinner(timerId) {
  clearTimeout(timerId);
  if (player.health === enemy.health) {
    showResult({ message: "Draw" });
  } else if (player.health > enemy.health) {
    showResult({ message: "Player 1 wins" });
  } else {
    showResult({ message: "Player 2 wins" });
  }
  setTimeout(() => {
    window.location.reload();
  }, 5000);
}

let timer = 90;
let timerId;
function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(() => decreaseTimer(), 1000);
    timer--;
    document.querySelector(".health-indicator--timer").innerHTML = timer;
  } else {
    determineWinner();
  }
}
