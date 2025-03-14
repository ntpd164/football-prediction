import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import RecentMatchesTeams from "../components/recentMatches/RecentMatches-teams";
import UpcomingMatches from "../components/club/Upcoming-club";
import PlayersClub from "../components/club/Players-club";
import StadingsClub from "../components/club/Standings-club";

function ClubDetails() {
  const { id } = useParams();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDetails, setSelectedDetails] = useState("upcoming");

  useEffect(() => {
    const fetchClubData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://v3.football.api-sports.io/teams?id=${id}`,
          {
            method: "GET",
            headers: {
              "x-rapidapi-key": import.meta.env.VITE_RAPIDAPI_KEY,
              "x-rapidapi-host": import.meta.env.VITE_RAPIDAPI_HOST,
            },
          }
        );
        const data = await response.json();
        if (data && data.response && data.response.length > 0) {
          setClub(data.response[0]);
        } else {
          setClub(null);
        }
      } catch (error) {
        console.error("Error fetching club data:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchClubData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center h-screen items-center">
        <h1 className="text-3xl">Loading club details...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center h-screen items-center">
        <h1 className="text-3xl">
          Error fetching club details: {error.message}
        </h1>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-[120rem] mx-auto">
        <div className=" bg-primary-dark text-white text-2xl pt-4 pl-4">
          <div className="m-10 pb-20 bg-white rounded-3xl ">
            <div className="">
              <div className="text-3xl font-bold px-6 bg-gradient-to-r from-primary to-primary-dark flex justify-center w-80 mx-auto py-4 rounded-b-2xl">
                <span>{club?.team.country}</span>
              </div>
              <div className="w-1 mx-auto mt-14 bg-zinc-500"></div>
            </div>
            <div className="grid grid-cols-[4fr_auto_4fr]">
              <div className="flex justify-center items-center space-x-14">
                <span className="text-black font-semibold text-4xl">
                  {club?.team.name}
                </span>
                <img
                  src={club?.team.logo}
                  alt={club?.team.name}
                  className="w-40 h-40"
                />
              </div>
              <div className="mx-auto max-w-1 w-1 bg-zinc-300"></div>
              <div className="my-auto space-y-8">
                <div className="flex ml-40 items-center text-black">
                  <span className="mr-10 pr-6 border-r-2 border-zinc-400">
                    Năm thành lập
                  </span>

                  <span className="ml-2 font-semibold">
                    {club?.team.founded}
                  </span>
                </div>
                <div className="flex ml-40 items-center text-black">
                  <span className="mr-10 pr-24 border-r-2 border-zinc-400">
                    Sân nhà
                  </span>

                  <span className="ml-2 font-semibold">{club?.venue.name}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-x-8 -mt-14">
            <div
              className={`cursor-pointer ${
                selectedDetails === "upcoming"
                  ? "border-b-[6px] border-[#F9D848]"
                  : "border-b-[6px] border-primary"
              }`}
              onClick={() => setSelectedDetails("upcoming")}
            >
              <h2 className="text-4xl font-semibold bg-primary px-16 py-2 rounded-t-xl whitespace-normal max-w-80 text-center">
                Các trận sắp diễn ra
              </h2>
            </div>
            <div
              className={`cursor-pointer ${
                selectedDetails === "recent"
                  ? "border-b-[6px] border-[#F9D848]"
                  : "border-b-[6px] border-primary"
              }`}
              onClick={() => setSelectedDetails("recent")}
            >
              <h2 className="text-4xl font-semibold bg-primary px-16 py-2 text-center whitespace-normal rounded-t-xl max-w-80">
                Các trận gần đây
              </h2>
            </div>
            <div
              className={`cursor-pointer ${
                selectedDetails === "players"
                  ? "border-b-[6px] border-[#F9D848]"
                  : "border-b-[6px] border-primary"
              }`}
              onClick={() => setSelectedDetails("players")}
            >
              <h2 className="text-4xl font-semibold bg-primary px-16 py-7 text-center whitespace-normal rounded-t-xl max-w-80">
                Cầu thủ
              </h2>
            </div>
            <div
              className={`cursor-pointer ${
                selectedDetails === "standings"
                  ? "border-b-[6px] border-[#F9D848]"
                  : "border-b-[6px] border-primary"
              }`}
              onClick={() => setSelectedDetails("standings")}
            >
              <h2 className="text-4xl font-semibold bg-primary px-16 py-2 text-center whitespace-normal rounded-t-xl max-w-80">
                Bảng xếp hạng
              </h2>
            </div>
          </div>
        </div>
        <div className="border-2 border-zinc-100">
          {selectedDetails === "upcoming" && (
            <div className="border-2 border-zinc-100 m-10 shadow-2xl rounded-[2rem] pb-10">
              <UpcomingMatches clubId={id} />
            </div>
          )}
          {selectedDetails === "recent" && (
            <div className="border-2 border-zinc-100 m-10 shadow-2xl rounded-[2rem] pb-10">
              <RecentMatchesTeams teamId={id} />
            </div>
          )}
          {selectedDetails === "players" && (
            <div className="border-2 border-zinc-100 m-10 shadow-2xl rounded-[2rem] pb-10">
              <PlayersClub clubId={id} />
            </div>
          )}
          {selectedDetails === "standings" && (
            <div className="border-2 border-zinc-100 m-10 shadow-2xl rounded-[2rem] pb-10">
              <StadingsClub clubId={id} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ClubDetails;
