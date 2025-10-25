// // ========================= running code

// import React from "react";
// import { motion } from "framer-motion";
// import Navbar from "../components/navbar";
// import jsPDF from "jspdf";

// const AnalyzeSkinTone = ({ colors = [] }) => {
//   const defaultColors = [
//     "#EDE0D4",
//     "#DDB892",
//     "#B08968",
//     "#7F5539",
//     "#9C6644",
//     "#F6CCB2",
//     "#EDE0D4",
//     "#DDB892",
//     "#B08968",
//     "#7F5539",
//     "#9C6644",
//     "#F6CCB2",
//   ];

//   const displayColors = colors.length > 0 ? colors : defaultColors;

//   const rows = [];
//   for (let i = 0; i < displayColors.length; i += 6) {
//     rows.push(displayColors.slice(i, i + 6));
//   }

//   const analysisReport = {
//     skinTone: "Warm Medium",
//     undertone: "Golden Olive",
//     summary: `
// Your skin tone falls under the warm medium category, characterized by a natural golden glow. The undertone analysis suggests a subtle olive hue, making warm earthy tones and natural colors ideal for you.
// Colors such as coral, terracotta, mustard, and olive green are likely to enhance your overall appearance.
// Avoid overly cool or bluish shades that might contrast sharply with your complexion.
// This analysis provides a foundation for choosing makeup, clothing, and accessories that harmonize with your natural tones.
// Your skin tone falls under the warm medium category, characterized by a natural golden glow.
// The undertone analysis suggests a subtle olive hue, making warm earthy tones and natural colors ideal for you.
// Colors such as coral, terracotta, mustard, and olive green are likely to enhance your overall appearance.
// Avoid overly cool or bluish shades that might contrast sharply with your complexion.
// This analysis provides a foundation for choosing makeup, clothing, and accessories that harmonize with your natural tones.
// `,
//   };

//   // 🟢 PDF Download Function
//   const downloadReport = () => {
//     const doc = new jsPDF();
//     const marginLeft = 15;
//     let yPos = 20;

//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(24);
//     doc.setTextColor(183, 122, 84);
//     doc.text("Coloryze", marginLeft, yPos);
//     yPos += 15;

//     doc.setFontSize(14);
//     doc.setTextColor(0, 0, 0);
//     doc.text(`Skin Tone: ${analysisReport.skinTone}`, marginLeft, yPos);
//     yPos += 8;
//     doc.text(`Undertone: ${analysisReport.undertone}`, marginLeft, yPos);
//     yPos += 15;

//     doc.setFont("helvetica", "normal");
//     doc.setFontSize(12);
//     const summaryLines = doc.splitTextToSize(analysisReport.summary, 180);
//     doc.text(summaryLines, marginLeft, yPos);
//     yPos += summaryLines.length * 6 + 10;

//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(14);
//     doc.text("Recommended Color Palette:", marginLeft, yPos);
//     yPos += 10;

//     const boxSize = 10;
//     const gap = 5;
//     displayColors.forEach((color, index) => {
//       const x = marginLeft + (index % 6) * (boxSize + gap);
//       const y = yPos + Math.floor(index / 6) * (boxSize + gap);
//       doc.setFillColor(color);
//       doc.rect(x, y, boxSize, boxSize, "F");
//     });

//     yPos += Math.ceil(displayColors.length / 6) * (boxSize + gap) + 10;
//     doc.setFont("helvetica", "italic");
//     doc.setFontSize(10);
//     doc.text(`Generated on: ${new Date().toLocaleDateString()}`, marginLeft, yPos);

//     doc.save(`Coloryze_Report_${new Date().getTime()}.pdf`);
//   };

//   return (
//     <div className="min-h-screen bg-[#F3E1CF] flex flex-col mt-20">
//       <Navbar />
//       <div className="flex justify-center items-center px-6">
//         {/* Centered AI Analysis Report Card */}
//         <div className="rounded-xl shadow-lg p-10 bg-white/30 backdrop-blur-sm w-[80%] max-w-8xl">
//           <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
//             Analysis Report and Color Palette
//           </h2>

