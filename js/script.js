// ✅ คำนวณ PPG
function calculatePPG() {
    const cards = document.querySelectorAll(".stat-card");

    let totalPoints = 0;
    let totalGames = 0;

    cards.forEach(card => {
        const points = card.querySelectorAll(".point");
        let sum = 0;

        points.forEach(p => {
            const val = Number(p.textContent) || 0;
            sum += val;
            totalPoints += val;
            totalGames++;
        });

        const avg = points.length ? (sum / points.length).toFixed(1) : "-";
        const output = card.querySelector(".ppg");

        if (output) {
            output.textContent = avg;

            // animation เบา ๆ
            output.style.transform = "scale(1.1)";
            setTimeout(() => {
                output.style.transform = "scale(1)";
            }, 200);
        }
    });

    // Career Summary
    const career = document.getElementById("total-career-ppg");
    if (career && totalGames > 0) {
        career.textContent = (totalPoints / totalGames).toFixed(2);
    }
}


// ✅ Reset
function resetPPG() {
    document.querySelectorAll(".ppg").forEach(el => {
        el.textContent = "-";
    });

    const career = document.getElementById("total-career-ppg");
    if (career) career.textContent = "-";
}