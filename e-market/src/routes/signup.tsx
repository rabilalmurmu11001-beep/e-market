import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import React, { useState, useEffect } from "react";
import { useAuthStore } from "../core/useAuthStore";

export const Route = createFileRoute("/signup")({
  component: SignupComponent,
});

function SignupComponent() {
  const { isAuthenticated, register } = useAuthStore();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
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

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError("Please fill in all the required details.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!agreeTerms) {
      setError("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }

    setIsLoading(true);

    // Simulate network authentication delay
    setTimeout(() => {
      register(firstName, lastName, email);
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
            <h2 className="text-2xl font-black uppercase tracking-tight mb-4 leading-tight">Create Account</h2>
            <p className="text-xs leading-relaxed text-neutral-400 font-medium max-w-xs">
              Join e-Market to get free shipping on orders above $300, unlock 10% coupon codes, save billing address templates, and checkout in 1-click.
            </p>
          </div>

          {/* Footer info */}
          <div className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider">
            © 2026 e-Market Corp. All rights reserved.
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Registration Form (7 Cols) */}
        <div className="md:col-span-7 p-8 md:p-12 flex flex-col justify-center bg-white">
          <div className="mb-8">
            <h1 className="text-2xl font-black uppercase tracking-tight mb-1.5">Sign Up</h1>
            <p className="text-xs text-neutral-400 font-semibold">Fill out the fields below to register your shopping profile</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 mb-6 rounded-sm text-xs font-semibold flex items-center gap-2 animate-fadeIn">
              <i className="fa-solid fa-triangle-exclamation"></i> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-400 mb-1.5">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full border border-neutral-300 px-4 py-2.5 text-sm rounded-sm focus:outline-none focus:border-black font-medium"
                  placeholder="John"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-400 mb-1.5">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full border border-neutral-300 px-4 py-2.5 text-sm rounded-sm focus:outline-none focus:border-black font-medium"
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-400 mb-1.5">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-neutral-300 px-4 py-2.5 text-sm rounded-sm focus:outline-none focus:border-black font-medium"
                  placeholder="Password"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-400 mb-1.5">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-neutral-300 px-4 py-2.5 text-sm rounded-sm focus:outline-none focus:border-black font-medium"
                  placeholder="Confirm"
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-2 text-xs font-semibold text-neutral-500 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 accent-black shrink-0"
                />
                <span>
                  I agree to the{" "}
                  <a href="#" className="text-black font-bold underline">Terms of Service</a>
                  {" "}and{" "}
                  <a href="#" className="text-black font-bold underline">Privacy Policy</a>.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider py-4 rounded-sm transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="text-xs text-neutral-400 font-semibold text-center mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-black font-black underline hover:text-neutral-600">
              Sign In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
