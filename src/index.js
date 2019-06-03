import Phaser from "phaser";

import skyImg from "./assets/sky.png";
import  starImg from "./assets/star.png";
import  groundImg from "./assets/platform.png";
import  dudeImg from "./assets/dude.png";
import  bombImg  from "./assets/bomb.png";
import  logoImg  from "./assets/world.png";


const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 800,
  height: 600,
  crossOrigin: "anonymous",
  parent: 'phaser-game',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};


var player;
var stars;
var bombs;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;
var discountText;
var userText;


const game = new Phaser.Game(config);


function preload() {
 
  this.load.crossOrigin = 'anonymous';

  // this.load.image("logo", logoImg);
  // this.load.image("sky", skyImg);
  // this.load.image("star", starImg);
  // this.load.image("ground", groundImg);
  // this.load.image("bomb", bombImg);
  // this.load.spritesheet("dude", dudeImg, { frameWidth: 32, frameHeight: 48 });
}



function create() {
  // const sky = this.add.image(400, 300, "sky");
  // const star = this.add.image(100, 300, "star");
  // const logo = this.add.image(400, 150, "logo");

  // https://supernapie.com/blog/loading-assets-as-data-uri-in-phaser-3/

  const sky = this.textures.addBase64('sky', skyImg);
  const star = this.textures.addBase64('star', starImg);
 const logo=  this.textures.addBase64('logo', logoImg);
 
 const ground  = this.textures.addBase64('ground', groundImg);
 const bomb  = this.textures.addBase64('bomb', bombImg);
 

 var dudeImg = new Image();
 dudeImg.onload = () => {
     this.textures.addSpriteSheet('dude', dudeImg, { frameWidth: 16, frameHeight: 16 });
 };
 dudeImg.src = dude;


  // Logo Tweens 
  this.tweens.add({
    targets: logo,
    y: 450,
    duration: 10000,
    ease: "Power2",
    yoyo: true,
    loop: -1
  });

  // Platforms
  platforms = this.physics.add.staticGroup();
  platforms.create(400, 568, ground ).setScale(2).refreshBody();
  platforms.create(600, 400, ground );
  platforms.create(50, 250, ground );
  platforms.create(750, 220, ground );


  // Player 
  player = this.physics.add.sprite(100, 450, dude );
 

  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'turn',
    frames: [{ key: 'dude', frame: 4 }],
    frameRate: 20
  });

  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
  });

  // Cursors

  cursors = this.input.keyboard.createCursorKeys();


// Colider
  this.physics.add.collider(player, platforms);


  // Stars
  stars = this.physics.add.group({
    key: 'star',
    repeat: 11,
    setXY: { x: 12, y: 0, stepX: 70 }
});

stars.children.iterate(function (child) {

    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

});

this.physics.add.collider(stars, platforms);


this.physics.add.overlap(player, stars, collectStar, null, this);


// Score
scoreText = this.add.text(16, 25, 'score: 0', { fontSize: '20px', fill: '#000' });

// discount
discountText = this.add.text(650, 25, 'Code: *****', { fontSize: '20px', fill: '#000' });

// user
userText = this.add.text(300, 10, 'Collect the Stars!', { fontSize: '20px', fill: '#000' });

// bombs 
bombs = this.physics.add.group();
this.physics.add.collider(bombs, platforms);

this.physics.add.collider(player, bombs, hitBomb, null, this);


}

function update() {


  if (cursors.left.isDown) {
    player.setVelocityX(-160);

    player.anims.play('left', true);
  }
  else if (cursors.right.isDown) {
    player.setVelocityX(160);

    player.anims.play('right', true);
  }
  else {
    player.setVelocityX(0);

    player.anims.play('turn');
  }

  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-330);
  }

}

function collectStar (player, star)
{
    star.disableBody(true, true);

    score += 10;
    scoreText.setText('Score: ' + score);

    if (stars.countActive(true) === 0)
    {
        stars.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

        userText.setText("Wach out for crazy crabs!! ")

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

    }

    if (score > 100) {
      discountText.setText('Code: A***0')
    }

    if (score > 200) {
      discountText.setText('Code: AP**0')
    }
    if (score > 300) {
      discountText.setText('Code: APP10')
    }
    

}

function hitBomb (player, bomb)
{
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    userText.setText("Game Over - Reload Page")
    gameOver = true;


}
