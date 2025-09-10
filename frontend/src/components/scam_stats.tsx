import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { useScamContext } from "../contexts/ScamContext";

export default function Stats() {
  const { history, clearHistory } = useScamContext();

  const spamCount = history.filter((h) => h.Final === "SPAM").length;
  const hamCount = history.filter((h) => h.Final === "HAM").length;
  const total = history.length;

  const data = [
    { name: "Spam", value: spamCount },
    { name: "Ham", value: hamCount },
  ];
  const COLORS = ["#ff7675", "#74b9ff"];

  return (
    <div className="p-3 sm:p-6 max-w-5xl mx-auto space-y-4 sm:space-y-6">
      <Card className="border-muted bg-[#f6f4f4]">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg sm:text-xl md:text-2xl text-[#003399]">📊 Hybrid Fraud Detection Stats</CardTitle>
              <p className="text-xs sm:text-sm text-blue-600 mt-1">Overview of recent SMS evaluations</p>
            </div>
            {history.length > 0 && (
              <Button 
                onClick={clearHistory} 
                variant="outline" 
                size="sm"
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                Clear History
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="text-4xl sm:text-6xl mb-4">📊</div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">No Data Yet</h3>
              <p className="text-sm sm:text-base text-gray-500 mb-4">Start checking messages in the Scam Detector to see statistics here.</p>
              <Button 
                onClick={() => window.location.href = '/scam-detector'}
                className="bg-[#003399] text-white hover:bg-[#003399]/90 text-sm sm:text-base"
              >
                Go to Scam Detector
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
              <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-lg border border-gray-300 p-3 bg-white">
              <span className="text-[#003399]">Total Checked</span>
                  <span className="font-semibold text-[#003399]">{total}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3 bg-white border-gray-300">
                  <span className="text-[#003399]">Spam</span>
                  <span className="font-semibold text-[#003399]">{spamCount}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3 bg-white border-gray-300">
                  <span className="text-[#003399]">Ham</span>
                  <span className="font-semibold text-[#003399]">{hamCount}</span>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <PieChart width={280} height={280} className="sm:w-80 sm:h-80">
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    dataKey="value"
                    label
                  >
                  {data.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </div>
            </div>
          )}

          {history.length > 0 && (
            <div className="mt-6">
              <h2 className="text-sm sm:text-base font-semibold mb-2 text-blue-800">📝 History (Last {history.length} Messages)</h2>
              <div className="overflow-x-auto rounded-lg border bg-white border-gray-300">
                <table className="w-full text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-3 py-2 text-left text-blue-800">Message</th>
                      <th className="px-3 py-2 text-left text-blue-800">ML</th>
                      <th className="px-3 py-2 text-left text-blue-800">Gemini</th>
                      <th className="px-3 py-2 text-left text-blue-800">Final</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((h, i) => (
                      <tr key={i} className="border-t border-gray-300">
                        <td className="px-3 py-2 text-blue-800">{h.Message}</td>
                        <td className="px-3 py-2">
                          <span className={`px-2 py-1 rounded-md ${h.ML === 'SPAM' ? 'bg-blue-800 font-bold text-[#ffffff] border border-red-200' : 'bg-blue-800 font-bold text-[#ffffff] border border-green-200'}`}>{h.ML}</span>
                        </td>
                        <td className="px-3 py-2">
                          <span className={`px-2 py-1 rounded-md ${h.Gemini === 'SPAM' ? 'bg-blue-800 font-bold text-[#ffffff] border border-red-200' : 'bg-blue-800 font-bold text-[#ffffff] border border-green-200'}`}>{h.Gemini}</span>
                        </td>
                        <td className="px-3 py-2">
                          <span className={`px-2 py-1 rounded-md ${h.Final === 'SPAM' ? 'bg-blue-800 font-bold text-[#ffffff]' : 'bg-blue-800 font-bold text-[#ffffff]'}`}>{h.Final}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
