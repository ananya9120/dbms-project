"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  User, 
  AlertCircle, 
  LayoutDashboard, 
  CreditCard, 
  Bell, 
  HelpCircle, 
  Phone,
  Search
} from "lucide-react";

export const Header = () => {
  const [currentTime, setCurrentTime] = useState("");
  const [role, setRole] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const currentRole = localStorage.getItem("role");
    setRole(currentRole);
    
    const checkRole = () => {
      const updatedRole = localStorage.getItem("role");
      setRole(updatedRole);
    };
    const intervalId = setInterval(checkRole, 1000);
    
    // ... rest of the time logic ...

    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      setCurrentTime(now.toLocaleString('en-IN', options).replace(',', ''));
    };

    updateTime();
    const timeInterval = setInterval(updateTime, 1000);
    return () => {
      clearInterval(timeInterval);
      clearInterval(intervalId);
    };
  }, [pathname]);


  return (
    <header className="w-full bg-white flex flex-col shadow-sm sticky top-0 z-50">
      {/* Top Bar */}
      <div className="container mx-auto px-4 py-2 flex items-center justify-between text-[13px] text-gray-600">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Link href="/" className="font-semibold text-gray-800 hover:text-irctc-blue transition-colors cursor-pointer">
              VoltGuard
            </Link>
            <span className="text-gray-400">|</span>
            <span className="font-medium text-irctc-blue">{currentTime}</span>
          </div>
          <div className="hidden md:flex items-center gap-4 border-l border-gray-200 pl-4">
            <button className="hover:text-irctc-blue">A-</button>
            <button className="hover:text-irctc-blue font-bold">A</button>
            <button className="hover:text-irctc-blue">A+</button>
            <span className="text-gray-400">|</span>
            <button className="hover:text-irctc-blue font-medium">हिन्दी</button>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/login" className="bg-irctc-blue text-white px-4 py-1.5 rounded-sm font-semibold hover:bg-opacity-90">
            LOGIN / REGISTER
          </Link>
          <div className="hidden lg:flex items-center gap-4 text-gray-700">
            {role === 'admin' ? (
              <span className="text-irctc-blue font-bold px-4 border-l border-gray-200 uppercase">Central Command</span>
            ) : role === 'technician' ? (
              <span className="text-irctc-orange font-bold px-4 border-l border-gray-200 uppercase">Field Inspector</span>
            ) : (
              <>
                <Link href="/dashboard" className="hover:text-irctc-blue">DASHBOARD</Link>
                <Link href="/complaints" className="hover:text-irctc-blue">ALERTS</Link>
                <Link href="/payment" className="hover:text-irctc-blue">E-WALLET</Link>
              </>
            )}
            <Link href="/contact" className="hover:text-irctc-blue">CONTACT US</Link>
          </div>
        </div>
      </div>

      {/* Navigation Bar - Only for Consumers */}
      {role === 'user' && (
        <div className="bg-irctc-blue text-white py-2">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="p-1 hover:bg-white/10 rounded">
                <Home size={20} />
              </Link>
              <nav className="hidden md:flex items-center gap-6 text-[14px] font-bold">
                <Link href="/dashboard" className="hover:text-irctc-orange transition-colors uppercase">Usage History</Link>
                <Link href="/complaints" className="text-white hover:text-irctc-orange transition-colors uppercase">Complaint</Link>
                <Link href="/payment" className="hover:text-irctc-orange transition-colors uppercase">Bill Payment</Link>
                <Link href="/help" className="hover:text-irctc-orange transition-colors uppercase">Support</Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative hidden sm:block">
                <input 
                  type="text" 
                  placeholder="Search Features..." 
                  className="bg-white/10 border border-white/20 rounded px-3 py-1 text-sm focus:outline-none focus:bg-white/20 w-48"
                />
                <Search className="absolute right-2 top-1.5 text-white/50" size={16} />
              </div>
              <button className="md:hidden p-1">
                <AlertCircle size={24} />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
