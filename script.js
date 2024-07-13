<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Team Generator</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 20px;
        }

        .container {
            display: grid;
            grid-template-columns: 1fr;
            gap: 20px;
        }

        .player-form {
            background-color: #f0f0f0;
            padding: 15px;
            border-radius: 8px;
        }

        .player-list {
            list-style-type: none;
            padding: 0;
        }

        .player-list li {
            margin-bottom: 10px;
            padding: 10px;
            background-color: #e0e0e0;
            border-radius: 4px;
        }

        .teams-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }

        .team {
            background-color: #f0f0f0;
            padding: 15px;
            border-radius: 8px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="player-form">
            <h2>Add Player</h2>
            <form id="playerForm">
                <label for="name">Name:</label>
                <input type="text" id="name" name="name" required><br><br>
                <label for="position">Position:</label>
                <input type="text" id="position" name="position" required><br><br>
                <label for="skill">Skill:</label>
                <input type="number" id="skill" name="skill" required><br><br>
                <button type="submit">Add Player</button>
            </form>
        </div>

        <div>
            <h2>Players</h2>
            <ul id="playerList" class="player-list"></ul>
        </div>

        <button id="generateTeams">Generate Teams</button>

        <div id="teams" class="teams-container">
            <div id="teamA" class="team"></div>
            <div id="teamB" class="team"></div>
        </div>
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.4/xlsx.full.min.js"></script>
    <script src="script.js"></script>
</body>
</html>
