let games = [];

function addGame() {
    let opponent = document.getElementById("opponent").value;
    let points = parseInt(document.getElementById("points").value);

    if (!opponent || isNaN(points)) {
        alert("กรอกข้อมูลให้ครบ");
        return;
    }

    games.push({ opponent, points });

    document.getElementById("opponent").value = "";
    document.getElementById("points").value = "";

    renderTable();
}

function renderTable() {
    let table = document.getElementById("tableBody");
    table.innerHTML = "";

    games.forEach((game, index) => {
        let row = `
            <tr>
                <td>${game.opponent}</td>
                <td>${game.points}</td>
                <td><button onclick="deleteGame(${index})">Delete</button></td>
            </tr>
        `;
        table.innerHTML += row;
    });

    // ❌ เอาออก (ไม่ให้คำนวณอัตโนมัติ)
    // calculatePPG();
}

function deleteGame(index) {
    games.splice(index, 1);
    renderTable();

    // รีเซ็ตค่า PPG เมื่อมีการลบ
    document.getElementById("ppg").innerText = "PPG: -";
}

function calculatePPG() {
    if (games.length === 0) {
        document.getElementById("ppg").innerText = "PPG: 0";
        return;
    }

    let total = games.reduce((sum, game) => sum + game.points, 0);
    let avg = (total / games.length).toFixed(2);

    document.getElementById("ppg").innerText = "PPG: " + avg;
}