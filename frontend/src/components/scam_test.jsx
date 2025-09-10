import { useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";

export default function Home() {
  const API_URL = `${import.meta.env.VITE_API_BASE_URL || "https://neuravos-x-brainware-university.onrender.com"}/scam/predict`;
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const checkMessage = async () => {
    if (!message.trim()) {
      alert("⚠️ Please enter a message before checking.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const response = await axios.post(API_URL, { message });
      setResult(response.data);
    } catch (err) {
      const backendError = err?.response?.data?.error;
      const msg = backendError || err?.message || "⚠️ Could not connect to backend API.";
      setError(msg);
      console.error("Scam check error:", err);
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Card className="border-muted bg-white">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl md:text-2xl text-[#003399]">📱 Fraud Alert System</CardTitle>
              <p className="text-sm text-black mt-1">Hybrid ML + Gemini evaluation for SMS messages</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Message</label>
            <textarea
              className="w-full p-3 resize-none border rounded-md border-gray-300 bg-white text-slate-900 placeholder:text-slate-400"
              placeholder="Type or paste the SMS content..."
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <p className="text-[12px] text-black  mt-1">We do not store your message. It's used only for this evaluation.</p>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">{error}</div>
          )}

          {result && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
                  <span className={`px-2 py-1 rounded-md ${String(result.final_prediction).toLowerCase()==='spam' ? 'bg-[#003399] text-white' : 'bg-[#003399] text-white'}`}>
                    {String(result.final_prediction).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-between gap-3">
          <Button onClick={checkMessage} disabled={loading} className="bg-[#003399] text-white font-bold hover:bg-[#003399]/90">
            {loading ? "Checking..." : "🔍 Check Message"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
