//for canvas
let block;
let block_width=1036;
let block_height=200;
let context;
//for dino
let dino_width=48;
let dino_height=50;
let dinoX=50;
let dinoY=block_height-dino_height;
let dinoImg;

let dino={
    x:dinoX,
    y:dinoY,
    width:dino_width,
    height:dino_height
}

//for ground
let groundX = 0; 
let groundSpeed = -5; 


//for cactus
let cactusArray=[];

let cactus_smol_1_width=25;
let cactus_smol_2_width=35;
let cactus_smol_3_width=45;

let cacti_height=40;
let cactiX=1036;
let cactiY=block_height-cacti_height;

let cactus_smol_1_img;
let cactus_smol_2_img;
let cactus_smol_3_img;

//cactus in action
let speedX=-5;
let speedY=0;
let gravity=0.4;

let gameOver=false;
let score=0;

//for bird
let birdArray = [];

let bird_width = 40;
let bird_height = 30;
let birdX = 1036;

let bird_Img;
let birdScoreThreshold = 1000;

let flapSpeed = 15;
let flapCount = 0;


window.onload=function(){
    block=document.getElementById("block");
    block.height=block_height;
    block.width=block_width;

    context=block.getContext("2d");
    
    dinoImg = new Image();
    dinoImg.src = "./png/dino.png";
    dinoImg.onload = function() {
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    }

    cactus_smol_1_img = new Image();
    cactus_smol_1_img.src = "./png/cactus_smol_1.png";

    cactus_smol_2_img = new Image();
    cactus_smol_2_img.src = "./png/cactus_smol_2.png";

    cactus_smol_3_img = new Image();
    cactus_smol_3_img.src = "./png/cactus_smol_3.png";

    cloud_img = new Image();
    cloud_img.src = "./png/cloud.png";

    dino_duck_img = new Image();
    dino_duck_img.src = "./png/dino_dodge_1.png";

    bird_feather_up_img = new Image();
    bird_feather_up_img.src = "./png/bird_feather_up.png";

    bird_feather_down_img = new Image();
    bird_feather_down_img.src = "./png/bird_feather_down.png";

    ground_img = new Image();
    ground_img.src = "./png/ground.png";


    requestAnimationFrame(update);
    setInterval(cactusAt,900);
    setInterval(birdAt, 1500); 
    document.addEventListener("keydown",moveDino);
    document.addEventListener("keyup", function(e) {
        if (e.code == "ArrowDown") {
            stopDucking();
        }
    });
}

function update(){
    
    requestAnimationFrame(update);

    if (gameOver){
        return;
    }

    context.clearRect(0,0,block.width,block.height);

    // drawing the ground
    groundX += groundSpeed;
    if (groundX <= -block_width) {
        groundX = 0;
    }

    context.drawImage(ground_img, groundX, block_height - 18);
    context.drawImage(ground_img, groundX + block_width, block_height - 5);

    //dino will be drawn with each frame
    speedY += gravity;
    dino.y = Math.min(dino.y+speedY,dinoY);
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

    //draw cactus
    for(let i=0;i<cactusArray.length;i++){
        let cacti=cactusArray[i];
        cacti.x += speedX;
        context.drawImage(cacti.img,cacti.x,cacti.y,cacti.width,cacti.height);

        if(detectCollision(dino,cacti)){
            gameOver=true;
            dinoImg.src="./png/dino_deceased.png";
            dinoImg.onload=function(){
                context.drawImage(dinoImg,dino.x,dino.y,dino.width,dino.height);
            }
            alert("Game Over! Reload page to play Again."); 
            return; 
        }
        
    }

    //draw birds
        flapCount++;
        for (let i = 0; i < birdArray.length; i++) {
            let bird = birdArray[i];
            bird.x += speedX;
    
            // Alternate bird images to create a flapping effect
            if (flapCount % (2 * flapSpeed) < flapSpeed) {
                context.drawImage(bird_feather_up_img, bird.x, bird.y, bird.width, bird.height);
            } else {
                context.drawImage(bird_feather_down_img, bird.x, bird.y, bird.width, bird.height);
            }
    
            if (detectCollision(dino, bird)) {
                gameOver = true;
                dinoImg.src = "./png/dino_deceased.png";
                dinoImg.onload = function () {
                    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
                }
            }
        }


    //score
    context.fillStyle="black";
    context.font="20px Pixelify Sans";
    score++;
    context.fillText(score,5,20); //5 from left ,20 from top
}

//generating cactus
function cactusAt(){
    if (gameOver){
        return;
    }

    let cacti={
        img:null,
        x:cactiX,
        y:cactiY,
        width:null,
        height:cacti_height
    }
    let RandomCacti=Math.random();

    //setting probability of generation of each cactus
    if (RandomCacti > .70){
        cacti.img=cactus_smol_3_img;
        cacti.width=cactus_smol_3_width;
        cactusArray.push(cacti);
    }
    else if (RandomCacti > .50){
        cacti.img=cactus_smol_2_img;
        cacti.width=cactus_smol_2_width;
        cactusArray.push(cacti);
    }
    else if (RandomCacti > .30){
        cacti.img=cactus_smol_1_img;
        cacti.width=cactus_smol_1_width;
        cactusArray.push(cacti);
    }

    if (cactusArray.length > 5){
        cactusArray.shift();
    }
}

//generating bird
function birdAt() {
    if (gameOver || score < birdScoreThreshold) {
        return;
    }


    let bird = {
        img: bird_Img,
        x: birdX,
        y: cactiY - 120 , //Math.floor(Math.random() * 60) - 20,
        width: bird_width,
        height: bird_height
    };
    birdArray.push(bird);

    if (birdArray.length > 3) {
        birdArray.shift();
    }
}

//jump action
function moveDino(e){
    if (gameOver){
        return;
    }
    if ((e.code=="spaceBar" || e.code=="ArrowUp")&& dino.y==dinoY){
        speedY=-8;
    }
}

//collision
function detectCollision(obj1,obj2){
    let margin = 4;

    return obj1.x < obj2.x + obj2.width - margin &&
            obj1.x + obj2.width - margin > obj2.x &&
            obj1.y < obj2.y + obj2.height - margin &&
            obj1.y + obj1.height - margin > obj2.y;
}