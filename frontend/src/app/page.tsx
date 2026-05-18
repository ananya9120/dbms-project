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
  FileText,
  Mail,
  Lock,
  Loader2,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Droplet
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Home() {
  const [isAuth, setIsAuth] = useState(false);
  const [selectedRole, setSelectedRole] = useState("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsAuth(!!localStorage.getItem("token"));
  }, []);

  const handleDirectLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:3000/api/auth/login", { email, password });
      
      if (res.data.token) {
        const userRole = res.data.user.role;
        const normalizedRole = userRole === 'technician' ? 'inspector' : userRole;
        if (normalizedRole !== selectedRole) {
          setError(`Access Denied: You do not have ${selectedRole === 'user' ? 'consumer' : selectedRole} privileges.`);
          setIsLoading(false);
          return;
        }

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("role", res.data.user.role);
        setSuccess(true);
        setTimeout(() => {
          if (res.data.user.role === 'admin') {
            router.push('/admin-dashboard');
          } else if (res.data.user.role === 'technician' || res.data.user.role === 'inspector') {
            router.push('/technician-dashboard');
          } else {
            router.push('/dashboard');
          }
        }, 1500);
      }
    } catch (err: any) {
      console.error("Login Error:", err);
      const msg = err.response?.data?.error || err.message || "Authentication failed.";
      setError(msg);
      setIsLoading(false);
    }
  };

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
                  <h2 className="text-2xl font-bold text-irctc-blue text-center mb-4">QUICK LOGIN</h2>
                  
                  {/* Role Selection Tabs */}
                  <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                    {["user", "inspector", "admin"].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setSelectedRole(r)}
                        className={`flex-1 py-2 text-xs font-black rounded-md uppercase tracking-wider transition-all ${
                          selectedRole === r
                            ? "bg-white text-irctc-blue shadow-sm"
                            : "text-gray-400 hover:text-gray-600"
                        }`}
                      >
                        {r === "user" ? "Consumer" : r}
                      </button>
                    ))}
                  </div>

                  {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-3 text-red-700 text-xs">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="bg-green-50 border-l-4 border-green-500 p-3 text-green-700 text-xs">
                      Authentication successful! Redirecting...
                    </div>
                  )}

                  <form onSubmit={handleDirectLogin} className="space-y-4">
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-irctc-blue">
                        <Mail size={18} />
                      </div>
                      <input 
                        type="email" 
                        required
                        placeholder="Email Address" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded focus:border-irctc-blue outline-none transition-colors"
                      />
                    </div>

                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-irctc-blue">
                        <Lock size={18} />
                      </div>
                      <input 
                        type="password" 
                        required
                        placeholder="Password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded focus:border-irctc-blue outline-none transition-colors"
                      />
                    </div>

                    <button 
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-irctc-orange text-white font-bold py-4 rounded shadow-lg hover:bg-opacity-90 transition-all text-lg flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          AUTHENTICATING...
                        </>
                      ) : (
                        "LOGIN TO PROCEED"
                      )}
                    </button>
                  </form>
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
                  ELECTRICITY ANOMALY DETECTION <br/>
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
                  <a href="#safety-guidelines" className="border border-white text-white px-8 py-3 rounded-md font-bold hover:bg-white/10 transition-all flex items-center justify-center">
                    Safety Guidelines
                  </a>
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

      {/* Safety Guidelines Section */}
      <section id="safety-guidelines" className="py-20 bg-white border-t border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-red-500/5 rounded-full -translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-irctc-orange/5 rounded-full translate-y-1/2 translate-x-1/2 blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-irctc-orange bg-irctc-orange/10 px-3 py-1 rounded-full">VoltGuard Security</span>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-irctc-blue mt-3 mb-4">Grid Safety & Emergency Guidelines</h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto leading-relaxed">
              Ensure the protection of your household and our grid infrastructure by adhering to the following smart grid safety regulations.
            </p>
            <div className="w-24 h-1 bg-irctc-orange mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Guideline 1 */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-irctc-blue/10 flex items-center justify-center text-irctc-blue mb-6">
                <Zap size={24} />
              </div>
              <h3 className="text-lg font-bold text-irctc-blue mb-3">Electrical Shock Prevention</h3>
              <p className="text-gray-600 text-xs leading-relaxed">
                Never touch exposed wiring or electrical meters. Ensure all home outlets are properly grounded with three-prong sockets, especially for heavy appliances.
              </p>
            </div>

            {/* Guideline 2 */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-6">
                <Flame size={24} />
              </div>
              <h3 className="text-lg font-bold text-irctc-blue mb-3">Fire Hazard Safety</h3>
              <p className="text-gray-600 text-xs leading-relaxed">
                Avoid overloading extension cords and power strips. Keep combustible materials, curtains, and furniture away from space heaters and high-voltage sockets.
              </p>
            </div>

            {/* Guideline 3 */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6">
                <Droplet size={24} />
              </div>
              <h3 className="text-lg font-bold text-irctc-blue mb-3">Water & Electricity Warning</h3>
              <p className="text-gray-600 text-xs leading-relaxed">
                Keep all electronic devices and appliances away from sinks, bathtubs, and damp floors. Never operate electrical panels or switches with wet hands.
              </p>
            </div>

            {/* Guideline 4 */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-6">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-lg font-bold text-irctc-blue mb-3">Tamper & Bypass Reporting</h3>
              <p className="text-gray-600 text-xs leading-relaxed">
                Smart meters are equipped with automated tamper sensors. Tampering or bypassing a meter can trigger high-voltage discharges and immediate administrative penalties.
              </p>
            </div>
          </div>

          {/* Quick Emergency Action Box */}
          <div className="mt-12 bg-irctc-blue text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-white/10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-full text-irctc-orange animate-pulse">
                <ShieldCheck size={28} />
              </div>
              <div>
                <h4 className="text-lg font-bold">Smart Isolation Activated</h4>
                <p className="text-white/70 text-xs max-w-md mt-1">
                  VoltGuard smart meters automatically shut down power transmission locally if an anomaly is detected, minimizing risk of local shocks or sparks.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <a href="#apply-meter" className="bg-white text-irctc-blue px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all text-xs">
                Install Smart Meter
              </a>
              <Link href="/complaints" className="border border-white/20 hover:bg-white/10 px-6 py-3 rounded-xl font-bold transition-all text-xs">
                Report Emergency
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* New Meter Application Section */}
      <section id="apply-meter" className="py-24 bg-gray-50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-irctc-blue/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-irctc-orange/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
            <div className="md:w-2/5 bg-irctc-blue p-12 text-white flex flex-col justify-center">
              <h2 className="text-4xl font-bold mb-6">Apply for a New Meter</h2>
              <p className="text-white/70 mb-8 leading-relaxed">
                Skip the paperwork and long queues. Apply for your smart meter connection online in less than 5 minutes.
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold">1</div>
                  <span>Fill out the digital application form</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold">2</div>
                  <span>Our team verifies your location</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold">3</div>
                  <span>Professional installation within 48 hours</span>
                </div>
              </div>
            </div>
            
            <div className="md:w-3/5 p-12">
              <form 
                onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  const data = Object.fromEntries(formData.entries());
                  try {
                    const res = await fetch("http://localhost:3000/api/meter-applications/submit", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(data)
                    });
                    const result = await res.json();
                    if (res.ok) {
                      alert(result.message);
                      (e.target as HTMLFormElement).reset();
                    } else {
                      alert(result.error);
                    }
                  } catch (err) {
                    alert("Submission failed. Please try again.");
                  }
                }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Full Name</label>
                  <input name="applicantName" required type="text" placeholder="John Doe" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-irctc-blue outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Email Address</label>
                  <input name="email" required type="email" placeholder="john@example.com" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-irctc-blue outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Phone Number</label>
                  <input name="phone" required type="tel" placeholder="+91 XXXXX XXXXX" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-irctc-blue outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Connection Type</label>
                  <select name="connectionType" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-irctc-blue outline-none transition-all appearance-none">
                    <option>Residential</option>
                    <option>Commercial</option>
                    <option>Industrial</option>
                  </select>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-gray-700">Full Installation Address</label>
                  <textarea name="address" required rows={3} placeholder="Street, Area, City, Pincode" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-irctc-blue outline-none transition-all"></textarea>
                </div>
                <button type="submit" className="md:col-span-2 py-4 bg-irctc-orange text-white font-bold rounded-xl shadow-lg hover:shadow-orange-200 hover:-translate-y-1 transition-all">
                  Submit Application
                </button>
              </form>
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
