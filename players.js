// players.js

// Sample player data
let players = [];

// Load player data from localStorage if available
const savedPlayers = JSON.parse(localStorage.getItem('players'));
if (savedPlayers) {
    players = savedPlayers;
}

document.addEventListener('DOMContentLoaded', () => {
    const playerSelect = document.getElementById('playerSelect');
    const radarContainer = document.getElementById('radarContainer');
    const radarCtx = document.getElementById('radarChart').getContext('2d');

    function loadPlayers() {
        fetch('players_example.xlsx')
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
                    name: player.Nome,
                    defense: parseInt(player.Difesa, 10),
                    attack: parseInt(player.Attacco, 10),
                    midfield: parseInt(player.Centrocampo, 10),
                    speed: parseInt(player.Velocità, 10),
                    shooting: parseInt(player.Tiro, 10),
                    present: true // Default to true; modify as needed
                }));

                // Save the loaded players to localStorage
                localStorage.setItem('players', JSON.stringify(players));

                populatePlayerSelect();
            })
            .catch(error => console.error('Error loading or parsing file:', error));
    }

    function populatePlayerSelect() {
        players.forEach((player, index) => {
            if (player.present) { // Only add players who are present
                const option = document.createElement('option');
                option.value = index.toString(); // Save the player's index as the option value
                option.textContent = player.name;
                playerSelect.appendChild(option);
            }
        });

        // Add event listener for dropdown menu change
        playerSelect.addEventListener('change', (event) => {
            const playerIndex = parseInt(event.target.value, 10);
            if (!isNaN(playerIndex)) {
                createRadarChart(playerIndex);
            } else {
                clearRadarChart();
            }
        });
    }

    function createRadarChart(playerIndex) {
        const player = players[playerIndex];

        if (!player) {
            console.error('Player not found.');
            return;
        }

        const radarLabels = ['Defense', 'Attack', 'Midfield', 'Speed', 'Shooting'];
        const radarData = {
            labels: radarLabels,
            datasets: [{
                label: `${player.name} Skills`,
                data: [player.defense, player.attack, player.midfield, player.speed, player.shooting],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        };

        const radarOptions = {
            scale: {
                angleLines: {
                    display: true
                },
                ticks: {
                    beginAtZero: true,
                    min: 0,
                    max: 100,
                    stepSize: 20
                }
            }
        };

        radarContainer.style.display = 'block'; // Show the radar chart container if hidden

        // Destroy the existing chart if it already exists
        if (window.playerRadarChart) {
            window.playerRadarChart.destroy();
        }

        // Create a new radar chart
        window.playerRadarChart = new Chart(radarCtx, {
            type: 'radar',
            data: radarData,
            options: radarOptions
        });
    }

    function clearRadarChart() {
        radarContainer.style.display = 'none'; // Hide the radar chart container
        if (window.playerRadarChart) {
            window.playerRadarChart.destroy(); // Destroy the radar chart if it exists
        }
    }

    loadPlayers(); // Load players from Excel file
});
