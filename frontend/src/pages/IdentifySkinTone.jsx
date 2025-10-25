
// ================== actual working code
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/navbar";
import { useNavigate } from "react-router-dom";

const IdentifySkinTone = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [aiResult, setAiResult] = useState(null);

  // Monk Skin Tone HEX mapping
  const monk_hex = {
    1: "#f7ede4",
    2: "#f3e7da",
    3: "#f6ead0",
    4: "#ead9bb",
    5: "#d7bd96",
    6: "#9f7d54",
    7: "#815d44",
    8: "#604234",
    9: "#3a312a",
    10: "#2a2420"
  };

  const sendImageToBackend = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      setUploadStatus("Uploading...");
      const uploadResponse = await fetch("http://127.0.0.1:8000/api/upload-image/", {
        method: "POST",
        body: formData,
      });
      if (!uploadResponse.ok) throw new Error("Upload failed");
      const uploadData = await uploadResponse.json();
      setUploadStatus("Image uploaded successfully");
      if (uploadData.result) setAiResult(uploadData.result);
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadStatus("Upload failed");
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setSelectedImage(e.target.result);
      reader.readAsDataURL(file);
      sendImageToBackend(file);
    }
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setSelectedImage(e.target.result);
      reader.readAsDataURL(file);
      sendImageToBackend(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setAiResult(null);
    setUploadStatus("");
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    visible: (delay = 0) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 1.2, delay, ease: "easeOut" },
    }),
    float: { y: [0, -10, 0], transition: { duration: 4, repeat: Infinity, ease: "easeInOut" } },
  };

  return (
    <div className="min-h-screen w-screen absolute left-0 top-0 overflow-x-hidden overflow-y-auto bg-[#F3E1CF] pb-10">

      <Navbar />
      {/* Decorative Animated Images */}
      <div className="relative w-full max-w-3xl mx-auto h-[420px] top-20">
        <motion.img src="/color-analysis1.jpg" alt="Image 1"
          className="absolute w-[250px] h-[250px] shadow-xl transform rotate-6 top-16 left-10 z-30 object-cover rounded-xl"
          variants={imageVariants} initial="hidden" animate={["visible", "float"]} custom={0.2} />
        <motion.img src="/color-analysis2.jpg" alt="Image 2"
          className="absolute w-[250px] h-[250px] shadow-xl transform -rotate-6 top-9 left-[290px] z-20 object-cover rounded-xl"
          variants={imageVariants} initial="hidden" animate={["visible", "float"]} custom={0.4} />
        <motion.img src="/color-analyzer3.jpg" alt="Image 3"
          className="absolute w-[250px] h-[250px] shadow-xl transform rotate-6 top-20 left-[520px] z-10 object-cover rounded-xl"
          variants={imageVariants} initial="hidden" animate={["visible", "float"]} custom={0.6} />
      </div>
      <div className="absolute inset-0 bg-black/10"></div>

      {/* Header */}
      <div className="relative z-10 bg-gradient-to-r from-[#FAE8D4]/60 to-[#CFA57E] p-6 text-white max-w-4xl mx-auto rounded-2xl shadow-xl">
        <h1 className="text-3xl tracking-wider text-[#2E2B29] font-bold mb-2 font-abril">
          Let's find your perfect match!
        </h1>
        <p className="text-[#2E2B29] text-lg font-poppins font-semibold">
          Discover your color season in seconds and unlock style choices that amplify your natural beauty.
        </p>
      </div>

      {/* Main */}
      <div className="relative z-10 p-4">
        <div className="mb-8 max-w-4xl h-[340px] mx-auto rounded-2xl shadow-xl p-8 bg-[#FAE8D4]/50 border-2 border-dashed text-center transition-all duration-300">
          <AnimatePresence mode="wait">
            {!aiResult ? (
              // Upload Section
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`transition-all duration-300 ${isDragging
                  ? "border-blue-500 bg-blue-50"
                  : selectedImage
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                  }`}
              >
                <div className="space-y-4 relative z-20">
                  <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-2xl font-poppins font-semibold text-gray-800 mb-2">
                    Drop your image here or click to browse
                  </p>
                  <p className="text-gray-600 font-poppins text-lg">Supports JPG, PNG, WEBP - Max 5MB</p>
                  <label className="inline-block bg-[#CFA57E] text-black/90 font-poppins font-semibold text-xl tracking-wide px-6 py-3 rounded-lg cursor-pointer hover:bg-[#B8916B] transition-colors relative z-30">
                    Choose File
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                  {uploadStatus && <p className="text-black mt-4 font-poppins">{uploadStatus}</p>}
                </div>
              </motion.div>
            ) : (
              // Results Section
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="flex flex-col items-center justify-center space-y-6"
              >
                {selectedImage && (
                  <div className="relative -left-72 top-5">
                    <img src={selectedImage} alt="Uploaded"
                      className="w-40 h-40 rounded-lg shadow-lg object-cover mx-auto" />
                    <button
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-[#FAE8D4] text-black font-bold text-xl rounded-full w-8 h-8 flex items-center justify-center hover:bg-white transition-colors z-30"
                    >
                      ×
                    </button>
                  </div>
                )}

                {aiResult && (
                  <div className="relative -top-52 left-32 mt-10 p-6 bg-white/80 rounded-2xl shadow-md w-[500px] text-left pl-10">
                    <h2 className="font-bold text-gray-900 text-xl mb-4 font-poppins">
                      AI Analysis Result
                    </h2>

                    {/* SKIN TONE */}
                    <p className="text-gray-800 font-poppins text-lg mb-1">
                      <strong>Skin Tone:</strong> {aiResult.skin_tone} — {aiResult.descriptor}
                    </p>
                    <div className="flex">
                      <div>
                        <p className="text-gray-700 font-poppins text-md mb-1">
                          <strong>Tone Group:</strong> {aiResult.tone_group}
                        </p>

                        {/* UNDERTONE */}
                        <p className="text-gray-700 font-poppins text-md mb-2">
                          <strong>Undertone:</strong> {aiResult.undertone}
                        </p>

                        {/* EYES & HAIR */}
                        <p className="text-gray-700 font-poppins text-md mb-1">
                          <strong>Eye Color:</strong> {Array.isArray(aiResult.eye_color) ? aiResult.eye_color.join(" and ") : aiResult.eye_color}
                        </p>
                        <p className="text-gray-700 font-poppins text-md mb-4">
                          <strong>Hair Color:</strong> {aiResult.hair_color}
                        </p>
                      </div>

                      {/* Skin tone swatch */}
                      <div
                        className="w-24 h-24 rounded-full mx-auto border-4 border-gray-300 shadow-inner mt-5 mr-5"
                        style={{
                          backgroundColor: monk_hex[
                            parseInt(aiResult.skin_tone.replace("MST ", ""))
                          ],
                        }}
                      ></div>

                    </div>
                    <p className="text-gray-600 italic font-poppins mt-2">
                      This tone represents your skin’s undertone — use it to find colors that truly complement your look.
                    </p>
                  </div>
                )}

                <div className="relative -top-72 -left-72">
                  {/* <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gray-900 text-white rounded-lg px-6 py-3 font-abril text-xl hover:bg-[#CFA57E] transition-all"
                  >
                    Get your color palette
                  </motion.button> */}
                  {/* <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gray-900 text-white rounded-lg px-6 py-3 font-abril text-xl hover:bg-[#CFA57E] transition-all"
                    onClick={async () => {
                      if (!aiResult) return alert("No AI result available yet!");
                      try {
                        const response = await fetch("http://127.0.0.1:8000/api/generate-report/", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ ai_result: aiResult }),
                        });
                        const data = await response.json();
                        console.log("LLM Color Analysis Report:", data.report);
                        alert("Check console for generated color analysis report!");
                      } catch (err) {
                        console.error("Error generating report:", err);
                      }
                    }}
                  >
                    Get your color palette
                  </motion.button> */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gray-900 text-white rounded-lg px-6 py-3 font-abril text-xl hover:bg-[#CFA57E] transition-all"
                    onClick={async () => {
                      if (!aiResult) return alert("No AI result available yet!");

                      try {
                        // Call backend to generate report
                        const response = await fetch("http://127.0.0.1:8000/api/generate-report/", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ ai_result: aiResult }),
                        });
                        const data = await response.json();
                        data.report = data.summary;  // alias
                        console.log("LLM Color Analysis Report:", data.report);


                        // Navigate to AnalyzeSkinTone page with aiResult
                        navigate("/analyze-skin-tone", { state: { apiPayload: aiResult } });
                      } catch (err) {
                        console.error("Error generating report:", err);
                        alert("Failed to generate report. Please try again.");
                      }
                    }}
                  >
                    Get your color palette
                  </motion.button>


                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default IdentifySkinTone;
