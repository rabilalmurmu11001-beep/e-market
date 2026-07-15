import React, { useState } from "react";

interface AuthPanelProps {
  onLoginSuccess: (email: string) => void;
  onRegisterSuccess: () => void;
}

export const AuthPanel: React.FC<AuthPanelProps> = ({ onLoginSuccess, onRegisterSuccess }) => {
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [emailInput, setEmailInput] = useState("johndoe@example.com");
  const [passwordInput, setPasswordInput] = useState("••••••••");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess(emailInput);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    onRegisterSuccess();
  };

  return (
    <div className="max-w-md mx-auto my-12 border border-neutral-200 rounded-sm shadow-xl p-8 bg-white">
      <div className="flex border-b border-neutral-200 mb-6">
        <button
          onClick={() => setAuthTab("login")}
          className={`flex-1 pb-3 text-sm font-bold uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
            authTab === "login" ? "border-black text-black" : "border-transparent text-neutral-400 hover:text-black"
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => setAuthTab("register")}
          className={`flex-1 pb-3 text-sm font-bold uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
            authTab === "register" ? "border-black text-black" : "border-transparent text-neutral-400 hover:text-black"
          }`}
        >
          Register
        </button>
      </div>

      {authTab === "login" ? (
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Email Address</label>
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="w-full border border-neutral-300 px-3 py-2 text-sm rounded-sm focus:outline-none focus:border-black font-medium"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Password</label>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full border border-neutral-300 px-3 py-2 text-sm rounded-sm focus:outline-none focus:border-black font-medium"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider py-4 rounded-sm transition-colors cursor-pointer shadow-md"
          >
            Sign In (Simulated)
          </button>
        </form>
      ) : (
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">First Name</label>
              <input
                type="text"
                className="w-full border border-neutral-300 px-3 py-2 text-sm rounded-sm focus:outline-none focus:border-black font-medium"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Last Name</label>
              <input
                type="text"
                className="w-full border border-neutral-300 px-3 py-2 text-sm rounded-sm focus:outline-none focus:border-black font-medium"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Email Address</label>
            <input
              type="email"
              className="w-full border border-neutral-300 px-3 py-2 text-sm rounded-sm focus:outline-none focus:border-black font-medium"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Password</label>
            <input
              type="password"
              className="w-full border border-neutral-300 px-3 py-2 text-sm rounded-sm focus:outline-none focus:border-black font-medium"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider py-4 rounded-sm transition-colors cursor-pointer shadow-md"
          >
            Create Account (Simulated)
          </button>
        </form>
      )}
    </div>
  );
};
