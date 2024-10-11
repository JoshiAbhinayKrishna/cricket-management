import requests
from bs4 import BeautifulSoup

def scrape_player_rankings(url):
    # Send an HTTP request to the Wikipedia page
    response = requests.get(url)
    
    # Parse the HTML content using BeautifulSoup
    soup = BeautifulSoup(response.text, "html.parser")
    
    rankings_data = {}
    
    # Find all tables containing player rankings data
    tables = soup.find_all("table", {"class": "wikitable"})
    
    # Iterate through each table
    for table in tables:
        # Extract the heading of the section
        section_heading = table.find_previous("span", {"class": "mw-headline"})
        if section_heading:
            format = section_heading.text.strip()
        else:
            continue
        
        # Extract and store player rankings for each format
        format_rankings = extract_rankings(table)
        rankings_data[format] = format_rankings
    
    return rankings_data

def extract_rankings(table):
    player_rankings = []
    # Extract data from the table rows skipping the header row
    rows = table.find_all("tr")[1:]
    for row in rows:
        cells = row.find_all("td")
        if len(cells) >= 2:
            player_rank = cells[0].text.strip()
            player_name = cells[1].text.strip()
            player_rankings.append((player_rank, player_name))
    return player_rankings

if __name__ == "__main__":
    url = "https://en.wikipedia.org/wiki/ICC_men%27s_player_rankings"
    rankings_data = scrape_player_rankings(url)
    
    # Print the extracted rankings data
    for format, rankings in rankings_data.items():
        print(f"\n{format} Rankings:")
        for rank, player in rankings:
            print(f"Rank: {rank}, Player: {player}")