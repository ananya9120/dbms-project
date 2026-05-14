"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function PageLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Cinematic 2 second load
    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-volt-black)]"
    >
      <div className="relative flex flex-col items-center">
        {/* Rotating Energy Core */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="w-24 h-24 rounded-full border-t-4 border-b-4 border-volt-blue opacity-80 shadow-[0_0_30px_rgba(59,165,255,0.6)]"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          className="absolute top-2 w-20 h-20 rounded-full border-l-4 border-r-4 border-volt-yellow opacity-60 shadow-[0_0_20px_rgba(255,212,38,0.4)]"
        />
        {/* Core pulse */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="absolute top-6 w-12 h-12 rounded-full bg-volt-blue blur-md"
        />
        
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-8 text-2xl font-bold tracking-[0.2em] text-white text-glow-blue"
        >
          INITIALIZING
        </motion.h1>
      </div>
    </motion.div>
  );
}
