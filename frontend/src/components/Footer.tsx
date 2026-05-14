import React from "react";
import Link from "next/link";
import { Mail, MapPin, Phone, Globe } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-irctc-light border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-irctc-blue font-bold text-lg">VoltGuard</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              India's leading smart grid anomaly detection and electricity management platform. Ensuring safe, secure, and punctual power delivery for everyone.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-gray-400 hover:text-irctc-blue"><Globe size={20} /></Link>
              <Link href="#" className="text-gray-400 hover:text-irctc-blue"><Globe size={20} /></Link>
              <Link href="#" className="text-gray-400 hover:text-irctc-blue"><Globe size={20} /></Link>
              <Link href="#" className="text-gray-400 hover:text-irctc-blue"><Globe size={20} /></Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-irctc-blue font-bold text-lg">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/dashboard" className="hover:text-irctc-blue hover:underline">User Dashboard</Link></li>
              <li><Link href="/payment" className="hover:text-irctc-blue hover:underline">Pay Bill Online</Link></li>
              <li><Link href="/complaints" className="hover:text-irctc-blue hover:underline">Report Anomaly</Link></li>
              <li><Link href="/register" className="hover:text-irctc-blue hover:underline">New Registration</Link></li>
              <li><Link href="/admin-dashboard" className="hover:text-irctc-blue hover:underline">Admin Login</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-irctc-blue font-bold text-lg">Support</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="#" className="hover:text-irctc-blue hover:underline">FAQs</Link></li>
              <li><Link href="#" className="hover:text-irctc-blue hover:underline">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-irctc-blue hover:underline">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-irctc-blue hover:underline">Grievance Redressal</Link></li>
              <li><Link href="#" className="hover:text-irctc-blue hover:underline">Safety Measures</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-irctc-blue font-bold text-lg">Contact Us</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <MapPin className="text-irctc-blue mt-0.5" size={18} />
                <p>Grid House, Power Lane,<br />New Delhi, India - 110001</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-irctc-blue" size={18} />
                <p>1800-VOLT-GUARD (Toll Free)</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="text-irctc-blue" size={18} />
                <p>support@voltguard.gov.in</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-irctc-blue text-white py-4">
        <div className="container mx-auto px-4 text-center text-xs">
          <p>© 2026 VoltGuard - Electricity Anomaly Detection System. All Rights Reserved.</p>
          <p className="mt-1 opacity-70">Ministry of Power, Government of India</p>
        </div>
      </div>
    </footer>
  );
};
