"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Fingerprint, ShieldCheck, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:3000/api/auth/login", { email, password });
      
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("role", res.data.user.role);
        setSuccess(true);
          setTimeout(() => {
            if (res.data.user.role === 'admin') {
              router.push('/admin-dashboard');
            } else if (res.data.user.role === 'technician') {
              router.push('/technician-dashboard');
            } else {
              router.push('/dashboard');
            }
          }, 2000);
      }
    } catch (err: any) {
      console.error("Login Error:", err);
      const msg = err.response?.data?.error || err.message || "Authentication failed.";
      setError(msg);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100"
      >
        <div>
          <div className="flex justify-center">
            <div className="bg-irctc-blue p-3 rounded-full">
              <Zap className="text-white w-8 h-8" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-irctc-blue">
            LOGIN
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access your smart grid control panel
          </p>
        </div>

        {success ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <ShieldCheck className="w-16 h-16 text-green-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-800">Authentication Successful</h3>
            <p className="text-gray-500">Redirecting to portal...</p>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-sm">
                {error}
              </div>
            )}
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-irctc-blue focus:border-irctc-blue focus:z-10 sm:text-sm"
                  placeholder="Consumer ID / Email"
                />
              </div>
              <div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-irctc-blue focus:border-irctc-blue focus:z-10 sm:text-sm"
                  placeholder="Security Passcode"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-irctc-blue focus:ring-irctc-blue border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-irctc-blue hover:text-opacity-80">
                  Forgot passcode?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-md text-white bg-irctc-orange hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-irctc-orange transition-all shadow-md"
              >
                {isLoading ? "AUTHENTICATING..." : "LOGIN"}
              </button>
            </div>

            <div className="text-center mt-4">
              <Link href="/register" className="text-sm font-medium text-irctc-blue hover:underline">
                New User? Register here
              </Link>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
