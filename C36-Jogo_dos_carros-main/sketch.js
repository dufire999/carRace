var canvas;
var backgroundImage;
var bgImg;
var database;
var form, player;
var playerCount;
var gameState;
var car1img;
var car2img;
var road;
var car1;
var car2;
var cars = [];
var allPlayers;
var gasolineImg;
var coinImg;
var obstacle1Image;
var obstacle2Image;
var obstacleGroup;
var gasolineGroup;
var coinGroup;
var lifeImg;
var blast;



function preload() {
  backgroundImage = loadImage("assets/background.png");
  car1img = loadImage("assets/car1.png");
  car2img = loadImage("assets/car2.png");
  road = loadImage("assets/track.jpg");
  gasolineImg = loadImage("assets/fuel.png");
  coinImg = loadImage("assets/goldCoin.png");
  obstacle1Image = loadImage("assets/obstacle1.png");
  obstacle2Image = loadImage("assets/obstacle2.png");
  lifeImg = loadImage("assets/life.png");
  blast = loadImage("assets/blast.png");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.getState();
  game.start();

}

function draw() {
  background(backgroundImage);
  if(playerCount === 2){
    game.update(1)
  }
  if(gameState === 1){
    game.play()
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}