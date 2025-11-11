// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { login } from "../api/auth";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage("");

//     try {
//       const res = await login(email, password);

//       if (!res.data?.access_token) {
//         throw new Error("No token returned from server");
//       }

//       // Save token and user email
//       localStorage.setItem("token", res.data.access_token);
//       localStorage.setItem("userEmail", res.data.user?.email || email);

//       navigate("/"); // redirect to home
//     } catch (err) {
//       console.error(err);
//       setMessage(err.response?.data?.detail || err.message || "Invalid credentials");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
//       <h2 className="text-3xl font-bold mb-6">Login</h2>

//       <form
//         onSubmit={handleSubmit}
//         className="flex flex-col space-y-4 w-80 bg-white p-6 rounded-lg shadow-md"
//       >
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//           className="border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//           className="border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />
//         <button
//           type="submit"
//           disabled={loading}
//           className={`bg-blue-600 text-white py-2 rounded-md hover:bg-blue-500 transition duration-300 ${
//             loading ? "opacity-50 cursor-not-allowed" : ""
//           }`}
//         >
//           {loading ? "Logging in..." : "Login"}
//         </button>
//       </form>

//       {message && <p className="mt-4 text-red-500">{message}</p>}
//     </div>
//   );
// }
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { motion } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await login(email, password);
      if (!res.data?.access_token) throw new Error("No token returned");

      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("userEmail", res.data.user?.email || email);

      navigate("/");
    } catch (err) {
      setMessage(err.response?.data?.detail || err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#E8F5FF] via-[#F6FBFF] to-[#E2F1FF] overflow-hidden">
      {/* === Top Right Logo === */}
      <h1 className="absolute top-6 left-8 text-2xl font-bold font-abril text-black z-20">Coloryze</h1>

      {/* === Floating pink bubbles === */}
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

      {/* === Transparent Login Card === */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full max-w-xl h-[600px] bg-white/20 backdrop-blur-xl rounded-3xl shadow-[0_15px_50px_rgba(0,0,0,0.1)] p-12 z-10"
      >
        <h2 className="text-5xl font-bold text-center text-black mb-10">Login</h2>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-12 mt-20">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="font-poppins text-xl px-6 py-5 border border-pink-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-300 text-black text-lg placeholder-black/70"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="font-poppins text-xl px-6 py-5 border border-pink-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-300 text-black text-lg placeholder-black/70"
          />
          <button
  type="submit"
  disabled={loading}
  className={`mt-8 font-poppins text-3xl py-4 rounded-2xl text-white font-semibold 
    bg-gradient-to-r from-[#FFB3C6] to-[#80D0FF] 
    hover:from-[#FFA3B0] hover:to-[#70C8FF] 
    transition duration-300 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
>
  {loading ? "Logging in..." : "Login"}
</button>

        </form>

        {message && <p className="mt-8 text-center text-red-500 font-medium text-lg">{message}</p>}
      </motion.div>
    </div>
  );
}
