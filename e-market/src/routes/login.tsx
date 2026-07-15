import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import React, { useState, useEffect } from "react";
import { useAuthStore } from "../core/useAuthStore";

export const Route = createFileRoute("/login")({
  component: LoginComponent,
});

function LoginComponent() {
  const { isAuthenticated, login } = useAuthStore();
  const navigate = useNavigate();

  const [email, setEmail] = useState("johndoe@example.com");
  const [password, setPassword] = useState("••••••••");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // If already authenticated, redirect to profile page immediately
  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/profile" });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all credentials.");
      return;
    }

    setIsLoading(true);

    // Simulate network authentication delay
    setTimeout(() => {
      login(email);
      setIsLoading(false);
      navigate({ to: "/profile" });
    }, 1500);
  };

  return (
    <div className="mx-auto px-4 py-12 font-sans text-black bg-white min-h-[80vh] flex items-center justify-center">
      <div className="max-w-4xl w-full border border-neutral-200 rounded-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 shadow-xl bg-white min-h-[500px]">
        
        {/* LEFT COLUMN: Visual Brand Panel (5 Cols) */}
        <div className="md:col-span-5 bg-gradient-to-br from-neutral-900 to-black text-white p-8 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Background Art Accent */}
          <div className="absolute -right-16 -top-16 w-48 h-48 bg-neutral-800 rounded-full opacity-30 blur-2xl" />
          <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-neutral-800 rounded-full opacity-30 blur-2xl" />

          {/* Logo */}
          <div className="flex items-center text-lg font-bold">
            <span className="font-extrabold text-white">e</span>-
            <span className="font-bold font-serif text-3xl rotate-12 text-white/90 mx-0.5">M</span>
            arket
          </div>

          {/* Feature text info */}
          <div className="my-8">
            <h2 className="text-2xl font-black uppercase tracking-tight mb-4 leading-tight">Welcome Back</h2>
            <p className="text-xs leading-relaxed text-neutral-400 font-medium max-w-xs">
              Log in to access your dashboard, trace DHL logistics shipping statuses, edit billing cards, and use personalized saving coupons.
            </p>
          </div>

          {/* Footer info */}
          <div className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider">
            © 2026 e-Market Corp. All rights reserved.
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Login Form (7 Cols) */}
        <div className="md:col-span-7 p-8 md:p-12 flex flex-col justify-center bg-white">
          <div className="mb-8">
            <h1 className="text-2xl font-black uppercase tracking-tight mb-1.5">Sign In</h1>
            <p className="text-xs text-neutral-400 font-semibold">Enter your account credentials to access your dashboard</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 mb-6 rounded-sm text-xs font-semibold flex items-center gap-2">
              <i className="fa-solid fa-triangle-exclamation"></i> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-400 mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-neutral-300 px-4 py-2.5 text-sm rounded-sm focus:outline-none focus:border-black font-medium"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold uppercase text-neutral-400">Password</label>
                <a href="#" className="text-xs text-neutral-400 hover:text-black font-bold transition-colors">Forgot Password?</a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-neutral-300 px-4 py-2.5 text-sm rounded-sm focus:outline-none focus:border-black font-medium"
                placeholder="Enter password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider py-4 rounded-sm transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Verifying...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Social Signin divider */}
          <div className="relative my-6 text-center">
            <hr className="border-neutral-200" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-[10px] font-black uppercase text-neutral-400">Or Continue With</span>
          </div>

          <button className="w-full border border-neutral-300 hover:bg-neutral-50 text-neutral-700 font-bold text-xs uppercase tracking-wider py-3 rounded-sm transition-colors cursor-pointer flex items-center justify-center gap-2 mb-8">
            <i className="fa-brands fa-google text-sm"></i> Google Authentication
          </button>

          <p className="text-xs text-neutral-400 font-semibold text-center mt-2">
            Don't have an account?{" "}
            <Link to="/signup" className="text-black font-black underline hover:text-neutral-600">
              Sign Up For Free
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
