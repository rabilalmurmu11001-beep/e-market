import type React from "react";

export const Banner: React.FC = () => {
  return (
    <section className="relative overflow-hidden rounded-sm bg-[#F5F5F5] text-black sm:px-8 sm:py-10 border font-sans">
      {/* 1. E-commerce Creative Background Elements */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Large subtle typography watermark */}
        <div className="absolute right-[-5%] bottom-[-10%] text-[14rem] font-black text-black/3 select-none tracking-tighter uppercase hidden lg:block">
          SALE
        </div>
        {/* Solid geometry accent to make products pop */}
        <div className="absolute right-0 top-0 h-full w-[45%] bg-neutral-900 skew-x-6 origin-top-right hidden lg:block" />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col gap-12 px-6 py-12 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-14 lg:py-16 z-10">
        {/* Left Side: Storefront Copy & Action */}
        <div className="space-y-6">
          {/* E-com Category Tag */}
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-5 bg-black rounded-xs block"></span>
            <span className="text-black font-bold text-xs uppercase tracking-[0.2em]">
              Limited Time Only
            </span>
          </div>

          {/* Bold Retail Typography */}
          <h1 className="text-4xl font-black tracking-tight text-black sm:text-5xl lg:text-6xl uppercase leading-[0.95]">
            Upgrade <br />
            Your Style. <br />
            <span className="text-neutral-500">Save Up To 40%</span>
          </h1>

          <p className="max-w-md text-sm leading-6 text-neutral-600 font-medium">
            Explore premium tech gadgets, trending streetwear collections, and
            daily lifestyle essentials. Fast global delivery included.
          </p>

          {/* High-Contrast Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button className="inline-flex items-center gap-2 bg-black hover:bg-neutral-800 text-white px-8 py-3.5 rounded-sm text-sm font-bold transition-all active:scale-95 shadow-md uppercase tracking-wider">
              Shop The Collection
              <i className="fa-solid fa-arrow-right text-xs"></i>
            </button>
            <button className="inline-flex items-center gap-2 border border-neutral-300 bg-white hover:bg-neutral-50 text-black px-6 py-3.5 rounded-sm text-sm font-bold transition-all active:scale-95">
              Browse Categories
            </button>
          </div>

          {/* Store Trust Badges */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-4 border-t border-neutral-300/60">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-700">
              <i className="fa-solid fa-truck-fast text-sm text-black"></i> Free
              Shipping $50+
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-700">
              <i className="fa-solid fa-rotate-left text-sm text-black"></i>{" "}
              30-Day Returns
            </div>
          </div>
        </div>

        {/* Right Side: Hero Product Spotlight Cards */}
        <div className="flex flex-col sm:flex-row gap-4 lg:max-w-xl w-full justify-end items-center">
          {/* Main Featured Showcase Card */}
          <div className="relative bg-white border border-neutral-200 p-5 rounded-sm shadow-xl w-full sm:w-64 transform lg:-rotate-2 hover:rotate-0 transition-transform duration-300 group cursor-pointer">
            <span className="absolute top-3 left-3 bg-black text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-xs">
              Hot Item
            </span>
            <div className="bg-[#F5F5F5] h-48 w-full flex items-center justify-center rounded-sm overflow-hidden mb-4">
              <img
                src="https://via.placeholder.com/180"
                alt="Featured Product"
                className="max-h-36 object-contain group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <h3 className="font-bold text-sm text-black truncate">
              Wireless Noise-Canceling Headphones
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-black font-extrabold text-sm">$249</span>
              <span className="text-neutral-400 line-through text-xs">
                $349
              </span>
            </div>
          </div>

          {/* Secondary Mini Promo Card */}
          <div className="relative bg-white border border-neutral-200 p-5 rounded-sm shadow-xl w-full sm:w-56 transform lg:rotate-3 hover:rotate-0 transition-transform duration-300 group cursor-pointer hidden sm:block">
            <span className="absolute top-3 left-3 bg-[#00FF66] text-black text-[10px] font-bold uppercase px-2 py-0.5 rounded-xs">
              New
            </span>
            <div className="bg-[#F5F5F5] h-36 w-full flex items-center justify-center rounded-sm overflow-hidden mb-4">
              <img
                src="https://via.placeholder.com/120"
                alt="Featured Product"
                className="max-h-28 object-contain group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <h3 className="font-bold text-xs text-black truncate">
              Smart Sports Watch v2
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-black font-extrabold text-xs">$189</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
