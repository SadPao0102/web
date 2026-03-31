function calcPinkPPG() {
    const tbodies = document.querySelectorAll(
        '.pink-tbody-y1, .pink-tbody-y2, .pink-tbody-y3'
    );

    let totalPoints = 0;
    let totalGames = 0;

    tbodies.forEach(tbody => {
        const cells = tbody.querySelectorAll('.pink-pt');

        let sum = 0;
        const count = cells.length;

        for (let i = 0; i < count; i++) {
            sum += Number(cells[i].textContent) || 0;
        }

        const ppg = count ? (sum / count).toFixed(1) : '-';
        const output = tbody.closest('table').querySelector('.pink-ppg-val');
        output.textContent = ppg;

        totalPoints += sum;
        totalGames += count;
    });

    document.getElementById('career-ppg-display').textContent =
        totalGames ? (totalPoints / totalGames).toFixed(2) : '-';
}

function resetPinkPPG() {
    document.querySelectorAll('.pink-ppg-val')
        .forEach(el => (el.textContent = '-'));

    document.getElementById('career-ppg-display').textContent = '-';
}