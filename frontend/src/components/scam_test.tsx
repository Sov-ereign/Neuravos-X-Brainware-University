import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { useScamContext } from "../contexts/ScamContext";
import QrScanner from "qr-scanner";

interface ScamResult {
  ml_prediction: string;
  gemini_prediction: string;
  final_prediction: string;
  patterns?: {
    has_url: boolean;
    has_shortened_url: boolean;
    has_phone: boolean;
    has_urgent_language: boolean;
    has_financial_terms: boolean;
    has_suspicious_chars: boolean;
    is_very_short: boolean;
    is_very_long: boolean;
  };
  risk_score?: number;
  content_type?: string;
}

export default function Home() {
  const API_URL = `${import.meta.env.VITE_API_BASE_URL || "https://neuravos-x-brainware-university.onrender.com"}/scam/predict`;
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<ScamResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanMode, setScanMode] = useState<'text' | 'qr'>('text');
  const [qrSource, setQrSource] = useState<'camera' | 'storage'>('camera');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const qrScannerRef = useRef<QrScanner | null>(null);
  const { addResult } = useScamContext();

  const checkMessage = async (messageToCheck?: string) => {
    const messageToUse = messageToCheck || message;
    if (!messageToUse.trim()) {
      alert("⚠️ Please enter a message before checking.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const response = await axios.post(API_URL, { message: messageToUse });
      setResult(response.data);
      
      // Add result to context for stats tracking
      addResult(
        messageToUse,
        response.data.ml_prediction,
        response.data.gemini_prediction,
        response.data.final_prediction
      );
    } catch (err: any) {
      const backendError = err?.response?.data?.error;
      const msg = backendError || err?.message || "⚠️ Could not connect to backend API.";
      setError(msg);
      console.error("Scam check error:", err);
    }
    finally {
      setLoading(false);
    }
  };

  const startQRScan = async () => {
    if (!videoRef.current) return;
    
    try {
      setIsScanning(true);
      setError("");
      
      qrScannerRef.current = new QrScanner(
        videoRef.current,
        (result) => {
          console.log("QR Code detected:", result.data);
          setMessage(result.data);
          stopQRScan();
          // Automatically check the scanned content
          checkMessage(result.data);
        },
        {
          onDecodeError: (error) => {
            // Silently handle decode errors (camera is working but no QR code)
            console.log("QR decode error:", error);
          }
        }
      );
      
      await qrScannerRef.current.start();
    } catch (err) {
      console.error("QR Scanner error:", err);
      setError("Failed to start camera. Please check permissions.");
      setIsScanning(false);
    }
  };

  const stopQRScan = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
      qrScannerRef.current.destroy();
      qrScannerRef.current = null;
    }
    setIsScanning(false);
  };

  const switchMode = (mode: 'text' | 'qr') => {
    if (isScanning) {
      stopQRScan();
    }
    setScanMode(mode);
    setMessage("");
    setResult(null);
    setError("");
    setUploadedImage(null);
  };

  const switchQrSource = (source: 'camera' | 'storage') => {
    if (isScanning) {
      stopQRScan();
    }
    setQrSource(source);
    setUploadedImage(null);
    setMessage("");
    setResult(null);
    setError("");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError("Please select a valid image file.");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("Image file is too large. Please select a file smaller than 10MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageDataUrl = e.target?.result as string;
      setUploadedImage(imageDataUrl);
      setError("");
      
      // Automatically decode QR code from the uploaded image
      decodeQRFromImage(imageDataUrl);
    };
    reader.readAsDataURL(file);
  };

  const decodeQRFromImage = async (imageDataUrl: string) => {
    try {
      setLoading(true);
      setError("");
      
      // Create an image element to get the image data
      const img = new Image();
      img.onload = async () => {
        try {
          // Use QrScanner to decode QR code from the image
          const result = await QrScanner.scanImage(img);
          console.log("QR Code detected from image:", result);
          setMessage(result);
          // Automatically check the scanned content
          checkMessage(result);
        } catch (err) {
          console.error("QR decode error:", err);
          setError("No QR code found in the uploaded image. Please try a different image.");
        } finally {
          setLoading(false);
        }
      };
      img.src = imageDataUrl;
    } catch (err) {
      console.error("Image processing error:", err);
      setError("Failed to process the uploaded image.");
      setLoading(false);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="p-3 sm:p-6 max-w-3xl mx-auto">
      <Card className="border-muted bg-white">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg sm:text-xl md:text-2xl text-[#003399]">📱 Fraud Alert System</CardTitle>
              <p className="text-xs sm:text-sm text-black mt-1">Hybrid ML + Gemini evaluation for SMS messages & QR codes</p>
            </div>
          </div>
          
          {/* Mode Switcher */}
          <div className="flex bg-gray-100 rounded-lg p-1 mt-3 sm:mt-4">
            <button
              onClick={() => switchMode('text')}
              className={`flex-1 px-2 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                scanMode === 'text'
                  ? 'bg-white text-[#003399] shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              📝 Text Input
            </button>
            <button
              onClick={() => switchMode('qr')}
              className={`flex-1 px-2 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                scanMode === 'qr'
                  ? 'bg-white text-[#003399] shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              📷 QR Scanner
            </button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {scanMode === 'text' ? (
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Message</label>
              <textarea
                className="w-full p-3 resize-none border rounded-md border-gray-300 bg-white text-slate-900 placeholder:text-slate-400"
                placeholder="Type or paste the SMS content..."
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <p className="text-[12px] text-black mt-1">We do not store your message. It's used only for this evaluation.</p>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">QR Code Scanner</label>
              
              {/* QR Source Selection */}
              <div className="flex bg-gray-100 rounded-lg p-1 mb-3 sm:mb-4">
                <button
                  onClick={() => switchQrSource('camera')}
                  className={`flex-1 px-2 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                    qrSource === 'camera'
                      ? 'bg-white text-[#003399] shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  📷 Camera
                </button>
                <button
                  onClick={() => switchQrSource('storage')}
                  className={`flex-1 px-2 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                    qrSource === 'storage'
                      ? 'bg-white text-[#003399] shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  📁 Storage
                </button>
              </div>

              {/* Camera Interface */}
              {qrSource === 'camera' && (
                <div className="relative">
                  <video
                    ref={videoRef}
                    className="w-full h-48 sm:h-64 bg-gray-100 rounded-md border border-gray-300"
                    style={{ display: isScanning ? 'block' : 'none' }}
                  />
                  {!isScanning && (
                    <div className="w-full h-48 sm:h-64 bg-gray-100 rounded-md border border-gray-300 flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <div className="text-3xl sm:text-4xl mb-2">📷</div>
                        <p className="text-sm sm:text-base">Click "Start Scanning" to begin</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Storage Interface */}
              {qrSource === 'storage' && (
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <div
                      onClick={triggerFileUpload}
                      className="w-full h-48 sm:h-64 bg-gray-100 rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      {uploadedImage ? (
                        <div className="text-center">
                          <img
                            src={uploadedImage}
                            alt="Uploaded QR Code"
                            className="max-w-full max-h-44 sm:max-h-60 rounded-md mb-2"
                          />
                          <p className="text-xs sm:text-sm text-gray-600">Click to change image</p>
                        </div>
                      ) : (
                        <div className="text-center text-gray-500">
                          <div className="text-3xl sm:text-4xl mb-2">📁</div>
                          <p className="font-medium text-sm sm:text-base">Click to upload QR code image</p>
                          <p className="text-xs mt-1">Supports JPG, PNG, GIF (max 10MB)</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <p className="text-[12px] text-black mt-1">
                {qrSource === 'camera' 
                  ? "Point your camera at a QR code to scan and analyze its content."
                  : "Upload an image containing a QR code to scan and analyze its content."
                }
              </p>
              
              {/* Show scanned content when available */}
              {message && qrSource === 'storage' && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-800 font-medium mb-1">📋 Scanned Content:</p>
                  <p className="text-sm text-blue-700 break-all">{message}</p>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">{error}</div>
          )}

          {result && (
            <div className="space-y-4">
              {/* Main Predictions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="rounded-lg border p-3 bg-gray-50">
                  <div className="text-xs text-gray-500 mb-1">ML Prediction</div>
                  <div className="text-sm font-semibold">
                    <span className={`px-2 py-1 rounded-md ${String(result.ml_prediction).toLowerCase()==='spam' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                      {String(result.ml_prediction).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="rounded-lg border p-3 bg-gray-50">
                  <div className="text-xs text-gray-500 mb-1">Gemini Prediction</div>
                  <div className="text-sm font-semibold">
                    <span className={`px-2 py-1 rounded-md ${String(result.gemini_prediction).toLowerCase()==='spam' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                      {String(result.gemini_prediction).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="rounded-lg border p-3 bg-gray-50">
                  <div className="text-xs text-gray-500 mb-1">Final Decision</div>
                  <div className="text-sm font-semibold">
                    <span className={`px-2 py-1 rounded-md ${String(result.final_prediction).toLowerCase()==='spam' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}>
                      {String(result.final_prediction).toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Risk Analysis */}
              {result.patterns && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-blue-800 mb-3">🔍 Risk Analysis</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-xs">
                    <div className="flex items-center space-x-2">
                      <span className={`w-2 h-2 rounded-full ${result.patterns.has_url ? 'bg-red-500' : 'bg-gray-300'}`}></span>
                      <span className={result.patterns.has_url ? 'text-red-700' : 'text-gray-600'}>URL Detected</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`w-2 h-2 rounded-full ${result.patterns.has_shortened_url ? 'bg-red-500' : 'bg-gray-300'}`}></span>
                      <span className={result.patterns.has_shortened_url ? 'text-red-700' : 'text-gray-600'}>Shortened URL</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`w-2 h-2 rounded-full ${result.patterns.has_urgent_language ? 'bg-red-500' : 'bg-gray-300'}`}></span>
                      <span className={result.patterns.has_urgent_language ? 'text-red-700' : 'text-gray-600'}>Urgent Language</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`w-2 h-2 rounded-full ${result.patterns.has_financial_terms ? 'bg-red-500' : 'bg-gray-300'}`}></span>
                      <span className={result.patterns.has_financial_terms ? 'text-red-700' : 'text-gray-600'}>Financial Terms</span>
                    </div>
                  </div>
                  {result.risk_score !== undefined && (
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm text-blue-700">Risk Score:</span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        result.risk_score >= 3 ? 'bg-red-100 text-red-800' :
                        result.risk_score >= 1 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {result.risk_score}/8
                      </span>
                    </div>
                  )}
                  {result.content_type && (
                    <div className="mt-2 text-xs text-blue-600">
                      Content Type: <span className="font-semibold">{result.content_type.toUpperCase()}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {scanMode === 'text' ? (
            <Button onClick={() => checkMessage()} disabled={loading} className="bg-[#003399] text-white font-bold hover:bg-[#003399]/90">
              {loading ? "Checking..." : "🔍 Check Message"}
            </Button>
          ) : qrSource === 'camera' ? (
            <div className="flex flex-col sm:flex-row gap-3">
              {!isScanning ? (
                <Button onClick={startQRScan} className="bg-[#003399] text-white font-bold hover:bg-[#003399]/90">
                  📷 Start Scanning
                </Button>
              ) : (
                <Button onClick={stopQRScan} className="bg-red-600 text-white font-bold hover:bg-red-700">
                  ⏹️ Stop Scanning
                </Button>
              )}
              {message && !isScanning && (
                <Button onClick={() => checkMessage()} disabled={loading} className="bg-green-600 text-white font-bold hover:bg-green-700">
                  {loading ? "Checking..." : "🔍 Check Scanned Content"}
                </Button>
              )}
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={triggerFileUpload} className="bg-[#003399] text-white font-bold hover:bg-[#003399]/90">
                📁 Upload QR Image
              </Button>
              {message && uploadedImage && (
                <Button onClick={() => checkMessage()} disabled={loading} className="bg-green-600 text-white font-bold hover:bg-green-700">
                  {loading ? "Checking..." : "🔍 Check Scanned Content"}
                </Button>
              )}
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
