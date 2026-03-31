const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let balls = [];
let turn = "player";
let playerGroup = null;
let botGroup = null;
let gameOver = false;

let aiming = false;
let startX, startY, mouseX, mouseY;
let botThinking = false;

const holes = [
    {x:0,y:0},{x:450,y:0},{x:900,y:0},
    {x:0,y:450},{x:450,y:450},{x:900,y:450}
];

// 🎱 วาดหลุม
function drawHoles(){
    holes.forEach(h=>{
        ctx.beginPath();
        ctx.arc(h.x, h.y, 22, 0, Math.PI * 2);
        ctx.fillStyle = "#000";
        ctx.shadowColor = "black";
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowBlur = 0;
    });
}

class Ball{
    constructor(x,y,number){
        this.x=x;
        this.y=y;
        this.vx=0;
        this.vy=0;
        this.r=10;
        this.number=number;
        this.active=true;
    }

    get color(){
        if(this.number===0) return "white";
        if(this.number===8) return "black";
        return ["yellow","blue","red","purple","orange","green","maroon"][(this.number-1)%7];
    }

    draw(){
        if(!this.active) return;

        ctx.beginPath();
        ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
        ctx.fillStyle=this.color;
        ctx.fill();

        if(this.number>8){
            ctx.fillStyle="white";
            ctx.fillRect(this.x-10,this.y-3,20,6);
        }
    }

    update(){
        if(!this.active) return;

        let steps = 5;

        for(let i=0;i<steps;i++){
            this.x += this.vx / steps;
            this.y += this.vy / steps;

            if(this.x < this.r){
                this.x = this.r;
                this.vx *= -1;
            }
            if(this.x > canvas.width - this.r){
                this.x = canvas.width - this.r;
                this.vx *= -1;
            }
            if(this.y < this.r){
                this.y = this.r;
                this.vy *= -1;
            }
            if(this.y > canvas.height - this.r){
                this.y = canvas.height - this.r;
                this.vy *= -1;
            }
        }

        this.vx *= 0.99;
        this.vy *= 0.99;

        if(Math.abs(this.vx)<0.05) this.vx=0;
        if(Math.abs(this.vy)<0.05) this.vy=0;

        // 🎯 ตรวจหลุม
        holes.forEach(h=>{
            let dx=this.x-h.x;
            let dy=this.y-h.y;
            if(Math.sqrt(dx*dx+dy*dy)<20){

                this.active=false;

                if(this.number===0){
                    this.x=200;
                    this.y=225;
                    this.vx=this.vy=0;
                    this.active=true;

                    turn = (turn==="player")?"bot":"player";
                    updateHUD();
                    return;
                }

                if(!playerGroup){
                    if(this.number<=7){
                        playerGroup = (turn==="player")?"solid":"stripe";
                        botGroup = (playerGroup==="solid")?"stripe":"solid";
                    }else{
                        playerGroup = (turn==="player")?"stripe":"solid";
                        botGroup = (playerGroup==="solid")?"stripe":"solid";
                    }
                    updateHUD();
                }

                if(this.number===8){
                    alert(turn==="player"?"YOU WIN":"BOT WIN");
                    gameOver=true;
                }

                turn = (turn==="player")?"bot":"player";
                updateHUD();
            }
        });
    }
}

function handleCollision(b1,b2){
    if(!b1.active || !b2.active) return;

    let dx=b2.x-b1.x;
    let dy=b2.y-b1.y;
    let dist=Math.sqrt(dx*dx+dy*dy);

    if(dist < b1.r + b2.r){
        let angle=Math.atan2(dy,dx);

        let overlap = (b1.r + b2.r) - dist;

        b1.x -= overlap * Math.cos(angle)/2;
        b1.y -= overlap * Math.sin(angle)/2;
        b2.x += overlap * Math.cos(angle)/2;
        b2.y += overlap * Math.sin(angle)/2;

        let temp = b1.vx;
        b1.vx = b2.vx;
        b2.vx = temp;

        temp = b1.vy;
        b1.vy = b2.vy;
        b2.vy = temp;
    }
}

function setupBalls(){
    balls=[];
    balls.push(new Ball(200,225,0));

    let nums=[1,2,3,4,5,6,7,9,10,11,12,13,14,15,8];
    let i=0;

    for(let row=0;row<5;row++){
        for(let col=0;col<=row;col++){
            balls.push(new Ball(
                650+row*22,
                225-row*11+col*22,
                nums[i++]
            ));
        }
    }
}

function updateHUD(){
    document.getElementById("turn").textContent=turn;
    document.getElementById("playerGroup").textContent=playerGroup||"-";
    document.getElementById("botGroup").textContent=botGroup||"-";
}

function allStopped(){
    return balls.every(b=>Math.abs(b.vx)<0.05 && Math.abs(b.vy)<0.05);
}

function botPlay(){
    let cue=balls[0];
    cue.vx=(Math.random()*6)-3;
    cue.vy=(Math.random()*6)-3;
}

canvas.addEventListener("mousedown",e=>{
    if(turn!=="player") return;
    aiming=true;
    startX=e.offsetX;
    startY=e.offsetY;
});

canvas.addEventListener("mouseup",e=>{
    if(!aiming) return;

    aiming=false;
    let cue=balls[0];

    let dx=startX-e.offsetX;
    let dy=startY-e.offsetY;

    cue.vx = Math.max(-10, Math.min(10, dx*0.15));
    cue.vy = Math.max(-10, Math.min(10, dy*0.15));

    turn="bot";
    updateHUD();
});

canvas.addEventListener("mousemove",e=>{
    mouseX=e.offsetX;
    mouseY=e.offsetY;
});

function drawAim(){
    if(!aiming) return;
    ctx.beginPath();
    ctx.moveTo(startX,startY);
    ctx.lineTo(mouseX,mouseY);
    ctx.strokeStyle="white";
    ctx.stroke();
}

function gameLoop(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    drawHoles(); // 🔥 หลุมกลับมาแล้ว

    for(let i=0;i<balls.length;i++){
        for(let j=i+1;j<balls.length;j++){
            handleCollision(balls[i],balls[j]);
        }
    }

    balls.forEach(b=>{
        b.update();
        b.draw();
    });

    drawAim();

    if(turn==="bot" && allStopped() && !botThinking && !gameOver){
        botThinking=true;
        setTimeout(()=>{
            botPlay();
            turn="player";
            updateHUD();
            botThinking=false;
        },800);
    }

    requestAnimationFrame(gameLoop);
}

function resetGame(){
    playerGroup=null;
    botGroup=null;
    turn="player";
    gameOver=false;
    setupBalls();
    updateHUD();
}

setupBalls();
updateHUD();
gameLoop();