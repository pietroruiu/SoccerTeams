// script.js
document.addEventListener('DOMContentLoaded', () => {
    const playerForm = document.getElementById('playerForm');
    const playerList = document.getElementById('playerList');
    const generateTeamsButton = document.getElementById('generateTeams');
    const teamsDiv = document.getElementById('teams');

    let players = [];

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
        players.forEach((player, index) => {
            const li = document.createElement('li');
            li.textContent = `Name: ${player.name}, Position: ${player.position}, Skill: ${player.skill}`;
            playerList.appendChild(li);
        });
    }

    function generateTeams(players) {
        // Simple logic to split players into two teams based on skill
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
