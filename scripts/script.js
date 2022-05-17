const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 1;
const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  fullWindow: true,
  imageSrc: "../assets/background.png",
});
const shop = new Sprite({
  position: {
    x: 1000,
    y: 530,
  },
  imageSrc: "../assets/shop_frames.png",
  scale: 3.5,
  framesMax: 6,
});

const player = new Fighter({
  position: {
    x: 200,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  imageSrc: "../assets/player/Idle.png",
  framesMax: 10,
  scale: 3.1,
  offset: {
    x: 220,
    y: 120,
  },
  sprites: {
    idle: {
      imageSrc: "../assets/player/Idle.png",
      framesMax: 10,
      framesHold: 5,
    },
    run: {
      imageSrc: "../assets/player/Run.png",
      framesMax: 8,
      framesHold: 5,
    },
    fall: {
      imageSrc: "../assets/player/Fall.png",
      framesMax: 3,
      framesHold: 5,
    },
    jump: {
      imageSrc: "../assets/player/Jump.png",
      framesMax: 3,
      framesHold: 5,
    },
    attack1: {
      imageSrc: "../assets/player/Attack1.png",
      framesMax: 7,
      framesHold: 4,
    },
    attack2: {
      imageSrc: "../assets/player/Attack2.png",
      framesMax: 7,
      framesHold: 4,
    },
    attack3: {
      imageSrc: "../assets/player/Attack3.png",
      framesMax: 8,
      framesHold: 4,
    },
    getHit: {
      imageSrc: "../assets/player/GetHit.png",
      framesMax: 3,
      framesHold: 6,
    },
    death: {
      imageSrc: "../assets/player/Death.png",
      framesMax: 7,
      framesHold: 7,
    },
  },
  attackBox: {
    offset: {
      x: 0,
      y: 75,
    },
    width: 180,
    height: 100,
  },
});

const enemy = new Fighter({
  position: {
    x: window.innerWidth - 200,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  imageSrc: "../assets/player2/Idle.png",
  framesMax: 10,
  scale: 3.1,
  offset: {
    x: 180,
    y: 74,
  },
  sprites: {
    idle: {
      imageSrc: "../assets/player2/Idle.png",
      framesMax: 10,
      framesHold: 5,
    },
    run: {
      imageSrc: "../assets/player2/Run.png",
      framesMax: 6,
      framesHold: 5,
    },
    fall: {
      imageSrc: "../assets/player2/Fall.png",
      framesMax: 2,
      framesHold: 1,
    },
    jump: {
      imageSrc: "../assets/player2/Jump.png",
      framesMax: 2,
      framesHold: 1,
    },
    attack1: {
      imageSrc: "../assets/player2/Attack1.png",
      framesMax: 4,
      framesHold: 6,
    },
    attack2: {
      imageSrc: "../assets/player2/Attack2.png",
      framesMax: 4,
      framesHold: 4,
    },
    attack3: {
      imageSrc: "../assets/player2/Attack3.png",
      framesMax: 5,
      framesHold: 3,
    },
    getHit: {
      imageSrc: "../assets/player2/GetHit.png",
      framesMax: 3,
      framesHold: 6,
    },
    death: {
      imageSrc: "../assets/player2/Death.png",
      framesMax: 9,
      framesHold: 9,
    },
  },
  attackBox: {
    offset: {
      x: -120,
      y: 75,
    },
    width: 180,
    height: 100,
  },
});

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowUp: {
    pressed: false,
  },
};

// Rendering per frame
function animate() {
  window.requestAnimationFrame(animate);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  background.update();
  shop.update();
  ctx.fillStyle = "rgba(0, 0, 0, .6)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  // Player movement
  if (keys.a.pressed && player.lastKey == "a") {
    player.velocity.x = -5;
    player.switchSprite("run");
  } else if (keys.d.pressed && player.lastKey == "d") {
    player.velocity.x = 5;
    player.switchSprite("run");
  } else {
    player.switchSprite("idle");
  }

  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }

  // Enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey == "ArrowLeft") {
    enemy.velocity.x = -5;
    enemy.switchSprite("run");
  } else if (keys.ArrowRight.pressed && enemy.lastKey == "ArrowRight") {
    enemy.velocity.x = 5;
    enemy.switchSprite("run");
  } else {
    enemy.switchSprite("idle");
  }

  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall");
  }

  // detect for collision
  if (
    rectangleCollision({
      rect1: player,
      rect2: enemy,
    }) &&
    player.isAttacking &&
    player.framesCurrent === 4
  ) {
    player.isAttacking = false;
    enemy.getHit();
    gsap.to(".health-indicator--player2__health", {
      width: enemy.health + "%",
    });
    enemy.switchSprite("getHit");
  }

  // if player missed
  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false;
  }

  if (
    rectangleCollision({
      rect1: enemy,
      rect2: player,
    }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 1
  ) {
    enemy.isAttacking = false;
    player.getHit();
    gsap.to(".health-indicator--player1__health", {
      width: player.health + "%",
    });
    player.switchSprite("getHit");
  }

  // if enemy missed
  if (enemy.isAttacking && enemy.framesCurrent === 1) {
    enemy.isAttacking = false;
  }

  // end game base on health
  if (player.health <= 0 || enemy.health <= 0) {
    determineWinner(timerId);
  }
}

window.addEventListener("keydown", (e) => {
  if (!player.dead) {
    switch (e.key) {
      case "a":
        keys.a.pressed = true;
        player.lastKey = "a";
        break;
      case "d":
        keys.d.pressed = true;
        player.lastKey = "d";
        break;
      case "w":
        player.velocity.y = -25;
        break;
      case " ":
        player.attack();
        break;
    }
  }

  if (!enemy.dead) {
    switch (e.key) {
      case "ArrowLeft":
        keys.ArrowLeft.pressed = true;
        enemy.lastKey = "ArrowLeft";
        break;
      case "ArrowRight":
        keys.ArrowRight.pressed = true;
        enemy.lastKey = "ArrowRight";
        break;
      case "ArrowUp":
        enemy.velocity.y = -25;
        break;
      case "ArrowDown":
        enemy.attack();
        break;
    }
  }
});

window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "w":
      keys.w.pressed = false;
      break;
  }

  switch (e.key) {
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
    case "ArrowUp":
      keys.ArrowUp.pressed = false;
      break;
  }
});

decreaseTimer();
animate();
