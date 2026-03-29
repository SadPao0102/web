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

function calculatePPG() {
    const tables = document.querySelectorAll(".score-table");

    tables.forEach(table => {
        let points = table.querySelectorAll(".point");
        let sum = 0;

        points.forEach(p => {
            sum += parseInt(p.innerText) || 0;
        });

        let avg = (sum / points.length).toFixed(1);

        let ppgCell = table.querySelector(".ppg");
        ppgCell.innerText = avg;

        // 🔥 animation นิดๆ
        ppgCell.style.transform = "scale(1.2)";
        setTimeout(() => {
            ppgCell.style.transform = "scale(1)";
        }, 200);
    });
}

// 🔥 ปุ่มรีเซ็ต
function resetPPG() {
    const ppgs = document.querySelectorAll(".ppg");
    ppgs.forEach(p => {
        p.innerText = "-";
    });
}
