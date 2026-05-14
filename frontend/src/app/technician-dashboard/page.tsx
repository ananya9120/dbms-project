"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ClipboardList, Clock, CheckCircle2, User, MapPin, Phone, MessageSquare, AlertTriangle, TrendingUp, Play, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function TechnicianDashboard() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return router.push("/login");

        const res = await axios.get("http://localhost:3000/api/technician/tasks", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTasks(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        router.push("/login");
      }
    };
    fetchData();
  }, [router]);

  const updateStatus = async (complaintId: string, status: string, notes: string = "") => {
    try {
      setUpdating(complaintId);
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:3000/api/technician/update-status", {
        complaintId, status, notes
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Refresh local state
      setTasks(tasks.map(t => t._id === complaintId ? { ...t, status, resolutionNotes: notes } : t));
      setUpdating(null);
    } catch (err) {
      console.error(err);
      setUpdating(null);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-irctc-orange border-t-transparent rounded-full animate-spin"></div>
        <p className="text-irctc-orange font-bold uppercase tracking-widest text-sm">Loading Field Tasks...</p>
      </div>
    </div>
  );

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'Assigned').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    resolved: tasks.filter(t => t.status === 'Resolved').length
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12 pt-8">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="bg-irctc-orange p-4 rounded-xl text-white shadow-lg shadow-irctc-orange/20">
              <ClipboardList size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Inspector Duty Queue</h1>
              <p className="text-gray-500 text-sm font-medium">Real-time task synchronization for {JSON.parse(localStorage.getItem("user") || "{}").name}</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-white px-6 py-3 rounded-xl shadow-sm border border-gray-100 text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Success Rate</p>
              <p className="text-xl font-black text-green-600">{tasks.length > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}%</p>
            </div>
            <div className="bg-white px-6 py-3 rounded-xl shadow-sm border border-gray-100 text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Open Tasks</p>
              <p className="text-xl font-black text-irctc-orange">{stats.pending + stats.inProgress}</p>
            </div>
          </div>
        </div>

        {/* Task Workflow Tracker */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Active Tasks Column */}
          <div className="lg:col-span-8 space-y-6">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <TrendingUp size={16} className="text-irctc-orange" /> Priority Workstream
            </h3>
            
            {tasks.length > 0 ? tasks.map((task: any) => (
              <motion.div 
                key={task._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white rounded-2xl shadow-md border-l-[6px] transition-all overflow-hidden ${
                  task.status === 'Resolved' ? 'border-green-500 opacity-75' : 
                  task.status === 'In Progress' ? 'border-irctc-blue' : 'border-irctc-orange'
                }`}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black bg-gray-100 text-gray-500 px-2 py-0.5 rounded tracking-widest uppercase">ID: {task._id.substring(18)}</span>
                        {task.isAutoGenerated && <span className="text-[10px] font-black bg-red-50 text-red-600 px-2 py-0.5 rounded tracking-widest uppercase">AI Alert</span>}
                      </div>
                      <h4 className="text-xl font-black text-irctc-blue tracking-tight mt-1">{task.issueType}</h4>
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                      task.status === 'Resolved' ? 'bg-green-100 text-green-700' : 
                      task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {task.status === 'Resolved' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                      {task.status}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-gray-100 p-2 rounded-lg text-gray-600">
                          <User size={18} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Consumer</p>
                          <p className="text-sm font-bold text-gray-800">{task.userId.name}</p>
                          <p className="text-xs text-gray-500">{task.userId.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-gray-100 p-2 rounded-lg text-gray-600">
                          <MapPin size={18} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Location</p>
                          <p className="text-sm font-medium text-gray-700 leading-snug">{task.userId.address}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Technical Description</p>
                      <p className="text-sm text-gray-600 italic leading-relaxed">"{task.description}"</p>
                    </div>
                  </div>

                  {/* Resolution Notes Input - Only shown when In Progress */}
                  {task.status === 'In Progress' && (
                    <div className="mb-6">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Inspection Notes & Findings</label>
                      <textarea 
                        id={`notes-${task._id}`}
                        className="w-full bg-blue-50/30 border border-irctc-blue/10 rounded-xl p-4 text-sm outline-none focus:border-irctc-blue transition-colors resize-none"
                        placeholder="Detail the work done, parts replaced, or cause of anomaly..."
                        rows={3}
                      ></textarea>
                    </div>
                  )}

                  {/* Resolved Notes View */}
                  {task.status === 'Resolved' && task.resolutionNotes && (
                    <div className="mb-6 bg-green-50 p-4 rounded-xl border border-green-100">
                      <p className="text-[10px] font-bold text-green-700 uppercase tracking-widest mb-1">Resolution Summary</p>
                      <p className="text-sm text-green-800">{task.resolutionNotes}</p>
                    </div>
                  )}

                  {/* Workflow Actions */}
                  <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                    {task.status === 'Assigned' && (
                      <button 
                        onClick={() => updateStatus(task._id, 'In Progress')}
                        disabled={updating === task._id}
                        className="flex items-center gap-2 bg-irctc-blue text-white px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-widest hover:shadow-lg hover:shadow-irctc-blue/20 transition-all disabled:opacity-50"
                      >
                        <Play size={16} fill="currentColor" /> Start Inspection
                      </button>
                    )}
                    
                    {task.status === 'In Progress' && (
                      <button 
                        onClick={() => {
                          const notes = (document.getElementById(`notes-${task._id}`) as HTMLTextAreaElement).value;
                          updateStatus(task._id, 'Resolved', notes);
                        }}
                        disabled={updating === task._id}
                        className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-widest hover:shadow-lg hover:shadow-green-600/20 transition-all disabled:opacity-50"
                      >
                        <Check size={18} /> Mark as Resolved
                      </button>
                    )}

                    <div className="flex-1"></div>

                    {task.status !== 'Resolved' && (
                      <a href={`tel:${task.userId.phone}`} className="flex items-center gap-2 text-irctc-blue font-bold text-xs hover:underline">
                        <Phone size={14} /> CONTACT USER
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="bg-white p-20 rounded-2xl border border-dashed border-gray-200 text-center">
                <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                  <CheckCircle2 size={40} />
                </div>
                <h4 className="text-gray-400 font-bold uppercase tracking-widest">All Clear</h4>
                <p className="text-sm text-gray-400 mt-1">No pending tasks assigned to your profile.</p>
              </div>
            )}
          </div>

          {/* Side Performance Column */}
          <div className="lg:col-span-4 space-y-8">
            {/* Live Progress Bar for Admin Tracking */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-tight mb-4 flex items-center gap-2">
                <TrendingUp size={16} className="text-irctc-blue" /> Daily Progression
              </h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-500 uppercase mb-2">
                    <span>Task Completion</span>
                    <span>{stats.resolved}/{stats.total}</span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 transition-all duration-1000" 
                      style={{ width: `${(stats.resolved / stats.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-xl text-center">
                    <p className="text-[10px] font-bold text-blue-400 uppercase mb-1">In Progress</p>
                    <p className="text-2xl font-black text-irctc-blue">{stats.inProgress}</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-xl text-center">
                    <p className="text-[10px] font-bold text-orange-400 uppercase mb-1">Queueing</p>
                    <p className="text-2xl font-black text-irctc-orange">{stats.pending}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Support Guide */}
            <div className="bg-irctc-blue rounded-2xl p-6 text-white shadow-xl shadow-irctc-blue/20">
              <h3 className="font-black text-lg uppercase tracking-tight mb-4">Operational Protocol</h3>
              <ul className="space-y-4 text-xs font-medium text-blue-100">
                <li className="flex gap-3">
                  <div className="bg-white/10 p-1 rounded-md h-fit"><Check size={12} /></div>
                  Always call the consumer before departing for their location.
                </li>
                <li className="flex gap-3">
                  <div className="bg-white/10 p-1 rounded-md h-fit"><Check size={12} /></div>
                  Capture clear photographic proof of resolution (Coming Soon).
                </li>
                <li className="flex gap-3">
                  <div className="bg-white/10 p-1 rounded-md h-fit"><Check size={12} /></div>
                  Detail any equipment replaced in the resolution notes.
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
