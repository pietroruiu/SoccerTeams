document.addEventListener('DOMContentLoaded', () => {
    const teamsDiv = document.getElementById('teams');
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
                    shooting: parseInt(player.Tiro, 10),
                    goalie: parseInt(player.Porta, 10),
                    presence: true // Default to true; will be overridden by presence data
                }));

                // Sovrascrivi i dati di presenza con quelli salvati in localStorage
                const savedPlayers = JSON.parse(localStorage.getItem('players'));
                if (savedPlayers) {
                    players = players.map(player => {
                        const savedPlayer = savedPlayers.find(p => p.name === player.name);
                        return savedPlayer ? { ...player, presence: savedPlayer.presence } : player;
                    });
                }

                displayPlayers();
            })
            .catch(error => console.error('Error loading or parsing file:', error));
    }

    function generateTeams() {
        // Resetta lo stato dei giocatori selezionati
        players.forEach(player => {
            player.selected = false;
        });

        // Filtra i giocatori presenti e non ancora selezionati
        const filteredPlayers = players.filter(player => player.presence && !player.selected);

        // Se ci sono meno di 10 giocatori disponibili, non è possibile formare due squadre da 5 giocatori ciascuna
        if (filteredPlayers.length < 10) {
            console.error('Not enough players available to form two teams.');
            alert("Seleziona almeno 10 giocatori!");
            return;
        }

        if (filteredPlayers.length > 10) {
            console.error('Too many players selected!');
            alert("Hai selezionato troppi giocatori!");
            return;
        }

        // Filtra i giocatori con skill di 1 in porta
        const goaliesWithSkill1 = filteredPlayers.filter(player => player.goalie === 1);

        // Seleziona almeno un giocatore con skill 1 in porta per ciascuna squadra
        let goalieSkill1A = goaliesWithSkill1.find(player => !player.selected);
        let goalieSkill1B = goaliesWithSkill1.find(player => !player.selected && player !== goalieSkill1A);

        // Se non ci sono sufficienti giocatori con skill 1 in porta, esce con un messaggio di errore
        if (!goalieSkill1A || !goalieSkill1B) {
            console.error('Not enough goalies with skill 1 available to form two teams.');
            alert("Seleziona almeno due portieri!");
            return;
        }

        // Assegna un portiere con skill 1 a ciascuna squadra
        goalieSkill1A.selected = true;
        goalieSkill1B.selected = true;
        let teamA = [goalieSkill1A];
        let teamB = [goalieSkill1B];

        // Rimuovi i giocatori con skill 1 in porta dai giocatori disponibili
        filteredPlayers.splice(filteredPlayers.indexOf(goalieSkill1A), 1);
        filteredPlayers.splice(filteredPlayers.indexOf(goalieSkill1B), 1);

        // Ordina i giocatori disponibili in modo casuale
        filteredPlayers.sort(() => Math.random() - 0.5);

        // Distribuisci i giocatori nei due team
        let sumA = 0;
        let sumB = 0;
        let currentPlayer;

        while (teamA.length < 5 || teamB.length < 5) {
            currentPlayer = filteredPlayers.pop();

            if (currentPlayer) {
                if (teamA.length < 5) {
                    teamA.push(currentPlayer);
                    sumA += currentPlayer.defense + currentPlayer.attack + currentPlayer.midfield + currentPlayer.speed + currentPlayer.shooting;
                    currentPlayer.selected = true;
                } else if (teamB.length < 5) {
                    teamB.push(currentPlayer);
                    sumB += currentPlayer.defense + currentPlayer.attack + currentPlayer.midfield + currentPlayer.speed + currentPlayer.shooting;
                    currentPlayer.selected = true;
                }
            } else {
                break; // Se non ci sono più giocatori disponibili, esci dal ciclo
            }
        }

        displayTeams({ teamA, teamB });
    }

    function displayTeams(teams) {
        teamsDiv.innerHTML = '';

        const teamAContainer = document.createElement('div');
        const teamBContainer = document.createElement('div');

        teamAContainer.classList.add('team');
        teamBContainer.classList.add('team');

        const teamAHeader = document.createElement('h2');
        teamAHeader.textContent = 'Team A';
        teamAContainer.appendChild(teamAHeader);

        teams.teamA.forEach(player => {
            const p = document.createElement('p');
            p.textContent = `${player.name}`;
            teamAContainer.appendChild(p);
        });

        const teamBHeader = document.createElement('h2');
        teamBHeader.textContent = 'Team B';
        teamBContainer.appendChild(teamBHeader);

        teams.teamB.forEach(player => {
            const p = document.createElement('p');
            p.textContent = `${player.name}`;
            teamBContainer.appendChild(p);
        });

        teamsDiv.appendChild(teamAContainer);
        teamsDiv.appendChild(teamBContainer);
    }

    function displayPlayers() {
        const presenceList = document.getElementById('presenceList');
        presenceList.innerHTML = '';
    
        players.forEach(player => {
            // Container per la presenza
            const presenceContainer = document.createElement('div');
            presenceContainer.className = 'switch-container';
    
            // Etichetta per la presenza
            const presenceLabel = document.createElement('label');
            presenceLabel.textContent = 'Presente';
            presenceLabel.className = 'switch-label';
            presenceLabel.setAttribute('for', `presenceSwitch-${player.name}`);
    
            // Slider per la presenza
            const presenceSlider = document.createElement('label');
            presenceSlider.className = 'switch';
    
            const presenceInput = document.createElement('input');
            presenceInput.type = 'checkbox';
            presenceInput.id = `presenceSwitch-${player.name}`;
            presenceInput.checked = player.presence;
            presenceInput.className = 'slider';
    
            const presenceSpan = document.createElement('span');
            presenceSpan.className = 'slider';
    
            presenceSlider.appendChild(presenceInput);
            presenceSlider.appendChild(presenceSpan);
    
            presenceInput.addEventListener('change', (event) => {
                player.presence = event.target.checked;
                localStorage.setItem('players', JSON.stringify(players));
            });
    
            // Aggiungi tutto al container della presenza
            presenceContainer.appendChild(presenceLabel);
            presenceContainer.appendChild(presenceSlider);
    
            // Container per il portiere (goalie)
            const goalieContainer = document.createElement('div');
            goalieContainer.className = 'switch-container';
    
            // Etichetta per il portiere (goalie)
            const goalieLabel = document.createElement('label');
            goalieLabel.textContent = 'Portiere';
            goalieLabel.className = 'switch-label';
            goalieLabel.setAttribute('for', `goalieSwitch-${player.name}`);
    
            // Slider per il portiere (goalie)
            const goalieSlider = document.createElement('label');
            goalieSlider.className = 'switch';
    
            const goalieInput = document.createElement('input');
            goalieInput.type = 'checkbox';
            goalieInput.id = `goalieSwitch-${player.name}`;
            goalieInput.checked = player.goalie === 1;
            goalieInput.className = 'slider';
    
            const goalieSpan = document.createElement('span');
            goalieSpan.className = 'slider';
    
            goalieSlider.appendChild(goalieInput);
            goalieSlider.appendChild(goalieSpan);
    
            goalieInput.addEventListener('change', (event) => {
                player.goalie = event.target.checked ? 1 : 0;
                localStorage.setItem('players', JSON.stringify(players));
            });
    
            // Aggiungi tutto al container del portiere (goalie)
            goalieContainer.appendChild(goalieLabel);
            goalieContainer.appendChild(goalieSlider);
    
            // Creazione del listItem e aggiunta alla lista principale
            const listItem = document.createElement('li');
            listItem.textContent = player.name;
            listItem.appendChild(presenceContainer);
            listItem.appendChild(goalieContainer);
            presenceList.appendChild(listItem);
        });
    }
    
    loadPlayers();

    // Aggiungi l'event listener per il click sul pulsante "Generate Teams"
    const generateTeamsButton = document.getElementById('generateTeams');
    if (generateTeamsButton) {
        generateTeamsButton.addEventListener('click', generateTeams);
    } else {
        console.error('Element with ID "generateTeams" not found.');
    }
});
