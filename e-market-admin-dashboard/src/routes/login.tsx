import { createFileRoute, useNavigate, Navigate } from "@tanstack/react-router";
import { useStore } from "../store/useStore";
import { useState } from "react";

export const Route = createFileRoute("/login")({
  component: LoginPageComponent,
});

function LoginPageComponent() {
  const { login, currentUser } = useStore();
  const [email, setEmail] = useState("admin@e-market.com");
  const [password, setPassword] = useState("admin");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // If already logged in, redirect directly to dashboard
  if (currentUser) {
    return <Navigate to="/" />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      if (!email.trim() || !password.trim()) {
        setError("All fields are required");
        setIsLoading(false);
        return;
      }

      // Validate mock admin credentials
      if (email === "admin@e-market.com" && password === "admin") {
        login(email, "admin");
        setIsLoading(false);
        navigate({ to: "/" });
      } else {
        setError("Invalid admin credentials. Use admin@e-market.com / admin");
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4 font-sans select-none">
      {/* Geometric background grids */}
      <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:30px_30px]"></div>

      <div className="relative max-w-sm w-full bg-white border border-neutral-200 p-8 space-y-8 shadow-md">
        {/* Brand Banner */}
        <div className="text-center space-y-2">
          <span className="text-[10px] font-black text-red-500 uppercase tracking-widest bg-red-50 px-2 py-0.5 rounded-xs">
            Logistics portal
          </span>
          <div
            id="logo"
            className="font-bold flex items-center justify-center"
          >
            <span className="">e</span>-
            <span className=" font-serif text-5xl rotate-12 text-black/90">
              M
            </span>
            arket
          </div>
          <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">
            Sign in to access administration dashboard.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 border border-red-200 text-xs font-bold uppercase tracking-wider py-2.5 px-3 rounded-xs flex items-center gap-2 animate-shake">
            <i className="fa-solid fa-triangle-exclamation"></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email input */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-black block">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                disabled={isLoading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-neutral-200 px-3 py-2.5 pl-8 text-xs font-semibold focus:outline-none focus:border-black rounded-xs disabled:opacity-50"
              />
              <i className="fa-solid fa-envelope absolute left-3 top-3.5 text-neutral-400 text-xs"></i>
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-black block">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                disabled={isLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-neutral-200 px-3 py-2.5 pl-8 pr-8 text-xs font-semibold focus:outline-none focus:border-black rounded-xs disabled:opacity-50"
              />
              <i className="fa-solid fa-key absolute left-3 top-3.5 text-neutral-400 text-xs"></i>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-neutral-400 hover:text-black cursor-pointer"
              >
                <i
                  className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"} text-[11px]`}
                ></i>
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-widest py-3.5 rounded-xs transition-colors active-scale cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <i className="fa-solid fa-circle-notch animate-spin"></i>
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-right-to-bracket"></i>
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Helper */}
        <div className="bg-neutral-50 border border-neutral-200 p-4 text-[10px] text-neutral-400 font-bold uppercase tracking-wider text-center space-y-1">
          <p className="text-black font-black">Demo Account credentials</p>
          <p>
            Email: <span className="text-slate-600">admin@e-market.com</span>
          </p>
          <p>
            Password: <span className="text-slate-600">admin</span>
          </p>
        </div>
      </div>
    </div>
  );
}
