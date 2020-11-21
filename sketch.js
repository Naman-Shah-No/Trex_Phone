var cacGroup;
var cloudGroup;

var vegetable;

var restartImg,gameOvImg,gameOv,restart;

var trex, trex_running, ground,groundImage,invisible_ground;

var cloud,cloundImg;

var score;

var cac1,cac2,cac3,cac4,cac5,cac6;
var cactus;

var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex_collided;
var jumpSound,dieSound,cpSound;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  
  groundImage = loadImage("ground2.png");
  cloudImg = loadImage("cloud.png");
  
  cac1 = loadImage("obstacle1.png");
  cac2 = loadImage("obstacle2.png");
  cac3 = loadImage("obstacle3.png");
  cac4 = loadImage("obstacle4.png");
  cac5 = loadImage("obstacle5.png");
  cac6 = loadImage("obstacle6.png");
  
  restartImg = loadImage("restart.png");
  gameOvImg = loadImage("gameOver.png");
  
  trex_collided = loadAnimation("trex_collided.png");
  
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  cpSound = loadSound("checkPoint.mp3");
}

function setup(){
  createCanvas(windowWidth,windowHeight);
  edges = createEdgeSprites();
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running",trex_running);
  trex.addAnimation("trex_collided",trex_collided);
  trex.scale = 0.5;
  trex.x = 50;
  
  ground = createSprite(width/2,height-10,width,2);
  ground.addImage("ground2",groundImage);  
  ground.x = ground.width/2;

  invisible_ground = createSprite(width/2,height-10,width,1);
  invisible_ground.visible = false;
  
  cacGroup = createGroup();
  cloudGroup = createGroup();
  
  restart = createSprite(width/2,height/2);
  restart.addImage("restart",restartImg);
  restart.scale = 0.5;
  
  gameOv = createSprite(width/2,height/2-60);
  gameOv.addImage("gameOv",gameOvImg);
  gameOv.scale = 0.5;
  
  score = 0;
}


function draw(){
  background("white");

  vegetable = ["onion","brinjal","capsicum"];
  console.log(vegetable[1]);
  
  text("score : " + score, 500, 50);
  
  if(gameState === PLAY){
    ground.velocityX = -(4+3*score/100)
    restart.visible = false;
    gameOv.visible = false;
    console.log(trex.y);
    
    trex.changeAnimation("running",trex_running);
    
    score = score + Math.round(getFrameRate() / 60);
    
    if(touches.length>0  || keyDown("space") && trex.y >= 480){
      trex.velocityY = -13.5;
      jumpSound.play();
      touches = [];
    }
    
    if(score % 100 === 0 && score > 0){
    cpSound.play();
    }
    
    if(ground.x<0){
      ground.x = ground.width/2;
    }
    
    spawnCloud();
    spawnObstacles();
    
    if(trex.isTouching(cacGroup)){
      gameState = END;
      dieSound.play();
      //trex.velocityY = -10;
      //jumpSound.play;
  }
  }
  
  if(gameState === END){
      ground.velocityX = 0;
    
      if(mousePressedOver(restart)){
        reset();
      }
    
      cacGroup.setVelocityXEach(0);
      cloudGroup.setVelocityXEach(0);
      cacGroup.setLifetimeEach(-1);
      cloudGroup.setLifetimeEach(-1);
    
      trex.changeAnimation("trex_collided",trex_collided);
      trex.velocityY = 0;
      
      restart.visible = true;
      gameOv.visible = true;
  }
  
  trex.velocityY = trex.velocityY+1.0;
  trex.collide(invisible_ground);
  
  drawSprites();
  
  //console.log(gameState);
  //console.time();
  //console.count();
  //console.timeEnd();
}

function spawnCloud(){
    if(frameCount  % 100 === 0){
      
      cloud = createSprite(width+20,height-300,40,10);
      cloud.addImage("cloud",cloudImg);
      cloud.y = Math.round(random(100,220));
      cloud.scale = .6;
      cloud.lifetime = 300;
      cloud.velocityX = -3;
      cloud.depth = trex.depth;
      
      console.log(trex.depth);
      console.log(cloud.depth);
      
      trex.depth = trex.depth+1;
      
      cloudGroup.add(cloud);
  }
}

function spawnObstacles(){
  if(frameCount  % 100 === 0){
    
      cactus = createSprite(600,height-25,20,30);
      cactus.velocityX = -(6+score/100);
      cactus.lifetime = 300;
      cactus.scale = 0.5;
    
      var rand = Math.round(random(1,6));
      switch(rand){
          case 1:cactus.addImage(cac1);
            break;
          case 2:cactus.addImage(cac2);
            break;
          case 3:cactus.addImage(cac3);
            break;
          case 4:cactus.addImage(cac4);
            break;
          case 5:cactus.addImage(cac5);
            break;
          case 6:cactus.addImage(cac6);
            break;
            default:break;
      }

    cacGroup.add(cactus);
  }
}

function reset(){
  gameState = PLAY;
  
  cacGroup.destroyEach();
  cloudGroup.destroyEach();
  
  score = 0;
}
