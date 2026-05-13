
import { useState } from "react";
import { signup } from "../api/auth";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await signup({ username, email, password, age, gender });
      setMessage("Signup successful! You can login now.");
      setTimeout(() => navigate("/login"), 1500); // auto redirect after signup
    } catch (err) {
      setMessage(err.response?.data?.detail || "Error signing up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#E8F5FF] via-[#F6FBFF] to-[#E2F1FF] overflow-hidden">
      {/* Top Right Logo */}
      <h1 className="absolute top-6 left-12 text-3xl font-abril font-bold text-black z-20">Coloryze</h1>

      {/* Floating pink bubbles */}
      <motion.div
        className="absolute w-96 h-96 bg-pink-200 rounded-full blur-3xl opacity-40 -top-40 -left-40"
        animate={{ x: [0, 50, 0, -50, 0], y: [0, -30, 0, 30, 0] }}
        transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-80 h-80 bg-pink-300 rounded-full blur-3xl opacity-30 -bottom-40 right-10"
        animate={{ x: [0, -40, 0, 20, 0], y: [0, 20, 0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-64 h-64 bg-pink-100 rounded-full blur-3xl opacity-35 top-20 right-1/4"
        animate={{ x: [0, 20, 0, -20, 0], y: [0, -10, 0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
      />

      {/* Signup Card */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full max-w-2xl bg-white/20 backdrop-blur-xl rounded-3xl shadow-[0_15px_50px_rgba(0,0,0,0.1)] p-12 z-10"
      >
        <h2 className="text-5xl font-bold text-center text-black mb-10">Signup</h2>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="px-6 py-5 border border-pink-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-300 text-black text-lg placeholder-black"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="px-6 py-5 border border-pink-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-300 text-black text-lg placeholder-black"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="px-6 py-5 border border-pink-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-300 text-black text-lg placeholder-black"
          />
          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
            className="px-6 py-5 border border-pink-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-300 text-black text-lg placeholder-black"
          />
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
            className="px-6 py-5 border border-pink-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-300 text-black text-lg placeholder-black"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          {/* Button with pink-to-blue gradient */}
          <button
            type="submit"
            disabled={loading}
            className={`mt-8 font-poppins text-3xl py-5 rounded-2xl text-white font-semibold 
              bg-gradient-to-r from-[#FFB3C6] to-[#80D0FF] 
              hover:from-[#FFA3B0] hover:to-[#70C8FF] 
              transition duration-300 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading ? "Signing up..." : "Signup"}
          </button>
        </form>

        {message && <p className="mt-8 text-center text-red-500 font-medium text-lg">{message}</p>}
      </motion.div>
    </div>
  );
}
