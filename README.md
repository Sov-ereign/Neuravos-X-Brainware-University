# PresentationEvaluator

<div align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=22&pause=1000&color=1A237E&center=true&vCenter=true&width=600&lines=Welcome+to+Neuravos+X+Brainware+University!;AI-Powered+Presentation+Analysis+Platform;Built+with+Modern+Technologies;Let's+Evaluate+Presentations+Like+Never+Before!" alt="Typing SVG" />
</div>

<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=200&section=header&text=Neuravos&fontSize=40&fontAlignY=35&animation=twinkling&fontColor=1A237E" />
</div>

## 📋 Problem Statement

## *PresentationEvaluator – AI-Powered Presentation Analysis Platform* 
PresentationEvaluator is a comprehensive AI-powered platform that analyzes presentation videos to provide detailed feedback on body language, speech patterns, confidence levels, and overall presentation quality. It's designed to help presenters improve their skills through intelligent analysis and actionable insights.
                  |

## 🎬 Demo

<div align="center">
  <a href="#" target="_blank">
    <img src="https://img.shields.io/badge/🎥_Watch_Demo-FF0000?style=for-the-badge&logo=youtube&logoColor=white&labelColor=FF0000" alt="https://www.linkedin.com/posts/sov-ereign_nexathon2024-ai-machinelearning-activity-7371639148597743616-8H27?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFJgqL4Blt08GWuJ9AdUx5iQUQUE3O2mDc4" />
  </a>
</div>

> 🎯 Click to explore the live experience of PresentationEvaluator's advanced AI-powered analysis features.

## 👥 Team Members

| 👤 Name             | 📧 Email                        |
|--------------------|---------------------------------|
| 1. Somenath Gorai      |    somu8608@gmail.com    |
| 2. Subham Mandal      |          |
| 3. Madhure Das |   |
| 4. Pranjali |       |

## 📋 Features Overview

### 🎯 Core Modules

#### **1. Orato-AI (Presentation Analysis)**
- **Video Upload**: Support for MP4, AVI, MOV formats
- **Body Language Analysis**: Posture, hand gestures, eye contact tracking
- **Confidence Scoring**: AI-powered confidence level assessment
- **Real-time Processing**: Advanced computer vision with MediaPipe
- **Detailed Feedback**: Strengths, areas for improvement, and actionable tips

#### **2. Campus-AI (Intelligent Assistant)**
- **Smart Chatbot**: AI-powered campus information assistant
- **Academic Programs**: Detailed information about courses and programs
- **Campus Facilities**: Information about amenities and services
- **Event Management**: Upcoming events and club activities
- **Student Services**: Support for various student needs

#### **3. Scam Detector (Fraud Detection)**
- **Text Analysis**: ML-powered spam detection using TF-IDF
- **QR Code Scanning**: Camera and image-based QR code analysis
- **URL Safety Check**: Link validation and risk assessment
- **Pattern Recognition**: Detection of suspicious patterns and language
- **Real-time Statistics**: Dynamic tracking of detection results

### 🛠 Technical Features

#### **Frontend Technologies**
- **React 18** with TypeScript for type safety
- **Vite** for fast development and building
- **Tailwind CSS** for responsive design
- **React Router** for client-side navigation
- **Recharts** for data visualization
- **QR Scanner** for QR code detection
- **Axios** for API communication

#### **Backend Technologies**
- **Flask** with CORS support
- **TensorFlow 2.10** for deep learning models
- **PyTorch** with CUDA support for GPU acceleration
- **MediaPipe** for pose and face detection
- **OpenCV** for computer vision processing
- **Librosa** for audio analysis
- **Google Gemini AI** for advanced text analysis
- **Scikit-learn** for machine learning models

#### **AI/ML Models**
- **YOLOv8** for object detection
- **DeepFace** for emotion recognition
- **Custom ML Models** for spam detection
- **Hybrid Decision Making** combining ML and AI predictions

### 📊 Analysis Capabilities

#### **Body Language Analysis**
- Head stability tracking
- Posture assessment
- Hand gesture recognition
- Movement pattern analysis
- Confidence scoring algorithm

#### **Speech Analysis**
- Audio quality assessment
- Speaking pace analysis
- Pause detection
- Volume consistency
- Clarity evaluation

#### **Content Analysis**
- Presentation structure
- Visual element assessment
- Timing analysis
- Engagement metrics

### 🔔 Smart Features

#### **Real-time Processing**
- Live video analysis
- Instant feedback generation
- Progress tracking
- Error handling and recovery

#### **Data Visualization**
- Interactive charts and graphs
- Statistical analysis
- Trend tracking
- Performance metrics

