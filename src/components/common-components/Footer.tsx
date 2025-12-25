import React from 'react';
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Shield, 
  Users,
  Facebook,
  Twitter,
  Linkedin,
  Github,
  ArrowUpRight
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Quick links data
  const quickLinks = [
    { name: 'Travel Management', href: '/travel-management' },
    { name: 'Employee Portal', href: '/employee-management' },
    { name: 'Hotels & Booking', href: '/hotels-management' },
    { name: 'Vehicle Fleet', href: '/vehicle-management' },
    { name: 'ERP Dashboard', href: '/erp-system' },
    { name: 'Reports & Analytics', href: '/reports' },
  ];

  // Company links
  const companyLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Contact Sales', href: '/contact' },
    { name: 'Support Center', href: '/support' },
    { name: 'Documentation', href: '/docs' },
    { name: 'API Reference', href: '/api' },
  ];

  // Legal links
  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'GDPR Compliance', href: '/gdpr' },
    { name: 'Security', href: '/security' },
    { name: 'SLA Agreement', href: '/sla' },
  ];

  // Contact info
  const contactInfo = [
    { icon: <Mail size={16} />, text: 'support@businessmanager.com' },
    { icon: <Phone size={16} />, text: '+1 (555) 123-4567' },
    { icon: <MapPin size={16} />, text: '123 Enterprise St, Suite 500, San Francisco, CA 94107' },
  ];

  // Social media links
  const socialLinks = [
    { icon: <Facebook size={18} />, href: '#', label: 'Facebook' },
    { icon: <Twitter size={18} />, href: '#', label: 'Twitter' },
    { icon: <Linkedin size={18} />, href: '#', label: 'LinkedIn' },
    { icon: <Github size={18} />, href: '#', label: 'GitHub' },
  ];

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Company Info Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-lg bg-purple-600 flex items-center justify-center mr-3">
                <Building2 className="text-white" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Business Manager</h2>
                <p className="text-sm text-gray-600">Enterprise Management Suite</p>
              </div>
            </div>
            
            <p className="text-gray-600 mb-6 max-w-md">
              A comprehensive enterprise management platform integrating travel, employee, 
              hotel, vehicle, and ERP systems for modern businesses.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-start">
                  <span className="text-purple-600 mr-3 mt-0.5">{item.icon}</span>
                  <span className="text-gray-600 text-sm">{item.text}</span>
                </div>
              ))}
            </div>

            {/* Social Media */}
            <div className="flex space-x-4 mt-6">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="h-10 w-10 rounded-full bg-gray-100 hover:bg-purple-50 hover:text-purple-600 
                           flex items-center justify-center text-gray-600 transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ArrowUpRight size={18} className="mr-2 text-purple-600" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-600 hover:text-purple-600 hover:underline text-sm transition-colors flex items-center"
                  >
                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mr-3"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Users size={18} className="mr-2 text-purple-600" />
              Company
            </h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-600 hover:text-purple-600 hover:underline text-sm transition-colors flex items-center"
                  >
                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mr-3"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Shield size={18} className="mr-2 text-purple-600" />
              Legal
            </h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-600 hover:text-purple-600 hover:underline text-sm transition-colors flex items-center"
                  >
                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mr-3"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>

            {/* System Status */}
            <div className="mt-8 p-4 bg-amber-50 border border-amber-100 rounded-lg">
              <div className="flex items-center mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium text-gray-900">All Systems Operational</span>
              </div>
              <p className="text-xs text-gray-600">Last checked: Today, 14:30 UTC</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="text-sm text-gray-600 mb-4 md:mb-0">
              <p>© {currentYear} Business Manager. All rights reserved.</p>
              <p className="text-xs mt-1 text-gray-500">
                Version 2.4.1 • Build #20231215 • 
                <span className="inline-flex items-center ml-2">
                  <Globe size={12} className="mr-1" />
                  English (US)
                </span>
              </p>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <span className="text-xs text-gray-500">Secure Connection</span>
                <div className="flex items-center">
                  <Shield size={14} className="text-green-600 mr-1" />
                  <span className="text-xs font-medium text-green-600">SSL/TLS Encrypted</span>
                </div>
              </div>
              
              {/* Optional: Download Links */}
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-xs text-gray-600 hover:text-purple-600 hover:underline"
                >
                  Mobile App
                </a>
                <a
                  href="#"
                  className="text-xs text-gray-600 hover:text-purple-600 hover:underline"
                >
                  Developer API
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;