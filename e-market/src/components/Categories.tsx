import React, { useState } from "react";

// 1. Define the category data structure
const categoriesData = [
  { id: "phones", name: "Phones", icon: "fa-solid fa-mobile-screen-button" },
  { id: "computers", name: "Computers", icon: "fa-solid fa-desktop" },
  { id: "smartwatch", name: "SmartWatch", icon: "fa-solid fa-clock" }, // Note: fa-watch-fitness or fa-clock depending on version. fa-clock is universal.
  { id: "camera", name: "Camera", icon: "fa-solid fa-camera" },
  { id: "headphones", name: "HeadPhones", icon: "fa-solid fa-headphones" },
  { id: "gaming", name: "Gaming", icon: "fa-solid fa-gamepad" },
];

export const Categories: React.FC = () => {
  // Use state to track which category card is currently active/clicked
  const [activeCategory, setActiveCategory] = useState("camera");

  return (
    <div className="mx-auto px-4 py-8 font-sans">
      {/* Header Section */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-5 h-10 bg-black rounded-sm block"></span>
            <span className="text-black font-semibold text-sm">Categories</span>
          </div>
          <h2 className="text-3xl font-bold tracking-wide text-black">
            Browse By Category
          </h2>
        </div>

        {/* Navigation Arrows */}
        <div className="flex gap-2">
          <button className="w-11 h-11 rounded-full cursor-pointer bg-gray-100 border hover:bg-black flex items-center justify-center text-black hover:text-white transition-colors">
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <button className="w-11 h-11 rounded-full cursor-pointer bg-gray-100 border hover:bg-black flex items-center justify-center text-black hover:text-white transition-colors">
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>

      {/* Categories Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {categoriesData.map((cat) => {
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`
                flex flex-col items-center justify-center h-36 border rounded-sm transition-all duration-200
                ${
                  isActive
                    ? "bg-black text-white border-black shadow-md"
                    : "bg-white text-black hover:bg-gray-50"
                }
              `}
            >
              {/* Font Awesome Icon */}
              <i className={`${cat.icon} text-3xl mb-4`}></i>
              <span className="text-sm font-medium">{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
