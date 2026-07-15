import type React from "react";

// 1. Define strict TypeScript types for the props
export interface Product {
  id: number;
  name: string;
  price: number;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  hasBadge?: boolean;
  badgeText?: string;
  colors?: string[];
  category?: string;
  inStock?: boolean;
}

interface ProductCardProps {
  product: Product;
  selectedColor?: string;
  onColorSelect?: (productId: number, color: string) => void;
  onAddToCart?: (productId: number) => void;
  onFavoriteClick?: (productId: number) => void;
  onViewClick?: (productId: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  selectedColor,
  onColorSelect,
  onAddToCart,
  onFavoriteClick,
  onViewClick,
}) => {
  return (
    <div className="group border p-2 rounded-sm flex flex-col h-full bg-white">
      {/* Box Wrapper Container */}
      <div className="relative bg-[#F5F5F5] rounded-sm h-64 flex items-center justify-center overflow-hidden mb-3">
        {/* Optional Badge */}
        {product.hasBadge && product.badgeText && (
          <span className="absolute top-3 left-3 bg-[#00FF66] text-black font-semibold text-xs px-3 py-1 rounded-sm z-10">
            {product.badgeText}
          </span>
        )}

        {/* Product Asset Thumbnail */}
        <img
          src={product.imageUrl}
          alt={product.name}
          className="max-h-40 object-contain group-hover:scale-105 transition-transform duration-300"
        />

        {/* Floating Icons Panel */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteClick?.(product.id);
            }}
            className="w-8 h-8 rounded-full cursor-pointer bg-white hover:bg-black hover:text-white flex items-center justify-center text-black text-sm transition-colors shadow-xs"
          >
            <i className="fa-regular fa-heart"></i>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewClick?.(product.id);
            }}
            className="w-8 h-8 rounded-full cursor-pointer bg-white hover:bg-black hover:text-white flex items-center justify-center text-black text-sm transition-colors shadow-xs"
          >
            <i className="fa-regular fa-eye"></i>
          </button>
        </div>

        {/* Interactive Hover Add-to-Cart Shelf */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart?.(product.id);
          }}
          className="absolute bottom-0 left-0 w-full cursor-pointer bg-black hover:bg-neutral-800 text-white text-sm py-2.5 font-medium transition-all duration-300 transform translate-y-full group-hover:translate-y-0"
        >
          Add To Cart
        </button>
      </div>

      {/* Product Meta Data Description */}
      <h3 className="text-base font-bold text-black mb-1 truncate">
        {product.name}
      </h3>

      {/* Price & Review Metrics */}
      <div className="flex items-center gap-3 mb-2">
        <span className="text-black font-bold">${product.price}</span>

        {/* Stars Alignment Block */}
        <div className="flex items-center gap-1.5 ml-1">
          <div className="flex text-[#FFAD33] text-xs">
            {[...Array(5)].map((_, idx) => (
              <i
                key={idx}
                className={`${idx < product.rating ? "fa-solid" : "fa-regular"} fa-star`}
              ></i>
            ))}
          </div>
          <span className="text-gray-400 text-xs font-semibold">
            ({product.reviewsCount})
          </span>
        </div>
      </div>

      {/* Color Swatches Node Container */}
      {product.colors && product.colors.length > 0 && (
        <div className="flex items-center gap-2 mt-auto pt-1">
          {product.colors.map((color, colorIdx) => {
            const defaultActive = colorIdx === 0;
            const isColorActive = selectedColor
              ? selectedColor === color
              : defaultActive;

            return (
              <button
                key={color}
                onClick={(e) => {
                  e.stopPropagation(); // Prevents layout card clicks
                  onColorSelect?.(product.id, color);
                }}
                className="w-4 h-4 rounded-full flex items-center justify-center border transition-transform hover:scale-110"
                style={{
                  backgroundColor: color,
                  borderColor: isColorActive ? "#000000" : "transparent",
                }}
              >
                {isColorActive && (
                  <span
                    className="w-2 h-2 rounded-full bg-white block"
                    style={{
                      backgroundColor:
                        color === "#FFFFFF" ? "#000000" : "transparent",
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
