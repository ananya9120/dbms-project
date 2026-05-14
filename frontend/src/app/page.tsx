"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { 
  ArrowRight, 
  Search, 
  MapPin, 
  Calendar, 
  Zap, 
  ShieldAlert, 
  Activity,
  User,
  CreditCard,
  FileText
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    setIsAuth(!!localStorage.getItem("token"));
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] w-full overflow-hidden">
        {/* Background Image - Placeholder for the generated one */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] hover:scale-110"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=2070')",
            filter: "brightness(0.8)"
          }}
        />
        
        <div className="container mx-auto px-4 h-full relative z-10 flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
            
            {/* Action Card (Mimicking Book Ticket) */}
            <div className="lg:col-span-5 xl:col-span-4">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-lg shadow-2xl overflow-hidden"
              >
                <div className="flex border-b border-gray-100">
                  <button className="flex-1 py-4 flex flex-col items-center gap-1 border-b-4 border-irctc-blue bg-white">
                    <Zap size={24} className="text-irctc-blue" />
                    <span className="text-[12px] font-bold text-irctc-blue">MANAGE USAGE</span>
                  </button>
                  <button className="flex-1 py-4 flex flex-col items-center gap-1 text-gray-400 hover:bg-gray-50">
                    <CreditCard size={24} />
                    <span className="text-[12px] font-bold">PAY BILL</span>
                  </button>
                  <button className="flex-1 py-4 flex flex-col items-center gap-1 text-gray-400 hover:bg-gray-50">
                    <FileText size={24} />
                    <span className="text-[12px] font-bold">REPORTS</span>
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  <h2 className="text-2xl font-bold text-irctc-blue text-center mb-8">QUICK SERVICES</h2>
                  
                  <div className="space-y-4">
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-irctc-blue">
                        <MapPin size={18} />
                      </div>
                      <input 
                        type="text" 
                        placeholder="Consumer ID / Meter Number" 
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded focus:border-irctc-blue outline-none transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-irctc-blue">
                          <Calendar size={18} />
                        </div>
                        <input 
                          type="text" 
                          placeholder="Bill Period" 
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded focus:border-irctc-blue outline-none transition-colors"
                        />
                      </div>
                      <select className="w-full px-3 py-3 border border-gray-300 rounded focus:border-irctc-blue outline-none transition-colors text-gray-500 bg-white">
                        <option>Residential</option>
                        <option>Commercial</option>
                        <option>Industrial</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 accent-irctc-orange" />
                        <span>Show Bill History</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 accent-irctc-orange" />
                        <span>Predict Usage</span>
                      </label>
                    </div>

                    <Link 
                      href={isAuth ? "/dashboard" : "/login"}
                      className="block w-full bg-irctc-orange text-white text-center font-bold py-4 rounded shadow-lg hover:bg-opacity-90 transition-all text-lg mt-4"
                    >
                      LOGIN TO PROCEED
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Hero Text */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col justify-center text-white pb-12 lg:pb-0">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h1 className="text-5xl lg:text-7xl font-bold mb-6 tracking-tight leading-[1.1]">
                  INDIAN SMART GRID <br/>
                  <span className="text-irctc-orange font-black">VOLTGUARD</span>
                </h1>
                <div className="flex items-center gap-6 text-xl font-medium mb-8">
                  <span className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-1 rounded-full border border-white/20">
                    <ShieldAlert size={20} className="text-irctc-orange" /> Safety
                  </span>
                  <span className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-1 rounded-full border border-white/20">
                    <Activity size={20} className="text-green-400" /> Efficiency
                  </span>
                  <span className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-1 rounded-full border border-white/20">
                    <Zap size={20} className="text-blue-400" /> Punctuality
                  </span>
                </div>
                <p className="text-lg lg:text-xl text-white/80 max-w-2xl leading-relaxed mb-10">
                  Securing the nation's energy infrastructure with real-time AI anomaly detection and automated maintenance workflows.
                </p>
                <div className="flex gap-4">
                  <Link href="/register" className="bg-white text-irctc-blue px-8 py-3 rounded-md font-bold hover:bg-gray-100 transition-all">
                    Register New Connection
                  </Link>
                  <Link href="/help" className="border border-white text-white px-8 py-3 rounded-md font-bold hover:bg-white/10 transition-all">
                    Safety Guidelines
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-irctc-blue mb-4">Core Services</h2>
            <div className="w-24 h-1 bg-irctc-orange mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="group p-8 border border-gray-100 rounded-xl hover:shadow-xl transition-all duration-300 bg-gray-50 text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-md group-hover:scale-110 transition-transform">
                <Activity size={32} className="text-irctc-blue" />
              </div>
              <h3 className="text-xl font-bold text-irctc-blue mb-4">Anomaly Detection</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Using predictive neural networks to identify deviations in power consumption and detect potential theft or leaks.
              </p>
            </div>

            <div className="group p-8 border border-gray-100 rounded-xl hover:shadow-xl transition-all duration-300 bg-gray-50 text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-md group-hover:scale-110 transition-transform">
                <ShieldAlert size={32} className="text-irctc-red" />
              </div>
              <h3 className="text-xl font-bold text-irctc-blue mb-4">Safety Alerts</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Instant SMS and Email notifications to users and technicians when critical malfunctions are detected in the grid.
              </p>
            </div>

            <div className="group p-8 border border-gray-100 rounded-xl hover:shadow-xl transition-all duration-300 bg-gray-50 text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-md group-hover:scale-110 transition-transform">
                <CreditCard size={32} className="text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-irctc-blue mb-4">Smart Billing</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Automated billing with predictive estimation and seamless online payment integration via E-Wallet and UPI.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 bg-irctc-blue text-white">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl lg:text-4xl font-bold mb-4">Have a Power Emergency?</h2>
            <p className="text-white/70 text-lg">Our technicians are available 24/7 for critical grid maintenance.</p>
          </div>
          <Link href="/complaints" className="bg-irctc-orange text-white px-10 py-4 rounded-full font-bold text-xl hover:scale-105 transition-transform shadow-lg">
            Report Anomaly Now
          </Link>
        </div>
      </section>
    </div>
  );
}
