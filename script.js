document.addEventListener('DOMContentLoaded', () => {
    const playerForm = document.getElementById('playerForm');
    const playerList = document.getElementById('playerList');
    const generateTeamsButton = document.getElementById('generateTeams');
    const teamsDiv = document.getElementById('teams');
    const fileInput = document.getElementById('fileInput');
    const loadFileButton = document.getElementById('loadFileButton');

    let players = [];

    loadFileButton.addEventListener('click', () => {
        fileInput.click(); // Simulate click on file input
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const data = event.target.result;
            const workbook = XLSX.read(data, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const playersArray = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            players = playersArray.slice(1).map(row => ({
                name: row[0],
                position: row[1],
                skill: parseInt(row[2])
            }));

            displayPlayers();
        };
        reader.readAsBinaryString(file);
    });

    function displayPlayers() {
        playerList.innerHTML = '';
        players.forEach((player) => {
            const li = document.createElement('li');
            li.textContent = `Name: ${player.name}, Position: ${player.position}, Skill: ${player.skill}`;
            playerList.appendChild(li);
        });
    }

    playerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const position = document.getElementById('position').value;
        const skill = document.getElementById('skill').value;

        const player = { name, position, skill: parseInt(skill) };
        players.push(player);

        displayPlayers();

        playerForm.reset();
    });

    generateTeamsButton.addEventListener('click', () => {
        const teams = generateTeams(players);
        displayTeams(teams);
    });

    function generateTeams(players) {
        const sortedPlayers = [...players].sort((a, b) => b.skill - a.skill);
        const teamA = [];
        const teamB = [];

        sortedPlayers.forEach((player, index) => {
            if (index % 2 === 0) {
                teamA.push(player);
            } else {
                teamB.push(player);
            }
        });

        return { teamA, teamB };
    }

    function displayTeams(teams) {
        teamsDiv.innerHTML = '';

        const teamA = document.createElement('div');
        teamA.innerHTML = '<h2>Team A</h2>';
        teams.teamA.forEach(player => {
            const p = document.createElement('p');
            p.textContent = `Name: ${player.name}, Position: ${player.position}, Skill: ${player.skill}`;
            teamA.appendChild(p);
        });

        const teamB = document.createElement('div');
        teamB.innerHTML = '<h2>Team B</h2>';
        teams.teamB.forEach(player => {
            const p = document.createElement('p');
            p.textContent = `Name: ${player.name}, Position: ${player.position}, Skill: ${player.skill}`;
            teamB.appendChild(p);
        });

        teamsDiv.appendChild(teamA);
        teamsDiv.appendChild(teamB);
    }
});