//           <div className="space-y-8">
//             {/* Skin Tone + Undertone */}
//             <div className="grid grid-cols-2 gap-6">
//               <div className="bg-[#B77A54]/50 h-[70px] p-4 rounded-lg flex items-center gap-4">
//                 <h3 className="font-semibold font-poppins text-lg text-gray-700">
//                   Skin Tone:
//                 </h3>
//                 <p className="text-lg text-white font-semibold font-poppins">
//                   {analysisReport.skinTone}
//                 </p>
//               </div>
//               <div className="bg-[#B77A54]/50 h-[70px] p-4 rounded-lg flex items-center gap-4">
//                 <h3 className="font-semibold font-poppins text-lg text-gray-700">
//                   Undertone:
//                 </h3>
//                 <p className="text-lg text-white font-semibold font-poppins">
//                   {analysisReport.undertone}
//                 </p>
//               </div>
//             </div>

//             {/* Detailed Analysis */}
//             <div className="p-4 rounded-lg">
//               <h3 className="font-semibold font-poppins text-2xl text-black mb-2">
//                 Detailed Analysis
//               </h3>
//               <div className="h-[250px] w-8xl overflow-y-auto pr-2 scrollbar scrollbar-thin scrollbar-thumb-[#B77A54] scrollbar-track-transparent rounded-lg">
//                 <p className="text-[#B77A54] text-[18px] font-poppins text-justify leading-relaxed whitespace-pre-line">
//                   {analysisReport.summary}
//                 </p>
//               </div>
//             </div>

//             {/* Color Palette */}
//             <div className="bg-white/40 justify-center rounded-xl shadow-md p-6 mt-6 flex gap-10">
//               <h3 className="font-semibold mt-10 text-black text-xl mb-5 font-poppins text-center">
//                 Recommended Color Palette
//               </h3>
//               <div className="space-y-4">
//                 {rows.map((row, rowIndex) => (
//                   <div
//                     key={rowIndex}
//                     className="flex justify-center items-center gap-3"
//                   >
//                     {row.map((color, colorIndex) => (
//                       <div
//                         key={`${rowIndex}-${colorIndex}`}
//                         className="w-14 h-14 rounded-lg shadow-md transition-transform hover:scale-110 relative group"
//                         style={{ backgroundColor: color }}
//                       >
//                         <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-[10px] py-[2px] text-center opacity-0 group-hover:opacity-100 transition-opacity rounded-b-lg">
//                           {color}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Download PDF Button */}
//           <div className="mt-10 pt-6 border-t-2 border-black/50">
//             <button
//               onClick={downloadReport}
//               className="w-full bg-[#B77A54] text-white text-poppins text-xl py-4 px-8 rounded-lg font-bold transition-all duration-200 shadow-md hover:shadow-lg hover:bg-[#9C6644]"
//             >
//               Download PDF Report
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AnalyzeSkinTone;

// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import Navbar from "../components/navbar";
// import jsPDF from "jspdf";

// const AnalyzeSkinTone = ({ apiPayload }) => {
//   // apiPayload is expected to contain: { skinTone, undertone, summary, colors }
//   const [analysisReport, setAnalysisReport] = useState({
//     skinTone: "",
//     undertone: "",
//     summary: "",
//   });
//   const [displayColors, setDisplayColors] = useState([]);

//   useEffect(() => {
//     if (apiPayload) {
//       setAnalysisReport({
//         skinTone: apiPayload.skinTone || "",
//         undertone: apiPayload.undertone || "",
//         summary: apiPayload.summary || "",
//       });

//       setDisplayColors(apiPayload.colors || []);
//     }
//   }, [apiPayload]);

//   const rows = [];
//   for (let i = 0; i < displayColors.length; i += 6) {
//     rows.push(displayColors.slice(i, i + 6));
//   }

