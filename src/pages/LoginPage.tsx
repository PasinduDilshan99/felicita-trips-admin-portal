"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useTheme } from "@/contexts/ThemeContext";

// Helper function to convert hex to rgba
const hexToRgba = (hex: string, opacity: number): string => {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const { login } = useAuth();
  const { theme } = useTheme();

  const handleLogin = async () => {
    try {
      setError(null);
      setIsLoading(true);
      await login(username, password);
      router.push("/");
    } catch (err: unknown) {
      console.log(err);
      setError("Invalid username or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <>
      <div 
        className="flex items-center justify-center p-4 relative overflow-hidden py-24 min-h-screen transition-colors duration-300"
        style={{ backgroundColor: theme.background }}
      >
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl"
            style={{ backgroundColor: hexToRgba(theme.primary, 0.05) }}
          />
          <div 
            className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl"
            style={{ backgroundColor: hexToRgba(theme.accent, 0.05) }}
          />
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Main Card */}
          <div 
            className="rounded-lg shadow-sm transition-colors duration-300"
            style={{ 
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`
            }}
          >
            {/* Header */}
            <div 
              className="px-8 py-10 text-center transition-colors duration-300"
              style={{ 
                background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
              }}
            >
              <div 
                className="inline-flex items-center justify-center mb-4 w-16 h-16 backdrop-blur-sm rounded-xl"
                style={{ 
                  backgroundColor: hexToRgba('#ffffff', 0.1),
                  border: `1px solid ${hexToRgba('#ffffff', 0.2)}`
                }}
              >
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-semibold text-white mb-2">
                Admin Portal
              </h1>
              <p className="text-purple-100 text-sm opacity-90">
                Sign in to access your dashboard
              </p>
            </div>

            {/* Form Section */}
            <div className="p-8">
              {error && (
                <div 
                  className="mb-6 p-4 rounded-lg flex items-start space-x-3 transition-colors duration-300"
                  style={{ 
                    backgroundColor: hexToRgba(theme.error, 0.1),
                    border: `1px solid ${hexToRgba(theme.error, 0.2)}`
                  }}
                >
                  <svg
                    className="w-5 h-5 flex-shrink-0 mt-0.5"
                    style={{ color: theme.error }}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm font-medium" style={{ color: theme.error }}>
                    {error}
                  </p>
                </div>
              )}

              <div className="space-y-5">
                {/* Username Field */}
                <div>
                  <label 
                    className="block text-sm font-medium mb-2 transition-colors duration-300"
                    style={{ color: theme.textSecondary }}
                  >
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 transition-colors duration-300"
                        style={{ color: theme.textSecondary }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200"
                      style={{ 
                        backgroundColor: theme.background,
                        border: `1px solid ${theme.border}`,
                        color: theme.text
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = theme.primary;
                        e.currentTarget.style.boxShadow = `0 0 0 2px ${hexToRgba(theme.primary, 0.2)}`;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = theme.border;
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      value={username}
                      placeholder="Enter your username"
                      onChange={(e) => setUsername(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label 
                    className="block text-sm font-medium mb-2 transition-colors duration-300"
                    style={{ color: theme.textSecondary }}
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 transition-colors duration-300"
                        style={{ color: theme.textSecondary }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full pl-10 pr-10 py-2.5 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200"
                      style={{ 
                        backgroundColor: theme.background,
                        border: `1px solid ${theme.border}`,
                        color: theme.text
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = theme.primary;
                        e.currentTarget.style.boxShadow = `0 0 0 2px ${hexToRgba(theme.primary, 0.2)}`;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = theme.border;
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      value={password}
                      placeholder="Enter your password"
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center transition-colors duration-200"
                      style={{ color: theme.textSecondary }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = theme.primary;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = theme.textSecondary;
                      }}
                    >
                      {showPassword ? (
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="remember"
                      className="h-4 w-4 rounded border-gray-300 focus:ring-2 transition-colors duration-200"
                      style={{ 
                        accentColor: theme.primary,
                        borderColor: theme.border
                      }}
                    />
                    <label
                      htmlFor="remember"
                      className="ml-2 text-sm transition-colors duration-300"
                      style={{ color: theme.textSecondary }}
                    >
                      Remember me
                    </label>
                  </div>
                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium transition-colors duration-200 hover:opacity-80"
                    style={{ color: theme.primary }}
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Login Button */}
                <button
                  className="w-full text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                  style={{ 
                    background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                    boxShadow: `0 4px 14px ${hexToRgba(theme.primary, 0.3)}`
                  }}
                  onClick={handleLogin}
                  disabled={isLoading || !username || !password}
                >
                  <span className="flex items-center justify-center">
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Signing In...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </span>
                </button>
              </div>
            </div>

            {/* Footer */}
            <div 
              className="px-8 py-6 rounded-b-lg transition-colors duration-300"
              style={{ 
                backgroundColor: hexToRgba(theme.background, 0.5),
                borderTop: `1px solid ${theme.border}`
              }}
            >
              <p className="text-center text-sm" style={{ color: theme.textSecondary }}>
                Need access?{" "}
                <Link
                  href="/request-account"
                  className="font-medium transition-colors duration-200 hover:opacity-80"
                  style={{ color: theme.primary }}
                >
                  Request an account
                </Link>
              </p>
            </div>
          </div>

          {/* Security Info */}
          <div className="mt-6 flex items-center justify-center space-x-6 text-xs">
            <div className="flex items-center space-x-1.5">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: theme.success }}></div>
              <span style={{ color: theme.textSecondary }}>Secure Connection</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <svg
                className="w-3.5 h-3.5"
                style={{ color: theme.textSecondary }}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span style={{ color: theme.textSecondary }}>256-bit Encryption</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}