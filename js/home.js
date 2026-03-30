// Typewriter Animation Logic
const textElement = document.getElementById('typewriter');
const phrases = [
    "Computer Engineering Student",
    "SIET Student ",
    "Basketball Player No. 6",
    "KMITL Industrial Education"
];

let i = 0; // ลำดับคำใน Array
let j = 0; // ลำดับตัวอักษรในคำ
let currentPhrase = [];
let isDeleting = false;
let speed = 150;

function typeLoop() {
    const isEnd = i === phrases.length;
    if (isEnd) i = 0; // วนกลับไปคำแรก

    textElement.innerHTML = currentPhrase.join('');

    if (!isDeleting && j <= phrases[i].length) {
        currentPhrase.push(phrases[i][j]);
        j++;
        speed = 100; // ความเร็วตอนพิมพ์
    }

    if (isDeleting && j <= phrases[i].length) {
        currentPhrase.pop();
        j--;
        speed = 50; // ความเร็วตอนลบ
    }

    if (j === phrases[i].length) {
        isDeleting = true;
        speed = 2000; // หยุดรอเมื่อพิมพ์เสร็จ
    }

    if (isDeleting && j === 0) {
        currentPhrase = [];
        isDeleting = false;
        i++;
        speed = 500;
    }

    setTimeout(typeLoop, speed);
}

// เริ่มทำงานเมื่อโหลดหน้าเสร็จ
document.addEventListener('DOMContentLoaded', typeLoop);