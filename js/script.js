/**
 * ฟังก์ชันคำนวณคะแนนเฉลี่ยต่อเกม (PPG)
 * รองรับทั้งแบบรายปี และสรุปยอดรวมตลอดอาชีพ (Career Summary)
 */
function calculatePPG() {
    // เลือกทุกตารางที่มีข้อมูลสถิติ
    const tables = document.querySelectorAll("table");
    
    let totalPointsCareer = 0;
    let totalGamesCareer = 0;

    tables.forEach(table => {
        // หาเฉพาะตัวเลขคะแนนในแต่ละแถว (class="point")
        const pointsCells = table.querySelectorAll(".point");
        let sumYear = 0;
        let gamesInYear = pointsCells.length;

        pointsCells.forEach(cell => {
            let val = parseInt(cell.innerText) || 0;
            sumYear += val;
            
            // สะสมค่าเพื่อใช้คำนวณ Career Summary (รวมทุกตาราง)
            totalPointsCareer += val;
            totalGamesCareer++;
        });

        // คำนวณค่าเฉลี่ยรายปี
        if (gamesInYear > 0) {
            let avgYear = (sumYear / gamesInYear).toFixed(1);
            let ppgCell = table.querySelector(".ppg");
            
            if (ppgCell) {
                ppgCell.innerText = avgYear;
                ppgCell.style.color = "#a10f1a"; // เปลี่ยนสีเป็นสีแดงเข้มตาม Theme
                
                // 🔥 เพิ่ม Animation เล็กน้อยให้ดูมีชีวิตชีวา
                ppgCell.animate([
                    { transform: 'scale(1)', opacity: 0.5 },
                    { transform: 'scale(1.2)', opacity: 1 },
                    { transform: 'scale(1)', opacity: 1 }
                ], {
                    duration: 300,
                    easing: 'ease-out'
                });
            }
        }
    });

    // คำนวณค่าเฉลี่ยรวมทุกปี (Career Summary)
    const careerDisplay = document.getElementById("total-career-ppg");
    if (careerDisplay && totalGamesCareer > 0) {
        let avgCareer = (totalPointsCareer / totalGamesCareer).toFixed(2);
        
        // แสดงผลลัพธ์พร้อม Animation
        careerDisplay.innerText = avgCareer;
        careerDisplay.style.color = "#a10f1a";
        careerDisplay.style.fontWeight = "800";
    }
}

/**
 * ฟังก์ชันรีเซ็ตค่าทั้งหมดกลับเป็นเริ่มต้น
 */
function resetPPG() {
    // 1. รีเซ็ตค่ารายปีในตาราง
    const ppgs = document.querySelectorAll(".ppg");
    ppgs.forEach(p => {
        p.innerText = "-";
        p.style.color = ""; // คืนค่าสีเดิมจาก CSS
    });

    // 2. รีเซ็ตค่ารวมสรุปอาชีพ
    const careerDisplay = document.getElementById("total-career-ppg");
    if (careerDisplay) {
        careerDisplay.innerText = "-";
        careerDisplay.style.color = "";
        careerDisplay.style.fontWeight = "";
    }
    
    console.log("Stats have been reset.");
}