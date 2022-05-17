class Sprite {
  constructor({
    position,
    imageSrc,
    scale = 1,
    fullWindow = false,
    framesMax = 1,
    offset = { x: 0, y: 0 },
  }) {
    this.position = position;
    this.width = 75;
    this.height = 150;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.fullWindow = fullWindow;
    this.framesMax = framesMax;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 8;
    this.offset = offset;
  }

  draw() {
    if (this.fullWindow) {
      ctx.drawImage(
        this.image,
        this.position.x,
        this.position.y,
        window.innerWidth,
        canvas.height
      );
    } else {
      ctx.drawImage(
        this.image,
        this.framesCurrent * (this.image.width / this.framesMax),
        0,
        this.image.width / this.framesMax,
        this.image.height,
        this.position.x - this.offset.x,
        this.position.y - this.offset.y,
        (this.image.width / this.framesMax) * this.scale,
        this.image.height * this.scale
      );
    }
  }

  update() {
    this.draw();
    if (!this.fullWindow) {
      this.animateFrames();
    }
  }

  animateFrames() {
    this.framesElapsed++;
    if (this.framesElapsed % this.framesHold === 0) {
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++;
      } else {
        this.framesCurrent = 0;
      }
    }
  }
}

class Fighter extends Sprite {
  attackStyle = "attack1";
  constructor({
    position,
    velocity,
    color = "red",
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
    sprites,
    attackBox = {
      offset: {
        x: 0,
        y: 0,
      },
      width: undefined,
      height: undefined,
    },
  }) {
    super({
      position,
      imageSrc,
      scale,
      framesMax,
      offset,
    });

    this.velocity = velocity;
    this.width = 60;
    this.height = 200;
    this.lastKey;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset: attackBox.offset,
      width: attackBox.width,
      height: attackBox.height,
    };
    this.color = color;
    this.isAttacking = false;
    this.health = 100;

    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = this.framesMax / 2;
    this.sprites = sprites;
    this.dead = false;

    for (const sprite in sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }
  }

  switchSprite(type) {
    if (
      this.image === this.sprites.death.image &&
      this.framesCurrent < this.framesMax
    ) {
      if (this.framesCurrent === this.framesMax - 1) this.dead = true;
      return;
    }
    // override all other animation with the attack animation
    for (let i = 1; i <= 3; i++) {
      if (
        this.image === this.sprites[`attack${i}`].image &&
        this.framesCurrent < this.sprites[`attack${i}`].framesMax - 1
      )
        return;
    }

    // override when fighter gets hit
    if (
      this.image === this.sprites.getHit.image &&
      this.framesCurrent < this.sprites.getHit.framesMax - 1
    )
      return;

    if (this.sprites.hasOwnProperty(type)) {
      if (this.image !== this.sprites[type].image) {
        this.image = this.sprites[type].image;
        this.framesMax = this.sprites[type].framesMax;
        this.framesHold = this.sprites[type].framesHold;
        this.framesCurrent = 0;
      }
    }
  }

  attack() {
    for (let i = 1; i <= 3; i++) {
      let currAttack = `attack${i}`;
      if (currAttack === this.attackStyle) {
        this.switchSprite(currAttack);
        this.attackStyle = i < 3 ? `attack${i + 1}` : `attack1`;
        break;
      }
    }
    this.isAttacking = true;
    // setTimeout(() => {
    //   this.isAttacking = false;
    // }, 200);
  }

  update() {
    this.draw();
    if (!this.dead) this.animateFrames();

    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

    // show attack box area
    // ctx.fillRect(
    //   this.attackBox.position.x,
    //   this.attackBox.position.y,
    //   this.attackBox.width,
    //   this.attackBox.height
    // );

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // gravity function
    if (
      this.position.y + this.height + this.velocity.y >=
      canvas.height - 130
    ) {
      this.velocity.y = 0;
      this.position.y = canvas.height - 330;
    } else this.velocity.y += gravity;
  }

  getHit() {
    this.health -= 10;
    if (this.health <= 0) this.switchSprite("death");
    else this.switchSprite("getHit");
  }
}
