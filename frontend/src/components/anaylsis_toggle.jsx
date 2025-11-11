// import React from "react";

// const AnalysisToggles = ({ analyzeSkinTone, setAnalyzeSkinTone, getReport, setGetReport, getOutfitRecs, setGetOutfitRecs }) => {
//   return (
//     <div className="flex gap-6 mb-6">
//       <label className="flex items-center gap-2">
//         <input 
//           type="checkbox" 
//           checked={analyzeSkinTone} 
//           onChange={(e) => setAnalyzeSkinTone(e.target.checked)} 
//         />
//         <span>Analyze Skin Tone</span>
//       </label>

//       <label className="flex items-center gap-2">
//         <input 
//           type="checkbox" 
//           checked={getReport} 
//           onChange={(e) => setGetReport(e.target.checked)} 
//         />
//         <span>Get Report & Color Palette</span>
//       </label>

//       <label className="flex items-center gap-2">
//         <input 
//           type="checkbox" 
//           checked={getOutfitRecs} 
//           onChange={(e) => setGetOutfitRecs(e.target.checked)} 
//         />
//         <span>Get Outfit Recommendations</span>
//       </label>
//     </div>
//   );
// };

// export default AnalysisToggles;
import React from "react";

const ToggleSwitch = ({ label, checked, onChange, activeColor }) => {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      {/* Toggle container */}
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        {/* Track */}
        <div
          className={`w-16 h-9 rounded-full transition-all duration-500 shadow-inner ${
            checked
              ? `${activeColor} shadow-[0_0_15px_rgba(255,200,150,0.6)]`
              : "bg-gray-300"
          }`}
        ></div>
        {/* Knob */}
        <div
          className={`absolute top-1 left-1 w-7 h-7 rounded-full bg-white shadow-lg transform transition-transform duration-500 ${
            checked ? "translate-x-7" : "translate-x-0"
          }`}
          style={{
            boxShadow: checked
              ? "0 0 15px rgba(255, 240, 200, 0.9)"
              : "0 2px 4px rgba(0,0,0,0.2)",
          }}
        ></div>
      </div>
      <span className="text-base font-semibold text-[#744C33] drop-shadow-sm">
        {label}
      </span>
    </label>
  );
};

const AnalysisToggles = ({
  analyzeSkinTone,
  setAnalyzeSkinTone,
  getReport,
  setGetReport,
  getOutfitRecs,
  setGetOutfitRecs,
}) => {
  return (
    <div
      className="fixed top-1 right-6 flex flex-row gap-8 items-center justify-end 
                  backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/30 
                 z-50 font-poppins"
    >
      <ToggleSwitch
        label="Analyze Skin Tone"
        checked={analyzeSkinTone}
        onChange={setAnalyzeSkinTone}
        activeColor="bg-gradient-to-r from-[#B77A54] via-[#ffcf99] to-[#B77A54]"
      />
      <ToggleSwitch
        label="Get Report & Color Palette"
        checked={getReport}
        onChange={setGetReport}
        activeColor="bg-gradient-to-r from-[#ffcf99] via-[#FFD6B5] to-[#B77A54]"
      />
      <ToggleSwitch
        label="Get Outfit Recommendations"
        checked={getOutfitRecs}
        onChange={setGetOutfitRecs}
        activeColor="bg-gradient-to-r from-[#B77A54] via-[#D9A273] to-[#ffcf99]"
      />
    </div>
  );
};

export default AnalysisToggles;