//   // PDF Download Function
//   const downloadReport = () => {
//     const doc = new jsPDF();
//     const marginLeft = 15;
//     let yPos = 20;

//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(24);
//     doc.setTextColor(183, 122, 84);
//     doc.text("Coloryze", marginLeft, yPos);
//     yPos += 15;

//     doc.setFontSize(14);
//     doc.setTextColor(0, 0, 0);
//     doc.text(`Skin Tone: ${analysisReport.skinTone}`, marginLeft, yPos);
//     yPos += 8;
//     doc.text(`Undertone: ${analysisReport.undertone}`, marginLeft, yPos);
//     yPos += 15;

//     doc.setFont("helvetica", "normal");
//     doc.setFontSize(12);
//     const summaryLines = doc.splitTextToSize(analysisReport.summary, 180);
//     doc.text(summaryLines, marginLeft, yPos);
//     yPos += summaryLines.length * 6 + 10;

//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(14);
//     doc.text("Recommended Color Palette:", marginLeft, yPos);
//     yPos += 10;

//     const boxSize = 10;
//     const gap = 5;
//     displayColors.forEach((color, index) => {
//       const x = marginLeft + (index % 6) * (boxSize + gap);
//       const y = yPos + Math.floor(index / 6) * (boxSize + gap);
//       doc.setFillColor(color);
//       doc.rect(x, y, boxSize, boxSize, "F");
//     });

//     yPos += Math.ceil(displayColors.length / 6) * (boxSize + gap) + 10;
//     doc.setFont("helvetica", "italic");
//     doc.setFontSize(10);
//     doc.text(`Generated on: ${new Date().toLocaleDateString()}`, marginLeft, yPos);

//     doc.save(`Coloryze_Report_${new Date().getTime()}.pdf`);
//   };

//   return (
//     <div className="min-h-screen bg-[#F3E1CF] flex flex-col mt-20">
//       <Navbar />
//       <div className="flex justify-center items-center px-6">
//         <div className="rounded-xl shadow-lg p-10 bg-white/30 backdrop-blur-sm w-[80%] max-w-8xl">
//           <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
//             Analysis Report and Color Palette
//           </h2>

//           <div className="space-y-8">
//             {/* Skin Tone + Undertone */}
//             <div className="grid grid-cols-2 gap-6">
//               <div className="bg-[#B77A54]/50 h-[70px] p-4 rounded-lg flex items-center gap-4">
//                 <h3 className="font-semibold font-poppins text-lg text-gray-700">
//                   Skin Tone:
//                 </h3>
//                 <p className="text-lg text-white font-semibold font-poppins">
//                   {analysisReport.skinTone || "N/A"}
//                 </p>
//               </div>
//               <div className="bg-[#B77A54]/50 h-[70px] p-4 rounded-lg flex items-center gap-4">
//                 <h3 className="font-semibold font-poppins text-lg text-gray-700">
//                   Undertone:
//                 </h3>
//                 <p className="text-lg text-white font-semibold font-poppins">
//                   {analysisReport.undertone || "N/A"}
//                 </p>
//               </div>
//             </div>

//             {/* Detailed Analysis */}
//             <div className="p-4 rounded-lg">
//               <h3 className="font-semibold font-poppins text-2xl text-black mb-2">
//                 Detailed Analysis
//               </h3>
//               <div className="h-[250px] w-8xl overflow-y-auto pr-2 scrollbar scrollbar-thin scrollbar-thumb-[#B77A54] scrollbar-track-transparent rounded-lg">
//                 <p className="text-[#B77A54] text-[18px] font-poppins text-justify leading-relaxed whitespace-pre-line">
//                   {analysisReport.summary || "Your report will appear here after analysis."}
//                 </p>
//               </div>
//             </div>

