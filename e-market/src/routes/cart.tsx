import { createFileRoute, Link } from "@tanstack/react-router";
import React, { useState } from "react";
import { useCart } from "../core/CartContext";

interface Address {
  id: string;
  type: string;
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
}

export const Route = createFileRoute("/cart")({
  component: CartComponent,
});

function CartComponent() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartSubtotal,
  } = useCart();

  // Load addresses from local storage
  const [addresses] = useState<Address[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("e_market_addresses");
      if (saved) return JSON.parse(saved);
    }
    return [
      {
        id: "addr-1",
        type: "Home Address",
        fullName: "John Doe",
        street: "123 Main Street, Suite 4B",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        isDefaultShipping: true,
        isDefaultBilling: true,
      },
      {
        id: "addr-2",
        type: "Office Address",
        fullName: "John Doe",
        street: "456 Broadway Ave, Floor 12",
        city: "New York",
        state: "NY",
        zipCode: "10013",
        isDefaultShipping: false,
        isDefaultBilling: false,
      },
    ];
  });

  const defaultShipping = addresses.find((a) => a.isDefaultShipping) || addresses[0];
  const [selectedAddressId, setSelectedAddressId] = useState<string>(defaultShipping?.id || "");
  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) || defaultShipping;


  // State for promo code
  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  // State for simulated checkout modal
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<"idle" | "loading" | "success">("idle");
  const [orderId, setOrderId] = useState("");

  // Shipping calculation
  const baseShippingRate = 15;
  const freeShippingThreshold = 300;
  const isFreeShipping = cartSubtotal >= freeShippingThreshold || couponCode.toUpperCase() === "FREESHIP";
  const shippingCost = cartSubtotal === 0 || isFreeShipping ? 0 : baseShippingRate;

  // Coupon application handler
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    setCouponSuccess("");

    const code = couponCode.trim().toUpperCase();

    if (!code) {
      setCouponError("Please enter a coupon code.");
      return;
    }

    if (code === "SAVE10") {
      setDiscountPercent(10);
      setCouponSuccess("Coupon 'SAVE10' applied! 10% discount subtracted from your total.");
    } else if (code === "FREESHIP") {
      setDiscountPercent(0);
      setCouponSuccess("Coupon 'FREESHIP' applied! Your shipping is now free.");
    } else {
      setCouponError("Invalid coupon code. Try 'SAVE10' or 'FREESHIP'.");
      setDiscountPercent(0);
    }
  };

  const discountAmount = (cartSubtotal * discountPercent) / 100;
  const orderTotal = cartSubtotal - discountAmount + shippingCost;

  // Simulated checkout handler
  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    
    setIsCheckingOut(true);
    setCheckoutStep("loading");
    
    // Simulate payment process
    setTimeout(() => {
      setCheckoutStep("success");
      setOrderId("EM-" + Math.floor(100000 + Math.random() * 900000));
      clearCart();
    }, 2500);
  };

  const closeCheckoutModal = () => {
    setIsCheckingOut(false);
    setCheckoutStep("idle");
    setCouponCode("");
    setDiscountPercent(0);
    setCouponSuccess("");
  };

  return (
    <div className="mx-auto px-4 py-8 font-sans text-black bg-white min-h-[80vh]">
      {/* Breadcrumb Path */}
      <nav className="text-xs text-neutral-400 font-medium mb-6">
        <Link to="/" className="hover:text-black transition-colors">Home</Link> /{" "}
        <span className="text-black font-semibold">Cart</span>
      </nav>

      <h1 className="text-3xl font-black uppercase tracking-tight mb-8">
        Your Shopping Cart
      </h1>

      {cartItems.length === 0 ? (
        /* ================= EMPTY STATE ================= */
        <div className="flex flex-col items-center justify-center py-16 border border-neutral-100 rounded-sm bg-neutral-50/30 text-center px-4">
          <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-400 mb-6 transition-transform hover:scale-110 duration-300">
            <i className="fa-solid fa-shopping-basket text-3xl"></i>
          </div>
          <h2 className="text-xl font-bold mb-2">Your cart is currently empty</h2>
          <p className="text-sm text-neutral-500 max-w-sm mb-8">
            Before you proceed to checkout, you must add some products to your shopping cart.
            You will find a lot of interesting products on our browse page.
          </p>
          <Link to="/products">
            <button className="bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider py-4 px-10 rounded-sm transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer shadow-md">
              Browse Products
            </button>
          </Link>
        </div>
      ) : (
        /* ================= CART ITEMS LIST AND SUMMARY GRID ================= */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Cart Items Table (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="overflow-x-auto border border-neutral-200 rounded-sm">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50/50 text-xs font-bold uppercase tracking-wider text-neutral-400">
                    <th className="py-4 px-6">Product</th>
                    <th className="py-4 px-6 text-center">Price</th>
                    <th className="py-4 px-6 text-center">Quantity</th>
                    <th className="py-4 px-6 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {cartItems.map((item) => (
                    <tr key={`${item.id}-${item.color || ""}-${item.size || ""}`} className="group hover:bg-neutral-50/30 transition-colors">
                      {/* Product details */}
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-4">
                          {/* Image container */}
                          <div className="w-16 h-16 bg-neutral-100 rounded-sm overflow-hidden flex items-center justify-center shrink-0 border border-neutral-100">
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          {/* Name + variation badges */}
                          <div>
                            <Link to="/product/$productId" params={{ productId: String(item.id) }} className="font-bold text-black hover:underline leading-snug">
                              {item.name}
                            </Link>
                            <div className="flex flex-wrap gap-2 mt-1.5">
                              {item.color && (
                                <span className="inline-flex items-center gap-1.5 bg-neutral-100 text-neutral-600 text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase border border-neutral-200">
                                  <span className="w-2.5 h-2.5 rounded-full inline-block border border-neutral-300" style={{ backgroundColor: item.color }} />
                                  Color
                                </span>
                              )}
                              {item.size && (
                                <span className="inline-flex items-center bg-neutral-100 text-neutral-600 text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase border border-neutral-200">
                                  Size: {item.size}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Item unit price */}
                      <td className="py-5 px-6 text-center font-bold text-neutral-600">
                        ${item.price}.00
                      </td>

                      {/* Quantity modifiers */}
                      <td className="py-5 px-6">
                        <div className="flex items-center justify-center">
                          <div className="flex items-center border border-neutral-300 rounded-sm overflow-hidden h-9">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1, item.color, item.size)}
                              className="w-8 h-full bg-white hover:bg-neutral-50 flex items-center justify-center text-xs border-r border-neutral-300 transition-colors cursor-pointer"
                            >
                              <i className="fa-solid fa-minus"></i>
                            </button>
                            <span className="w-10 text-center text-xs font-black select-none">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1, item.color, item.size)}
                              className="w-8 h-full bg-white hover:bg-neutral-50 flex items-center justify-center text-xs border-l border-neutral-300 transition-colors cursor-pointer"
                            >
                              <i className="fa-solid fa-plus"></i>
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Item subtotal */}
                      <td className="py-5 px-6 text-right">
                        <div className="flex items-center justify-end gap-4">
                          <span className="font-black text-black">
                            ${item.price * item.quantity}.00
                          </span>
                          <button
                            onClick={() => removeFromCart(item.id, item.color, item.size)}
                            className="text-neutral-300 hover:text-red-600 w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-50 transition-colors cursor-pointer"
                            title="Remove item"
                          >
                            <i className="fa-regular fa-trash-can"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Shipping Address Selection Card */}
            <div className="border border-neutral-200 rounded-sm p-6 bg-neutral-50/20">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-truck-ramp-box text-neutral-500"></i>
                  <h3 className="font-bold text-sm uppercase tracking-wide">
                    Shipping Destination
                  </h3>
                </div>
                
                {addresses.length > 0 && (
                  <div className="flex items-center gap-2">
                    <label htmlFor="address-select" className="text-xs text-neutral-400 font-bold uppercase">Deliver to:</label>
                    <select
                      id="address-select"
                      value={selectedAddressId}
                      onChange={(e) => setSelectedAddressId(e.target.value)}
                      className="border bg-white text-xs font-bold py-1.5 px-3 rounded-sm focus:outline-none cursor-pointer"
                    >
                      {addresses.map((addr) => (
                        <option key={addr.id} value={addr.id}>
                          {addr.type} ({addr.fullName})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {selectedAddress ? (
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="text-xs font-semibold text-neutral-600 space-y-1">
                    <p className="font-bold text-black flex items-center gap-1.5">
                      <span>{selectedAddress.fullName}</span>
                      {selectedAddress.isDefaultShipping && (
                        <span className="bg-neutral-150 text-neutral-500 border text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded-xs scale-90">
                          Default
                        </span>
                      )}
                    </p>
                    <p>{selectedAddress.street}</p>
                    <p>{selectedAddress.city}, {selectedAddress.state} {selectedAddress.zipCode}</p>
                  </div>
                  
                  <Link to="/profile">
                    <button className="text-xs font-bold uppercase tracking-wider text-black border-b border-black hover:text-neutral-500 hover:border-neutral-500 transition-colors py-0.5 cursor-pointer">
                      Manage Addresses
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="flex justify-between items-center text-xs">
                  <p className="text-neutral-500 font-medium">No saved shipping addresses found.</p>
                  <Link to="/profile">
                    <button className="bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-sm transition-colors cursor-pointer">
                      Add Shipping Address
                    </button>
                  </Link>
                </div>
              )}
            </div>

            {/* Cart Operations Row */}
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <Link to="/products">
                <button className="border border-black hover:bg-black hover:text-white px-8 py-3 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer">
                  Continue Shopping
                </button>
              </Link>
              <button
                onClick={clearCart}
                className="border border-red-200 hover:border-red-600 text-red-600 hover:bg-red-50/50 px-8 py-3 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
              >
                Clear Shopping Cart
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Coupons and Sidebar Summary (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Promo / Coupon Box */}
            <div className="border border-neutral-200 rounded-sm p-6 bg-white">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 mb-3">
                Have a coupon?
              </h3>
              <p className="text-xs text-neutral-500 mb-4">
                Use <code className="font-bold text-black bg-neutral-100 px-1 py-0.5 rounded">SAVE10</code> for 10% off, or <code className="font-bold text-black bg-neutral-100 px-1 py-0.5 rounded">FREESHIP</code> for free shipping.
              </p>
              
              <form onSubmit={handleApplyCoupon} className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 border border-neutral-300 px-3 py-2 text-sm rounded-sm focus:outline-none focus:border-black uppercase font-medium"
                />
                <button
                  type="submit"
                  className="bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider px-5 py-2 rounded-sm transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </form>

              {couponError && (
                <p className="text-xs text-red-600 font-semibold mt-1">
                  <i className="fa-solid fa-triangle-exclamation mr-1"></i> {couponError}
                </p>
              )}
              {couponSuccess && (
                <p className="text-xs text-green-600 font-semibold mt-1">
                  <i className="fa-solid fa-circle-check mr-1"></i> {couponSuccess}
                </p>
              )}
            </div>

            {/* Cart Summary Card */}
            <div className="border-2 border-black rounded-sm p-6 bg-white shadow-xs">
              <h3 className="text-base font-black uppercase tracking-wider mb-6 pb-2 border-b border-neutral-100">
                Order Summary
              </h3>
              
              <div className="space-y-4 text-sm font-medium mb-6">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-black">${cartSubtotal}.00</span>
                </div>
                
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({discountPercent}%)</span>
                    <span className="font-bold">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-neutral-600">
                  <span>Shipping</span>
                  {shippingCost === 0 ? (
                    <span className="text-[#00FF66] font-bold uppercase tracking-wider text-xs">Free Shipping</span>
                  ) : (
                    <span className="font-bold text-black">${shippingCost}.00</span>
                  )}
                </div>

                {!isFreeShipping && cartSubtotal > 0 && (
                  <div className="pt-1.5 text-[11px] text-neutral-400 font-medium leading-normal">
                    <i className="fa-solid fa-circle-info mr-1"></i>
                    Add <span className="font-bold text-black">${freeShippingThreshold - cartSubtotal}</span> more to unlock <span className="font-bold text-black">FREE SHIPPING</span>.
                  </div>
                )}
                
                <hr className="border-neutral-200 my-4" />
                
                <div className="flex justify-between text-base font-black">
                  <span>Total</span>
                  <span className="text-lg">${orderTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider py-4 rounded-sm transition-all duration-300 transform hover:-translate-y-0.5 shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <i className="fa-solid fa-credit-card"></i> Proceed to Checkout
              </button>
            </div>

          </div>

        </div>
      )}

      {/* ================= SIMULATED CHECKOUT MODAL ================= */}
      {isCheckingOut && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Modal backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={checkoutStep === "success" ? closeCheckoutModal : undefined}
          />
          
          {/* Modal content box */}
          <div className="relative bg-white border border-neutral-100 rounded-sm shadow-2xl p-8 max-w-md w-full z-10 overflow-hidden transform transition-all duration-300 scale-100 flex flex-col items-center text-center">
            
            {checkoutStep === "loading" && (
              <div className="py-12 flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-neutral-200 border-t-black rounded-full animate-spin mb-6"></div>
                <h3 className="text-lg font-bold mb-2">Processing Payment</h3>
                <p className="text-xs text-neutral-500 max-w-xs">
                  Please hold on as we securely authorize your transaction with the payment gateway. Do not close this window.
                </p>
              </div>
            )}

            {checkoutStep === "success" && (
              <div className="py-6 flex flex-col items-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 text-2xl animate-bounce">
                  <i className="fa-solid fa-check"></i>
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight mb-2">Order Confirmed!</h3>
                <p className="text-xs text-neutral-500 max-w-xs mb-6">
                  Thank you for your purchase. Your payment was processed successfully. A confirmation invoice has been sent to your email.
                </p>
                
                <div className="bg-neutral-50 border border-neutral-200 rounded-sm p-4 w-full mb-8 text-left space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-neutral-400 font-semibold">Order ID</span>
                    <span className="font-bold text-black font-mono">{orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400 font-semibold">Status</span>
                    <span className="text-green-600 font-bold uppercase tracking-wider text-[10px]">Paid & Confirmed</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400 font-semibold">Estimated Delivery</span>
                    <span className="font-bold text-black">3 - 5 Business Days</span>
                  </div>
                  <div className="border-t border-neutral-200/60 pt-2 flex flex-col gap-1 text-[11px] leading-relaxed">
                    <span className="text-neutral-400 font-semibold">Shipping Address:</span>
                    <span className="font-bold text-neutral-700">
                      {selectedAddress ? (
                        <>
                          {selectedAddress.fullName}, {selectedAddress.street}, {selectedAddress.city}, {selectedAddress.state} {selectedAddress.zipCode}
                        </>
                      ) : (
                        "No address selected"
                      )}
                    </span>
                  </div>

                </div>

                <button
                  onClick={closeCheckoutModal}
                  className="bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider py-4 px-8 rounded-sm transition-colors cursor-pointer w-full"
                >
                  Return to Home
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
