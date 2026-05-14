"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, ShieldCheck, ArrowLeft, Zap, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

export default function Payment() {
  const [formData, setFormData] = useState({
    name: "",
    cardNumber: "",
    expiry: "",
    cvv: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:3000/api/user/pay-bill", {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 2500);
    } catch (err) {
      console.error(err);
      alert("Payment failed. Please check your card details.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative z-10">
      
      <Link href="/dashboard" className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-5 h-5" /> <span className="font-mono text-sm tracking-widest">CANCEL TRANSACTION</span>
      </Link>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="glass p-8 rounded-3xl border border-volt-blue/20 shadow-[0_0_50px_rgba(59,165,255,0.1)] relative overflow-hidden">
          
          {isSuccess ? (
            <div className="text-center py-12">
              <motion.div 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <ShieldCheck className="w-10 h-10" />
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-2">PAYMENT SECURED</h2>
              <p className="text-slate-400 font-mono text-sm">TRANSACTION HASH: {Math.random().toString(36).substring(7).toUpperCase()}</p>
              <p className="text-volt-blue mt-4 text-xs animate-pulse">SYNCHRONIZING ACCOUNT LEDGER...</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-volt-blue/10 rounded-2xl border border-volt-blue/30">
                    <Lock className="text-volt-blue w-6 h-6" />
                  </div>
                </div>
                <h2 className="text-2xl font-black text-white tracking-widest">SECURE CHECKOUT</h2>
                <p className="text-slate-400 text-xs font-mono mt-1">VOLTGUARD ENCRYPTED GATEWAY</p>
              </div>

              {/* Credit Card Mockup */}
              <div className="relative h-48 w-full bg-gradient-to-br from-volt-blue to-purple-600 rounded-2xl p-6 mb-8 shadow-2xl overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-150 transition-transform duration-1000">
                  <Zap className="w-32 h-32 text-white" />
                </div>
                <div className="w-12 h-10 bg-yellow-400/80 rounded-lg mb-6 shadow-inner" />
                <div className="text-xl font-mono text-white tracking-[0.2em] mb-4">
                  {formData.cardNumber || "**** **** **** ****"}
                </div>
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <div className="text-[8px] text-white/60 font-mono uppercase">Card Holder</div>
                    <div className="text-xs font-mono text-white uppercase tracking-widest truncate max-w-[150px]">
                      {formData.name || "OPERATOR NAME"}
                    </div>
                  </div>
                  <div className="space-y-1 text-right">
                    <div className="text-[8px] text-white/60 font-mono uppercase">Expires</div>
                    <div className="text-xs font-mono text-white">
                      {formData.expiry || "MM/YY"}
                    </div>
                  </div>
                </div>
              </div>

              <form onSubmit={handlePayment} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 ml-1">CARDHOLDER NAME</label>
                  <input 
                    required
                    className="w-full bg-volt-navy/50 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-volt-blue uppercase"
                    placeholder="FULL NAME"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 ml-1">CARD NUMBER</label>
                  <input 
                    required
                    maxLength={19}
                    className="w-full bg-volt-navy/50 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-volt-blue"
                    placeholder="0000 0000 0000 0000"
                    value={formData.cardNumber}
                    onChange={e => setFormData({...formData, cardNumber: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-500 ml-1">EXPIRY</label>
                    <input 
                      required
                      maxLength={5}
                      className="w-full bg-volt-navy/50 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-volt-blue"
                      placeholder="MM/YY"
                      value={formData.expiry}
                      onChange={e => setFormData({...formData, expiry: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-500 ml-1">CVV</label>
                    <input 
                      required
                      type="password"
                      maxLength={3}
                      className="w-full bg-volt-navy/50 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-volt-blue"
                      placeholder="***"
                      value={formData.cvv}
                      onChange={e => setFormData({...formData, cvv: e.target.value})}
                    />
                  </div>
                </div>

                <button 
                  disabled={isLoading}
                  className="w-full py-4 bg-volt-blue text-volt-black font-black rounded-xl mt-4 shadow-[0_0_20px_rgba(59,165,255,0.3)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                >
                  {isLoading ? "ENCRYPTING..." : "CONFIRM TRANSACTION"}
                </button>
              </form>
            </>
          )}

        </div>
      </motion.div>
    </div>
  );
}