//             {/* Color Palette */}
//             <div className="bg-white/40 justify-center rounded-xl shadow-md p-6 mt-6 flex gap-10">
//               <h3 className="font-semibold mt-10 text-black text-xl mb-5 font-poppins text-center">
//                 Recommended Color Palette
//               </h3>
//               <div className="space-y-4">
//                 {rows.length > 0 ? (
//                   rows.map((row, rowIndex) => (
//                     <div
//                       key={rowIndex}
//                       className="flex justify-center items-center gap-3"
//                     >
//                       {row.map((color, colorIndex) => (
//                         <div
//                           key={`${rowIndex}-${colorIndex}`}
//                           className="w-14 h-14 rounded-lg shadow-md transition-transform hover:scale-110 relative group"
//                           style={{ backgroundColor: color }}
//                         >
//                           <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-[10px] py-[2px] text-center opacity-0 group-hover:opacity-100 transition-opacity rounded-b-lg">
//                             {color}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   ))
//                 ) : (
//                   <p className="text-gray-500 text-center">No color palette available.</p>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Download PDF Button */}
//           <div className="mt-10 pt-6 border-t-2 border-black/50">
//             <button
//               onClick={downloadReport}
//               className="w-full bg-[#B77A54] text-white text-poppins text-xl py-4 px-8 rounded-lg font-bold transition-all duration-200 shadow-md hover:shadow-lg hover:bg-[#9C6644]"
//             >
//               Download PDF Report
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AnalyzeSkinTone;
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/navbar";
import jsPDF from "jspdf";
import { useLocation } from "react-router-dom";

