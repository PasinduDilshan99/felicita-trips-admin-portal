'use client'

import Link from "next/link";
import { JSX, useEffect, useState } from "react";

export default function NotFound(): JSX.Element {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number }>>([]);

  useEffect(() => {
    // Generate random particles for background
    const generatedParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      delay: Math.random() * 2,
    }));
    setParticles(generatedParticles);
  }, []);

  return (
    <div className="relative flex items-center justify-center py-24 bg-gradient-to-br from-purple-50 via-white to-indigo-50 overflow-hidden">
      {/* Background Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-gradient-to-r from-purple-200 to-indigo-200 animate-float"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Animated Floating Shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full opacity-20 animate-float-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full opacity-10 animate-float-slower" />
        <div className="absolute top-3/4 left-3/4 w-48 h-48 bg-gradient-to-r from-purple-200 to-indigo-200 rounded-full opacity-15 animate-float-reverse" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-2xl mx-4">
        {/* Animated 404 */}
        <div className="relative mb-6">
          <h1 className="text-8xl sm:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 animate-gradient-x mb-2">
            404
          </h1>
          <div className="absolute inset-0 text-8xl sm:text-9xl font-bold text-gray-900 opacity-5 -z-10">
            404
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-4 mb-8 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
            Oops! Page Lost in Space
          </h2>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            The page you&apos;re looking for seems to have drifted off into the digital cosmos.
          </p>
          <div className="flex items-center justify-center space-x-2 text-gray-500">
            <div className="w-4 h-4 rounded-full bg-purple-500 animate-pulse" />
            <span className="text-sm">Error 404 • Page Not Found</span>
          </div>
        </div>

        {/* Animated Illustration/Icon */}
        <div className="relative w-40 h-40 mx-auto mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full animate-pulse" />
          <div className="absolute inset-4 bg-gradient-to-r from-purple-200 to-indigo-200 rounded-full animate-spin-slow" />
          <div className="absolute inset-8 bg-gradient-to-r from-purple-300 to-indigo-300 rounded-full animate-ping-slow" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <Link
            href="/"
            className="group relative px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <span className="relative z-10 flex items-center justify-center space-x-2">
              <svg
                className="w-5 h-5 transition-transform group-hover:-translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span>Back to Home</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>

          <button
            onClick={() => window.history.back()}
            className="group px-8 py-4 border-2 border-purple-500 text-purple-600 font-semibold rounded-xl hover:bg-purple-50 transition-all duration-300 transform hover:-translate-y-1"
          >
            <span className="flex items-center justify-center space-x-2">
              <svg
                className="w-5 h-5 transition-transform group-hover:-translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span>Go Back</span>
            </span>
          </button>
        </div>

        {/* Additional Help */}
        <div className="mt-12 pt-8 border-t border-gray-200 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <p className="text-gray-500 mb-4">Need help finding your way?</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/support" className="text-purple-600 hover:text-purple-700 transition-colors">
              Contact Support
            </Link>
            <Link href="/docs" className="text-purple-600 hover:text-purple-700 transition-colors">
              Documentation
            </Link>
            <Link href="/status" className="text-purple-600 hover:text-purple-700 transition-colors">
              System Status
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-gray-400 text-sm animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
        Felicita • Making moments memorable
      </div>

      {/* Custom CSS Animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
          }
        }

        @keyframes float-slow {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          50% {
            transform: translate(-30px, -30px) rotate(180deg);
          }
        }

        @keyframes float-slower {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          50% {
            transform: translate(40px, 40px) rotate(-180deg);
          }
        }

        @keyframes float-reverse {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          50% {
            transform: translate(20px, -20px) rotate(-90deg);
          }
        }

        @keyframes gradient-x {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes ping-slow {
          0% {
            transform: scale(0.8);
            opacity: 0.8;
          }
          70%, 100% {
            transform: scale(1.2);
            opacity: 0;
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float-slow 20s ease-in-out infinite;
        }

        .animate-float-slower {
          animation: float-slower 25s ease-in-out infinite;
        }

        .animate-float-reverse {
          animation: float-reverse 15s ease-in-out infinite;
        }

        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
          background-size: 200% 200%;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }

        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        /* Responsive adjustments */
        @media (max-width: 640px) {
          .animate-float-slow,
          .animate-float-slower,
          .animate-float-reverse {
            animation-duration: 40s;
          }
        }
      `}</style>
    </div>
  );
}