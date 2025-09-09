import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Video, Award, Calendar, Clock } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('analyses');
      setItems(stored ? JSON.parse(stored) : []);
    } catch {
      setItems([]);
    }
  }, []);

  const totals = useMemo(() => {
    const total = items.length;
    const avg = total ? Math.round(items.reduce((s, a) => s + (a.overall_score || 0), 0) / total) : 0;
    const last = items[0]?.createdAt ? new Date(items[0].createdAt) : null;
    return { total, avg, last };
  }, [items]);

  const recentAnalyses = useMemo(() => {
    const byWeek = new Map<string, { name: string; presentations: number; scoreSum: number }>();
    items.forEach((a) => {
      const d = a.createdAt ? new Date(a.createdAt) : new Date();
      const yearStart = new Date(d.getFullYear(), 0, 1);
      const diffDays = Math.floor((+d - +yearStart) / 86400000);
      const week = Math.ceil((diffDays + yearStart.getDay() + 1) / 7);
      const key = `${d.getFullYear()}-W${week}`;
      if (!byWeek.has(key)) byWeek.set(key, { name: key, presentations: 0, scoreSum: 0 });
      const row = byWeek.get(key)!;
      row.presentations += 1;
      row.scoreSum += a.overall_score || 0;
    });
    return Array.from(byWeek.values())
      .map((r) => ({ name: r.name, presentations: r.presentations, score: Math.round(r.scoreSum / Math.max(1, r.presentations)) }))
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(-8);
  }, [items]);

  const skillsData = useMemo(() => {
    if (!items[0]) return [
      { skill: 'Body Language', score: 0 },
      { skill: 'Speech Clarity', score: 0 },
      { skill: 'Engagement', score: 0 },
      { skill: 'Confidence', score: 0 },
    ];
    const last = items[0];
    return [
      { skill: 'Body Language', score: last.body_score || 0 },
      { skill: 'Speech Clarity', score: last.speech_score || 0 },
      { skill: 'Engagement', score: Math.round(((last.emotion_analysis?.emotions?.happy || 0) * 100)) },
      { skill: 'Confidence', score: last.body_language?.score || 0 },
    ];
  }, [items]);

  const emotionData = useMemo(() => {
    const dist = items[0]?.emotion_analysis?.emotions || {};
    const entries = Object.entries(dist).slice(0, 6);
    const palette = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316'];
    return entries.map(([name, value], i) => ({ name, value: Math.round((value as number) * 100), color: palette[i % palette.length] }));
  }, [items]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#003399] mb-2">Dashboard Overview</h1>
          <p className="text-gray-600">Track your presentation performance and improvement over time</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-[#003399]">Welcome back!</div>
          <div className="text-gray-500 text-sm">Last analysis: {totals.last ? totals.last.toLocaleString() : '—'}</div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total Analyses</p>
                <p className="text-3xl font-bold text-gray-900">{totals.total}</p>
                <p className="text-blue-600 text-xs">Local history</p>
              </div>
              <Video className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Average Score</p>
                <p className="text-3xl font-bold text-gray-900">{totals.avg}</p>
                <p className="text-green-600 text-xs">Across saved analyses</p>
              </div>
              <Award className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Top Emotion</p>
                <p className="text-3xl font-bold text-gray-900">{items[0]?.emotion || '—'}</p>
                <p className="text-purple-600 text-xs">Latest analysis</p>
              </div>
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 text-sm font-medium">Last Score</p>
                <p className="text-3xl font-bold text-gray-900">{items[0]?.overall_score ?? '—'}</p>
                <p className="text-yellow-600 text-xs">Most recent</p>
              </div>
              <Calendar className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trend */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-900">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span>Performance Trend</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={recentAnalyses}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#2563EB" 
                    strokeWidth={3}
                    dot={{ fill: '#2563EB', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Emotion Analysis */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-900">
              <Users className="w-5 h-5 text-purple-600" />
              <span>Emotion Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={emotionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {emotionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #E5E7EB', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Skills Progress */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">Skills Assessment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {skillsData.map((skill, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">{skill.skill}</span>
                <span className="text-gray-900 font-bold">{skill.score}%</span>
              </div>
              <Progress value={skill.score} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {items.slice(0, 6).map((a) => (
              <div key={a.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div>
                  <p className="text-gray-900 font-medium">Presentation analyzed</p>
                  <p className="text-gray-500 text-sm">{new Date(a.createdAt).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600">{a.overall_score}%</div>
                  <div className="text-xs text-gray-500">Overall</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;