import React, { useState } from 'react';
import axios from 'axios';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import FileUpload from './FileUpload';
import VideoPreview from './VideoPreview';
import LoadingSpinner from './LoadingSpinner';
import AnalysisResults from './AnalysisResults';
import { AlertCircle, Sparkles, Target, TrendingUp } from 'lucide-react';

interface AnalysisData {
  overall_score: number;
  body_score: number;
  speech_score: number;
  emotion: string;
  body_language: {
    score: number;
    strengths: string[];
    problems_detected: string[];
    keys_to_improve: string[];
  };
  speech_analysis: {
    duration: number;
    speaking_rate: number;
    volume: number;
    pitch: number;
  };
  emotion_analysis: {
    dominant_emotion: string;
    emotions: Record<string, number>;
  };
}

const OratoAI: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setAnalysisResults(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('video', selectedFile);

      const response = await axios.post('https://neuravos-x-brainware-university.onrender.com//analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 300000,
      });

      if (response.data.error) {
        setError(response.data.error);
      } else {
        setAnalysisResults(response.data);
        try {
          const stored = localStorage.getItem('analyses');
          const arr = stored ? JSON.parse(stored) : [];
          const now = new Date().toISOString();
          const entry = {
            id: `${Date.now()}`,
            createdAt: now,
            overall_score: response.data.overall_score ?? 0,
            body_score: response.data.body_score ?? 0,
            speech_score: response.data.speech_score ?? 0,
            emotion: response.data.emotion ?? 'neutral',
            emotion_analysis: response.data.emotion_analysis ?? {},
            body_language: response.data.body_language ?? {},
            speech_analysis: response.data.speech_analysis ?? {},
          };
          const updated = [entry, ...arr].slice(0, 50);
          localStorage.setItem('analyses', JSON.stringify(updated));
        } catch (e) {
          console.warn('Failed to persist analysis to localStorage', e);
        }
      }
    } catch (err: any) {
      console.error('Analysis error:', err);
      if (err.code === 'ECONNABORTED') {
        setError('Analysis timed out. Please try with a shorter video or check your connection.');
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.code === 'ERR_NETWORK') {
        setError('Could not connect to the analysis server. Please ensure the server is running on https://neuravos-x-brainware-university.onrender.com');
      } else {
        setError('An unexpected error occurred during analysis. Please try again.');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 bg-[#003399] rounded-2xl flex items-center justify-center shadow-sm">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-[#003399] mb-4">
          Orato-AI Presentation Evaluator
        </h1>
        <p className="text-xl text-gray-700 mb-2">
          Advanced AI-powered presentation analysis
        </p>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Upload your presentation video and receive comprehensive insights on body language, 
          speech patterns, and emotional engagement with actionable improvement recommendations.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-[#003399]">
              <Target className="w-5 h-5" />
              <span>Body Language</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-sm">
              Analyze posture, gestures, and confidence levels with detailed feedback
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-green-600">
              <TrendingUp className="w-5 h-5" />
              <span>Speech Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-sm">
              Evaluate speaking rate, volume, pitch, and overall vocal delivery
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-purple-600">
              <Sparkles className="w-5 h-5" />
              <span>Emotion Detection</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-sm">
              Identify emotional states and engagement levels throughout your presentation
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        {/* File Upload */}
        <div className="max-w-3xl mx-auto">
          <FileUpload
            onFileSelect={handleFileSelect}
            selectedFile={selectedFile}
          />
        </div>

        {/* Video Preview */}
        {selectedFile && !isAnalyzing && !analysisResults && (
          <div className="max-w-3xl mx-auto space-y-6">
            <VideoPreview file={selectedFile} />
            <div className="text-center">
              <Button
                onClick={handleAnalyze}
                className="bg-[#E60023] hover:bg-[#cc001f] text-white px-8 py-3 rounded-xl font-semibold shadow-sm transition-all"
                size="lg"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Analyze Presentation
              </Button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isAnalyzing && (
          <div className="max-w-3xl mx-auto">
            <LoadingSpinner />
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="max-w-3xl mx-auto">
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 text-red-600">
                  <AlertCircle className="w-6 h-6" />
                  <div>
                    <h3 className="font-semibold">Analysis Error</h3>
                    <p className="text-sm mt-1">{error}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Analysis Results */}
        {analysisResults && !isAnalyzing && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-[#003399] mb-2">Analysis Complete!</h2>
              <p className="text-gray-600">Here's your comprehensive presentation evaluation</p>
            </div>
            <AnalysisResults data={analysisResults} />
            
            {/* Action Buttons */}
            <div className="text-center mt-8 space-x-4">
              <Button
                onClick={() => {
                  setSelectedFile(null);
                  setAnalysisResults(null);
                  setError(null);
                }}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Analyze New Video
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OratoAI;