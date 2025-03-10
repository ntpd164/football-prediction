import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Loading from "../loading";
import { useNavigate } from "react-router-dom";

async function fetchMatchesWithPredictionByDate(date, leagueId) {
  try {
    const response = await fetch(
      `http://localhost:9000/predict?date=${date}&league=${leagueId}`
    );
    if (!response.ok) {
      throw new Error(
        `Error fetching matches with prediction for league ${leagueId}: ${response.status}`
      );
    }
    const data = await response.json();
    return data.matches;
  } catch (error) {
    console.error(error);
    throw error; // Re-throw the error to handle it upstream
  }
}

function UpcomingMatches({ date }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5; // Number of matches per page
  const leagueIDs = [39, 140, 78, 135, 61];
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        setError(null);

        const leagueMatchesPromises = leagueIDs.map((leagueId) =>
          fetchMatchesWithPredictionByDate(date, leagueId)
        );
        const results = await Promise.all(leagueMatchesPromises);
        const matchesWithPredictions = results.flat(); // combine all league matches

        if (matchesWithPredictions.length === 0) {
          setError("No matches found for the specified date.");
          setLoading(false);
          return;
        }

        setMatches(matchesWithPredictions);
        setCurrentPage(1);
        setLoading(false);
      } catch (err) {
        setError(`Failed to fetch matches: ${err.message}`);
        setLoading(false);
      }
    };

    fetchMatches();
  }, [date]);

  if (loading) {
    return (
      <div className="flex justify-center h-screen items-center">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center h-1/2 items-center">
        <h1 className="text-red-500 text-3xl">{error}</h1>
      </div>
    );
  }

  const convertDate = (utcDate) => {
    const date = new Date(utcDate);
    const formattedDate = date.toLocaleDateString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const formattedTime = date.toLocaleTimeString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      hour: "2-digit",
      minute: "2-digit",
    });
    return { formattedDate, formattedTime };
  };

  const totalPages = Math.ceil(matches.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const displayedMatches = matches.slice(startIndex, startIndex + pageSize);

  const groupedMatches = displayedMatches.reduce((acc, match) => {
    const leagueId = match.league.id;
    if (!acc[leagueId]) {
      acc[leagueId] = {
        logo: match.league.logo,
        name: match.league.name,
        matches: [],
      };
    }
    acc[leagueId].matches.push(match);
    return acc;
  }, {});

  const leagueIds = Object.keys(groupedMatches);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleMatchClick = (match) => {
    const currentDate = new Date();
    const matchDate = new Date(date);
    const addedTwoYear = new Date(
      matchDate.setFullYear(matchDate.getFullYear() + 2)
    );

    // If match date is beyond 2 years, don't pass prediction state
    if (currentDate >= addedTwoYear) {
      navigate(`/matches/${match.fixture.id}`);
    } else {
      navigate(`/matches/${match.fixture.id}`, {
        state: {
          prediction: match.predict,
          date: date,
        },
      });
    }
  };

  return (
    <div className="rounded-[2rem] pb-4">
      {leagueIds.map((leagueId, index) => {
        const league = groupedMatches[leagueId];
        return (
          <div
            key={leagueId}
            className={`text-3xl p-2 mb-4 ${
              index < leagueIds.length - 1 ? "border-b-2 " : ""
            }`}
          >
            <div className="flex font-bold text-white py-4 px-6 mb-10 rounded-xl bg-gradient-to-r from-primary to-primary-dark w-full">
              <span>{league.name}</span>
            </div>
            {league.matches.map((match) => (
              <div
                key={match.fixture.id}
                className="mt-6 bg-white px-8 flex py-10 border border-zinc-300 rounded-2xl shadow-lg"
                onClick={() => handleMatchClick(match)}
              >
                <div className="flex flex-col items-center border-r-2 my-auto pr-8">
                  <p className="text-black text-2xl font-semibold mb-6">
                    {convertDate(match.fixture.date).formattedTime}
                  </p>
                  <p className="text-black text-2xl">
                    {convertDate(match.fixture.date).formattedDate}
                  </p>
                </div>
                <div className="flex flex-row justify-center w-full">
                  <div className="flex justify-center items-center">
                    <img
                      src={match.teams.home.logo}
                      alt={match.teams.home.name}
                      className="w-28 h-28"
                    />
                    {/* Display predict if current date is less than match date minus 2 years */}
                    {(() => {
                      const currentDate = new Date();
                      const matchDate = new Date(date);
                      const addedTwoYear = new Date(
                        matchDate.setFullYear(matchDate.getFullYear() + 2)
                      );

                      return currentDate < addedTwoYear ? (
                        <div className="mx-10">
                          <span className="text-2xl -mt-8 flex justify-center font-bold text-primary">
                            Dự đoán
                          </span>
                          <div className="border mt-2 shadow-xl text-5xl font-bold text-primary-dark border-zinc-400 rounded-full px-10 flex justify-center py-4">
                            <span className="">{match.predict.home}</span>
                            <span className="mx-6">-</span>
                            <span className="">{match.predict.away}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="mx-10">
                          <span className="text-2xl -mt-8 flex justify-center font-bold text-primary">
                            Kết quả
                          </span>
                          <div className="border mt-2 shadow-xl text-5xl font-bold text-primary-dark border-zinc-400 rounded-full px-10 flex justify-center py-4">
                            <span className="">{match.goals.home}</span>
                            <span className="mx-6">-</span>
                            <span className="">{match.goals.away}</span>
                          </div>
                        </div>
                      );
                    })()}
                    <img
                      src={match.teams.away.logo}
                      alt={match.teams.away.name}
                      className="w-28 h-28"
                    />
                  </div>
                </div>
                <button className="border-2 border-red-300 mr-4 rounded-xl px-8 py-2 flex items-center self-center justify-center text-2xl whitespace-nowrap hover:bg-red-600 hover:text-white">
                  Xem thêm
                </button>
              </div>
            ))}
          </div>
        );
      })}

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6 space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="text-2xl px-3 py-2 rounded-xl border-2 border-zinc-300 font-normal hover:bg-red-600 hover:text-white disabled:opacity-50"
        >
          <FaChevronLeft />
        </button>

        {/* Page Numbers */}
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            className={`text-2xl px-4 py-2 rounded-xl border-2 border-zinc-300 ${
              currentPage === i + 1
                ? "bg-red-600 text-white"
                : "hover:bg-red-600 hover:text-white"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="text-2xl px-3 py-2 rounded-xl border-2 border-zinc-300 font-normal hover:bg-red-600 hover:text-white disabled:opacity-50"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
}

UpcomingMatches.propTypes = {
  date: PropTypes.string.isRequired,
  onMatchClick: PropTypes.func.isRequired,
};

export default UpcomingMatches;