const AnalyzeSkinTone = () => {
    const location = useLocation();
    const { apiPayload } = location.state || {};

    const [analysisReport, setAnalysisReport] = useState({
        skinTone: "",
        undertone: "",
        summary: "",
    });
    const [displayColors, setDisplayColors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // const fetchLLMReport = async () => {
        //   if (!apiPayload) return;
        //   setLoading(true);

        //   try {
        //     const response = await fetch("http://127.0.0.1:8000/api/generate-report/", {
        //       method: "POST",
        //       headers: { "Content-Type": "application/json" },
        //       body: JSON.stringify({ ai_result: apiPayload }),
        //     });
        //     const data = await response.json();

        //     // Clean the color strings to extract hex codes
        //     const cleanedColors = (data.colors || apiPayload.colors || []).map((c) => {
        //       const match = c.match(/#([0-9A-Fa-f]{6})/);
        //       return match ? match[0] : "#FFFFFF";
        //     });

        //     // Remove ** in summary
        //     const cleanedSummary = (data.summary || apiPayload.summary || "")
        //       .replace(/\*\*/g, "")
        //       .trim();

        //     setAnalysisReport({
        //       skinTone: data.skinTone || apiPayload.skinTone,
        //       undertone: data.undertone || apiPayload.undertone,
        //       summary: cleanedSummary,
        //     });

        //     setDisplayColors(cleanedColors);
        //   } catch (err) {
        //     console.error("Error fetching LLM report:", err);
        //     setAnalysisReport({
        //       skinTone: apiPayload.skinTone,
        //       undertone: apiPayload.undertone,
        //       summary: apiPayload.summary || "Failed to fetch report from backend.",
        //     });
        //     setDisplayColors(
        //       (apiPayload.colors || []).map((c) => {
        //         const match = c.match(/#([0-9A-Fa-f]{6})/);
        //         return match ? match[0] : "#FFFFFF";
        //       })
        //     );
        //   } finally {
        //     setLoading(false);
        //   }
        // };
        const fetchLLMReport = async () => {
            if (!apiPayload) return;
            setLoading(true);

            try {
                const response = await fetch("http://127.0.0.1:8000/api/generate-report/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ai_result: apiPayload }),
                });

                const data = await response.json();

                // Check if the response contains an error
                if (!response.ok) {
                    throw new Error(data.error || `HTTP error! status: ${response.status}`);
                }

                // Clean the color strings to extract hex codes
                const cleanedColors = (data.colors || apiPayload.colors || []).map((c) => {
                    if (typeof c === 'string') {
                        const match = c.match(/#([0-9A-Fa-f]{6})/);
                        return match ? match[0] : "#FFFFFF";
                    }
                    return "#FFFFFF"; // Fallback for non-string values
                });

                // Remove ** in summary
                const cleanedSummary = (data.summary || apiPayload.summary || "")
                    .replace(/\*\*/g, "")
                    .trim();

                setAnalysisReport({
                    skinTone: data.skinTone || apiPayload.skinTone,
                    undertone: data.undertone || apiPayload.undertone,
                    summary: cleanedSummary,
                });

                setDisplayColors(cleanedColors);
            } catch (err) {
                console.error("Error fetching LLM report:", err);
                setAnalysisReport({
                    skinTone: apiPayload.skinTone,
                    undertone: apiPayload.undertone,
                    summary: `Failed to fetch report: ${err.message}. Using basic analysis.`,
                });
                setDisplayColors(
                    (apiPayload.colors || []).map((c) => {
                        if (typeof c === 'string') {
                            const match = c.match(/#([0-9A-Fa-f]{6})/);
                            return match ? match[0] : "#FFFFFF";
                        }
                        return "#FFFFFF";
                    })
                );
            } finally {
                setLoading(false);
            }
        };

        fetchLLMReport();
    }, [apiPayload]);

    const rows = [];
    for (let i = 0; i < displayColors.length; i += 6) {
        rows.push(displayColors.slice(i, i + 6));
    }

    // const downloadReport = () => {
    //     const doc = new jsPDF();
    //     const marginLeft = 15;
    //     let yPos = 20;

    //     doc.setFont("helvetica", "bold");
    //     doc.setFontSize(24);
    //     doc.setTextColor(183, 122, 84);
    //     doc.text("Coloryze", marginLeft, yPos);
    //     yPos += 15;

    //     doc.setFontSize(14);
    //     doc.setTextColor(0, 0, 0);
    //     doc.text(`Skin Tone: ${analysisReport.skinTone}`, marginLeft, yPos);
    //     yPos += 8;
    //     doc.text(`Undertone: ${analysisReport.undertone}`, marginLeft, yPos);
    //     yPos += 15;

    //     doc.setFont("helvetica", "normal");
    //     doc.setFontSize(12);
    //     const summaryLines = doc.splitTextToSize(analysisReport.summary, 180);
    //     doc.text(summaryLines, marginLeft, yPos);
    //     yPos += summaryLines.length * 6 + 10;

    //     doc.setFont("helvetica", "bold");
    //     doc.setFontSize(14);
    //     doc.text("Recommended Color Palette:", marginLeft, yPos);
    //     yPos += 10;

    //     const boxSize = 10;
    //     const gap = 5;
    //     displayColors.forEach((color, index) => {
    //         const x = marginLeft + (index % 6) * (boxSize + gap);
    //         const y = yPos + Math.floor(index / 6) * (boxSize + gap);
    //         doc.setFillColor(color);
    //         doc.rect(x, y, boxSize, boxSize, "F");
    //     });

    //     yPos += Math.ceil(displayColors.length / 6) * (boxSize + gap) + 10;
    //     doc.setFont("helvetica", "italic");
    //     doc.setFontSize(10);
    //     doc.text(`Generated on: ${new Date().toLocaleDateString()}`, marginLeft, yPos);

    //     doc.save(`Coloryze_Report_${new Date().getTime()}.pdf`);
    // };
    const downloadReport = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;
        const marginLeft = 20;
        const marginRight = 20;
        const contentWidth = pageWidth - marginLeft - marginRight;
        let yPos = 25;

        // Helper function to add new page if needed
        const checkPageBreak = (requiredSpace = 50) => {
            if (yPos > doc.internal.pageSize.height - requiredSpace) {
                doc.addPage();
                yPos = 25;
            }
        };

        // Title Section
        doc.setFont("helvetica", "bold");
        doc.setFontSize(28);
        doc.setTextColor(183, 122, 84);
        doc.text("Coloryze", marginLeft, yPos);
        yPos += 12;

        doc.setFontSize(16);
        doc.setTextColor(100, 100, 100);
        doc.text("Personal Color Analysis Report", marginLeft, yPos);
        yPos += 20;

        // Skin Analysis Section
        checkPageBreak(30);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.setTextColor(0, 0, 0);
        doc.text("Skin Analysis", marginLeft, yPos);
        yPos += 12;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.text(`Skin Tone: ${analysisReport.skinTone || "N/A"}`, marginLeft, yPos);
        yPos += 7;
        doc.text(`Undertone: ${analysisReport.undertone || "N/A"}`, marginLeft, yPos);
        yPos += 15;

        // Detailed Analysis Section
        checkPageBreak(100);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.text("Detailed Analysis", marginLeft, yPos);
        yPos += 12;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);

        // Split the summary into paragraphs and handle page breaks
        const summaryParagraphs = analysisReport.summary.split('\n').filter(p => p.trim());

        summaryParagraphs.forEach(paragraph => {
            checkPageBreak(40);

            // Handle very long paragraphs by splitting them
            const lines = doc.splitTextToSize(paragraph, contentWidth);

            lines.forEach((line, index) => {
                checkPageBreak(15);
                doc.text(line, marginLeft, yPos);
                yPos += 6;

                // Add a bit more space after each paragraph
                if (index === lines.length - 1) {
                    yPos += 4;
                }
            });
        });

        yPos += 10;

        // Color Palette Section
        checkPageBreak(100);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.text("Recommended Color Palette", marginLeft, yPos);
        yPos += 15;

        if (displayColors.length > 0) {
            // Color boxes with labels
            const boxSize = 15;
            const gap = 8;
            const colorsPerRow = 5;
            const startX = marginLeft;

            displayColors.forEach((color, index) => {
                const row = Math.floor(index / colorsPerRow);
                const col = index % colorsPerRow;

                // Check if we need a new page for the next row
                if (row > 0 && col === 0) {
                    checkPageBreak(50);
                }

                const x = startX + col * (boxSize + gap + 25); // Extra space for text
                const currentY = yPos + row * (boxSize + gap + 12);

                // Draw color box
                doc.setFillColor(color);
                doc.rect(x, currentY, boxSize, boxSize, "F");

                // Add border to make light colors visible
                doc.setDrawColor(200, 200, 200);
                doc.rect(x, currentY, boxSize, boxSize, "S");

                // Add color hex code
                doc.setFontSize(8);
                doc.setTextColor(0, 0, 0);
                doc.text(color, x, currentY + boxSize + 8);
            });

            // Update yPos after all colors
            const totalRows = Math.ceil(displayColors.length / colorsPerRow);
            yPos += totalRows * (boxSize + gap + 12) + 15;
        } else {
            doc.setFont("helvetica", "italic");
            doc.setFontSize(11);
            doc.setTextColor(150, 150, 150);
            doc.text("No color palette available", marginLeft, yPos);
            yPos += 15;
        }

        // Style Tips Section
        checkPageBreak(80);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.setTextColor(0, 0, 0);
        doc.text("Style Recommendations", marginLeft, yPos);
        yPos += 12;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);

        const styleTips = [
            "• Build your wardrobe around your best colors for a cohesive look",
            "• Use accessories in your recommended metals to complement your undertone",
            "• Experiment with different combinations of your palette colors",
            "• Remember that fit and confidence are as important as color",
            "• Use neutral colors from your palette as foundation pieces"
        ];

        styleTips.forEach(tip => {
            checkPageBreak(15);
            const lines = doc.splitTextToSize(tip, contentWidth);
            lines.forEach(line => {
                doc.text(line, marginLeft, yPos);
                yPos += 6;
            });
            yPos += 2;
        });

        yPos += 10;

        // Footer
        checkPageBreak(20);
        doc.setFont("helvetica", "italic");
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);

        const footerText = `Generated by Coloryze on ${new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}`;

        doc.text(footerText, marginLeft, yPos);
        yPos += 8;

        doc.setFontSize(8);
        doc.text("Discover your perfect colors. Embrace your unique beauty.", marginLeft, yPos);

        // Add page numbers if multiple pages
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text(`Page ${i} of ${pageCount}`, pageWidth - marginRight, doc.internal.pageSize.height - 10);
        }

        doc.save(`Coloryze_Report_${new Date().getTime()}.pdf`);
    };
    return (
        <div className="min-h-screen bg-[#F3E1CF] flex flex-col mt-20">
            <Navbar />
            <div className="flex justify-center items-center px-6">
                <div className="rounded-xl shadow-lg p-10 bg-white/30 backdrop-blur-sm w-[80%] max-w-8xl">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
                        Analysis Report and Color Palette
                    </h2>

                    {loading ? (
                        <p className="text-center text-gray-600 font-poppins text-xl">
                            Generating your personalized color report...
                        </p>
                    ) : (
                        <div className="space-y-8">
                            {/* Skin Tone + Undertone */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-[#B77A54]/50 h-[70px] p-4 rounded-lg flex items-center gap-4">
                                    <h3 className="font-semibold font-poppins text-lg text-gray-700">
                                        Skin Tone:
                                    </h3>
                                    <p className="text-lg text-white font-semibold font-poppins">
                                        {analysisReport.skinTone || "N/A"}
                                    </p>
                                </div>
                                <div className="bg-[#B77A54]/50 h-[70px] p-4 rounded-lg flex items-center gap-4">
                                    <h3 className="font-semibold font-poppins text-lg text-gray-700">
                                        Undertone:
                                    </h3>
                                    <p className="text-lg text-white font-semibold font-poppins">
                                        {analysisReport.undertone || "N/A"}
                                    </p>
                                </div>
                            </div>

                            {/* Detailed Analysis */}
                            <div className="p-4 rounded-lg">
                                <h3 className="font-semibold font-poppins text-2xl text-black mb-2">
                                    Detailed Analysis
                                </h3>
                                <div className="h-[250px] w-full overflow-y-auto pr-2 scrollbar scrollbar-thin scrollbar-thumb-[#B77A54] scrollbar-track-transparent rounded-lg">
                                    <p className="text-black text-[18px] font-poppins text-justify leading-relaxed whitespace-pre-line">
                                        {analysisReport.summary || "No report available."}
                                    </p>
                                </div>
                            </div>

                            {/* Color Palette */}
                            <div className="bg-white/40 justify-center rounded-xl shadow-md p-6 mt-6 flex flex-col gap-6">
                                <h3 className="font-semibold text-black text-xl mb-5 font-poppins text-center">
                                    Recommended Color Palette
                                </h3>
                                {rows.length > 0 ? (
                                    rows.map((row, rowIndex) => (
                                        <div key={rowIndex} className="flex justify-center items-center gap-3">
                                            {row.map((color, colorIndex) => (
                                                <div
                                                    key={`${rowIndex}-${colorIndex}`}
                                                    className="w-14 h-14 rounded-lg shadow-md transition-transform hover:scale-110 relative group"
                                                    style={{ backgroundColor: color }}
                                                >
                                                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-[10px] py-[2px] text-center opacity-0 group-hover:opacity-100 transition-opacity rounded-b-lg">
                                                        {color}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-center">No color palette available.</p>
                                )}
                            </div>

                            {/* Download PDF Button */}
                            <div className="mt-10 pt-6 border-t-2 border-black/50">
                                <button
                                    onClick={downloadReport}
                                    className="w-full bg-[#B77A54] text-white text-poppins text-xl py-4 px-8 rounded-lg font-bold transition-all duration-200 shadow-md hover:shadow-lg hover:bg-[#9C6644]"
                                >
                                    Download PDF Report
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnalyzeSkinTone;
