import requests
from bs4 import BeautifulSoup

def scrape_player_rankings(url):
    # Send an HTTP request to the Wikipedia page
    response = requests.get(url)
    
    # Parse the HTML content using BeautifulSoup
    soup = BeautifulSoup(response.text, "html.parser")
    
    rankings_data = {}
    
    # Find the section containing batting rankings for Test format
    test_batting_rankings = soup.find("span", {"id": "Test_batting_rankings"})
    if test_batting_rankings:
        test_batting_rankings = test_batting_rankings.parent.find_next_sibling("table").find_all("tr")[1:]
    
    test_bowling_rankings = soup.find("span", {"id": "Test_bowling_rankings"})
    if test_bowling_rankings:
        test_bowling_rankings = test_bowling_rankings.parent.find_next_sibling("table").find_all("tr")[1:]
    
    test_all_rounder_rankings = soup.find("span", {"id": "Test_all-rounder_rankings"})
    if test_all_rounder_rankings:
        test_all_rounder_rankings = test_all_rounder_rankings.parent.find_next_sibling("table").find_all("tr")[1:]
    
    # Extract and store Test rankings
    rankings_data['Test'] = {
        'Batting': extract_rankings(test_batting_rankings),
        'Bowling': extract_rankings(test_bowling_rankings),
        'All-Rounder': extract_rankings(test_all_rounder_rankings)
    }
    
    # Repeat the process for ODI and T20 formats...
    
    return rankings_data

def extract_rankings(rankings):
    player_rankings = []
    if rankings:
        for row in rankings:
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
        for category, players in rankings.items():
            print(f"\n{category}:")
            for rank, player in players:
                print(f"Rank: {rank}, Player: {player}")
