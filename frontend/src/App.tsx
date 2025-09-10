import Navigation from './components/Navigation';
import OratoAI from './components/OratoAI';
import CampusAI from './components/CampusAI';
import Dashboard from './components/Dashboard';
import About from './components/About';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import campusImg from '../assests/bwuCampus.webp';
import logoSvg from '../assests/bwu-logo.svg';
import ScamDetector from './components/scam_test';
import ScamStats from './components/scam_stats';
import { ScamProvider } from './contexts/ScamContext';
function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const activeTab = location.pathname.replace('/', '') || 'orato-ai';
  const setActiveTab = (tab: string) => navigate(`/${tab}`);

  return (
    <ScamProvider>
      <div className="min-h-screen bg-white">
        {/* Banner above navbar */}
        <div className="w-full">
          <div className="flex w-full h-24 md:h-28 relative">
            {/* Left blue panel */}
            <div className="relative flex items-center bg-[#003399] text-white w-[50%] md:w-[42%] px-6">
              <div className="flex items-center gap-4">
                <img src={logoSvg} alt="Brainware University" className="h-20 md:h-12 w-auto" />
                <div className="hidden sm:block leading-tight">
                  <div className="text-sm md:text-base font-semibold uppercase tracking-wide">Brainware University X Neuravos</div>
                  <div className="text-[10px] md:text-xs opacity-90">We Make Careers</div>
                </div>
              </div>
              {/* Angled white divider */}
              <div className="absolute top-0 -right-6 h-full w-8 bg-white transform skew-x-12" />
            </div>

            {/* Right campus image */}
            <div className="flex-1 overflow-hidden">
              <img src={campusImg} alt="Campus" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="container mx-auto px-6 py-10 max-w-7xl">
          <Routes>
            <Route path="/" element={<OratoAI />} />
            <Route path="/orato-ai" element={<OratoAI />} />
            <Route path="/campus-ai" element={<CampusAI />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/about" element={<About />} />
            <Route path="/scam-detector" element={<ScamDetector />} />
            <Route path="/scam-stats" element={<ScamStats />} />
            <Route path="*" element={<OratoAI />} />
          </Routes>
        </div>
        
        {/* Footer */}
        <footer className="bg-[#000F20]">
          <div className="container mx-auto px-6 py-8">
            <div className="text-center">
              <p className="text-white/90 text-sm">
                © Team Apexars -- Neuravos X Brainware University
              </p>
            </div>
          </div>
        </footer>
      </div>
    </ScamProvider>
  );
}

export default App;