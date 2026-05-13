
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/navbar";
import jsPDF from "jspdf";
import { useLocation } from "react-router-dom";

const AnalyzeSkinTone = () => {
    const location = useLocation();
    // const { apiPayload } = location.state || {};
    const { apiPayload, backendResponse } = location.state || {};
    const [analysisReport, setAnalysisReport] = useState({
        skinTone: "",
        undertone: "",
        summary: "",
    });
    const [displayColors, setDisplayColors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [recommendedPalette, setRecommendedPalette] = useState({
        main_colors: [],
        neutrals: [],
        metallics: []
    });
    useEffect(() => {
    if (!apiPayload) return;

    // ✅ If we already have the full backend response, use it directly
    if (backendResponse) {
        console.log("Using passed backend response:", backendResponse);

        const finalReport = backendResponse.final_report || "";
        const palette = backendResponse.recommended_palette || {
        main_colors: [],
        neutrals: [],
        metallics: []
        };

        const allColors = [
        ...(palette.main_colors || []),
        ...(palette.neutrals || []),
        ...(palette.metallics || [])
        ].map(c => c.hex).filter(Boolean);

        const skinTone = apiPayload.skin_tone || "Unknown";
        const undertone = apiPayload.undertone || "Unknown";

        const cleanedReport = finalReport
        .replace(/\*\*/g, "")
        .replace(/#{1,6}\s?/g, "")
        .trim();

        setAnalysisReport({
        skinTone,
        undertone,
        summary: cleanedReport,
        });
        setDisplayColors(allColors);
        setRecommendedPalette(palette);
        setLoading(false);
    } else {
        // ✅ Otherwise fallback to fetching it (optional backup)
        const fetchLLMReport = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://127.0.0.1:8000/api/generate-report/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ai_result: apiPayload }),
            });
            const data = await res.json();
            console.log("Fetched report:", data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
        };
        fetchLLMReport();
    }
    }, [apiPayload, backendResponse]);

    // Create rows for color display (6 colors per row)
    const rows = [];
    for (let i = 0; i < displayColors.length; i += 6) {
        rows.push(displayColors.slice(i, i + 6));
    }


const downloadReport = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const marginLeft = 20;
    const marginRight = 20;
    const contentWidth = pageWidth - marginLeft - marginRight;
    let yPos = 30;

    // ==================== HELPERS ====================
    const checkPageBreak = (neededHeight = 40) => {
        if (yPos > pageHeight - neededHeight) {
            doc.addPage();
            addHeaderFooter();
            yPos = 30;
        }
    };

    const addMainHeading = (title) => {
        checkPageBreak(40);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(20);
        doc.setTextColor(183, 122, 84);
        doc.text(title, marginLeft, yPos);
        yPos += 8;
        doc.setDrawColor(183, 122, 84);
        doc.line(marginLeft, yPos, pageWidth - marginRight, yPos);
        yPos += 12;
    };

    const addSubHeading = (title) => {
        checkPageBreak(30);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(90, 90, 90);
        doc.text(title, marginLeft, yPos);
        yPos += 10;
    };

    const addParagraph = (text) => {
        checkPageBreak(20);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.setTextColor(50, 50, 50);

        if (text.includes('•')) {
            // Treat as bullet list
            const items = text.split(/• /).filter(item => item.trim());
            items.forEach((item) => {
                checkPageBreak(15);
                const lines = doc.splitTextToSize(`• ${item.trim()}`, contentWidth);
                lines.forEach((line, lineIndex) => {
                    checkPageBreak(15);
                    const isLastLine = lineIndex === lines.length - 1;
                    if (!isLastLine && line.trim().length > 10) {
                        doc.text(line, marginLeft, yPos, { align: "justify", maxWidth: contentWidth });
                    } else {
                        doc.text(line, marginLeft, yPos);
                    }
                    yPos += 7;
                });
            });
            yPos += 4; // Reduced space after list
        } else if (text.match(/(\d+\. )/g)?.length > 1) {
            // Treat as numbered list
            const parts = text.split(/(\d+\. )/).filter(part => part.trim());
            for (let i = 0; i < parts.length; i += 2) {
                const num = parts[i];
                const content = parts[i + 1] || '';
                if (num) {
                    checkPageBreak(15);
                    const itemText = `${num}${content.trim()}`;
                    const lines = doc.splitTextToSize(itemText, contentWidth);
                    lines.forEach((line, lineIndex) => {
                        checkPageBreak(15);
                        const isLastLine = lineIndex === lines.length - 1;
                        const xOffset = (lineIndex > 0) ? marginLeft + 10 : marginLeft; // Indent wrapped lines
                        if (!isLastLine && line.trim().length > 10) {
                            doc.text(line, xOffset, yPos, { align: "justify", maxWidth: contentWidth - (lineIndex > 0 ? 10 : 0) });
                        } else {
                            doc.text(line, xOffset, yPos);
                        }
                        yPos += 7;
                    });
                }
            }
            yPos += 4; // Reduced space after list
        } else {
            // Normal paragraph
            const lines = doc.splitTextToSize(text, contentWidth);
            lines.forEach((line, lineIndex) => {
                checkPageBreak(15);
                const isLastLine = lineIndex === lines.length - 1;
                if (!isLastLine && line.trim().length > 10) {
                    doc.text(line, marginLeft, yPos, { align: "justify", maxWidth: contentWidth });
                } else {
                    doc.text(line, marginLeft, yPos);
                }
                yPos += 7;
            });
        }
        yPos += 10; // Space after paragraph or list
    };

    const addDivider = () => {
        doc.setDrawColor(210, 210, 210);
        doc.line(marginLeft, yPos, pageWidth - marginRight, yPos);
        yPos += 10;
    };

    const addHeaderFooter = () => {
        const pageCount = doc.internal.getNumberOfPages();
        const currentPage = doc.internal.getCurrentPageInfo().pageNumber;
        // Header
        doc.setFont("helvetica", "italic");
        doc.setFontSize(9);
        doc.setTextColor(130, 130, 130);
        doc.text("Coloryze – Personal Color Report", marginLeft, 10);
        // Footer
        doc.text(`Page ${currentPage} of ${pageCount}`, pageWidth - marginRight - 20, pageHeight - 10);
    };

    const isHeadingLike = (text) => {
        const smallWords = ['and', 'or', 'of', 'the', 'a', 'an', 'to', 'for', 'in', 'with', 'by', 'as', 'on', 'at', 'from'];
        const words = text.trim().split(/\s+/).filter(w => w && !/^[,:!?-]+$/.test(w));
        return words.every(word => /^[A-Z0-9]/.test(word) || smallWords.includes(word.toLowerCase()));
    };

    // ==================== COVER PAGE ====================
    doc.setFont("helvetica", "bold");
    doc.setFontSize(36);
    doc.setTextColor(183, 122, 84);
    doc.text("Coloryze", pageWidth / 2, 80, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(18);
    doc.setTextColor(80, 80, 80);
    doc.text("Personal Color Analysis Report", pageWidth / 2, 100, { align: "center" });

    doc.setFont("helvetica", "italic");
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on ${new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    })}`, pageWidth / 2, 115, { align: "center" });

    doc.setFont("helvetica", "italic");
    doc.setTextColor(120, 120, 120);
    doc.text("Discover your perfect colors — embrace your unique beauty", pageWidth / 2, 130, { align: "center" });

    doc.addPage();
    addHeaderFooter();

    // ==================== SECTION 1: SKIN ANALYSIS ====================
    addMainHeading("Skin Analysis");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    doc.text(`Skin Tone: ${analysisReport.skinTone || "N/A"}`, marginLeft, yPos);
    yPos += 7;
    doc.text(`Undertone: ${analysisReport.undertone || "N/A"}`, marginLeft, yPos);
    yPos += 15;
    addDivider();

    // ==================== SECTION 2: DETAILED ANALYSIS ====================
    addMainHeading("Detailed Analysis");

    if (analysisReport.summary) {
        // Clean and properly split the summary into paragraphs
        const cleanSummary = analysisReport.summary
            .replace(/\*\*/g, "") // Remove bold markers
            .replace(/\*/g, "")   // Remove italic markers  
            .replace(/#{1,6}\s?/g, "") // Remove headers
            .replace(/�/g, "")    // Remove zero-width or artifact characters
            .replace(/Ø[^ ]{1,5} ?/g, "") // Remove strange end-of-paragraph artifacts
            .replace(/–/g, "-")   // Normalize dashes
            .replace(/\s+/g, " ") // Normalize spaces
            .trim();

        // Manual paragraph splitting based on the content structure
        const paragraphPatterns = [
            // Split at major section transitions
            /(?=Welcome to Your Color Journey)/,
            /(?=Your Color Profile Overview)/,
            /(?=Skin Tone Analysis)/,
            /(?=Undertone Discovery)/,
            /(?=What Are Undertones\?)/,
            /(?=What Warm Undertones Mean for You)/,
            /(?=Complete Feature Analysis)/,
            /(?=Your Color Season)/,
            /(?=You Are a Spring-Autumn Crossover)/,
            /(?=Season Characteristics)/,
            /(?=Your Perfect Color Palette)/,
            /(?=Colors to Approach with Caution)/,
            /(?=Remember)/,
            /(?=Styling Tips & Recommendations)/,
            /(?=Everyday Wear)/,
            /(?=Professional & Formal)/,
            /(?=Accessories & Details)/,
            /(?=Makeup & Personal Grooming)/,
            /(?=Smart Shopping Guide)/,
            /(?=Your Color Confidence)/
        ];

        let paragraphs = [cleanSummary];
        
        // Apply all splitting patterns
        paragraphPatterns.forEach(pattern => {
            let newParagraphs = [];
            paragraphs.forEach(para => {
                const split = para.split(pattern);
                newParagraphs = newParagraphs.concat(split.filter(p => p.trim()));
            });
            paragraphs = newParagraphs;
        });

        // Further split long paragraphs and detect headings
        const finalParagraphs = [];
        paragraphs.forEach(para => {
            const sentences = para.split(/(?<=[.!?])\s+(?=[A-Z])/);
            let currentParagraph = '';
            
            sentences.forEach(sentence => {
                if ((currentParagraph + sentence).length < 300) {
                    currentParagraph += (currentParagraph ? ' ' : '') + sentence;
                } else {
                    if (currentParagraph) finalParagraphs.push(currentParagraph);
                    currentParagraph = sentence;
                }
            });
            
            if (currentParagraph) finalParagraphs.push(currentParagraph);
        });

        // Render all paragraphs
        finalParagraphs.forEach(paragraph => {
            if (paragraph.trim()) {
                const words = paragraph.split(/\s+/).filter(w => w);
                let potentialHeading = '';
                for (let i = 0; i < words.length; i++) {
                    const newWord = words[i];
                    if (potentialHeading && /[.:!?]$/.test(potentialHeading) && /^[A-Z]/.test(newWord)) {
                        break;
                    }
                    const testHeading = potentialHeading ? potentialHeading + ' ' + newWord : newWord;
                    if (isHeadingLike(testHeading)) {
                        potentialHeading = testHeading;
                    } else {
                        break;
                    }
                }
                const content = paragraph.substring(potentialHeading.length).trim();
                if (potentialHeading && potentialHeading.length > 10 && content) {
                    addSubHeading(potentialHeading);
                    if (content) {
                        addParagraph(content);
                    }
                } else {
                    addParagraph(paragraph.trim());
                }
            }
        });

    } else {
        addParagraph("No detailed analysis available.");
    }

    addDivider();

    // ==================== SECTION 3: RECOMMENDED COLOR PALETTE ====================
    addMainHeading("Recommended Color Palette");

    const renderColorSection = (title, colors) => {
        if (!colors || colors.length === 0) return;
        addSubHeading(title);

        const boxSize = 25;
        const gap = 20;
        const colorsPerRow = 5;
        const rowWidth = (colorsPerRow * (boxSize + gap)) - gap;
        const startX = (pageWidth - rowWidth) / 2;

        colors.forEach((color, index) => {
            checkPageBreak(boxSize + 20);
            const rowIndex = Math.floor(index / colorsPerRow);
            const colIndex = index % colorsPerRow;
            const x = startX + colIndex * (boxSize + gap);
            const y = yPos + rowIndex * (boxSize + 15);

            // Color box
            doc.setFillColor(color.hex);
            doc.roundedRect(x, y, boxSize, boxSize, 3, 3, "F");

            // Border
            doc.setDrawColor(150, 150, 150);
            doc.roundedRect(x, y, boxSize, boxSize, 3, 3, "S");

            // Label
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(50, 50, 50);
            doc.text(color.name || color.hex, x + boxSize / 2, y + boxSize + 10, { align: "center" });
        });

        const rowsUsed = Math.ceil(colors.length / colorsPerRow);
        yPos += rowsUsed * (boxSize + 15) + 15;
    };

    renderColorSection("Main Colors", recommendedPalette.main_colors);
    renderColorSection("Neutral Colors", recommendedPalette.neutrals);
    renderColorSection("Metallic & Accent Colors", recommendedPalette.metallics);
    addDivider();

    // ==================== SECTION 4: STYLE RECOMMENDATIONS ====================
    addMainHeading("Style Recommendations");
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(50, 50, 50);
    
    const tips = [
        "Build your wardrobe around your best colors for a cohesive look.",
        "Use accessories in your recommended metals to enhance your undertone.",
        "Experiment with shades from your palette to express personality.",
        "Confidence and fit matter as much as color.",
        "Use neutral colors as foundation pieces in your outfits."
    ];
    
    tips.forEach(tip => {
        checkPageBreak(15);
        addParagraph(`• ${tip}`);
    });

    addDivider();

    // ==================== FOOTER & SAVE ====================
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text("Generated by Coloryze AI • Empowering self-expression through color", marginLeft, yPos + 10);

    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        addHeaderFooter();
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
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center text-gray-600 font-poppins text-xl"
                        >
                            <p>Generating your personalized color report...</p>
                            <p className="text-sm mt-2">This may take a few moments</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="space-y-8"
                        >
                            {/* Skin Tone + Undertone */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            <div className="p-6 rounded-lg bg-white/40">
                                <h3 className="font-semibold font-poppins text-2xl text-black mb-4">
                                    Detailed Analysis
                                </h3>
                                <div className="h-[250px] w-full overflow-y-auto pr-2 scrollbar scrollbar-thin scrollbar-thumb-[#B77A54] scrollbar-track-transparent rounded-lg">
                                    <p className="text-black text-[16px] font-poppins text-justify leading-relaxed whitespace-pre-line">
                                        {analysisReport.summary || "No report available."}
                                    </p>
                                </div>
                            </div>

                            {/* Color Palette */}
                            <div className="bg-white/40 rounded-xl shadow-md p-6">
                                <h3 className="font-semibold text-black text-xl mb-6 font-poppins text-center">
                                    Recommended Color Palette
                                </h3>
                                
                                {/* Main Colors */}
                                {recommendedPalette.main_colors && recommendedPalette.main_colors.length > 0 && (
                                    <div className="mb-6">
                                        <h4 className="font-semibold text-lg text-gray-800 mb-3">Main Colors</h4>
                                        <div className="flex flex-wrap justify-center gap-3">
                                            {recommendedPalette.main_colors.map((color, index) => (
                                                <div key={index} className="text-center">
                                                    <div
                                                        className="w-14 h-14 rounded-lg shadow-md transition-transform hover:scale-110 relative group"
                                                        style={{ backgroundColor: color.hex }}
                                                    >
                                                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-[10px] py-[2px] text-center opacity-0 group-hover:opacity-100 transition-opacity rounded-b-lg">
                                                            {color.hex}
                                                        </div>
                                                    </div>
                                                    <p className="text-xs mt-1 text-gray-700">{color.name}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Neutrals */}
                                {recommendedPalette.neutrals && recommendedPalette.neutrals.length > 0 && (
                                    <div className="mb-6">
                                        <h4 className="font-semibold text-lg text-gray-800 mb-3">Neutral Colors</h4>
                                        <div className="flex flex-wrap justify-center gap-3">
                                            {recommendedPalette.neutrals.map((color, index) => (
                                                <div key={index} className="text-center">
                                                    <div
                                                        className="w-14 h-14 rounded-lg shadow-md transition-transform hover:scale-110 relative group"
                                                        style={{ backgroundColor: color.hex }}
                                                    >
                                                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-[10px] py-[2px] text-center opacity-0 group-hover:opacity-100 transition-opacity rounded-b-lg">
                                                            {color.hex}
                                                        </div>
                                                    </div>
                                                    <p className="text-xs mt-1 text-gray-700">{color.name}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Metallics */}
                                {recommendedPalette.metallics && recommendedPalette.metallics.length > 0 && (
                                    <div className="mb-6">
                                        <h4 className="font-semibold text-lg text-gray-800 mb-3">Metallic & Accent Colors</h4>
                                        <div className="flex flex-wrap justify-center gap-3">
                                            {recommendedPalette.metallics.map((color, index) => (
                                                <div key={index} className="text-center">
                                                    <div
                                                        className="w-14 h-14 rounded-lg shadow-md transition-transform hover:scale-110 relative group"
                                                        style={{ backgroundColor: color.hex }}
                                                    >
                                                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-[10px] py-[2px] text-center opacity-0 group-hover:opacity-100 transition-opacity rounded-b-lg">
                                                            {color.hex}
                                                        </div>
                                                    </div>
                                                    <p className="text-xs mt-1 text-gray-700">{color.name}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Fallback display if structured palette is empty but displayColors has data */}
                                {displayColors.length > 0 && 
                                 (!recommendedPalette.main_colors || recommendedPalette.main_colors.length === 0) && (
                                    <div className="flex flex-wrap justify-center gap-3">
                                        {displayColors.map((color, index) => (
                                            <div
                                                key={index}
                                                className="w-14 h-14 rounded-lg shadow-md transition-transform hover:scale-110 relative group"
                                                style={{ backgroundColor: color }}
                                            >
                                                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-[10px] py-[2px] text-center opacity-0 group-hover:opacity-100 transition-opacity rounded-b-lg">
                                                    {color}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {displayColors.length === 0 && (
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
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnalyzeSkinTone;

