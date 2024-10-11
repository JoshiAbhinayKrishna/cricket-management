window.onload = function() {
    // Fetch rankings data from the server
    fetchRankingsData()
        .then(data => {
            displayRankings(data);
        })
        .catch(error => {
            console.error("Error fetching rankings data:", error);
        });
}

async function fetchRankingsData() {
    try {
        const response = await fetch('http://localhost:8000/fetch_rankings'); // Adjust the URL based on your server setup
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error("Failed to fetch rankings data");
    }
}

function displayRankings(data) {
    // Extract rankings for each format
    const testRankings = data.Test;
    const odiRankings = data.ODI;
    const t20iRankings = data.T20I;

    // Display Test rankings
    displayFormatRankings(testRankings, 'testBatting');
    displayFormatRankings(testRankings, 'testBowling');
    displayFormatRankings(testRankings, 'testAllRounder');
    
    // Repeat for ODI and T20I
}

function displayFormatRankings(rankings, containerId) {
    const container = document.getElementById(containerId);
    const categoryRankings = rankings[containerId.split(/(?=[A-Z])/).join('_')]; // Convert camelCase to snake_case
    if (container && categoryRankings) {
        const list = document.createElement('ul');
        categoryRankings.forEach(player => {
            const listItem = document.createElement('li');
            listItem.textContent = `Rank: ${player[0]}, Player: ${player[1]}`;
            list.appendChild(listItem);
        });
        container.appendChild(list);
    }
}
