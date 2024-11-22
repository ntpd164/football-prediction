import { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function ClubDetails() {
  const [clubs, setClubs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredClubs, setFilteredClubs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const pageSize = 10;

  const leagueIds = [39, 61, 78, 135, 140];

  useEffect(() => {
    const fetchClubData = async () => {
      setLoading(true);
      try {
        const requests = leagueIds.map((leagueId) =>
          fetch(
            `https://v3.football.api-sports.io/teams?league=${leagueId}&season=2022`,
            {
              method: "GET",
              headers: {
                "x-rapidapi-key": import.meta.env.VITE_RAPIDAPI_KEY,
                "x-rapidapi-host": import.meta.env.VITE_RAPIDAPI_HOST,
              },
            }
          ).then((response) => response.json())
        );

        const responses = await Promise.all(requests);
        const allClubs = responses
          .flatMap((res) => res.response)
          .filter(Boolean);

        setClubs(allClubs);
        setFilteredClubs(allClubs);
      } catch (error) {
        console.error("Error fetching club data:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchClubData();
  }, []);

  useEffect(() => {
    if (clubs) {
      const results = clubs.filter((club) =>
        club.team.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredClubs(results);
      setCurrentPage(1); // Reset to trang đầu tiên khi thay đổi từ khóa tìm kiếm
    }
  }, [searchTerm, clubs]);

  const totalPages = Math.ceil(filteredClubs.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const displayedClubs = filteredClubs.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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
      <div className="max-w-[120rem] mx-auto border border-x-2 border-gray-200 pb-20">
        <div className="mx-40 mt-20">
          {/* Search Bar */}
          <div className="flex items-center border-2 border-gray-300 rounded-2xl w-full p-2">
            <input
              type="text"
              placeholder="Tìm kiếm Câu lạc bộ"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow outline-none px-4 py-1"
            />
            <div className="border border-gray-400 h-10 mx-4"></div>
            <BiSearch className="text-5xl text-gray-400 mr-2" />
          </div>

          {/* Club List Header */}
          <div className="mt-20 grid grid-cols-[6fr_2fr_2fr] font-bold text-white py-4 px-6 rounded-xl bg-gradient-to-r from-primary to-primary-dark w-full">
            <span className="ml-4">Câu lạc bộ</span>
            <span>Quốc gia</span>
            <span className="ml-auto mr-4">Xem thêm</span>
          </div>

          {/* Display Filtered Clubs */}
          {displayedClubs.map((club) => (
            <div
              key={club.team.id}
              className="grid grid-cols-[6fr_2fr_2fr] border-b border-gray-300 py-8 mt-4 px-10"
            >
              <div className="flex justify-start items-center space-x-4">
                <img
                  src={club.team.logo}
                  alt={club.team.name}
                  className="h-16 w-16"
                />
                <h1 className="text-black text-4xl font-medium">
                  {club.team.name}
                </h1>
              </div>
              <div className="text-black text-4xl font-medium flex justify-start items-center">
                {club.team.country}
              </div>
              <svg
                width="24"
                height="24"
                xmlns="http://www.w3.org/2000/svg"
                fillRule="evenodd"
                clipRule="evenodd"
                className="ml-auto mr-10 cursor-pointer"
              >
                <path d="M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z" />
              </svg>
            </div>
          ))}

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
      </div>
    </div>
  );
}

export default ClubDetails;
