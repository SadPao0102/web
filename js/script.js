const rows = document.querySelectorAll("table tr");

rows.forEach(row => {
    const point = row.children[1];
    if(point && point.innerText > 30){
        row.style.background = "#ffd6dc";
    }
});