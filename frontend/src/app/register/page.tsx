"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus, ShieldCheck, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    area: "",
    role: "user"
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await axios.post("http://localhost:3000/api/auth/register", formData);
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      console.error("Registration Error:", err);
      const msg = err.response?.data?.error || err.message || "Registration failed.";
      setError(msg);
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-[70vh] bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100"
      >
        <div>
          <div className="flex justify-center">
            <div className="bg-irctc-blue p-3 rounded-full">
              <Zap className="text-white w-8 h-8" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-irctc-blue">
            REGISTER
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Create your VoltGuard account to manage your smart grid connection
          </p>
        </div>

        {success ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <ShieldCheck className="w-16 h-16 text-green-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-800">Registration Successful</h3>
            <p className="text-gray-500">Redirecting to login...</p>
          </div>
        ) : (
          <form className="mt-8 space-y-4" onSubmit={handleRegister}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-sm">
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-md focus:outline-none focus:ring-irctc-blue focus:border-irctc-blue sm:text-sm"
                  placeholder="John Doe"
                />
              </div>
              
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-md focus:outline-none focus:ring-irctc-blue focus:border-irctc-blue sm:text-sm"
                  placeholder="john@example.com"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Residential Address</label>
                <input
                  name="address"
                  type="text"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-md focus:outline-none focus:ring-irctc-blue focus:border-irctc-blue sm:text-sm"
                  placeholder="123 Street Name, City"
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Grid Area</label>
                <input
                  name="area"
                  type="text"
                  required
                  value={formData.area}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-md focus:outline-none focus:ring-irctc-blue focus:border-irctc-blue sm:text-sm"
                  placeholder="e.g. North Zone"
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">User Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="block w-full px-3 py-3 border border-gray-300 bg-white text-gray-900 rounded-md focus:outline-none focus:ring-irctc-blue focus:border-irctc-blue sm:text-sm"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Secure Passcode</label>
                <input
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-md focus:outline-none focus:ring-irctc-blue focus:border-irctc-blue sm:text-sm"
                  placeholder="Min. 6 characters"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 py-2">
              <input type="checkbox" required className="h-4 w-4 text-irctc-blue border-gray-300 rounded" />
              <label className="text-xs text-gray-600">
                I agree to the <a href="#" className="text-irctc-blue underline">Terms and Conditions</a> of VoltGuard Services.
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-md text-white bg-irctc-orange hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-irctc-orange transition-all shadow-md mt-6"
              >
                {isLoading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
              </button>
            </div>

            <div className="text-center mt-4">
              <Link href="/login" className="text-sm font-medium text-irctc-blue hover:underline">
                Already have an account? Login here
              </Link>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
