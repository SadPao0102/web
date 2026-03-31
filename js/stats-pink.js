function calcPinkPPG() {
    const years = ['.pink-tbody-y1', '.pink-tbody-y2', '.pink-tbody-y3'];
    let totalAllPoints = 0;
    let totalAllGames = 0;

    years.forEach(selector => {
        const tbody = document.querySelector(selector);
        if (!tbody) return;

        const pointsCells = tbody.querySelectorAll('.pink-pt');
        let yearTotal = 0;
        let yearGames = pointsCells.length;

        pointsCells.forEach(cell => {
            yearTotal += parseInt(cell.textContent) || 0;
        });

        // แสดงผล PPG ของแต่ละปี
        const ppg = yearGames > 0 ? (yearTotal / yearGames).toFixed(1) : 0;
        const ppgDisplay = tbody.closest('table').querySelector('.pink-ppg-val');
        ppgDisplay.textContent = ppg;

        totalAllPoints += yearTotal;
        totalAllGames += yearGames;
    });

    // สรุปรวมอาชีพ
    const careerPPG = totalAllGames > 0 ? (totalAllPoints / totalAllGames).toFixed(2) : 0;
    document.getElementById('career-ppg-display').textContent = careerPPG;
}

function resetPinkPPG() {
    document.querySelectorAll('.pink-ppg-val').forEach(el => el.textContent = '-');
    document.getElementById('career-ppg-display').textContent = '-';
}