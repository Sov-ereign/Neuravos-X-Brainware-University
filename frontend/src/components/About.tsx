import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Github, Linkedin, GraduationCap, BarChart3, ShieldAlert, Brain, Users, Award, Target } from 'lucide-react';

const About: React.FC = () => {
  const team = [
    { 
      name: 'Somenath Gorai', 
      role: 'Team Leader & Full Stack Developer(Backend+Frontend)', 
      linkedin: 'https://www.linkedin.com/in/sov-ereign/', 
      github: 'https://github.com/Sov-ereign',
      description: 'BTech CSE @ Brainware University | AI & Cybersecurity Explorer | Building AI-powered solutions'
    },
    { 
      name: 'Subham Mandal', 
      role: 'Backend Developer', 
      linkedin: '#', 
      github: '#',
      description: 'Backend Development & ML Integration Specialist'
    },
    { 
      name: 'Madhure Das', 
      role: 'Frontend Developer', 
      linkedin: '#', 
      github: '#',
      description: 'Frontend Development Expert'
    },
  ];

  const features = [
    {
      icon: BarChart3,
      title: 'Orato-AI',
      description: 'Advanced presentation analysis using computer vision and AI to evaluate body language, facial expressions, and speech patterns for comprehensive performance insights.',
      color: 'text-blue-600'
    },
    {
      icon: GraduationCap,
      title: 'Campus-AI',
      description: 'Intelligent campus assistant powered by Gemini AI, providing real-time information about timetables, subjects, and academic resources for students.',
      color: 'text-green-600'
    },
    {
      icon: ShieldAlert,
      title: 'Scam Detector',
      description: 'Hybrid fraud detection system combining ML models (TF-IDF + SVM) with Gemini AI for accurate SMS spam detection and real-time security alerts.',
      color: 'text-red-600'
    }
  ];

  const openLink = (url?: string) => {
    if (url && url.trim().length > 0 && url !== '#') window.open(url, '_blank', 'noopener');
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center py-12 bg-gradient-to-br from-[#003399] to-[#1e40af] text-white rounded-2xl">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center justify-center mb-4">
            <Award className="w-8 h-8 mr-3" />
            <span className="text-lg font-semibold">Nexathon 2025</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Neuravos X Brainware University</h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-6">Professional Analysis Platform</p>
          <p className="text-lg text-blue-200 max-w-3xl mx-auto">
            An integrated AI-powered platform combining presentation evaluation, campus assistance, and fraud detection 
            to revolutionize educational and professional development.
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#003399] mb-4">Our Platform Features</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Three powerful AI modules working together to provide comprehensive analysis and assistance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-white border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gray-50 flex items-center justify-center`}>
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl text-[#003399]">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#003399] mb-4">Meet Team Apexars</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A passionate team of developers from Brainware University, building the future of AI-powered education
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <Card key={index} className="bg-white border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#003399] to-[#1e40af] flex items-center justify-center">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-xl text-[#003399]">{member.name}</CardTitle>
                <p className="text-sm font-semibold text-gray-600 mb-2">{member.role}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{member.description}</p>
              </CardHeader>
              <CardContent className="flex items-center justify-center gap-3">
                <Button
                  variant="outline"
                  className="border-[#003399] text-[#003399] hover:bg-[#003399] hover:text-white"
                  onClick={() => openLink(member.linkedin)}
                >
                  <Linkedin className="w-4 h-4 mr-2" /> LinkedIn
                </Button>
                <Button
                  variant="outline"
                  className="border-[#003399] text-[#003399] hover:bg-[#003399] hover:text-white"
                  onClick={() => openLink(member.github)}
                >
                  <Github className="w-4 h-4 mr-2" /> GitHub
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Mission Section */}
      <Card className="bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200">
        <CardContent className="py-12">
          <div className="text-center max-w-4xl mx-auto">
            <Target className="w-16 h-16 mx-auto mb-6 text-[#003399]" />
            <h2 className="text-3xl md:text-4xl font-bold text-[#003399] mb-6">Our Mission</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              To democratize AI-powered analysis and create intelligent solutions that enhance learning, 
              professional development, and security awareness. We believe in the power of technology 
              to transform education and make advanced AI accessible to everyone.
            </p>
            <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-[#003399]" />
                <span>AI-Powered</span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#003399]" />
                <span>Education-Focused</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-[#003399]" />
                <span>Security-First</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center py-8">
        <p className="text-gray-500 mb-2">Built with ❤️ by Team Apexars for Nexathon 2025</p>
        <p className="text-sm text-gray-400">Brainware University | Computer Science Engineering</p>
      </div>
    </div>
  );
};

export default About;