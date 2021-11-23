let Game = {
    play : false,
    anime : undefined,
    w : 700,
    h : 500,
    speed : 5,
    speedUp : false,
    bricks : [],
    score : 0,
    currentLvl : 0,
    levels : [Level1, Level2, Level3]
}
let Ball = {
    x : 335,
    y : 430,
    radius : 10,
    direction : {
        x:1,
        y:-1
    },
    color : 'whitesmoke',
    colorArray : ['#ffd900','#ffae00','#ff7b00','#ff3c00','#a32600']

}
let Paddle = {
    w : 120,
    h : 10,
    x : 280,
    y : 450,
    direction : 0
}
class Brick {
    constructor(x,y,id){
        this.w = 88.5;
        this.h = 20;
        this.margin = 5;
        this.x = x;
        this.y = y;
        this.id = id;
        this.pv = 1;
    }
}

// --- --- --- --- --- --- --- --- --- --- --- --- //
    // INIT GAME
function initValue(){
    Game.play = true;
    Game.speed = Game.levels[Game.currentLvl].speed;
    Ball.x = 335;
    Ball.y = 430;
    Ball.direction.y = -1;
    Ball.direction.x = (-1*Math.random())+(Math.random()*2);
    Ball.color = 'whitesmoke';
    Paddle.x = 280;
    Paddle.y = 450;
    Game.speedUp = setInterval(() => {
        Game.speed += 0.1;
    }, 1000);
    document.getElementById('score').innerHTML = '';
}

function init(){
    initValue();
    windowHandler();
    Game.levels[Game.currentLvl].generate();
    play();
    document.getElementById('play').removeEventListener('click',init);
}

document.addEventListener('DOMContentLoaded', ()=>{
    draw();
    document.getElementById('play').addEventListener('click',init);
    document.addEventListener('keyup',()=>{Paddle.direction=0});
    document.addEventListener('keydown',(e)=>{
        keyboardHandler(e);
    });
});


// --- --- --- --- --- --- --- --- --- --- --- --- //
    // CANVAS
    

function draw(){
    let cvs = document.getElementById('cvs');
    let ctx = cvs.getContext('2d');

    // CLEAN
    ctx.clearRect(0,0,cvs.width,cvs.height);

    // PADDLE
    ctx.fillStyle = 'whitesmoke';
    ctx.fillRect(Paddle.x,Paddle.y,Paddle.w,Paddle.h);

    // BALL
    ctx.fillStyle = Ball.color;
    ctx.fillRect(Ball.x,Ball.y,Ball.radius,Ball.radius)

    // BRICK
    for(let i in Game.bricks){
        switch (Game.bricks[i].pv) {
            case 1 : ctx.fillStyle = 'whitesmoke';
            break;
            case 2 : ctx.fillStyle = '#ff7b00';
            break;
            case 3 : ctx.fillStyle = '#ff3c00';
            break;
        }
        ctx.fillRect(Game.bricks[i].x, Game.bricks[i].y, Game.bricks[i].w, Game.bricks[i].h)
    }
}

function collision(target){
    if(
        (
            Ball.x > target.x &&
            Ball.x < target.x + target.w &&
            Ball.y > target.y &&
            Ball.y < target.y + target.h
        ) || (
            Ball.x > target.x &&
            Ball.x < target.x + target.w &&
            (Ball.y + Ball.radius) > target.y &&
            (Ball.y + Ball.radius) < target.y + target.h
        ) || (
            (Ball.x && Ball.radius) > target.x &&
            (Ball.x && Ball.radius) < target.x + target.w &&
            Ball.y > target.y &&
            Ball.y < target.y + target.h
        ) || (
            (Ball.x && Ball.radius) > target.x &&
            (Ball.x && Ball.radius) < target.x + target.w &&
            (Ball.y + Ball.radius) > target.y &&
            (Ball.y + Ball.radius) < target.y + target.h )
        ) {
            Ball.color = Ball.colorArray[Math.floor(Math.random()*Ball.colorArray.length)];
            return true;
        }
}
// --- --- --- --- --- --- --- --- --- --- --- --- //
    // BALL

