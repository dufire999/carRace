class Form {
  constructor() {
    //Construir o formulário em HTML
    this.input = createInput("").attribute("placeholder", "digite seu nome ou apelido");
    this.playButton = createButton("aperte para jogar");
    this.titleImg = createImg("assets/title.png","title");
    this.greeting = createElement("h2");
    
    
  }

  setElementsPosition() {
    //Definir a posição dos elementos do formulário
    this.input.position(width/2-110, height/2-80);
    this.playButton.position(width/2-90,height/2-20);
    this.titleImg.position(120,160);
    this.greeting.position(width/2-300,height/2-100);

  }

  setElementsStyle() {
    //Adicionar estilo aos elementos do formulário (style.css)
    this.input.class("customInput");
    this.playButton.class("customButton");
    this.titleImg.class("gameTitle");
    this.greeting.class("greeting");
  }

  hide() {
    //Esconder os elementos quando o jogo iniciar
    this.input.hide();
    this.playButton.hide();
    this.greeting.hide();
  }

  //Função para quando apertar o botão de PLAY
  playb() {
    this.playButton.mousePressed(() => {
      this.input.hide();
      this.playButton.hide();
      var mensagem = `
      bem vindo ${this.input.value()}
      </br> aguarde outro jogdor`;
      this.greeting.html(mensagem);
      playerCount += 1;
      player.name = this.input.value();
      player.index = playerCount;
      player.addPlayer();
      player.updateCount(playerCount);
      player.getDistance();
    });
  }

  display() {
    //Exibir os elementos nas suas posições e estilos
    this.setElementsPosition();
    this.setElementsStyle();
    //Chamar a função de apertar o botão PLAY
    this.playb();
  }
}