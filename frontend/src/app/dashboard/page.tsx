"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid } from "recharts";
import { Activity, AlertTriangle, Zap, LogOut, CheckCircle2, TrendingUp, History, CreditCard, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const res = await axios.get("http://localhost:3000/api/user/dashboard", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const readings = res.data.readings.map((r: any) => ({
          ...r,
          displayDate: new Date(r.readingDate).toLocaleDateString(),
          prediction: r.isAnomaly ? r.unitsConsumed * 0.6 : r.unitsConsumed * 1.1
        }));

        const lastReading = readings[readings.length - 1];
        const nextMonth = {
          displayDate: "Next Month (Projected)",
          prediction: res.data.nextPrediction || (lastReading ? lastReading.unitsConsumed * 1.05 : 200),
          unitsConsumed: null
        };

        const formattedData = {
          ...res.data,
          readings: [...readings, nextMonth]
        };
        
        setData(formattedData);
        setLoading(false);
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
        router.push("/login");
      }
    };

    fetchData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    router.push("/");
  };

  const simulateMeter = async (forceAnomaly: boolean) => {
    try {
      const token = localStorage.getItem("token");
      const predRes = await axios.get("http://localhost:3000/api/user/prediction?season=Summer", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const basePrediction = predRes.data?.prediction || 200;
      let units = basePrediction * (Math.random() * 0.2 + 0.9);
      if (forceAnomaly) units = basePrediction * (Math.random() * 0.5 + 1.6);

      const res = await axios.post("http://localhost:3000/api/user/reading", {
        readingDate: new Date().toISOString().split('T')[0],
        unitsConsumed: Math.round(units),
        season: 'Summer'
      }, { headers: { Authorization: `Bearer ${token}` } });

      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-irctc-blue border-t-transparent rounded-full animate-spin"></div>
          <p className="text-irctc-blue font-bold">Synchronizing Grid Data...</p>
        </div>
      </div>
    );
  }

  const unpaidTotal = data.readings.filter((r: any) => !r.isPaid).reduce((acc: number, curr: any) => acc + (curr.billAmount || 0), 0);
  const recentAlerts = data.alerts.slice(0, 3);
  const recentComplaints = data.complaints.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Dashboard Header */}
      <div className="bg-white border-b border-gray-200 py-6 mb-8 shadow-sm">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-irctc-blue/10 p-3 rounded-lg text-irctc-blue">
              <TrendingUp size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-irctc-blue">Welcome, {JSON.parse(localStorage.getItem("user") || "{}").name || "User"}</h1>
              <p className="text-gray-500 text-sm">Consumer ID: {JSON.parse(localStorage.getItem("user") || "{}")._id?.substring(0, 8).toUpperCase()}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 font-bold hover:bg-red-50 px-4 py-2 rounded-md transition-colors border border-red-200">
            <LogOut size={18} /> DISCONNECT SESSION
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Stats Column */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Neighborhood Comparison Widget */}
            {data.areaComparison !== undefined && (
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 flex items-center justify-between overflow-hidden relative group">
                <div className="relative z-10">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <TrendingUp size={14} className="text-irctc-orange" /> Local Area Insight
                  </h3>
                  <p className="text-xl font-bold text-irctc-blue">
                    Your usage is {Math.abs(data.areaComparison)}% {data.areaComparison > 0 ? 'Higher' : 'Lower'} 
                    <span className="text-gray-500 font-normal text-sm block">than similar households in {JSON.parse(localStorage.getItem("user") || "{}").area}</span>
                  </p>
                </div>
                <div className={`p-4 rounded-full ${data.areaComparison > 0 ? 'bg-orange-50 text-irctc-orange' : 'bg-green-50 text-green-600'} transition-transform group-hover:scale-110`}>
                  {data.areaComparison > 0 ? <AlertTriangle size={32} /> : <CheckCircle2 size={32} />}
                </div>
                {/* Micro-animation decorative element */}
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gray-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
              </div>
            )}
            
            {/* Chart Widget */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
              <div className="bg-irctc-blue text-white px-6 py-4 flex justify-between items-center">
                <h2 className="font-bold flex items-center gap-2"><Activity size={18} /> USAGE ANALYTICS</h2>
                <span className="text-xs bg-white/20 px-2 py-1 rounded">REAL-TIME</span>
              </div>
              <div className="p-6">
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.readings}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <defs>
                        <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#213d77" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#213d77" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="displayDate" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 12 }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      />
                      <Area type="monotone" dataKey="unitsConsumed" stroke="#213d77" strokeWidth={3} fillOpacity={1} fill="url(#colorUsage)" name="Units Consumed" />
                      <Line type="monotone" dataKey="prediction" stroke="#fb792b" strokeWidth={2} strokeDasharray="5 5" dot={false} name="AI Prediction" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Manual Meter Reading Entry */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-lg font-bold text-irctc-blue mb-1">Manual Meter Reading</h3>
                  <p className="text-gray-500 text-sm">Enter the current units displayed on your smart meter for bill generation.</p>
                </div>
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const units = (e.target as any).units.value;
                    if (units) {
                      const token = localStorage.getItem("token");
                      axios.post("http://localhost:3000/api/user/reading", {
                        readingDate: new Date().toISOString().split('T')[0],
                        unitsConsumed: parseInt(units),
                        season: 'Summer'
                      }, { headers: { Authorization: `Bearer ${token}` } })
                      .then(() => window.location.reload())
                      .catch(err => alert(err.response?.data?.error || "Submission failed"));
                    }
                  }}
                  className="flex gap-4 w-full md:w-auto"
                >
                  <input 
                    name="units" 
                    type="number" 
                    placeholder="Enter Units (kWh)" 
                    required 
                    className="flex-1 md:w-48 px-4 py-3 border border-gray-200 rounded-lg focus:border-irctc-blue outline-none text-sm"
                  />
                  <button type="submit" className="px-6 py-3 bg-irctc-blue text-white font-black rounded-lg hover:bg-opacity-95 transition-all shadow-md uppercase tracking-wider text-xs">
                    Submit Reading
                  </button>
                </form>
              </div>
            </div>

            {/* History Table */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-100 px-6 py-4">
                <h3 className="font-bold text-irctc-blue flex items-center gap-2"><History size={18} /> READING HISTORY</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50/50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Units</th>
                      <th className="px-6 py-4">Bill Amount</th>
                      <th className="px-6 py-4">Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.readings.filter((r: any) => r.unitsConsumed !== null).map((r: any, i: number) => (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm">{r.displayDate}</td>
                        <td className="px-6 py-4 text-sm font-bold text-irctc-blue">{r.unitsConsumed} <span className="font-normal text-gray-400">kWh</span></td>
                        <td className="px-6 py-4 text-sm">${r.billAmount?.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${r.isAnomaly ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                            {r.isAnomaly ? 'Anomaly' : 'Standard'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Action Column */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Billing Card */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
              <div className="bg-irctc-orange p-6 text-white text-center">
                <p className="text-white/80 text-sm font-bold mb-1 uppercase tracking-wider">Pending Balance</p>
                <div className="text-4xl font-black mb-4">${unpaidTotal.toFixed(2)}</div>
                {unpaidTotal > 0 ? (
                  <button 
                    onClick={() => router.push("/payment")}
                    className="w-full py-3 bg-white text-irctc-orange font-bold rounded-lg shadow-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <CreditCard size={18} /> PAY NOW
                  </button>
                ) : (
                  <div className="flex items-center justify-center gap-2 bg-white/20 py-2 rounded-lg">
                    <CheckCircle2 size={18} /> ALL BILLS PAID
                  </div>
                )}
              </div>
            </div>

            {/* Critical Alerts */}

            {/* Critical Alerts */}
            <div className="bg-red-50 rounded-xl border border-red-100 p-6">
              <div className="flex items-center gap-2 mb-4 text-red-700">
                <AlertTriangle size={20} />
                <h3 className="font-bold">SYSTEM ALERTS</h3>
              </div>
              <div className="space-y-4">
                {recentAlerts.length > 0 ? recentAlerts.map((alert: any) => (
                  <div key={alert._id} className="bg-white border border-red-200 p-4 rounded-lg shadow-sm">
                    <span className="text-[10px] text-gray-400 font-bold uppercase">{new Date(alert.alertDate).toLocaleDateString()}</span>
                    <p className="text-sm text-gray-800 mt-1">{alert.details}</p>
                  </div>
                )) : (
                  <div className="text-center py-4 text-gray-400 text-sm">
                    No critical issues reported.
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
