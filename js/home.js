// Typewriter Animation Logic - Optimized for Performance
const textElement = document.getElementById('typewriter');
const phrases = [
    "Computer Engineering Student",
    "SIET Student",
    "Basketball Player No. 6",
    "KMITL Industrial Education"
];

let i = 0; // Index ของกลุ่มคำ
let j = 0; // Index ของตัวอักษร
let currentText = '';
let isDeleting = false;
let speed = 150;

function typeLoop() {
    // 1. วนลูป Index เมื่อถึงคำสุดท้าย
    const currentPhrase = phrases[i % phrases.length];

    // 2. จัดการข้อความ (ใช้ String Manipulation แทน Array เพื่อลด Overhead)
    if (isDeleting) {
        currentText = currentPhrase.substring(0, j - 1);
        j--;
        speed = 50; // เร็วขึ้นตอนลบ
    } else {
        currentText = currentPhrase.substring(0, j + 1);
        j++;
        speed = 100; // ความเร็วปกติตอนพิมพ์
    }

    // 3. แสดงผล (ใช้ textContent เร็วกว่า innerHTML)
    textElement.textContent = currentText;

    // 4. Logic การเปลี่ยนสถานะ (พิมพ์เสร็จ / ลบเสร็จ)
    if (!isDeleting && j === currentPhrase.length) {
        isDeleting = true;
        speed = 2000; // หยุดรอ 2 วินาทีเมื่อพิมพ์จบคำ
    } else if (isDeleting && j === 0) {
        isDeleting = false;
        i++; // ไปคำถัดไป
        speed = 500; // เว้นวรรคสั้นๆ ก่อนเริ่มพิมพ์คำใหม่
    }

    setTimeout(typeLoop, speed);
}

// เริ่มทำงานเมื่อ DOM พร้อม
document.addEventListener('DOMContentLoaded', () => {
    if (textElement) typeLoop();
});