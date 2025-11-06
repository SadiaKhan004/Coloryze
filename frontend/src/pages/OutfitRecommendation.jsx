

// export default OutfitRecommendation;
import React, { useState } from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react"; // Uncomment if you install lucide-react
import Navbar from "../components/navbar";

const OutfitRecommendation = () => {
  const [selectedBrand, setSelectedBrand] = useState("Sapphire");
  const [selectedColor, setSelectedColor] = useState("#B77A54");
  const [garmentLoading, setGarmentLoading] = useState(false);
  const [garments, setGarments] = useState([]);
  const [error, setError] = useState(null);

  const brands = ["Sapphire", "Khaddi", "Saya", "Outfitters"];
  const colorPalette = [
    // "#B77A54",
    // "#8F5B3E",
    // "#6B6B6B",
    // "#000000",
    // "#FFFFFF",
    // "#E0B084",
    // "#A67C52",
    // "#D4A017",
    // "#9C6644",
    // "#C3A995",
    "#808000",
    "#F5F5DC",
    "#E2725B",
    "#FFDB58",
    "#000080",
    "#8B0000",
    "#FFC0CB",
    "#000000",
    "#FFFFFF",
    "#8B4513",
    // "#FFA500",
    "#C7B8EA"
  ];

  const GARMENT_API = "http://localhost:8000/api/search-garment/";

  const handleGarmentSearch = async () => {
    setGarmentLoading(true);
    setGarments([]);
    try {
      const res = await fetch(GARMENT_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand: selectedBrand, color: selectedColor }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setGarments(data.results);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch garments");
    } finally {
      setGarmentLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2E3D5] text-gray-800 p-6">
      <Navbar />

      {/* === Brand & Color Selection === */}
      <div className="flex justify-end mt-28 gap-6 font-poppins">
        {/* Brand */}
        <div className="flex bg-[#89CFF0]/30 rounded-xl p-4 shadow-lg w-[520px]">
          <h3 className="text-lg font-semibold mb-2 mt-5">SELECT BRAND:</h3>
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="w-[300px] bg-white/70 ml-10 border border-gray-300 rounded-lg py-3 px-4 text-gray-800 focus:ring-2 focus:ring-[#B77A54]"
          >
            {brands.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </div>

        {/* Colors */}
        <div className="bg-[#89CFF0]/30 rounded-xl p-4 shadow-lg">
          <h3 className="text-lg font-semibold font-poppins mb-2">SELECT COLOR</h3>
          <div className="flex flex-wrap gap-3">
            {colorPalette.map((c, i) => (
              <button
                key={i}
                onClick={() => setSelectedColor(c)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  selectedColor === c
                    ? "border-[#B77A54] scale-110 shadow-md"
                    : "border-gray-300"
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* === Try-On & Garment Search === */}
      <div className="flex flex-col lg:flex-row justify-center items-start gap-10 mt-12">
        {/* Try-On */}
        <div className="flex-1 max-w-[700px] bg-[#89CFF0]/30 rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-4">TRY-ON RESULT</h2>
          <div className="bg-[#F7F2EC] rounded-xl h-[450px] flex items-center justify-center shadow-inner">
            {/* <div
              className="w-64 h-80 rounded-lg shadow-md"
              style={{ backgroundColor: selectedColor }}
            ></div> */}
          </div>
           <button
            className="w-full bg-[#B77A54] text-white py-3 rounded-lg font-semibold hover:bg-[#8F5B3E] transition disabled:opacity-50"
          > Try-On
          </button>
        </div>

        {/* Garment Search */}
        <div className="lg:w-1/3 bg-[#89CFF0]/30 rounded-xl p-6 shadow-lg relative">
          <h2 className="text-2xl font-bold mb-4">GARMENT SEARCH</h2>

          <button
            onClick={handleGarmentSearch}
            disabled={garmentLoading}
            className="w-full bg-[#B77A54] text-white py-3 rounded-lg font-semibold hover:bg-[#8F5B3E] transition disabled:opacity-50"
          >
            {garmentLoading ? "Searching..." : "Search Garments"}
          </button>

          {/* === Garment Results === */}
          <div className="mt-6">
            {garments.length > 0 ? (
              <div className="relative">
                {/* Horizontal Scroll Container */}
                <div className="flex overflow-x-auto gap-4 scroll-smooth scrollbar-hide">
                  {garments.map((g, i) => (
                    <div key={i} className="min-w-[100%] flex-shrink-0">
                      <div className="border rounded-lg p-3 h-[400px] flex flex-col justify-between">
                        <a
                          href={g.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#B77A54] font-medium hover:underline mb-3"
                        >
                          View Product
                        </a>
                        {g.img && (
                          <div className="w-full h-full flex justify-center items-center bg-[#F7F2EC] rounded-lg">
                            <img
                              src={g.img}
                              alt="Garment"
                              className="rounded-lg w-full h-full object-contain"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Navigation Arrows */}
                {garments.length > 1 && (
                  <>
                    {/* Left Arrow */}
                    <button
                      onClick={() => {
                        const container =
                          document.querySelector(".overflow-x-auto");
                        container.scrollBy({
                          left: -container.clientWidth,
                          behavior: "smooth",
                        });
                      }}
                      className="absolute bg-[#B77A54] left-0 top-1/2 -translate-y-1/2 text-4xl rounded-full p-2 shadow-md hover:bg-[#F2E3D5]"
                    >
                      ←
                    </button>

                    {/* Right Arrow */}
                    <button
                      onClick={() => {
                        const container =
                          document.querySelector(".overflow-x-auto");
                        container.scrollBy({
                          left: container.clientWidth,
                          behavior: "smooth",
                        });
                      }}
                      className="absolute right-0 top-1/2 text-4xl bg-[#B77A54] -translate-y-1/2 rounded-full p-2 shadow-md hover:bg-[#F2E3D5]"
                    >
                      →
                    </button>
                  </>
                )}
              </div>
            ) : (
              !garmentLoading && (
                <p className="text-gray-500 text-center mt-6">
                  No garments found yet.
                </p>
              )
            )}
          </div>
        </div>
      </div>

      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>Dynamic color palette powered by Coloryze AI</p>
      </footer>
    </div>
  );
};

export default OutfitRecommendation;
