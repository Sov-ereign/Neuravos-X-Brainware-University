import React from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from './ui/card';

const LoadingSpinner: React.FC = () => {
  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardContent className="p-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white mb-2">
              Analyzing Your Presentation
            </h3>
            <p className="text-gray-400">
              Our AI is evaluating your video for body language, speech patterns, and emotions...
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoadingSpinner;