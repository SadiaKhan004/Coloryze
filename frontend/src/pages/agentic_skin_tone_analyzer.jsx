
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProgressModal from "../components/progess_modal";
import UploadSection from "../components/upload_section";
import ResultCard from "../components/ResultCard";
import ReportSection from "../components/ReportSection";
import OutfitRecommendations from "../components/OutfitRecommendations";
import AnalysisToggles from "../components/anaylsis_toggle";
import { useInView } from "react-intersection-observer";

const AgenticSkinToneAnalysis = () => {
  const [aiResult, setAiResult] = useState(null);
  const [backendResponse, setBackendResponse] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const [progress, setProgress] = useState(0);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [outfitLoading, setOutfitLoading] = useState(false);

  const [analyzeSkinTone, setAnalyzeSkinTone] = useState(true);
  const [getReport, setGetReport] = useState(false);
  const [getOutfitRecs, setGetOutfitRecs] = useState(false);

  // Intersection observer for ReportSection
  const [reportRef, reportInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [outfitRef, outfitInView] = useInView({ triggerOnce: true, threshold: 0.2 });

  const monk_hex = {
    1: "#f7ede4", 2: "#f3e7da", 3: "#f6ead0", 4: "#ead9bb", 5: "#d7bd96",
    6: "#9f7d54", 7: "#815d44", 8: "#604234", 9: "#3a312a", 10: "#2a2420",
  };

  const simulateProgress = (to, duration = 1600) => {
    const steps = 20;
    const inc = (to - progress) / steps;
    let cur = progress;
    const id = setInterval(() => {
      cur += inc;
      setProgress(Math.min(cur, to));
      if (cur >= to - 0.01) clearInterval(id);
    }, duration / steps);
    return id;
  };

  const sendImageToBackendStreaming = async (file) => {
  if (!file) return;

  setShowProgressModal(true);
  setProgress(0);
  setAiResult(null);
  setBackendResponse({});
  setReportLoading(false);
  setOutfitLoading(false);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("generate_report", getReport ? "true" : "false");
  formData.append("outfit_recommendations", getOutfitRecs ? "true" : "false");

  const token = localStorage.getItem("token");
  if (!token) {
    alert("Session expired. Redirecting to login...");
    window.location.href = "/login";
    return;
  }

  try {
    simulateProgress(30, 800);

    const res = await fetch("http://127.0.0.1:8000/api/automated-analysis-stream/", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = ""; // accumulate partial data
    let partialResponse = {};

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      let boundary;
      while ((boundary = buffer.indexOf("\n")) >= 0) {
        const jsonLine = buffer.slice(0, boundary).trim();
        buffer = buffer.slice(boundary + 1);
        if (!jsonLine) continue;

        try {
          const data = JSON.parse(jsonLine);

          // --- Handle AI result stage ---
          if (data.stage === "ai_result") {
            setAiResult(data.ai_result);
            setShowProgressModal(false);
            setProgress(100);
            if (getReport) setReportLoading(true);
            if (getOutfitRecs) setOutfitLoading(true);

          // --- Handle report stage ---
          } else if (data.stage === "report") {
            partialResponse = { ...partialResponse, ...data };
            setBackendResponse(partialResponse);
            setTimeout(() => setReportLoading(false), 300);

          // --- Handle outfit recommendations stage ---
          } else if (data.stage === "outfit_recommendations") {
            partialResponse = {
              ...partialResponse,
              outfit_recommendations: data.outfit_recommendations,
            };
            setBackendResponse(partialResponse);
            setTimeout(() => setOutfitLoading(false), 300);

          // --- Handle errors ---
          } else if (data.stage === "error") {
            console.error(data.message);
            setShowProgressModal(false);
            setReportLoading(false);
            setOutfitLoading(false);
          }
        } catch (err) {
          // Incomplete JSON (split across chunks) → wait for next part
          break;
        }
      }
    }

  } catch (err) {
    console.error("Error:", err);
    setShowProgressModal(false);
    setReportLoading(false);
    setOutfitLoading(false);
  }
};


  const handleImageUpload = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setSelectedImage(e.target.result);
    reader.readAsDataURL(file);
    sendImageToBackendStreaming(file);
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center bg-gradient-to-b from-[#E8F5FF] via-[#F6FBFF] to-[#E2F1FF]">

      {/* Background blobs */}
      <motion.div
        className="absolute w-[500px] h-[500px] bg-gradient-to-br from-[#0077B6] via-[#00B4D8] to-[#90E0EF] rounded-full blur-3xl opacity-40 top-[-150px] right-[-150px] -z-10"
        animate={{ y: [0, 25, 0], opacity: [0.4, 0.6, 0.4] }}
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] bg-gradient-to-bl from-[#8FD9FF] via-[#CAF0F8] to-[#ADE8F4] rounded-full blur-3xl opacity-50 bottom-[-120px] left-[-100px] -z-10"
        animate={{ y: [0, -30, 0], opacity: [0.3, 0.5, 0.3] }}
        transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
      />

      {/* Main AI progress modal */}
      <ProgressModal show={showProgressModal} progress={progress} />

      {/* Corner loader for report */}
      {/* Corner loader for report */}
      {reportLoading && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-[#90E0EF] via-[#48CAE4] to-[#00B4D8] rounded-xl shadow-lg flex items-center space-x-3">
          <div className="w-6 h-6 border-4 border-t-white border-blue-200 rounded-full animate-spin"></div>
          <span className="text-md md:text-base font-semibold text-white">Generating report...</span>
        </div>
      )}

      {/* Corner loader for outfits */}
      {outfitLoading && (
        <div className="fixed bottom-20 right-6 z-50 p-4 bg-gradient-to-r from-[#FFD6A5] via-[#FFB100] to-[#FF9F1C] rounded-xl shadow-lg flex items-center space-x-3">
          <div className="w-6 h-6 border-4 border-t-white border-yellow-300 rounded-full animate-spin"></div>
          <span className="text-2sm md:text-base font-semibold text-white">Fetching outfit recommendations...</span>
        </div>
      )}


      {/* Toggles */}
      <div className="absolute top-6 right-8 z-50">
        <AnalysisToggles
          analyzeSkinTone={analyzeSkinTone} setAnalyzeSkinTone={setAnalyzeSkinTone}
          getReport={getReport} setGetReport={setGetReport}
          getOutfitRecs={getOutfitRecs} setGetOutfitRecs={setGetOutfitRecs}
        />
      </div>

      {/* Slogan */}
      <AnimatePresence>
        {!selectedImage && !showProgressModal && (
          <motion.h1
            key="slogan"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 1 }}
            className="mb-10 text-center mt-32 max-w-3xl text-3xl md:text-5xl font-semibold font-abril tracking-widest leading-loose text-transparent bg-clip-text bg-gradient-to-r from-[#9b6ef3] via-[#e65ba0] to-[#50b8e7]"
          >
            Discover your perfect colors through COLORYZE
          </motion.h1>

        )}
      </AnimatePresence>

      {/* Upload / Result Section */}
      {/* {!selectedImage && !showProgressModal ? (
        <UploadSection onFileSelect={handleImageUpload} isDragging={isDragging} setIsDragging={setIsDragging} />
      ) : (
        <motion.div className="flex flex-col items-center justify-center w-full h-full px-6 mt-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          <ResultCard aiResult={aiResult} selectedImage={selectedImage} monk_hex={monk_hex} />
          <ReportSection {...backendResponse} />
          <OutfitRecommendations outfits={backendResponse?.outfit_recommendations} />
        </motion.div>
      )} */}
      {!selectedImage && !showProgressModal ? (
        <UploadSection onFileSelect={handleImageUpload} isDragging={isDragging} setIsDragging={setIsDragging} />
      ) : (
        <motion.div className="flex flex-col items-center justify-center w-full h-full px-6 mt-10">
          {/* Result Card */}
          <ResultCard aiResult={aiResult} selectedImage={selectedImage} monk_hex={monk_hex} />

          {/* Report Section with scroll animation */}
          <motion.div
            ref={reportRef}
            initial={{ opacity: 0, y: 50 }}
            animate={reportInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full mt-28"
          >
            <ReportSection {...backendResponse} />
          </motion.div>

          {/* Outfit Recommendations with scroll animation */}
          <motion.div
            ref={outfitRef}
            initial={{ opacity: 0, y: 50 }}
            animate={outfitInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="w-full mt-20"
          >
            <OutfitRecommendations outfits={backendResponse?.outfit_recommendations} />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default AgenticSkinToneAnalysis;
