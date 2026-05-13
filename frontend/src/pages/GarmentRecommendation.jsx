// export default OutfitRecommendation;
import React, { useState } from "react";
import Navbar from "../components/navbar";
import { motion } from "framer-motion";

export default function OutfitRecommendation() {
  const [selectedColor, setSelectedColor] = useState("#D4A017");
  const [selectedBrand, setSelectedBrand] = useState("Sapphire");
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const colorPalette = [
    "#808000", "#F5F5DC", "#E2725B", "#FFDB58",
    "#000080", "#8B0000", "#FFC0CB", "#000000",
    "#FFFFFF", "#8B4513", "#C7B8EA"
  ];

  // Fetch outfits from backend
  const handleTryOn = async () => {
    setLoading(true);
    setError("");
    setOutfits([]);

    try {
      const controller = new AbortController(); // optional abort controller
      const res = await fetch("http://127.0.0.1:8000/api/search-garment/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand: selectedBrand,
          color: selectedColor,
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      // Use a reader to parse response incrementally (for large async payloads)
      const data = await res.json();

      if (data.status === "success" && data.results.length > 0) {
        setOutfits(data.results);
      } else {
        setError("No results found. Try another color or brand!");
      }

    } catch (err) {
      console.error("Error fetching outfits:", err);
      setError("Failed to fetch recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f4ff] via-[#fef6f9] to-[#e9f6ff] relative overflow-hidden">
      <Navbar />

      {/* Floating blobs */}
      <div className="absolute top-20 left-1/3 w-80 h-80 bg-[#b3e5fc]/40 blur-3xl rounded-full animate-pulse"></div>
      <div className="absolute bottom-32 right-1/4 w-96 h-96 bg-[#f48fb1]/40 blur-3xl rounded-full animate-pulse delay-700"></div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center mt-32 text-4xl md:text-5xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#9b6ef3] via-[#e65ba0] to-[#50b8e7]"
      >
        AI-Powered Outfit Try-On
      </motion.h1>

      <div className="flex flex-col lg:flex-row justify-center items-start gap-16 px-10 mt-20 pb-20">
        {/* Try-On Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative w-full lg:w-1/2 bg-white/20 backdrop-blur-2xl rounded-[40px] shadow-2xl border border-white/30 p-10 flex flex-col items-center justify-center"
        >
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">Try-On Preview</h2>
          <div className="relative w-full flex justify-center items-center">
            <div className="absolute w-[350px] h-[350px] bg-white/10 rounded-full blur-2xl"></div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative w-[280px] h-[360px] rounded-[30px] bg-white/10 backdrop-blur-xl border border-white/30 shadow-lg flex items-center justify-center"
            >
              <div
                className="w-48 h-64 rounded-2xl shadow-inner"
                style={{ backgroundColor: selectedColor }}
              />
            </motion.div>
          </div>

          {/* Try-On Button */}
          <button
            onClick={handleTryOn}
            disabled={loading}
            className={`mt-10 px-10 py-3 rounded-full text-white font-semibold bg-gradient-to-r from-[#9b6ef3] to-[#50b8e7] hover:scale-105 transition-transform shadow-lg ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {loading ? "Searching..." : "Try On"}
          </button>

          {error && <p className="text-red-500 mt-4">{error}</p>}
        </motion.div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="relative w-full lg:w-1/2 bg-white/20 backdrop-blur-2xl rounded-[40px] shadow-2xl border border-white/30 p-10"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Recommended Outfits</h2>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="bg-white/40 border border-white/50 text-gray-900 rounded-xl px-4 py-2 focus:outline-none"
            >
              {["Sapphire","Khaddi","Saya","Outfitters"].map(b => <option key={b}>{b}</option>)}
            </select>
          </div>

          {/* Color Palette */}
          <div className="flex flex-wrap gap-3 mb-8">
            {colorPalette.map((c,i) => (
              <button
                key={i}
                onClick={() => setSelectedColor(c)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === c ? "border-[#9b6ef3] scale-110 shadow-md" : "border-gray-300"}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          {/* Outfits carousel */}
          <div className="flex overflow-x-auto gap-6 scroll-smooth pb-4">
            {loading ? (
              <p className="text-gray-600 text-center w-full">Fetching outfit recommendations...</p>
            ) : outfits.length > 0 ? (
              outfits.map((item,i) => (
                <motion.div key={i} whileHover={{ scale: 1.05 }} className="min-w-[260px] bg-white/30 backdrop-blur-xl border border-white/30 rounded-3xl shadow-lg p-4 flex flex-col justify-between">
                  <div className="h-48 bg-white/40 rounded-2xl flex justify-center items-center overflow-hidden">
                    <img src={item.image_url} alt="Matched Outfit" className="object-cover h-full w-full rounded-2xl" />
                  </div>
                  <div className="mt-4 text-center">
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="font-medium text-[#9b6ef3] hover:underline">
                      View Product
                    </a>
                    <p className="text-xs text-gray-500 mt-1">
                      ΔE: {item.distance.toFixed(2)}
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500 w-full text-center">No outfits yet — select a color and brand to begin!</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
