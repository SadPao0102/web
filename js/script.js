function calculatePPG() {
    const tables = document.querySelectorAll(".score-table");
    
    // 1. ตั้งตัวแปรสำหรับเก็บค่ารวม "ทุกปี"
    let totalPointsCareer = 0;
    let totalGamesCareer = 0;

    tables.forEach(table => {
        let points = table.querySelectorAll(".point");
        let sumYear = 0;

        points.forEach(p => {
            let val = parseInt(p.innerText) || 0;
            sumYear += val;
            
            // สะสมค่าเพื่อใช้คำนวณ Career Summary
            totalPointsCareer += val;
            totalGamesCareer++;
        });

        // 2. คำนวณค่าเฉลี่ยรายปี
        let avgYear = (sumYear / points.length).toFixed(1);
        let ppgCell = table.querySelector(".ppg");
        
        if (ppgCell) {
            ppgCell.innerText = avgYear;
            // ใส่ Animation เล็กน้อย
            ppgCell.style.transform = "scale(1.2)";
            setTimeout(() => { ppgCell.style.transform = "scale(1)"; }, 200);
        }
    });

    // 3. คำนวณค่าเฉลี่ยรวมทุกปี (Career Summary)
    const careerDisplay = document.getElementById("total-career-ppg");
    if (careerDisplay && totalGamesCareer > 0) {
        let avgCareer = (totalPointsCareer / totalGamesCareer).toFixed(2);
        careerDisplay.innerText = avgCareer;
        careerDisplay.style.color = "#c1121f"; // เปลี่ยนสีให้เด่นขึ้น
    }
}

// 🔥 ฟังก์ชันรีเซ็ตค่า
function resetPPG() {
    // รีเซ็ตค่ารายปีในตาราง
    const ppgs = document.querySelectorAll(".ppg");
    ppgs.forEach(p => {
        p.innerText = "-";
        p.style.color = ""; // คืนค่าสีเดิม
    });

    // รีเซ็ตค่ารวมทุกปี
    const careerDisplay = document.getElementById("total-career-ppg");
    if (careerDisplay) {
        careerDisplay.innerText = "-";
        careerDisplay.style.color = "";
    }
}