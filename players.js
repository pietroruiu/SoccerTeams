document.addEventListener('DOMContentLoaded', () => {
    const playerSelect = document.getElementById('playerSelect');
    const radarContainer = document.getElementById('radarContainer');
    const radarCtx = document.getElementById('radarChart').getContext('2d');
    let players = [];

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
                    shooting: parseInt(player.Tiro, 10)
                }));

                populatePlayerSelect();
            })
            .catch(error => console.error('Error loading or parsing file:', error));
    }

    function populatePlayerSelect() {
        players.forEach((player, index) => {
            const option = document.createElement('option');
            option.value = index.toString(); // Salva l'indice del giocatore come valore dell'opzione
            option.textContent = player.name;
            playerSelect.appendChild(option);
        });

        // Aggiungi event listener per il cambio nel menu a tendina
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

        radarContainer.style.display = 'block'; // Mostra il container del diagramma radar se nascosto

        // Distruggi il diagramma esistente se già presente
        if (window.playerRadarChart) {
            window.playerRadarChart.destroy();
        }

        // Crea un nuovo diagramma radar
        window.playerRadarChart = new Chart(radarCtx, {
            type: 'radar',
            data: radarData,
            options: radarOptions
        });
    }

    function clearRadarChart() {
        radarContainer.style.display = 'none'; // Nascondi il container del diagramma radar
        if (window.playerRadarChart) {
            window.playerRadarChart.destroy(); // Distruggi il diagramma radar se esiste
        }
    }

    loadPlayers();
});
