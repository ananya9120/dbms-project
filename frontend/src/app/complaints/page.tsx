"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, ClipboardList, Clock, CheckCircle2, AlertTriangle, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function ComplaintsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return router.push("/login");

        const res = await axios.get("http://localhost:3000/api/user/dashboard", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        router.push("/login");
      }
    };
    fetchData();
  }, [router]);

  const handleComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const issueType = (form.elements.namedItem("issueType") as HTMLSelectElement).value;
    const description = (form.elements.namedItem("description") as HTMLTextAreaElement).value;

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:3000/api/user/complaint", { issueType, description }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Complaint submitted successfully!");
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-irctc-blue border-t-transparent rounded-full animate-spin"></div>
        <p className="text-irctc-blue font-bold">Accessing Secure Records...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-12 pt-8">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Page Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-irctc-blue p-3 rounded-lg text-white">
            <ClipboardList size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-irctc-blue uppercase tracking-tight">Grievance Redressal Portal</h1>
            <p className="text-gray-500 text-sm italic">Track and report issues with your electricity connection.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Raise Grievance Form */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8 sticky top-28">
              <h3 className="text-xl font-bold text-irctc-blue mb-6 flex items-center gap-2"><MessageSquare size={22} className="text-irctc-orange" /> Log New Complaint</h3>
              <form onSubmit={handleComplaint} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Issue Category</label>
                  <select name="issueType" required className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:border-irctc-blue outline-none transition-colors bg-gray-50/50">
                    <option value="">Select Category</option>
                    <option value="Billing Issue">Billing Discrepancy</option>
                    <option value="Power Outage">Frequent Outage</option>
                    <option value="Meter Fault">Faulty Meter</option>
                    <option value="Other">Other Issues</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Detailed Description</label>
                  <textarea name="description" required rows={5} className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:border-irctc-blue outline-none transition-colors bg-gray-50/50 resize-none" placeholder="Provide as much detail as possible to help us resolve the issue..."></textarea>
                </div>
                <button type="submit" className="w-full py-4 bg-irctc-blue text-white font-black rounded-lg hover:bg-opacity-95 transition-all shadow-lg hover:shadow-irctc-blue/20 uppercase tracking-widest text-sm">
                  Register Grievance
                </button>
              </form>
              <div className="mt-6 p-4 bg-orange-50 border border-orange-100 rounded-lg">
                <p className="text-[10px] text-orange-700 leading-relaxed font-medium">
                  <span className="font-bold">Note:</span> Your complaint will be automatically assigned to a field technician based on your area. You can track the live status here.
                </p>
              </div>
            </div>
          </div>

          {/* Complaints History */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex justify-between items-center">
                <h3 className="font-bold text-irctc-blue flex items-center gap-2 uppercase tracking-wider"><Clock size={18} /> Recent Filings</h3>
                <span className="text-[10px] font-bold text-gray-400 bg-gray-200/50 px-2 py-0.5 rounded">{data.complaints.length} Records Found</span>
              </div>
              <div className="p-2">
                <div className="space-y-3">
                  {data.complaints.length > 0 ? data.complaints.map((c: any) => (
                    <div key={c._id} className="p-5 rounded-lg border border-gray-50 hover:border-irctc-blue/10 hover:bg-gray-50/30 transition-all">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-black text-irctc-blue uppercase tracking-widest">{c.issueType}</span>
                          <span className="text-[10px] text-gray-400">{new Date(c.date).toLocaleString()}</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm ${
                          c.status === 'Resolved' ? 'bg-green-100 text-green-700' : 
                          c.status === 'Assigned' ? 'bg-blue-100 text-blue-700' : 
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {c.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">{c.description}</p>
                      
                      {c.technicianId ? (
                        <div className="bg-irctc-blue/5 border border-irctc-blue/10 p-3 rounded-lg flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-irctc-blue/10 flex items-center justify-center text-irctc-blue font-bold text-xs">
                              {c.technicianId.name[0]}
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-irctc-blue uppercase tracking-widest leading-none mb-1">Field Expert Allotted</p>
                              <p className="text-sm font-bold text-gray-800 leading-none">{c.technicianId.name}</p>
                            </div>
                          </div>
                          <a href={`tel:${c.technicianId.phone}`} className="text-xs font-bold text-irctc-blue hover:underline bg-white px-3 py-1.5 rounded-md border border-irctc-blue/10">
                            {c.technicianId.phone}
                          </a>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-[10px] text-gray-400 italic">
                          <Clock size={12} /> Pending administrative review for assignment
                        </div>
                      )}
                    </div>
                  )) : (
                    <div className="text-center py-20 text-gray-400 flex flex-col items-center gap-3">
                      <MessageSquare size={48} className="opacity-10" />
                      <p className="text-sm font-medium">No complaints found. Your grid connection is healthy.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
