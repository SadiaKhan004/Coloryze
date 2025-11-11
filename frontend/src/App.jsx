
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
// import AnalyzeSkinTone from './pages/AnalyzeSkinTone';
import AgenticSkinToneAnalysis from './pages/agentic_skin_tone_analyzer';
// import OutfitRecommendation from './pages/OutfitRecommendation';
import OutfitRecommendation from './pages/GarmentRecommendation';
import IdentifySkinTone from './pages/IdentifySkinTone';
import Signup from './pages/sign_up';
import Login from './pages/login';
import PrivateRoute from './components/private_route';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />   {/* Signup route */}
        <Route path="/login" element={<Login />} />     {/* Login route */}
        {/* <Route path="/analyze-skin-tone" element={<AgenticSkinToneAnalysis />} />
        <Route path="/outfit-recommendation" element={<OutfitRecommendation />} /> */}
        <Route path="/identify-skin-tone" element={<IdentifySkinTone />} />
        <Route
          path="/analyze-skin-tone"
          element={
            <PrivateRoute>
              <AgenticSkinToneAnalysis />
            </PrivateRoute>
          }
        />

        <Route
          path="/outfit-recommendation"
          element={
            <PrivateRoute>
              <OutfitRecommendation />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
