// script.js
document.addEventListener('DOMContentLoaded', () => {
    const playerForm = document.getElementById('playerForm');
    const playerList = document.getElementById('playerList');
    const generateTeamsButton = document.getElementById('generateTeams');
    const teamsDiv = document.getElementById('teams');

    let players = [];

    // Funzione per caricare il file CSV all'accesso
    function loadCSVFile() {
        fetch('players_example.csv') // Assicurati che il file sia nella stessa directory
            .then(response => response.text())
            .then(data => {
                const playersArray = parseCSV(data);
                players = playersArray.map(player => ({
                    name: player.Name,
                    position: player.Position,
                    skill: parseInt(player.Skill)
                }));
                displayPlayers();
            })
            .catch(error => console.error(error));
    }
    
    function parseCSV(csv) {
        const lines = csv.split('\n');
        const headers = lines[0].split(',');
        const playersArray = [];
    
        for (let i = 1; i < lines.length; i++) {
            const currentLine = lines[i].split(',');
            if (currentLine.length === headers.length) {
                const player = {};
                for (let j = 0; j < headers.length; j++) {
                    player[headers[j].trim()] = currentLine[j].trim();
                }
                playersArray.push(player);
            }
        }
    
        return playersArray;
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

    function displayPlayers() {
        playerList.innerHTML = '';
        players.forEach((player) => {
            const li = document.createElement('li');
            li.textContent = `Name: ${player.name}, Position: ${player.position}, Skill: ${player.skill}`;
            playerList.appendChild(li);
        });
    }

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

    // Carica il file Excel al caricamento della pagina
    loadExcelFile();
});
