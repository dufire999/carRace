class Game {
  constructor() {
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");
    this.placar = createElement("h2");
    this.primeiro = createElement("h2");
    this.segundo = createElement("h2");
    this.playerMoving = false;
    this.leftArrow = false;
    this.explosion = false;
  }

  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", (data)=> {
      gameState = data.val()
    })
  }

  start() {
    form = new Form();
    form.display();
    player = new Player();
    playerCount = player.getCount();
    car1 = createSprite(width/2-50, height-100)
    car1.addImage("car1",car1img);
    car1.scale = 0.07
    car1.addImage("blast",blast);
    car2 = createSprite(width/2+100, height-100)
    car2.addImage("car2",car2img);
    car2.scale = 0.07;
    car2.addImage("blast",blast);
    cars = [car1, car2];
    obstacleGroup = new Group();
    coinGroup = new Group();
    gasolineGroup = new Group();
    var obstaclesPositions = [ { x: width / 2 + 250, y: height - 800, image: obstacle2Image }, { x: width / 2 - 150, y: height - 1300, image: obstacle1Image }, { x: width / 2 + 250, y: height - 1800, image: obstacle1Image }, { x: width / 2 - 180, y: height - 2300, image: obstacle2Image }, { x: width / 2, y: height - 2800, image: obstacle2Image }, { x: width / 2 - 180, y: height - 3300, image: obstacle1Image }, { x: width / 2 + 180, y: height - 3300, image: obstacle2Image }, { x: width / 2 + 250, y: height - 3800, image: obstacle2Image }, { x: width / 2 - 150, y: height - 4300, image: obstacle1Image }, { x: width / 2 + 250, y: height - 4800, image: obstacle2Image }, { x: width / 2, y: height - 5300, image: obstacle1Image }, { x: width / 2 - 180, y: height - 5500, image: obstacle2Image } ];
    this.addSprite(gasolineGroup,4,gasolineImg,0.02);
    this.addSprite(coinGroup,18,coinImg,0.09);
    this.addSprite(obstacleGroup,obstaclesPositions.length,obstacle1Image,0.04,obstaclesPositions);
  }

  addSprite(spriteGroupe,numberOfSprites,spriteImage,scale,positions = []) {
    for(var i = 0;i<numberOfSprites;i++){
      var x;
      var y;
      if(positions.length>0){
        x=positions[i].x;
        y=positions[i].y;
        spriteImage=positions[i].image;
      }else{
        x = random(width/2+150,width/2-150);
        y = random(-height*4.5,height-400);
      }
      var sprite = createSprite(x,y);
      sprite.addImage(spriteImage);
      sprite.scale = scale;
      spriteGroupe.add(sprite);
    }
  }

  update(state) {
    database.ref("/").update({
      gameState: state,
    })
  }
  
  hideElements() {
    form.hide();
    form.titleImg.position(40,50);
    form.titleImg.class("gameTitleAfterEffect");
    this.resetTitle.html("jogue de novo");
    this.resetTitle.position(width/2 +200, 40);
    this.resetTitle.class("resetText");
    this.resetButton.position(width/2+230, 100);
    this.resetButton.class("resetButton");
    this.placar.html("placar");
    this.placar.class("resetText")
    this.placar.position(width/3-60,40);
    this.primeiro.class("leadersText");
    this.primeiro.position(width/3-50,80);
    this.segundo.class("leadersText");
    this.segundo.position(width/3-50,130)
  }

  play() {
    this.hideElements();
    Player.getPlayersInfo();
    player.getCarsAtEnd();
    if(allPlayers !== undefined){
      image(road, 0,-height*5, width, height*6);
      this.showLeader();
      this.showLife();
      this.showGas();
      var index = 0;
      for(var plr in allPlayers){
        index += 1;
        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;
        var vida_atual = allPlayers[plr].lifeBar;
        if(vida_atual <= 0){
          cars[index-1].changeImage("blast");
          cars[index-1].scale = 0.3;
        }
        cars[index-1].position.x = x;
        cars[index-1].position.y = y;
        if(index === player.index){
          camera.position.y = cars[index-1].position.y;
          if(player.lifeBar <=0){
            this.explosion=true;
            this.playerMoving = false;
            setTimeout(()=>{
              this.noGas()
            },"1000")
          }
          this.carsCollision(index);
          this.obsCollision(index);
          this.pegarGasolina(index);
          this.pegarMoeda(index);
          stroke(10);
          fill("red");
          ellipse(x,y,60,60)
        }
      }
      this.playerControlls();
      if(this.playerMoving){
        player.positionY +=5;
        player.update();
      }
      const finishLine = height*6-100;
      if(player.positionY>finishLine){
        gameState = 2;
        player.rank += 1;
        Player.updateCarsAtEnd(player.rank);
        player.update();
        this.showRank()
      }
      drawSprites();
    }
    this.reset();
  }
  playerControlls(){
    if(!this.explosion){
      if(keyIsDown(UP_ARROW)){
        player.positionY +=10;
        player.update();
        this.playerMoving = true;
      }
      if(keyIsDown(LEFT_ARROW) && player.positionX>width/3-50){
        player.positionX -=10
        player.update();
        this.leftArrow = true;
      }
      if(keyIsDown(RIGHT_ARROW) && player.positionX<width/2+300){
        player.positionX +=10
        player.update();
        this.leftArrow = false;
      }
    }
  }

  reset(){
    this.resetButton.mousePressed(()=>{
      database.ref("/").set({
        gameState: 0,
        playerCount: 0,
        players:{},
        carsAtEnd:0,
      })
      window.location.reload();
    })
  }

  showLeader(){
    var leader1, leader2;
    var players = Object.values(allPlayers);
    if (
      (players[0].rank === 0 && players[1].rank === 0) ||
      players[0].rank === 1
    ) {
      // &emsp;    Essa etiqueta é usada para exibir quatro espaços.
      leader1 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;

      leader2 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;
    }
    if(players[1].rank === 1){
      leader1 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;

      leader2 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;
    }
    this.primeiro.html(leader1);
    this.segundo.html(leader2);
  }

  pegarGasolina(index) {
    cars[index-1].overlap(gasolineGroup,function(collector,collected){
      collected.remove();
      player.gasolina = 185;
    });
    if(player.gasolina>0 && this.playerMoving){
      player.gasolina -= 0.8;
    }
    if(player.gasolina<=0){
      this.noGas();
      gameState = 2;
    }
  }
  pegarMoeda(index) {
    cars[index-1].overlap(coinGroup,function(collector,collected){
      collected.remove();
      player.score += 1;
      player.update();
    });
  }

  showRank(){
    swal({
      title: `parabens${"\n"}${
        player.rank
      }lugar`,
      text: "perdeu seu tempo",
      imageUrl: "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize:"100x100",
      confirmButtonText: "ok",
    })
  }

  noGas(){
    swal({
      title: `acabou sua gasolina`,
      text: "200 conto por mais um litro",
      imageUrl: "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
      imageSize:"100x100",
      confirmButtonText: "ok",
    })
  }

  showLife(){
    push();
    image(lifeImg,width/2-130, height-player.positionY+200,20,20);
    fill("white");
    rect(width/2-100,height-player.positionY+200,185,20);
    fill("red");
    rect(width/2-100,height-player.positionY+200,player.lifeBar,20);
    noStroke();
    pop();
  }

  showGas(){
    push();
    image(gasolineImg,width/2-130, height-player.positionY+250,20,20);
    fill("white");
    rect(width/2-100,height-player.positionY+250,185,20);
    fill("orange");
    rect(width/2-100,height-player.positionY+250,player.gasolina,20);
    noStroke();
    pop();
  }

  obsCollision(index){
    if(cars[index-1].collide(obstacleGroup)){
      if(player.lifeBar>0){
        player.lifeBar -= 185/2;
      }
      player.update();
      if(this.leftArrow){
        player.positionX += 100;
      }else{
        player.positionX -=100;
      }

    }
  }

  carsCollision(index){
    if(index === 1){
      if(cars[index - 1].collide(cars[1])){
        if(this.leftArrow){
          player.positionX += 100;
        } else {
          player.positionX -= 100;
        }
        if(player.lifeBar > 0){
          player.lifeBar -= 185/2;
        }
        player.update();
      }
    }
    if(index === 2){
      if(cars[index - 1].collide(cars[0])){
        if(this.leftArrow){
          player.positionX += 100;
        } else {
          player.positionX -= 100;
        }
        if(player.lifeBar > 0){
          player.lifeBar -= 185/2;
        }
        player.update();
      }
    }
  }
}