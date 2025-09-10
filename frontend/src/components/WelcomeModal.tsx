import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { X, CheckCircle, AlertTriangle, Server, Cpu } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const WelcomeModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Only show modal on the landing page (home/root path)
    const isLandingPage = location.pathname === '/' || location.pathname === '/orato-ai';
    
    if (isLandingPage) {
      // Show modal with a small delay for better UX
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 500);
      
      return () => clearTimeout(timer);
    } else {
      // Close modal if user navigates away from landing page
      setIsOpen(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    // Handle escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    // Don't set localStorage flag - we want modal to show every time on landing page
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-2 sm:p-4 animate-in fade-in duration-300"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <Card className="w-full max-w-xs sm:max-w-lg md:max-w-2xl bg-white shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
        <CardHeader className="relative pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-2 sm:space-x-3 flex-1 min-w-0">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
              </div>
              <div className="min-w-0 flex-1">
                <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 leading-tight">
                  🎉 Project Status: 100% Complete
                </CardTitle>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  All functionalities are working perfectly
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 flex-shrink-0 ml-2 p-2 min-w-[44px] min-h-[44px] sm:min-w-auto sm:min-h-auto"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4 sm:space-y-6 px-3 sm:px-6">
          {/* Success Message */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
            <div className="flex items-start space-x-2 sm:space-x-3">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-green-800 mb-2 text-sm sm:text-base">
                  ✅ Development Complete
                </h3>
                <p className="text-xs sm:text-sm text-green-700 leading-relaxed">
                  Our AI-powered platform is fully functional with all three core modules:
                  <strong> Orato-AI</strong> (Presentation Analysis), <strong>Campus-AI</strong> (Intelligent Assistant), 
                  and <strong>Scam Detector</strong> (Fraud Detection) working seamlessly.
                </p>
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 sm:p-4">
            <div className="flex items-start space-x-2 sm:space-x-3">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-amber-800 mb-2 text-sm sm:text-base">
                  ⚠️ Live Server Limitations
                </h3>
                <p className="text-xs sm:text-sm text-amber-700 mb-3 leading-relaxed">
                  If you're using the live server, please note that <strong>Orato-AI</strong> might not work optimally due to hosting constraints.
                </p>
                <div className="space-y-1.5 sm:space-y-2 text-xs text-amber-700">
                  <div className="flex items-center space-x-2">
                    <Server className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span>Free tier provides only 512MB RAM</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Cpu className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span>Linux CPU environment (no GPU acceleration)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span>TensorFlow, PyTorch CUDA dependencies require more resources</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendation */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
            <div className="flex items-start space-x-2 sm:space-x-3">
              <div className="w-4 h-4 sm:w-5 sm:h-5 bg-blue-600 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                <span className="text-white text-xs font-bold">💡</span>
              </div>
              <div>
                <h3 className="font-semibold text-blue-800 mb-2 text-sm sm:text-base">
                  💡 Recommended Setup
                </h3>
                <p className="text-xs sm:text-sm text-blue-700 leading-relaxed">
                  For the best experience with <strong>Orato-AI</strong>, run the application locally with GPU support. 
                  All other features work perfectly on the live server!
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2 sm:pt-4">
            <Button
              onClick={handleClose}
              className="flex-1 bg-[#003399] hover:bg-[#003399]/90 text-white font-semibold text-sm sm:text-base py-3 sm:py-3 min-h-[44px]"
            >
              Got it, let's explore! 🚀
            </Button>
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1 border-[#003399] text-[#003399] hover:bg-[#003399]/10 text-sm sm:text-base py-3 sm:py-3 min-h-[44px]"
            >
              View Features
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomeModal;
