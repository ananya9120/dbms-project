"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ComposedChart, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid } from "recharts";
import { Activity, AlertTriangle, Zap, LogOut, CheckCircle2, TrendingUp, History, CreditCard, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [surgeNotes, setSurgeNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReason, setSelectedReason] = useState("Home Event / Party");
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

        // Sort readings by date and ensure unique display dates
        const sortedReadings = res.data.readings
          .sort((a: any, b: any) => new Date(a.readingDate).getTime() - new Date(b.readingDate).getTime());

        const readings = sortedReadings.map((r: any, idx: number) => ({
          ...r,
          // Create a truly unique key for Recharts to handle duplicate timestamps
          chartId: `${r._id || idx}`,
          displayDate: new Date(r.readingDate).toLocaleString('en-GB', { 
            day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' 
          }),
          prediction: r.isAnomaly ? r.unitsConsumed * 0.6 : r.unitsConsumed * 1.1
        }));

        const lastReading = readings[readings.length - 1];
        const nextMonth = {
          chartId: "next-month",
          displayDate: "Month (Projected)",
          prediction: res.data.nextPrediction || (lastReading ? lastReading.unitsConsumed * 1.05 : 200),
          unitsConsumed: null
        };

        const formattedData = {
          ...res.data,
          readings: [...readings, nextMonth]
        };
        
        setData(formattedData);
        
        // Fetch surge notes
        const notesRes = await axios.get("http://localhost:3000/api/user/usage-notes", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSurgeNotes(notesRes.data);

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
        readingDate: new Date().toISOString(),
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

  // Custom Light Tooltip Component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      // Find the actual reading for this label (which is the chartId)
      const reading = data.readings.find((r: any) => r.chartId === label);
      const displayLabel = reading ? reading.displayDate : label;

      return (
        <div className="bg-white border border-gray-200 p-3 rounded-lg shadow-xl">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 border-b border-gray-100 pb-1">{displayLabel}</p>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
                  <span className="text-xs text-gray-600">{entry.name}:</span>
                </div>
                <span className="text-xs font-bold" style={{ color: entry.color }}>
                  {entry.value ? `${Math.round(entry.value)} kWh` : 'N/A'}
                </span>
              </div>
            ))}
          </div>
          {reading?.isExpected ? (
            <div className="mt-2 pt-1 border-t border-blue-100 text-[9px] font-bold text-blue-500 uppercase flex items-center gap-1">
              <CheckCircle2 size={10} /> Expected Surge ({reading.surgeReason})
            </div>
          ) : reading?.isAnomaly && (
            <div className="mt-2 pt-1 border-t border-red-100 text-[9px] font-bold text-red-500 uppercase flex items-center gap-1">
              <AlertTriangle size={10} /> Anomaly Detected
            </div>
          )}
        </div>
      );
    }
    return null;
  };

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
                    <ComposedChart data={data.readings} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
                      <defs>
                        <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#213d77" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#213d77" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="chartId" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#666', fontSize: 10, fontWeight: '500' }} 
                        tickFormatter={(id) => {
                          const r = data.readings.find((item: any) => item.chartId === id);
                          return r ? r.displayDate : id;
                        }}
                        angle={-45}
                        textAnchor="end"
                        dy={20}
                        interval={0}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#666', fontSize: 10, fontWeight: '500' }} 
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area 
                        type="monotone" 
                        dataKey="unitsConsumed" 
                        stroke="#213d77" 
                        strokeWidth={3} 
                        fillOpacity={1} 
                        fill="url(#colorUsage)" 
                        name="Actual Usage" 
                        dot={{ r: 4, fill: '#213d77', strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 6, fill: '#213d77', strokeWidth: 0 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="prediction" 
                        stroke="#fb792b" 
                        strokeWidth={2} 
                        strokeDasharray="5 5" 
                        dot={{ r: 4, fill: '#fb792b', strokeWidth: 2, stroke: '#fff' }}
                        name="AI Prediction" 
                      />
                    </ComposedChart>
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
                        readingDate: new Date().toISOString(),
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
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            r.isExpected ? 'bg-blue-100 text-blue-800' : 
                            (r.isAnomaly ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800')
                          }`}>
                            {r.isExpected ? 'Expected Surge' : (r.isAnomaly ? 'Anomaly' : 'Standard')}
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

            {/* Report Expected Surge Card */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-irctc-orange/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-irctc-orange/10 transition-colors"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4 text-irctc-orange">
                  <Zap size={20} />
                  <h3 className="font-bold">REPORT EXPECTED SURGE</h3>
                </div>
                <p className="text-sm text-gray-500 mb-4">Planning an event or installing new appliances? Let us know to prevent false anomaly alerts.</p>
                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target as HTMLFormElement);
                    const data = Object.fromEntries(formData.entries());
                    
                    // Use custom specifies reason if 'Other' is chosen
                    if (data.reason === "Other" && data.customReason) {
                      data.reason = data.customReason;
                    }
                    delete data.customReason;

                    const token = localStorage.getItem("token");
                    try {
                      const res = await fetch("http://localhost:3000/api/user/usage-note", {
                        method: "POST",
                        headers: { 
                          "Content-Type": "application/json",
                          "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify(data)
                      });
                      const result = await res.json();
                      if (res.ok) {
                        alert(result.message);
                        (e.target as HTMLFormElement).reset();
                        setSelectedReason("Home Event / Party");
                        
                        // Dynamically refresh surge notes list in UI
                        const notesRes = await fetch("http://localhost:3000/api/user/usage-notes", {
                          headers: { Authorization: `Bearer ${token}` }
                        });
                        if (notesRes.ok) {
                          const updatedNotes = await notesRes.json();
                          setSurgeNotes(updatedNotes);
                        }
                      } else {
                        alert(result.error);
                      }
                    } catch (err) {
                      alert("Submission failed.");
                    }
                  }}
                  className="space-y-3"
                >
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">From</label>
                      <input name="startDate" required type="date" className="w-full px-2 py-2 text-xs border border-gray-100 rounded bg-gray-50 outline-none focus:border-irctc-orange transition-all" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">To</label>
                      <input name="endDate" required type="date" className="w-full px-2 py-2 text-xs border border-gray-100 rounded bg-gray-50 outline-none focus:border-irctc-orange transition-all" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Reason</label>
                    <select 
                      name="reason" 
                      value={selectedReason}
                      onChange={(e) => setSelectedReason(e.target.value)}
                      className="w-full px-2 py-2 text-xs border border-gray-100 rounded bg-gray-50 outline-none focus:border-irctc-orange transition-all appearance-none"
                    >
                      <option>Home Event / Party</option>
                      <option>New Heavy Appliance</option>
                      <option>Construction Work</option>
                      <option>Guests Staying Over</option>
                      <option>Other</option>
                    </select>
                  </div>
                  {selectedReason === "Other" && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      transition={{ duration: 0.2 }}
                      className="space-y-1 overflow-hidden"
                    >
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Specify Reason</label>
                      <input 
                        name="customReason" 
                        required 
                        type="text" 
                        placeholder="Please specify the reason"
                        className="w-full px-2 py-2 text-xs border border-gray-100 rounded bg-gray-50 outline-none focus:border-irctc-orange transition-all focus:ring-1 focus:ring-irctc-orange" 
                      />
                    </motion.div>
                  )}
                  <button type="submit" className="w-full py-2 bg-irctc-orange text-white text-xs font-bold rounded shadow hover:bg-opacity-90 transition-all uppercase tracking-wider">
                    Save Preemptive Note
                  </button>
                </form>
              </div>
            </div>

            {/* List of active surge reports */}
            {surgeNotes.length > 0 && (
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-blue-500" /> Active Reports
                </h3>
                <div className="space-y-3">
                  {surgeNotes.filter(n => n.isActive).map((note: any) => (
                    <div key={note._id} className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-blue-800">{note.reason}</span>
                        <span className="text-[10px] text-blue-500 font-mono">
                          {new Date(note.startDate).toLocaleDateString()} - {new Date(note.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-[11px] text-blue-600 mt-1">{note.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

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

            {/* Payment History Card */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4 text-irctc-blue">
                <TrendingUp size={20} />
                <h3 className="font-bold">RECENT PAYMENTS</h3>
              </div>
              <div className="space-y-4">
                {data.payments && data.payments.length > 0 ? data.payments.slice(0, 3).map((p: any) => (
                  <div key={p._id} className="border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-mono font-bold text-gray-400">{p.transactionId}</span>
                      <span className="text-sm font-black text-green-600">${p.amount.toFixed(2)}</span>
                    </div>
                    <div className="text-[10px] text-gray-500">{new Date(p.paymentDate).toLocaleDateString()} • {p.status}</div>
                  </div>
                )) : (
                  <div className="text-center py-4 text-gray-400 text-sm">
                    No payment history found.
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
