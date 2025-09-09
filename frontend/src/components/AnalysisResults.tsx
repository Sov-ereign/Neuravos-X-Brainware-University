import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Target, User, Mic, Heart } from 'lucide-react';

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

interface AnalysisResultsProps {
  data: AnalysisData;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ data }) => {
  const scoreData = [
    { name: 'Overall', score: data.overall_score },
    { name: 'Body Language', score: data.body_score },
    { name: 'Speech', score: data.speech_score },
  ];

  const emotionData = Object.entries(data.emotion_analysis?.emotions || {}).map(([emotion, value]) => ({
    name: emotion,
    value: value * 100,
  }));

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316'];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Overall Summary */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-gray-900">
            <Target className="w-5 h-5 text-blue-600" />
            <span>Overall Evaluation Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className={`text-3xl font-bold ${getScoreColor(data.overall_score)}`}>
                {data.overall_score}%
              </div>
              <div className="text-sm text-gray-500">Overall Score</div>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold ${getScoreColor(data.body_score)}`}>
                {data.body_score}%
              </div>
              <div className="text-sm text-gray-500">Body Language</div>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold ${getScoreColor(data.speech_score)}`}>
                {data.speech_score}%
              </div>
              <div className="text-sm text-gray-500">Speech Quality</div>
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="score" fill="#2563EB" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Body Language Analysis */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-900">
              <User className="w-5 h-5 text-green-600" />
              <span>Body Language Confidence</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className={`text-2xl font-bold ${getScoreColor(data.body_language?.score || 0)}`}>
                {data.body_language?.score || 0}%
              </div>
              <Progress 
                value={data.body_language?.score || 0} 
                className="flex-1"
              />
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-green-700 mb-2">Strengths</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  {(data.body_language?.strengths || []).map((strength, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-medium text-red-700 mb-2">Areas for Improvement</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  {(data.body_language?.problems_detected || []).map((problem, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-red-600 mt-1">•</span>
                      <span>{problem}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-medium text-yellow-700 mb-2">Key Improvements</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  {(data.body_language?.keys_to_improve || []).map((key, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-yellow-600 mt-1">•</span>
                      <span>{key}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Speech Analysis */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-900">
              <Mic className="w-5 h-5 text-purple-600" />
              <span>Speech Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-100 rounded-lg">
                <div className="text-xl font-bold text-gray-900">
                  {Math.round((data.speech_analysis?.duration || 0) / 60)}min
                </div>
                <div className="text-xs text-gray-500">Duration</div>
              </div>
              <div className="text-center p-3 bg-gray-100 rounded-lg">
                <div className="text-xl font-bold text-gray-900">
                  {data.speech_analysis?.speaking_rate || 0}
                </div>
                <div className="text-xs text-gray-500">Words/Min</div>
              </div>
              <div className="text-center p-3 bg-gray-100 rounded-lg">
                <div className="text-xl font-bold text-gray-900">
                  {data.speech_analysis?.volume || 0}%
                </div>
                <div className="text-xs text-gray-500">Volume</div>
              </div>
              <div className="text-center p-3 bg-gray-100 rounded-lg">
                <div className="text-xl font-bold text-gray-900">
                  {data.speech_analysis?.pitch || 0}Hz
                </div>
                <div className="text-xs text-gray-500">Avg Pitch</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Emotion Analysis */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-gray-900">
            <Heart className="w-5 h-5 text-pink-600" />
            <span>Emotion Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">
                Dominant Emotion: <span className="text-pink-600">{data.emotion_analysis?.dominant_emotion || data.emotion}</span>
              </h4>
              
              {emotionData.length > 0 && (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={emotionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {emotionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#ffffff', 
                          border: '1px solid #E5E7EB',
                          borderRadius: '8px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">Detailed Emotion Data</h4>
              <div className="bg-gray-900/50 p-4 rounded-lg max-h-64 overflow-y-auto">
                <pre className="text-xs text-gray-300">
                  {JSON.stringify(data.emotion_analysis || { emotion: data.emotion }, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalysisResults;