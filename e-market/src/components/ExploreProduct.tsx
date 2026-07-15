import React, { useState } from "react";
import { ProductCard } from "./ProductCard";
import { useNavigate } from "@tanstack/react-router";
import { useCart } from "../core/CartContext";


export const ExploreProducts: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  // Mock data representing the 8 items in the grid snippet
  const products = [
    {
      id: 1,
      name: "Breed Dry Dog Food",
      price: 100,
      rating: 3,
      reviewsCount: 35,
      imageUrl: "https://via.placeholder.com/150",
      hasBadge: false,
    },
    {
      id: 2,
      name: "CANON EOS DSLR Camera",
      price: 360,
      rating: 4,
      reviewsCount: 95,
      imageUrl: "https://via.placeholder.com/150",
      hasBadge: false,
    },
    {
      id: 3,
      name: "ASUS FHD Gaming Laptop",
      price: 700,
      rating: 5,
      reviewsCount: 325,
      imageUrl: "https://via.placeholder.com/150",
      hasBadge: false,
    },
    {
      id: 4,
      name: "Curology Product Set",
      price: 500,
      rating: 4,
      reviewsCount: 145,
      imageUrl: "https://via.placeholder.com/150",
      hasBadge: false,
    },
    {
      id: 5,
      name: "Kids Electric Car",
      price: 960,
      rating: 5,
      reviewsCount: 65,
      imageUrl: "https://via.placeholder.com/150",
      hasBadge: true,
      badgeText: "NEW",
      colors: ["#000000", "#DB4444"],
    },
    {
      id: 6,
      name: "Jr. Zoom Soccer Cleats",
      price: 1160,
      rating: 5,
      reviewsCount: 35,
      imageUrl: "https://via.placeholder.com/150",
      hasBadge: false,
      colors: ["#EEFF00", "#DB4444"],
    },
    {
      id: 7,
      name: "GP11 Shooter USB Gamepad",
      price: 660,
      rating: 4,
      reviewsCount: 55,
      imageUrl: "https://via.placeholder.com/150",
      hasBadge: true,
      badgeText: "NEW",
      colors: ["#000000", "#DB4444"],
    },
    {
      id: 8,
      name: "Quilted Satin Jacket",
      price: 660,
      rating: 4,
      reviewsCount: 55,
      imageUrl: "https://via.placeholder.com/150",
      hasBadge: false,
      colors: ["#184A45", "#DB4444"],
    },
  ];

  // Tracks active selected color variants locally per product item
  const [selectedColors, setSelectedColors] = useState<Record<number, string>>(
    {},
  );

  const handleColorSelect = (productId: number, colorCode: string) => {
    setSelectedColors((prev) => ({ ...prev, [productId]: colorCode }));
  };

  return (
    <div className="mx-auto px-4 py-8 font-sans">
      {/* Header Layout */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-5 h-10 bg-black rounded-sm block"></span>
            <span className="text-black font-semibold text-sm">
              Our Products
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-wide text-black">
            Explore Our Products
          </h2>
        </div>

        {/* Navigation Sliders */}
        <div className="flex gap-2">
          {/* View All Button */}
          <button className="bg-black hover:bg-gray-800 text-white px-10 py-3 rounded-sm font-medium transition-colors text-sm">
            View All
          </button>
        </div>
      </div>

      {/* 2-Row Grid Framework Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            selectedColor={selectedColors[product.id]}
            onColorSelect={handleColorSelect}
            onAddToCart={(id) => {
              const p = products.find((item) => item.id === id);
              if (p) {
                addToCart({
                  id: p.id,
                  name: p.name,
                  price: p.price,
                  imageUrl: p.imageUrl,
                  color: selectedColors[id],
                });
              }
            }}
            onFavoriteClick={(id) => console.log(`Favorited product ${id}`)}
            onViewClick={(id) => navigate({ to: `/product/${id}` })}
          />
        ))}
      </div>
    </div>
  );
};
