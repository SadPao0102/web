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
    {x:0, y:0}, {x:450, y:0}, {x:900, y:0},
    {x:0, y:450}, {x:450, y:450}, {x:900, y:450}
];

// --- 🛠 ฟังก์ชันช่วยคำนวณตำแหน่ง (รองรับทั้ง Mouse และ Touch) ---
function getEventPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    // คำนวณ Ratio เผื่อกรณี Canvas โดนบีบขนาดในมือถือ
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
    };
}

class Ball {
    constructor(x, y, number) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.r = 12; // ขยายขนาดลูกเล็กน้อยให้กดง่ายขึ้น
        this.number = number;
        this.active = true;
    }

    get color() {
        if (this.number === 0) return "white";
        if (this.number === 8) return "black";
        const colors = ["yellow", "blue", "red", "purple", "orange", "green", "maroon"];
        return colors[(this.number - 1) % 7];
    }

    draw() {
        if (!this.active) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = "white";
        ctx.lineWidth = 1;
        ctx.stroke();

        if (this.number > 8) { // ลูกลาย (Stripes)
            ctx.fillStyle = "white";
            ctx.fillRect(this.x - 12, this.y - 4, 24, 8);
        }
    }

    update() {
        if (!this.active) return;

        this.x += this.vx;
        this.y += this.vy;

        // ขอบโต๊ะ
        if (this.x < this.r || this.x > canvas.width - this.r) {
            this.vx *= -0.8;
            this.x = this.x < this.r ? this.r : canvas.width - this.r;
        }
        if (this.y < this.r || this.y > canvas.height - this.r) {
            this.vy *= -0.8;
            this.y = this.y < this.r ? this.r : canvas.height - this.r;
        }

        // แรงเสียดทาน
        this.vx *= 0.985;
        this.vy *= 0.985;

        if (Math.abs(this.vx) < 0.1) this.vx = 0;
        if (Math.abs(this.vy) < 0.1) this.vy = 0;

        // ตรวจหลุม
        holes.forEach(h => {
            let dx = this.x - h.x;
            let dy = this.y - h.y;
            if (Math.sqrt(dx * dx + dy * dy) < 25) {
                this.handlePotting();
            }
        });
    }

    handlePotting() {
        this.active = false;
        if (this.number === 0) { // ลูกขาวลงหลุม
            setTimeout(() => {
                this.x = 200; this.y = 225;
                this.vx = 0; this.vy = 0;
                this.active = true;
            }, 500);
        } else if (this.number === 8) {
            alert(turn === "player" ? "YOU WIN! 🎉" : "BOT WIN! 🤖");
            gameOver = true;
        }
    }
}

// --- 🎮 ระบบควบคุม (Event Listeners) ---
function startAim(e) {
    if (turn !== "player" || !allStopped()) return;
    if (e.type === 'touchstart') e.preventDefault();
    aiming = true;
    const pos = getEventPos(e);
    startX = pos.x; startY = pos.y;
    mouseX = pos.x; mouseY = pos.y;
}

function moveAim(e) {
    if (!aiming) return;
    const pos = getEventPos(e);
    mouseX = pos.x; mouseY = pos.y;
}

function endAim(e) {
    if (!aiming) return;
    aiming = false;
    const pos = getEventPos(e);
    const cue = balls[0];
    const dx = startX - pos.x;
    const dy = startY - pos.y;

    cue.vx = Math.max(-15, Math.min(15, dx * 0.12));
    cue.vy = Math.max(-15, Math.min(15, dy * 0.12));

    if (Math.abs(cue.vx) > 0.5) {
        turn = "bot";
        updateHUD();
    }
}

// ผูกฟังก์ชันเข้ากับหน้าจอ
canvas.addEventListener("mousedown", startAim);
canvas.addEventListener("mousemove", moveAim);
window.addEventListener("mouseup", endAim);

canvas.addEventListener("touchstart", startAim, { passive: false });
canvas.addEventListener("touchmove", moveAim, { passive: false });
canvas.addEventListener("touchend", endAim, { passive: false });

// --- ⚙️ ฟังก์ชันระบบเกม ---
function setupBalls() {
    balls = [new Ball(200, 225, 0)];
    let nums = [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 8];
    let i = 0;
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col <= row; col++) {
            balls.push(new Ball(650 + row * 25, 225 - row * 12 + col * 25, nums[i++]));
        }
    }
}

function handleCollision(b1, b2) {
    if (!b1.active || !b2.active) return;
    let dx = b2.x - b1.x;
    let dy = b2.y - b1.y;
    let dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < b1.r + b2.r) {
        let angle = Math.atan2(dy, dx);
        let sin = Math.sin(angle), cos = Math.cos(angle);
        // แก้ปัญหาลูกซ้อนกัน
        let overlap = (b1.r + b2.r) - dist;
        b1.x -= (overlap/2) * cos; b1.y -= (overlap/2) * sin;
        b2.x += (overlap/2) * cos; b2.y += (overlap/2) * sin;
        // แลกเปลี่ยนแรง
        let v1 = { x: b1.vx * cos + b1.vy * sin, y: b1.vy * cos - b1.vx * sin };
        let v2 = { x: b2.vx * cos + b2.vy * sin, y: b2.vy * cos - b2.vx * sin };
        b1.vx = v2.x * cos - v1.y * sin; b1.vy = v1.y * cos + v2.x * sin;
        b2.vx = v1.x * cos - v2.y * sin; b2.vy = v2.y * cos + v1.x * sin;
    }
}

function allStopped() {
    return balls.every(b => b.vx === 0 && b.vy === 0);
}

function updateHUD() {
    const turnEl = document.getElementById("turn");
    if(turnEl) turnEl.textContent = turn.toUpperCase();
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // วาดหลุม
    holes.forEach(h => {
        ctx.beginPath();
        ctx.arc(h.x, h.y, 25, 0, Math.PI * 2);
        ctx.fillStyle = "#111";
        ctx.fill();
    });

    for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) handleCollision(balls[i], balls[j]);
    }

    balls.forEach(b => { b.update(); b.draw(); });

    if (aiming) {
        ctx.beginPath();
        ctx.moveTo(balls[0].x, balls[0].y);
        ctx.lineTo(balls[0].x + (startX - mouseX), balls[0].y + (startY - mouseY));
        ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    if (turn === "bot" && allStopped() && !botThinking && !gameOver) {
        botThinking = true;
        setTimeout(() => {
            let cue = balls[0];
            cue.vx = (Math.random() * 10) + 5;
            cue.vy = (Math.random() * 4) - 2;
            turn = "player";
            updateHUD();
            botThinking = false;
        }, 1000);
    }
    requestAnimationFrame(gameLoop);
}

setupBalls();
gameLoop();