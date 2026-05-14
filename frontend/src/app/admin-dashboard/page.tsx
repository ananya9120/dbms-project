"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, AlertCircle, ClipboardList, Clock, Zap, LogOut, Plus, ShieldCheck, UserPlus, Settings, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [techForm, setTechForm] = useState({ name: "", phone: "", area: "", email: "" });
  const [adminName, setAdminName] = useState("Admin");
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [highlightTechForm, setHighlightTechForm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (!token) return router.push("/login");
        setAdminName(user.name || "Admin");

        const headers = { Authorization: `Bearer ${token}` };
        
        const [dashRes, compRes, anomRes, techRes] = await Promise.all([
          axios.get("http://localhost:3000/api/admin/dashboard", { headers }),
          axios.get("http://localhost:3000/api/admin/complaints", { headers }),
          axios.get("http://localhost:3000/api/admin/anomalies", { headers }),
          axios.get("http://localhost:3000/api/admin/technicians", { headers })
        ]);

        setStats(dashRes.data);
        setComplaints(compRes.data);
        setAnomalies(anomRes.data);
        setTechnicians(techRes.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        router.push("/login");
      }
    };

    fetchAdminData();
  }, [router]);

  const handleAssign = async (complaintId: string, technicianId: string) => {
    if (technicianId === "cancel" || !technicianId) {
      setAssigningId(null);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:3000/api/admin/assign-complaint", {
        complaintId,
        technicianId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert("Technician Assigned Successfully!");
      setAssigningId(null);
      window.location.reload();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to assign technician.");
    }
  };

  const handleTechSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:3000/api/admin/technician", techForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTechForm({ name: "", phone: "", area: "", email: "" });
      alert("Technician onboarded! Credentials: " + techForm.email + " / tech123");
      window.location.reload();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to add technician");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-irctc-orange border-t-transparent rounded-full animate-spin"></div>
          <p className="text-irctc-orange font-bold font-mono uppercase tracking-widest text-xs">Initializing Command Center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="bg-white border-b border-gray-200 py-6 mb-8 shadow-sm">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-irctc-orange/10 p-3 rounded-lg text-irctc-orange">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-irctc-blue">Admin Control Center</h1>
              <p className="text-gray-500 text-sm font-medium">Operator: {adminName} | System Status: <span className="text-green-600 font-bold uppercase tracking-widest text-xs">Optimal</span></p>
            </div>
          </div>
          <button onClick={() => { localStorage.clear(); router.push("/"); }} className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700 transition-colors shadow-md flex items-center gap-2 text-sm">
            <LogOut size={18} /> LOGOUT
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-irctc-blue">
            <p className="text-xs font-bold text-gray-400 uppercase mb-1">Grid Consumers</p>
            <p className="text-2xl font-black text-irctc-blue">{stats.totalUsers || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-red-500">
            <p className="text-xs font-bold text-gray-400 uppercase mb-1">Anomalies Detected</p>
            <p className="text-2xl font-black text-red-600">{stats.totalAnomalies || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-irctc-orange">
            <p className="text-xs font-bold text-gray-400 uppercase mb-1 tracking-tight">Resolution Ratio</p>
            <div className="flex items-end gap-2">
              <p className="text-2xl font-black text-irctc-orange">{stats.resolvedComplaints || 0}/{stats.totalComplaints || 0}</p>
              <span className="text-[10px] text-gray-400 mb-1 font-bold">TASK CLOSED</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
            <p className="text-xs font-bold text-gray-400 uppercase mb-1">Avg Resolution Time</p>
            <p className="text-2xl font-black text-green-600">{stats.avgResolutionTime || 0} <span className="text-xs font-normal">HRS</span></p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className={`lg:col-span-4 bg-white rounded-xl shadow-md border ${highlightTechForm ? 'border-irctc-orange ring-4 ring-irctc-orange/10 scale-[1.02]' : 'border-gray-100'} p-8 h-fit transition-all duration-500`}>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <UserPlus className={`${highlightTechForm ? 'text-irctc-orange animate-bounce' : 'text-irctc-blue'}`} size={24} />
              <h3 className={`text-xl font-bold ${highlightTechForm ? 'text-irctc-orange' : 'text-irctc-blue'}`}>Onboard Technician</h3>
            </div>
            
            <form onSubmit={handleTechSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">FULL NAME</label>
                <input 
                  className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:border-irctc-blue outline-none transition-colors"
                  placeholder="e.g. Rahul Sharma"
                  value={techForm.name}
                  onChange={e => setTechForm({...techForm, name: e.target.value})}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Contact</label>
                  <input className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-irctc-blue outline-none" placeholder="+91..." value={techForm.phone} onChange={e => setTechForm({...techForm, phone: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Email</label>
                  <input type="email" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-irctc-blue outline-none" placeholder="tech@grid.com" value={techForm.email} onChange={e => setTechForm({...techForm, email: e.target.value})} required />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">ASSIGNED ZONE</label>
                <input className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:border-irctc-blue outline-none transition-colors" placeholder="e.g. South Sector" value={techForm.area} onChange={e => setTechForm({...techForm, area: e.target.value})} required />
              </div>
              <button className="w-full bg-irctc-blue text-white font-bold py-4 rounded-lg mt-4 shadow-lg hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
                <Plus size={18} /> Add to Fleet
              </button>
            </form>
          </div>

          <div className="lg:col-span-8 bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden flex flex-col h-[600px]">
            <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex justify-between items-center">
              <h3 className="font-bold text-irctc-blue flex items-center gap-2 uppercase tracking-tight text-sm"><ClipboardList size={20} /> Complaints Queue</h3>
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Active Operations</div>
            </div>
            <div className="flex-1 overflow-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 text-gray-500 text-[10px] font-bold uppercase tracking-widest sticky top-0 bg-white/90 backdrop-blur z-10 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Issue</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Technician</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {complaints.map((c: any) => (
                    <tr key={c._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-gray-800">{c.userId?.name || "Unknown"}</div>
                        <div className="text-[10px] text-gray-400">{new Date(c.date).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-irctc-blue font-semibold">{c.issueType}</div>
                        <div className="text-[10px] text-gray-400 max-w-[200px] truncate uppercase font-medium">{c.description}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black tracking-widest ${c.isAutoGenerated ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                          {c.isAutoGenerated ? 'AI_ALERT' : 'USER'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          c.status === 'Resolved' ? 'bg-green-100 text-green-800' : 
                          c.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                        {c.technicianId?.name || (
                          assigningId === c._id ? (
                            <select className="border border-gray-200 rounded p-1 text-xs outline-none focus:border-irctc-blue" onChange={(e) => handleAssign(c._id, e.target.value)} defaultValue="">
                              <option value="" disabled>Select Tech</option>
                              {technicians.map((t: any) => (
                                <option key={t._id} value={t._id}>{t.name} ({t.area})</option>
                              ))}
                              <option value="cancel" onClick={() => setAssigningId(null)}>Cancel</option>
                            </select>
                          ) : (
                            <button onClick={() => { if (technicians.length === 0) { setHighlightTechForm(true); setTimeout(() => setHighlightTechForm(false), 3000); window.scrollTo({ top: 0, behavior: 'smooth' }); } else { setAssigningId(c._id); } }} className="text-irctc-orange font-bold hover:underline flex items-center gap-1 text-xs uppercase">
                              <Plus size={14} /> Assign
                            </button>
                          )
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:col-span-12 bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden mt-8">
            <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex items-center gap-2 text-irctc-blue">
              <Users size={20} />
              <h3 className="font-bold uppercase tracking-widest text-sm">Active Technician Fleet</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Contact</th>
                    <th className="px-6 py-4">Zone</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {technicians.map((t: any) => (
                    <tr key={t._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-800">{t.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{t.phone}</td>
                      <td className="px-6 py-4 text-sm text-irctc-blue font-semibold uppercase">{t.area}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider ${t.available ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                          {t.available ? 'Ready' : 'In Field'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
