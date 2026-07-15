import { Link } from "@tanstack/react-router";
import React, { useState } from "react";

export const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="mt-16 border-t border-neutral-200 bg-neutral-50 text-neutral-800 w-full">
      {/* Top Banner / Trust Badges Section */}
      <div className="border-b border-neutral-200 py-8 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-all duration-300 transform group-hover:scale-110">
              <i className="fa-solid fa-truck-fast text-lg"></i>
            </div>
            <div>
              <h4 className="font-bold text-sm text-black">Free Delivery</h4>
              <p className="text-xs text-neutral-500">On all orders over $50</p>
            </div>
          </div>
          <div className="flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-all duration-300 transform group-hover:scale-110">
              <i className="fa-solid fa-rotate-left text-lg"></i>
            </div>
            <div>
              <h4 className="font-bold text-sm text-black">Easy Returns</h4>
              <p className="text-xs text-neutral-500">30-day return policy</p>
            </div>
          </div>
          <div className="flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-all duration-300 transform group-hover:scale-110">
              <i className="fa-solid fa-shield-halved text-lg"></i>
            </div>
            <div>
              <h4 className="font-bold text-sm text-black">Secure Payment</h4>
              <p className="text-xs text-neutral-500">
                100% protected checkout
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-all duration-300 transform group-hover:scale-110">
              <i className="fa-solid fa-headset text-lg"></i>
            </div>
            <div>
              <h4 className="font-bold text-sm text-black">24/7 Support</h4>
              <p className="text-xs text-neutral-500">Dedicated care service</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-4">
            <div
              id="footer-logo"
              className="flex items-center text-neutral-900 text-xl tracking-tight"
            >
              <span className="font-bold text-black">e</span>-
              <span className="font-bold font-serif text-3xl rotate-12 text-black/90 mx-0.5 inline-block">
                M
              </span>
              <span className="font-medium text-black">arket</span>
            </div>
            <p className="text-sm text-neutral-500 leading-relaxed max-w-sm">
              Your ultimate destination for premium lifestyle products, trending
              streetwear, and cutting-edge tech gadgets. Elevate your everyday
              style with curated collections.
            </p>
            <div className="flex space-x-3 pt-2">
              <a
                href="#"
                className="w-9 h-9 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:text-black hover:border-black hover:scale-110 transition-all duration-300"
                aria-label="Facebook"
              >
                <i className="fa-brands fa-facebook-f text-sm"></i>
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:text-black hover:border-black hover:scale-110 transition-all duration-300"
                aria-label="Twitter"
              >
                <i className="fa-brands fa-x-twitter text-sm"></i>
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:text-black hover:border-black hover:scale-110 transition-all duration-300"
                aria-label="Instagram"
              >
                <i className="fa-brands fa-instagram text-sm"></i>
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:text-black hover:border-black hover:scale-110 transition-all duration-300"
                aria-label="Pinterest"
              >
                <i className="fa-brands fa-pinterest-p text-sm"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-black">
              Shop
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-neutral-500 hover:text-black hover:translate-x-1 inline-block transition-transform duration-200"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="text-neutral-500 hover:text-black hover:translate-x-1 inline-block transition-transform duration-200"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="text-neutral-500 hover:text-black hover:translate-x-1 inline-block transition-transform duration-200"
                >
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="text-neutral-500 hover:text-black hover:translate-x-1 inline-block transition-transform duration-200"
                >
                  My Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-black">
              Support
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="#"
                  className="text-neutral-500 hover:text-black hover:translate-x-1 inline-block transition-transform duration-200"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-neutral-500 hover:text-black hover:translate-x-1 inline-block transition-transform duration-200"
                >
                  Track Order
                </a>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="text-neutral-500 hover:text-black hover:translate-x-1 inline-block transition-transform duration-200"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-of-service"
                  className="text-neutral-500 hover:text-black hover:translate-x-1 inline-block transition-transform duration-200"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-4 space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-black">
              Newsletter
            </h3>
            <p className="text-sm text-neutral-500 leading-relaxed">
              Subscribe to get special offers, free giveaways, and
              once-in-a-lifetime deals.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white border border-neutral-300 text-sm px-4 py-2.5 rounded-sm focus:outline-none focus:border-black flex-1 transition-colors"
                  required
                />
                <button
                  type="submit"
                  className="bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase px-5 py-2.5 rounded-sm transition-all duration-300 active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  Join
                  <i className="fa-solid fa-paper-plane text-[10px]"></i>
                </button>
              </div>
              {subscribed && (
                <p className="text-emerald-600 text-xs font-semibold flex items-center gap-1 animate-pulse">
                  <i className="fa-solid fa-circle-check"></i> Thanks for
                  subscribing!
                </p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Footer Section */}
      <div className="border-t border-neutral-200 py-6 bg-neutral-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-neutral-500">
            &copy; {new Date().getFullYear()} e-Market. All rights reserved.
            Designed with precision.
          </p>
          <div className="flex items-center gap-4 text-neutral-400 text-lg">
            <i
              className="fa-brands fa-cc-visa hover:text-neutral-700 transition-colors duration-200"
              title="Visa"
            ></i>
            <i
              className="fa-brands fa-cc-mastercard hover:text-neutral-700 transition-colors duration-200"
              title="Mastercard"
            ></i>
            <i
              className="fa-brands fa-cc-paypal hover:text-neutral-700 transition-colors duration-200"
              title="Paypal"
            ></i>
            <i
              className="fa-brands fa-cc-stripe hover:text-neutral-700 transition-colors duration-200"
              title="Stripe"
            ></i>
            <i
              className="fa-brands fa-cc-apple-pay hover:text-neutral-700 transition-colors duration-200"
              title="Apple Pay"
            ></i>
          </div>
        </div>
      </div>
    </footer>
  );
};
