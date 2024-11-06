import { useState, useEffect } from "react";
import PropTypes from "prop-types";

function HeadToHead() {
  const [headToHead, setHeadToHead] = useState([]);

  useEffect(() => {
    const headToHead = localStorage.getItem("headToHeadData");
    setHeadToHead(headToHead ? JSON.parse(headToHead) : []);
    console.log("Head-to-head :", headToHead);
  }, []);

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

  const groupedMatches = headToHead.reduce((acc, match) => {
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

  return (
    <div className="bg-green-50 p-8 m-6 mt-12 rounded-[3rem]">
      {leagueIds.map((leagueId, index) => {
        const league = groupedMatches[leagueId];
        return (
          <div
            key={leagueId}
            className={`text-3xl mb-4 ${
              index < leagueIds.length - 1 ? "border-b-2 border-green-400" : ""
            }`}
          >
            <div className="flex font-bold">
              <img
                src={league.logo}
                alt={league.name}
                className="h-10 w-10 mr-4"
              />
              <span>{league.name}</span>
              <span className="ml-auto mr-8">Kết quả</span>
            </div>
            {league.matches.map((match) => (
              <div key={match.fixture.id} className="mt-4 flex py-4">
                <div className="flex flex-col items-center border-r-2 border-green-400 pr-8">
                  <p className="text-black text-2xl">
                    {convertDate(match.fixture.date).formattedDate}
                  </p>
                  <p className="text-black text-2xl">
                    {convertDate(match.fixture.date).formattedTime}
                  </p>
                  <p className="font-semibold">{match.fixture.status.short}</p>
                </div>
                <div className="flex flex-col justify-around w-full border-r-2 border-green-400 mr-2">
                  <div className="flex w-full justify-center items-center">
                    <div className="flex">
                      <img
                        src={match.teams.home.logo}
                        alt={match.teams.home.name}
                        className="h-8 w-8 mr-4 ml-2"
                      />
                      <span>{match.teams.home.name}</span>
                    </div>
                    <span className="ml-auto mr-8 font-bold">
                      {match.goals.home}
                    </span>
                  </div>
                  <div className="flex w-full justify-center items-center">
                    <div className="flex">
                      <img
                        src={match.teams.away.logo}
                        alt={match.teams.away.name}
                        className="h-8 w-8 mr-4 ml-2"
                      />
                      <span>{match.teams.away.name}</span>
                    </div>
                    <span className="ml-auto mr-8 font-bold">
                      {match.goals.away}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

HeadToHead.propTypes = {
  selectedMatch: PropTypes.object.isRequired,
};

export default HeadToHead;
