document.addEventListener('DOMContentLoaded', () => {
    const playerList = document.getElementById('playerList');
    const teamsDiv = document.getElementById('teams');

    let players = [];

    function loadExcelFile() {
        fetch('players_example.xlsx')  // Assicurati che il file sia nella stessa directory
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.arrayBuffer();
            })
            .then(data => {
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const playersArray = XLSX.utils.sheet_to_json(worksheet);

                players = playersArray.map(player => ({
                    name: player.Name,
                    position: player.Position,
                    skill: parseInt(player.Skill, 10)
                }));

                displayPlayers();
                displayTeams(generateTeams(players));
            })
            .catch(error => console.error('Error loading or parsing file:', error));
    }

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

    loadExcelFile();
});
