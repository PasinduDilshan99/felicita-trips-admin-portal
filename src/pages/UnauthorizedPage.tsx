// app/unauthorized/page.tsx - Corporate Professional Version
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Shield, ArrowLeft, Home, Phone, Mail, AlertTriangle } from "lucide-react";

const UnauthorizedPage = () => {
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/");
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleContactSupport = () => {
    window.location.href = "mailto:security@company.com?subject=Unauthorized%20Access%20Request";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center mr-3">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-semibold text-gray-900 tracking-tight">CORP SECURE</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="tel:+1-800-123-4567"
                className="text-sm text-gray-600 hover:text-gray-900 flex items-center"
              >
                <Phone className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Support: 1-800-123-4567</span>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Error Header */}
          <div className="bg-gradient-to-r from-red-50 to-red-100 border-b border-red-200 px-8 py-6">
            <div className="flex items-center">
              <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
                <p className="text-gray-600 mt-1">Security violation detected</p>
              </div>
              <div className="ml-auto">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                  SECURITY ALERT
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Left Column - Details */}
              <div className="md:col-span-2">
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">
                    Unauthorized Access Attempt
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Your account does not have the necessary permissions to access the requested resource. 
                    This attempt has been logged for security review.
                  </p>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                          Error Code
                        </p>
                        <p className="font-medium text-gray-900">403 - Forbidden</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                          Timestamp
                        </p>
                        <p className="font-medium text-gray-900">
                          {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommended Actions */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Recommended Actions
                  </h3>
                  <div className="space-y-4">
                    <button
                      onClick={handleGoBack}
                      className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 group"
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-gray-200 transition-colors">
                          <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Return to Previous Page</p>
                          <p className="text-sm text-gray-500 mt-1">Navigate back to your last location</p>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={handleGoHome}
                      className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 group"
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-4 group-hover:bg-blue-100 transition-colors">
                          <Home className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Go to Home Dashboard</p>
                          <p className="text-sm text-gray-500 mt-1">Access your authorized workspace</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column - Contact */}
              <div className="md:col-span-1">
                <div className="bg-gradient-to-b from-blue-50 to-white border border-blue-100 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Need Assistance?
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Mail className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900 mb-1">Email Support</p>
                        <a
                          href="mailto:security@company.com"
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          security@company.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Phone className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900 mb-1">Phone Support</p>
                        <a
                          href="tel:+1-800-123-4567"
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          1-800-123-4567
                        </a>
                        <p className="text-xs text-gray-500 mt-1">Available 24/7</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-blue-100">
                    <p className="text-sm text-gray-600">
                      For security reasons, all access requests are logged and monitored. 
                      Unauthorized access attempts may be reported to your supervisor.
                    </p>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="mt-6">
                  <div className="flex items-start p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <Shield className="w-5 h-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-gray-900">Security Protocol:</span> This incident has been recorded under security reference{' '}
                      <code className="text-gray-700 bg-gray-100 px-1 rounded">
                        SEC-{Date.now().toString().slice(-8)}
                      </code>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-gray-200 px-8 py-6 bg-gray-50">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <p className="text-sm text-gray-500 mb-4 sm:mb-0">
                Reference ID: SEC-{Date.now().toString().slice(-12).toUpperCase()}
              </p>
              <button
                onClick={handleContactSupport}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-sm hover:shadow"
              >
                Request Access
              </button>
            </div>
          </div>
        </div>

        {/* Legal Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Company Corporation. All rights reserved. | 
            <a href="/privacy" className="ml-2 hover:text-gray-700">Privacy Policy</a> | 
            <a href="/terms" className="ml-2 hover:text-gray-700">Terms of Service</a> | 
            <a href="/security" className="ml-2 hover:text-gray-700">Security Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;