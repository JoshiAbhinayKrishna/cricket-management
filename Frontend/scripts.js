$(document).ready(function() {
    $('#searchForm').submit(function(event) {
        event.preventDefault(); // Prevent form submission

        // Get the player name entered by the user
        var playerName = $('#playerName').val();

        // Make AJAX request to fetch player info
        $.ajax({
            url: 'https://api.cricapi.com/v1/players',
            method: 'GET',
            data: {
                apikey: 'ca21588f-bc9c-4995-9dd1-f7abcecd8b4d',
                offset: 0,
                search: playerName
            },
            success: function(response) {
                // Check if player data is found
                if (response.data.length > 0) {
                    var playerId = response.data[0].id;
                    fetchPlayerDetails(playerId); // Fetch detailed info for the first player found
                } else {
                    $('#playerInfo').html('<p>No player found with that name</p>');
                }
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
                $('#playerInfo').html('<p>Error fetching player information. Please try again later.</p>');
            }
        });
    });

    // Function to fetch detailed player info by player ID
    function fetchPlayerDetails(playerId) {
        $.ajax({
            url: 'https://api.cricapi.com/v1/players_info',
            method: 'GET',
            data: {
                apikey: 'ca21588f-bc9c-4995-9dd1-f7abcecd8b4d',
                id: playerId
            },
            success: function(response) {
                // Display player information
                var playerData = response.data;
                var playerInfoHTML = `
                    <h2>${playerData.name}</h2>
                    <p><strong>Date of Birth:</strong> ${playerData.dateOfBirth}</p>
                    <p><strong>Role:</strong> ${playerData.role}</p>
                    <p><strong>Batting Style:</strong> ${playerData.battingStyle}</p>
                    <p><strong>Bowling Style:</strong> ${playerData.bowlingStyle}</p>
                    <p><strong>Place of Birth:</strong> ${playerData.placeOfBirth}</p>
                    <p><strong>Country:</strong> ${playerData.country}</p>
                    <img src="${playerData.playerImg}" alt="Player Image">
                `;
                $('#playerInfo').html(playerInfoHTML);
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
                $('#playerInfo').html('<p>Error fetching player details. Please try again later.</p>');
            }
        });
    }
});