function ballMove(){
    // MOVE
    Ball.y += Game.speed * Ball.direction.y;
    Ball.x += Game.speed * Ball.direction.x;

    // BORDER COLLISION
    if (Ball.y + Ball.radius > Game.h) {
        Ball.direction.y = -1*Ball.direction.y;
        Ball.y = Game.h - Ball.radius;
    } else if (Ball.y < 0) {
        Ball.direction.y = -1*Ball.direction.y;
        Ball.y = 0;
    } else if ( Ball.x + Ball.radius > Game.w ) {
        Ball.direction.x = -1*Ball.direction.x;
        Ball.x = Game.w - Ball.radius;
    } else if ( Ball.x < 0 ) {
        Ball.direction.x = -1*Ball.direction.x;
        Ball.x = 0;
    }

    // PADDLE COLLISION
    if(collision(Paddle)) {
            Ball.direction.y = -1*Ball.direction.y;
            Ball.direction.x += ((Ball.x - (Paddle.x + Paddle.w/2))/40);
    }

    // BRICK COLLISION
    for(let i in Game.bricks){

        if(collision(Game.bricks[i])) {

                Ball.direction.y = -1*Ball.direction.y;

                for(let j in Game.bricks){
                    if (Game.bricks[i].id == Game.bricks[j].id){
                        Game.bricks[i].pv -= 1;
                        if(Game.bricks[i].pv <= 0){
                            Game.bricks.splice(Game.bricks.indexOf(Game.bricks[i]),1);
                            Game.score += 1;
                        }
                    }
                }

        }
    }
}

// --- --- --- --- --- --- --- --- --- --- --- --- //
    // PADDLE

function paddleMove(){
    if(Paddle.direction==1 && Paddle.x < Game.w - Paddle.w){
        Paddle.x += 10;
    } else if (Paddle.direction == -1 && Paddle.x > 0) {
        Paddle.x -= 10;
    }
}


// --- --- --- --- --- --- --- --- --- --- --- --- //
    // GAME

// PLAY
function play(){
    if(Game.play){
        paddleMove();
        ballMove();
        draw();
        Game.anime = window.requestAnimationFrame(play);
    }

    // WIN GAME - CONDITIONS
    if(Game.bricks.length == 0) {
        youWin();
    }

    // GAME OVER - CONDITIONS
    if(Ball.y + Ball.radius >= Game.h){
        gameOver();
    }
}

// PAUSE
function pause(){
    Game.play = !Game.play;
    if(Game.play){
        windowHandler();
        Game.speedUp = setInterval(() => {
            Game.speed += 0.1;
        }, 1000);
        play();
    } else {
        windowHandler();
        Game.speedUp = clearInterval(Game.speedUp);
        cancelAnimationFrame(Game.anime);
        document.getElementById('play').innerHTML = 'PAUSE';
    }
};

// VICTORY
function youWin(){
    document.getElementById('play').addEventListener('click',init);
    pause();
    nextLvl();
    document.getElementById('play').innerHTML = 'NEXT LEVEL';
}
function nextLvl (){
    Game.currentLvl += 1;
    if(Game.currentLvl > Game.levels.length){
        document.getElementById('play').innerHTML = 'VICTORY';
        document.getElementById('score').innerHTML = `SCORE : ${Game.score}`;
        document.getElementById('play').removeEventListener('click',init);
    }
}

// GAME OVER
function gameOver(){
    pause();
    document.getElementById('play').addEventListener('click',init);
    document.getElementById('play').innerHTML = 'RETRY';
    document.getElementById('score').innerHTML = `SCORE : ${Game.score}`;
}


// --- --- --- --- --- --- --- --- --- --- --- --- //
    // HANDLERS

function keyboardHandler(e) {
    if (e.key == 'ArrowLeft') {
        Paddle.direction = -1;
    } else if (e.key == 'ArrowRight') {
        Paddle.direction = 1;
    } else if (e.key == ' ') {
        pause();
    }
}

function windowHandler(){
    document.querySelector('.play-div').classList.toggle('hide');
}