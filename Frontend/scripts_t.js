$(document).ready(function() {
    var styles = `
        /* Styles for schedule info */
        #scheduleInfo {
            margin-top: 20px;
        }

        /* Styles for upcoming series list */
        ul {
            list-style-type: none;
            padding: 0;
        }

        .series {
            cursor: pointer;
            margin-bottom: 10px;
            padding: 10px;
            background-color: #f0f0f0;
            border-radius: 5px;
        }

        .series:hover {
            background-color: #e0e0e0;
        }

        /* Styles for match details */
        .match-details {
            list-style-type: none;
            padding: 0;
        }

        .match {
            margin-bottom: 20px;
            padding: 15px;
            
            border-radius: 5px;
        }

        .match img {
            vertical-align: middle;
        }

        .match p {
            margin: 5px 0;
        }

        /* Additional styles */
        h2 {
            margin-top: 0;
            text-align:center;
            font-style:italic;
            color: #f0eeed;
        }

        h3 {
            margin-top: 20px;
            margin-bottom: 10px;
        }
        #match{
            background-color:rgb(226, 230, 231);
            float: left;
            width: 50%;
            padding:5px 50px;
            box-sizing: border-box;
        }
        #match span{
            font-style: italic;
        }
        #match p{
            color:black;
            font-style: italic;
        }
        p{
            color:#f0eeed;
        }
        h3{
            color:#f0eeed;
        }
        #scheduleInfo::after {
            content: '';
            display: table;
            clear: both; /* Clear the float */
        }
    `;

    // Create a <style> element and append CSS styles to it
    var styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    styleElement.appendChild(document.createTextNode(styles));
    document.head.appendChild(styleElement);
    $('#searchForm').submit(function(event) {
        
        event.preventDefault(); // Prevent form submission

        // Get the team name entered by the user
        var teamName = $('#teamName').val();

        // Make AJAX request to fetch series info based on team name
        $.ajax({
            url: 'https://api.cricapi.com/v1/series',
            method: 'GET',
            data: {
                apikey: 'ca21588f-bc9c-4995-9dd1-f7abcecd8b4d',
                offset: 0,
                search: teamName
            },
            success: function(response) {
                // Check if series data is found
                if (response.data.length > 0) {
                    // Iterate over series data to find upcoming series of the entered team
                    var upcomingSeries = [];
                    var currentDate = new Date();

                    response.data.forEach(function(series) {
                        var seriesStartDate = new Date(series.startDate);
                        if (seriesStartDate > currentDate) {
                            upcomingSeries.push(series);
                        }
                    });

                    // Sort upcoming series based on start date
                    upcomingSeries.sort(function(a, b) {
                        return new Date(a.startDate) - new Date(b.startDate);
                    });

                    // If no upcoming series found for the team
                    if (upcomingSeries.length === 0) {
                        $('#scheduleInfo').html('<p>No upcoming series found for the entered team.</p>');
                    } else {
                        // Display upcoming series for the team
                        var scheduleInfoHTML = '<h2>Upcoming Series</h2>';
                        scheduleInfoHTML += '<ul>';
                        upcomingSeries.forEach(function(series) {
                            scheduleInfoHTML += `<li class="series" data-series-id="${series.id}">${series.name} (${series.startDate} - ${series.endDate})</li>`;
                        });
                        scheduleInfoHTML += '</ul>';
                        $('#scheduleInfo').html(scheduleInfoHTML);

                        // Add event listener to series items
                        $('.series').click(function() {
                            var seriesId = $(this).data('series-id');
                            fetchSeriesInfo(seriesId);
                        });
                    }
                } else {
                    $('#scheduleInfo').html('<p>No series found for the entered team.</p>');
                }
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
                $('#scheduleInfo').html('<p>Error fetching series information. Please try again later.</p>');
            }
        });
    });

    // Function to fetch series info based on series id
function fetchSeriesInfo(seriesId) {
    $.ajax({
        url: 'https://api.cricapi.com/v1/series_info',
        method: 'GET',
        data: {
            apikey: 'ca21588f-bc9c-4995-9dd1-f7abcecd8b4d',
            id: seriesId
        },
        success: function(response) {
            if (response.status === 'success') {
                var seriesData = response.data;
                var seriesInfoHTML = `
                    <h2>${seriesData.info.name}</h2>
                    <p>Start Date: ${seriesData.info.startdate}</p>
                    <p>End Date: ${seriesData.info.enddate}</p>
                    <h3>Match Details:</h3>
                    <ul>
                `;

                seriesData.matchList.forEach(function(match) {
                    seriesInfoHTML += `
                        <li>
                        <div id="match">
                        <img src="${match.teamInfo[0].img}" alt="${match.teams[0]}" width="24">
                        <span>${match.teams[0]}</span>
                        <span>vs</span>
                        <img src="${match.teamInfo[1].img}" alt="${match.teams[1]}" width="24">
                        <span>${match.teams[1]}</span>
                            <p> ${match.name}</p>
                            <p> ${match.status}</p>
                            <p> ${match.venue}</p>
                            <p> ${match.date}</p>
                            </div>    
                        </li>
                    `;
                });

                seriesInfoHTML += '</ul>';
                $('#scheduleInfo').html(seriesInfoHTML);
            } else {
                $('#scheduleInfo').html('<p>Error fetching series information.</p>');
            }
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
            $('#scheduleInfo').html('<p>Error fetching series information. Please try again later.</p>');
        }
    });
}

});
