"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Send, Headset, ShieldAlert, Globe } from "lucide-react";
import { useState } from "react";

export default function ContactUs() {
  const [formState, setFormState] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormState({ name: "", email: "", subject: "", message: "" });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header - Clean White Version */}
      <div className="bg-white py-10 text-center border-b border-gray-100">
        <div className="container mx-auto px-4">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-black mb-3 uppercase tracking-tighter text-irctc-blue"
          >
            Connect with VoltGuard
          </motion.h1>
          <p className="text-gray-500 max-w-xl mx-auto text-sm font-medium">
            Our specialized support team and grid engineers are available 24/7 to ensure the nation's energy security.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Quick Contact Cards */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-irctc-orange group hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-orange-50 p-3 rounded-lg text-irctc-orange group-hover:scale-110 transition-transform">
                  <ShieldAlert size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 uppercase text-sm">Emergency Hotline</h3>
                  <p className="text-xs text-gray-400 font-bold">24/7 CRITICAL GRID FAILURES</p>
                </div>
              </div>
              <p className="text-2xl font-black text-irctc-blue">1800-VOLT-GUARD</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-irctc-blue group hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-blue-50 p-3 rounded-lg text-irctc-blue group-hover:scale-110 transition-transform">
                  <Headset size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 uppercase text-sm">Consumer Support</h3>
                  <p className="text-xs text-gray-400 font-bold">BILLING & ACCOUNT INQUIRIES</p>
                </div>
              </div>
              <p className="text-lg font-bold text-gray-600">support@voltguard.gov.in</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
              <h3 className="font-bold text-irctc-blue mb-6 pb-2 border-b border-gray-100 uppercase text-sm tracking-widest">Regional Headquarters</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <MapPin className="text-irctc-orange shrink-0" size={20} />
                  <div>
                    <p className="font-bold text-sm text-gray-800 uppercase">Northern Zone</p>
                    <p className="text-xs text-gray-500 leading-relaxed">Grid House, Power Lane, New Delhi, India - 110001</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <MapPin className="text-irctc-orange shrink-0" size={20} />
                  <div>
                    <p className="font-bold text-sm text-gray-800 uppercase">Southern Zone</p>
                    <p className="text-xs text-gray-500 leading-relaxed">Electron Tower, Tech Park, Bangalore, India - 560001</p>
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <Clock className="text-gray-400 shrink-0" size={20} />
                  <div>
                    <p className="font-bold text-sm text-gray-800 uppercase">Office Hours</p>
                    <p className="text-xs text-gray-500">Mon - Sat: 09:00 AM to 06:00 PM</p>
                    <p className="text-[10px] text-green-600 font-bold mt-1 uppercase italic">Grid Monitoring: Always Active</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-8 py-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-bold text-irctc-blue flex items-center gap-2">
                  <Mail className="text-irctc-orange" /> SEND SECURE MESSAGE
                </h2>
                <span className="text-[10px] bg-irctc-blue/10 text-irctc-blue px-3 py-1 rounded-full font-bold uppercase tracking-widest">SSL Encrypted</span>
              </div>
              
              <div className="p-8">
                {submitted ? (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center justify-center py-20 text-center"
                  >
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                      <Send size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Message Dispatched!</h3>
                    <p className="text-gray-500 max-w-xs">Our engineers will review your inquiry and respond within 24 hours.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
                      <input 
                        required
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:border-irctc-blue focus:bg-white outline-none transition-all"
                        placeholder="John Doe"
                        value={formState.name}
                        onChange={e => setFormState({...formState, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">Email Address</label>
                      <input 
                        required
                        type="email"
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:border-irctc-blue focus:bg-white outline-none transition-all"
                        placeholder="john@example.com"
                        value={formState.email}
                        onChange={e => setFormState({...formState, email: e.target.value})}
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">Subject of Inquiry</label>
                      <select 
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:border-irctc-blue focus:bg-white outline-none transition-all text-gray-600"
                        value={formState.subject}
                        onChange={e => setFormState({...formState, subject: e.target.value})}
                      >
                        <option value="">Select a category</option>
                        <option value="billing">Billing Discrepancy</option>
                        <option value="anomaly">Anomaly Reporting</option>
                        <option value="new_connection">New Grid Connection</option>
                        <option value="technical">Technical Support</option>
                        <option value="other">Other Inquiry</option>
                      </select>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">Message</label>
                      <textarea 
                        required
                        rows={6}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:border-irctc-blue focus:bg-white outline-none transition-all"
                        placeholder="Please describe your inquiry in detail..."
                        value={formState.message}
                        onChange={e => setFormState({...formState, message: e.target.value})}
                      />
                    </div>
                    <div className="md:col-span-2 pt-4">
                      <button className="w-full bg-irctc-blue text-white font-bold py-4 rounded-lg shadow-lg hover:bg-opacity-90 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm">
                        <Send size={18} /> Disconnect & Dispatch
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
