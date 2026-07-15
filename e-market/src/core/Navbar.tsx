import { Link } from "@tanstack/react-router";
import React from "react";
import { useCart } from "./CartContext";
import { useAuthStore } from "./useAuthStore";

export const Navbar: React.FC = () => {
  const { cartCount } = useCart();
  const { isAuthenticated, logout } = useAuthStore();

  return (
    <nav className="sticky top-0 z-50 bg-white/50 backdrop-blur-xs border-b border-neutral-100 p-4">
      <div className="md:flex h-auto md:h-16 space-x-4">
        <div
          id="logo"
          className="md:w-38 w-full pb-4 md:pb-0 flex items-center justify-center h-full "
        >
          <span className="font-bold">e</span>-
          <span className="font-bold font-serif text-5xl rotate-12 text-black/90">
            M
          </span>
          arket
        </div>
        <div
          id="menu"
          className="flex-1 flex items-center justify-between h-full px-4"
        >
          <div className="space-x-4 flex items-center">
            <Link to="/">
              <button className="h-7 text-sm px-4 cursor-pointer rounded border border-black hover:bg-black hover:text-white transition-colors duration-300 flex items-center justify-center">
                Home
              </button>
            </Link>
            <Link to="/products">
              <button className="h-7 text-sm px-4 cursor-pointer rounded border border-black hover:bg-black hover:text-white transition-colors duration-300 flex items-center justify-center">
                Browse
              </button>
            </Link>
          </div>
          <div className="space-x-4 flex items-center">
            <Link to="/cart">
              <button className="relative w-10 h-7 cursor-pointer rounded border border-black hover:bg-black hover:text-white transition-colors duration-300 flex items-center justify-center">
                <i className="fa fa-shopping-cart"></i>
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full text-[9px] w-4.5 h-4.5 flex items-center justify-center font-bold border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </button>
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/profile">
                  <button className="w-10 h-7 cursor-pointer rounded border border-black hover:bg-black hover:text-white transition-colors duration-300 flex items-center justify-center" title="Profile">
                    <i className="fa fa-user"></i>
                  </button>
                </Link>
                <button
                  className="w-10 h-7 cursor-pointer rounded border border-red-500 hover:bg-red-500 hover:text-white transition-colors duration-300 flex items-center justify-center"
                  onClick={logout}
                  title="Log Out"
                >
                  <i className="fa fa-sign-out-alt"></i>
                </button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <button className="h-7 px-4 cursor-pointer rounded border border-black hover:bg-black hover:text-white transition-colors duration-300 flex items-center justify-center">
                    <i className="fa fa-sign-in-alt"></i>
                    <span className="ml-1.5 text-sm hidden md:inline">Sign In</span>
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="h-7 px-4 cursor-pointer rounded border border-black hover:bg-black hover:text-white transition-colors duration-300 flex items-center justify-center">
                    <i className="fa fa-user-plus"></i>
                    <span className="ml-1.5 hidden text-sm md:inline">Sign Up</span>
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

