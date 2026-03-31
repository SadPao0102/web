function calcPinkPPG() {
    const cards = document.querySelectorAll('.pink-stat-card');
    
    // 1. เพิ่มตัวแปรสำหรับเก็บค่ารวม "ทุกปี"
    let totalPointsCareer = 0;
    let totalGamesCareer = 0;

    cards.forEach(card => {
        const points = card.querySelectorAll('.pink-pt');
        const display = card.querySelector('.pink-ppg-val');
        
        let sumYear = 0;
        points.forEach(p => {
            const val = parseInt(p.innerText);
            sumYear += val;
            
            // สะสมค่าเพื่อใช้คำนวณค่าเฉลี่ยรวมทุกปี
            totalPointsCareer += val;
            totalGamesCareer++;
        });
        
        // คำนวณรายปี
        const avgYear = (sumYear / points.length).toFixed(2);
        display.innerText = avgYear;
        display.style.fontSize = "1.3rem";
        display.style.textShadow = "0 0 5px rgba(255, 77, 109, 0.2)";
        display.style.color = "#ff4d6d"; // เพิ่มสีให้เห็นชัดเจน
    });

    // 2. คำนวณค่าเฉลี่ยรวมทุกปี (Career Summary)
    const careerDisplay = document.getElementById('career-ppg-display');
    if (careerDisplay && totalGamesCareer > 0) {
        const avgCareer = (totalPointsCareer / totalGamesCareer).toFixed(2);
        careerDisplay.innerText = avgCareer;
        
        // เพิ่ม Animation เล็กน้อยเวลาคำนวณเสร็จ
        careerDisplay.style.transition = "0.3s";
        careerDisplay.style.color = "#c9184a";
    }
}

function resetPinkPPG() {
    // รีเซ็ตค่ารายปี
    const displays = document.querySelectorAll('.pink-ppg-val');
    displays.forEach(d => {
        d.innerText = "-";
        d.style.color = "inherit";
    });

    // รีเซ็ตค่ารวมทุกปี
    const careerDisplay = document.getElementById('career-ppg-display');
    if (careerDisplay) {
        careerDisplay.innerText = "-";
        careerDisplay.style.color = "inherit";
    }
}