// import React from "react";

// const ReportSection = ({ final_report, recommended_palette }) => {
//   if (!final_report) return null;

//   return (
//     <div className="mt-6 bg-white p-6 rounded shadow">
//       <h2 className="text-xl font-semibold mb-3">Personalized Color Report</h2>
//       <pre className="whitespace-pre-wrap text-sm">{final_report}</pre>

//       {recommended_palette && (
//         <div className="mt-4">
//           <h3 className="font-semibold mb-2">Recommended Palette</h3>
//           <div className="flex flex-wrap gap-3">
//             {(recommended_palette.main_colors || []).map((c, i) => (
//               <div key={i} className="text-center">
//                 <div style={{ backgroundColor: c.hex }} className="w-14 h-14 rounded-lg shadow" />
//                 <div className="text-xs mt-1">{c.name || c.hex}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ReportSection;

// import React from "react";

// const ReportSection = ({ final_report, recommended_palette }) => {
//   if (!final_report) return null;

//   return (
//     <div className="mt-6 bg-white p-6 rounded-xl shadow-lg flex flex-col md:flex-row gap-6">
//       {/* Report Text */}
//       <div className="flex-1 bg-gray-50 p-4 rounded-lg shadow-inner">
//         <h2 className="text-2xl font-semibold mb-4">Personalized Color Report</h2>
//         <pre className="whitespace-pre-wrap text-gray-800 text-sm leading-relaxed">{final_report}</pre>
//       </div>

//       {/* Recommended Palette */}
//       {recommended_palette && (
//         <div className="w-full md:w-64 flex-shrink-0 bg-white p-4 rounded-lg shadow">
//           <h3 className="font-semibold mb-3 text-gray-700">Recommended Palette</h3>
//           <div className="flex flex-col gap-3">
//             {(recommended_palette.main_colors || []).map((c, i) => (
//               <div key={i} className="flex items-center gap-3">
//                 <div
//                   style={{ backgroundColor: c.hex }}
//                   className="w-12 h-12 rounded-lg shadow-md border border-gray-200"
//                 />
//                 <span className="text-sm text-gray-600">{c.name || c.hex}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ReportSection;
import React from "react";
import { downloadReportPdf } from "./download_report";

// Clean text: remove emojis and unwanted symbols
const cleanText = (text) => {
  return text
    .replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF]+/g, '') // emojis
    .replace(/[^\w\s.,:;!?()\-]/g, '') // other unwanted symbols
    .trim();
};

// Detect heading level (## -> 2, ### -> 3, etc.)
const getHeadingLevel = (line) => {
  const match = line.match(/^(#+)\s*/);
  return match ? match[1].length : 0;
};

const ReportSection = ({ final_report, recommended_palette, username }) => {
  if (!final_report) return null;

  const lines = final_report.split("\n").map(cleanText);

  return (
    <div className="mt-8 flex flex-col md:flex-row gap-6 font-poppins justify-center">
      {/* Report Text Container */}
      <div className="flex-1 max-w-[1200px] h-[750px] rounded-3xl shadow-2xl 
                      bg-gradient-to-b from-[#FFF7EE] to-[#FDFCFB] border border-[#E0D7CD] flex flex-col overflow-hidden">
        
        {/* Fixed Header */}
        <div className="p-6 border-b border-stone-200 bg-[#FFF7EE]">
          <h2 className="text-3xl font-extrabold text-[#5D4037]">
            Personalized Color Report
          </h2>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-6">
          {lines.map((line, idx) => {
            const level = getHeadingLevel(line);
            const text = line.replace(/^#+\s*/, '');

            if (level > 0) {
              // Use h3/h4 for headings for guaranteed bold
              if (level === 2)
                return (
                  <h3 key={idx} className="text-2xl font-extrabold text-[#5D4037] mt-6 mb-3 leading-relaxed">
                    {text}
                  </h3>
                );
              if (level === 3)
                return (
                  <h4 key={idx} className="text-xl font-extrabold text-[#5D4037] mt-5 mb-2 leading-relaxed">
                    {text}
                  </h4>
                );
              return (
                <h5 key={idx} className="text-lg font-extrabold text-[#5D4037] mt-4 mb-2 leading-relaxed">
                  {text}
                </h5>
              );
            }

            return (
              <p key={idx} className="mb-3 leading-relaxed text-gray-800 text-base">
                {text}
              </p>
            );
          })}
        </div>

        {/* Fixed Footer Button */}
        <div className="p-6 border-t border-stone-200 flex justify-center bg-[#FFF7EE]">
          <button
            onClick={() => downloadReportPdf(final_report, recommended_palette, username)}
            className="bg-[#5D4037] text-white px-5 py-2 rounded-lg hover:bg-[#7b5a48] transition-colors duration-200 shadow-lg"
          >
            Download PDF
          </button>
        </div>
      </div>

      {/* Recommended Palette */}
      {recommended_palette && (
        <div className="w-full md:w-80 flex-shrink-0 bg-white p-5 rounded-2xl shadow-lg flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-gray-700 -mb-4">
            Recommended Palette
          </h3>
          <div className="flex flex-col gap-3">
            {(recommended_palette.main_colors || []).map((c, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-2 rounded-lg hover:scale-100 transition-transform duration-200 cursor-pointer"
              >
                <div
                  style={{ backgroundColor: c.hex }}
                  className="w-14 h-14 rounded-lg shadow-md border border-gray-200"
                />
                <span className="text-sm text-gray-600">{c.name || c.hex}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportSection;
