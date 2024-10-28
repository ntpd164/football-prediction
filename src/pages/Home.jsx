import { useState, useEffect } from "react";
import Calendar from "../components/calendar/Calendar";
import FinishedMatches from "../components/Matches/FinishedMatches-v2";
import LiveMatches from "../components/Matches/LiveMatches-v2";
import UpcomingMatches from "../components/Matches/UpcomingMatches-v2";
import finishedMatchesData from "../../finished-matches.json";
import liveMatchesData from "../../live-matches.json";
import upcomingMatchesData from "../../upcoming-matches.json";
import MatchDetails from "../components/Matches/MatchDetails";

function loadData() {
  localStorage.setItem('finishedMatchesData', JSON.stringify(finishedMatchesData));
  localStorage.setItem('liveMatchesData', JSON.stringify(liveMatchesData));
  localStorage.setItem('upcomingMatchesData', JSON.stringify(upcomingMatchesData));
  console.log('Data loaded');
}

function Home() {
  const [matches, setMatches] = useState([
    {
      "fixture": {
        "id": 157256,
        "referee": "M. Oliver",
        "timezone": "UTC",
        "date": "2024-11-02T12:30:00+00:00",
        "timestamp": 1737241200,
      },
      "league": {
        "id": 39,
        "name": "Premier League",
        "country": "England",
        "logo": "https://media.api-sports.io/football/leagues/39.png",
        "flag": "https://media.api-sports.io/flags/gb.svg"
      },
      "teams": {
        "home": {
          "id": 34,
          "name": "Newcastle",
          "logo": "https://media.api-sports.io/football/teams/34.png"
        },
        "away": {
          "id": 42,
          "name": "Arsenal",
          "logo": "https://media.api-sports.io/football/teams/42.png"
        }
      },
      "goals": {
        "home": 2,
        "away": 1
      },
      "score": {
        "halftime": {
          "home": 1,
          "away": 0
        },
        "fulltime": {
          "home": 2,
          "away": 1
        },
        "extratime": {
          "home": null,
          "away": null
        },
        "penalty": {
          "home": null,
          "away": null
        }
      },
    },
  ]);

  useEffect(() => {
    loadData();
  }, []);

  const onMatchClick = (match) => {
    console.log('Match clicked', match);
    setMatches([match]);
  }

  return (
    <div className="grid grid-cols-3 py-10">
      <Calendar />
      <div className="bg-white p-8 rounded-[3rem]">
        <p className="text-5xl font-bold text-green-600">Danh sách trận đấu</p>
        {/* <UpcomingMatches date={'2024-11-02'} /> */}
        {/* <LiveMatches date={'2024-10-26'} /> */}
        {/* <FinishedMatches date={'2024-10-20'} /> */}
        <UpcomingMatches onMatchClick={onMatchClick} />
        <LiveMatches onMatchClick={onMatchClick} />
        <FinishedMatches onMatchClick={onMatchClick} />
      </div>
      <MatchDetails matches={matches} />
    </div>
  );
}

export default Home;