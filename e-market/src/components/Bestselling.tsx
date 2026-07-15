import React, { useState } from "react";
import { ProductCard } from "./ProductCard";
import { useNavigate } from "@tanstack/react-router";
import { useCart } from "../core/CartContext";

export const BestSelling: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedColors, setSelectedColors] = useState<Record<number, string>>(
    {},
  );

  const handleColorSelect = (productId: number, color: string) => {
    setSelectedColors((prev) => ({ ...prev, [productId]: color }));
  };

  const bestSellingProducts = [
    {
      id: 1,
      name: "iPhone 14 Pro",
      price: 999,
      oldPrice: 1099,
      rating: 5,
      reviewsCount: 65,
      imageUrl: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      name: "MacBook Pro",
      price: 1999,
      oldPrice: 2199,
      rating: 5,
      reviewsCount: 65,
      imageUrl: "https://via.placeholder.com/150",
    },
    {
      id: 3,
      name: "Apple Watch Series 8",
      price: 399,
      rating: 5,
      reviewsCount: 65,
      imageUrl: "https://via.placeholder.com/150",
    },
    {
      id: 4,
      name: "AirPods Pro",
      price: 249,
      oldPrice: 299,
      rating: 5,
      reviewsCount: 65,
      imageUrl: "https://via.placeholder.com/150",
    },
  ];

  return (
    <div className="mx-auto px-4 py-8 font-sans">
      {/* Header Section */}
      <div className="flex justify-between items-end mb-8">
        <div>
          {/* Accent Tag Line */}
          <div className="flex items-center gap-3 mb-2">
            <span className="w-5 h-10 bg-black rounded-sm block"></span>
            <span className="text-black font-semibold text-sm">This Month</span>
          </div>
          <h2 className="text-3xl font-bold tracking-wide text-black">
            Best Selling Products
          </h2>
        </div>

        {/* View All Button */}
        <button className="bg-black hover:bg-gray-800 text-white px-10 py-3 rounded-sm font-medium transition-colors text-sm">
          View All
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {bestSellingProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            selectedColor={selectedColors[product.id]}
            onColorSelect={handleColorSelect}
            onAddToCart={(id) => {
              const p = bestSellingProducts.find((item) => item.id === id);
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
