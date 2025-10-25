// import { useState } from 'react'
// // import reactLogo from './assets/react.svg'
// // import viteLogo from '/vite.svg'
// import './App.css'
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import HomePage from './pages/homepage'
// import Navbar from './components/navbar'
// import About from './pages/About'
// import AnalyzeSkinTone from './pages/AnalyzeSkinTone'
// import OutfitRecommendation from './pages/OutfitRecommendation'
// import IdentifySkinTone from './pages/IdentifySkinTone'
// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <Router>
//             <div className="App">
//                 <Navbar />
//                 <Routes>
//                     <Route path="/" element={<HomePage />} />
//                     <Route path="/about" element={<About />} />
//                     <Route path="/analyze-skin-tone" element={<AnalyzeSkinTone />} />
//                     <Route path="/outfit-recommendation" element={<OutfitRecommendation />} />
//                     <Route path="/identify-skin-tone" element={<IdentifySkinTone />} />
//                     {/* <Route path="/login" element={<Login />} /> */}
//                 </Routes>
//             </div>
//         </Router>
//     </>
//   )
// }

// export default App

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AnalyzeSkinTone from './pages/AnalyzeSkinTone';
import OutfitRecommendation from './pages/OutfitRecommendation';
import IdentifySkinTone from './pages/IdentifySkinTone';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/analyze-skin-tone" element={<AnalyzeSkinTone />} />
        <Route path="/outfit-recommendation" element={<OutfitRecommendation />} />
        <Route path="/identify-skin-tone" element={<IdentifySkinTone />} />
      </Routes>
    </Router>
  );
}

export default App;
