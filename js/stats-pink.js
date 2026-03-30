function calcPinkPPG() {
    const cards = document.querySelectorAll('.pink-stat-card');
    
    cards.forEach(card => {
        const points = card.querySelectorAll('.pink-pt');
        const display = card.querySelector('.pink-ppg-val');
        
        let sum = 0;
        points.forEach(p => {
            sum += parseInt(p.innerText);
        });
        
        const avg = (sum / points.length).toFixed(2);
        display.innerText = avg;
        display.style.fontSize = "1.3rem";
        display.style.textShadow = "0 0 5px rgba(255, 77, 109, 0.2)";
    });
}

function resetPinkPPG() {
    const displays = document.querySelectorAll('.pink-ppg-val');
    displays.forEach(d => {
        d.innerText = "-";
    });
}