#### **Mobile Responsiveness**
- Touch-friendly interface
- Responsive design
- Mobile-optimized components
- Cross-platform compatibility

## 🛠 Getting Started

### Prerequisites
- Python 3.10.11 (Windows Installer)
- Node.js 18+ 
- CUDA 11.8 (for GPU acceleration)
- 8GB+ RAM recommended
- GPU with CUDA support (optional but recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/Sov-ereign/Neuravos-X-Brainware-University

# Navigate to the project directory
cd <project directory>

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# Install Python dependencies
pip install -r requirements.txt

# Navigate to frontend directory
cd frontend

# Install Node.js dependencies
npm install

# Start the development servers
# Terminal 1 - Backend
cd ../backend
python app.py

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Environment Setup

```bash
# Set up environment variables
cp .env.example .env

# Edit the .env file with your configuration:
# GEMINI_API_KEY=your_gemini_api_key
# FLASK_ENV=development
# CUDA_VISIBLE_DEVICES=0
```

### CUDA Setup (Optional)

```bash
# Verify CUDA installation
python -c "import tensorflow as tf; print(tf.config.list_physical_devices('GPU'))"

# Set CUDA environment variables (Windows)
set CUDA_HOME="C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v11.8"
set PATH="C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v11.8\bin";%PATH%
```

## 🚀 Usage

### 1. Orato-AI (Presentation Analysis)
1. Navigate to the Orato-AI tab
2. Upload your presentation video
3. Wait for AI analysis to complete
4. Review detailed feedback and scores
5. Download analysis report

### 2. Campus-AI (Intelligent Assistant)
1. Go to Campus-AI tab
2. Ask questions about campus life
3. Get instant AI-powered responses
4. Explore academic programs and facilities

### 3. Scam Detector
1. Switch to Scam Detector tab
2. Enter text or scan QR codes
3. Get real-time safety analysis
4. View detection statistics

## 📁 Project Structure

```
PresentationEvaluator/
├── backend/
│   ├── models/
│   │   ├── body_language.py
│   │   ├── scam_detector.py
│   │   └── *.pkl (ML models)
│   ├── app.py
│   ├── chatbot.py
│   ├── emotion_detector.py
│   ├── human_detection.py
│   └── speech_analyzer.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── OratoAI.tsx
│   │   │   ├── CampusAI.tsx
│   │   │   ├── scam_test.tsx
│   │   │   ├── scam_stats.tsx
│   │   │   └── WelcomeModal.tsx
│   │   ├── contexts/
│   │   │   └── ScamContext.tsx
│   │   └── data/
│   │       └── *.json (campus data)
│   ├── package.json
│   └── vite.config.ts
├── requirements.txt
├── runtime.txt
└── README.md
```

## 🔧 Configuration

### Backend Configuration
- **Flask**: Configured for CORS and API endpoints
- **Model Loading**: Automatic model initialization
- **GPU Support**: CUDA-enabled processing
- **Error Handling**: Comprehensive error management

### Frontend Configuration
- **Vite**: Optimized build configuration
- **TypeScript**: Strict type checking
- **Tailwind**: Custom design system
- **Responsive**: Mobile-first approach

## 📊 Performance

### System Requirements
- **Minimum**: 4GB RAM, CPU-only processing
- **Recommended**: 8GB+ RAM, GPU with CUDA support
- **Optimal**: 16GB+ RAM, RTX 3060+ GPU

### Processing Times
- **Short videos (1-2 min)**: 30-60 seconds
- **Medium videos (3-5 min)**: 1-3 minutes
- **Long videos (10+ min)**: 5-10 minutes

## 🐛 Troubleshooting

### Common Issues

1. **CUDA not detected**
   ```bash
   # Check CUDA installation
   nvidia-smi
   python -c "import torch; print(torch.cuda.is_available())"
   ```

2. **Model loading errors**
   ```bash
   # Clear model cache
   rm -rf backend/models/__pycache__
   ```

3. **Frontend build issues**
   ```bash
   # Clear node modules
   rm -rf node_modules
   npm install
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **MediaPipe** for pose detection
- **TensorFlow** for deep learning capabilities
- **Google Gemini** for AI-powered analysis
- **React** and **Vite** for frontend development
- **Flask** for backend API development

## 📞 Contact

**Team Apexars** - Neuravos X Brainware University

- **Project Link**: [https://github.com/Sov-ereign/Neuravos-X-Brainware-University](https://github.com/Sov-ereign/Neuravos-X-Brainware-University)
- **Email**: somu8608@gmail.com

---

<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=100&section=footer&text=Thank+You!&fontSize=20&fontAlignY=65&animation=twinkling&fontColor=1A237E" />
</div>