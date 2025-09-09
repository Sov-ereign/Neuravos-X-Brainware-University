import React from 'react';
import { Card, CardContent } from './ui/card';

interface VideoPreviewProps {
  file: File;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({ file }) => {
  const videoUrl = React.useMemo(() => {
    return URL.createObjectURL(file);
  }, [file]);

  React.useEffect(() => {
    return () => {
      URL.revokeObjectURL(videoUrl);
    };
  }, [videoUrl]);

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Video Preview</h3>
        <video
          src={videoUrl}
          controls
          className="w-full rounded-lg shadow-lg"
          style={{ maxHeight: '400px' }}
        >
          Your browser does not support the video tag.
        </video>
      </CardContent>
    </Card>
  );
};

export default VideoPreview;