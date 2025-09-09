import React from 'react';
import { Upload, Video } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, selectedFile }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      onFileSelect(file);
    } else {
      alert('Please select a video file (mp4, avi, mov)');
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      onFileSelect(file);
    } else {
      alert('Please select a video file (mp4, avi, mov)');
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <Card className="border-2 border-dashed border-gray-300 bg-white hover:border-gray-400 transition-colors">
      <div
        className="p-8 text-center cursor-pointer"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="hidden"
        />
        
        {selectedFile ? (
          <div className="flex items-center justify-center space-x-3">
            <Video className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-lg font-medium text-gray-900">{selectedFile.name}</p>
              <p className="text-sm text-gray-500">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="w-12 h-12 text-gray-400 mx-auto" />
            <div>
              <p className="text-lg font-medium text-gray-900 mb-2">
                Drop your presentation video here
              </p>
              <p className="text-sm text-gray-600 mb-4">
                or click to select a file
              </p>
              <p className="text-xs text-gray-500">
                Supports MP4, AVI, MOV formats
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default FileUpload;