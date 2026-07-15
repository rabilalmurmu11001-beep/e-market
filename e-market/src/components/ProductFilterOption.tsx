import type React from "react";

// Define the shape of props the filter component requires
interface ProductFilterProps {
  selectedCategories: string[];
  handleCategoryToggle: (category: string) => void;
  maxPrice: number;
  setMaxPrice: (price: number) => void;
  minRating: number | null;
  setMinRating: (rating: number | null) => void;
  stockOnly: boolean;
  setStockOnly: (val: boolean) => void;
}

export const ProductFilter: React.FC<ProductFilterProps> = ({
  selectedCategories,
  handleCategoryToggle,
  maxPrice,
  setMaxPrice,
  minRating,
  setMinRating,
  stockOnly,
  setStockOnly,
}) => {
  const categoryOptions = [
    "Phones",
    "Computers",
    "SmartWatch",
    "HeadPhones",
    "Gaming",
  ];

  return (
    <div className="space-y-6">
      {/* Category Selection Section */}
      <div>
        <h3 className="text-xs font-black uppercase tracking-wider text-neutral-400 mb-3">
          Categories
        </h3>
        <div className="space-y-2">
          {categoryOptions.map((cat) => (
            <label
              key={cat}
              className="flex items-center gap-3 text-sm font-semibold text-neutral-800 cursor-pointer select-none"
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat)}
                onChange={() => handleCategoryToggle(cat)}
                className="w-4 h-4 accent-black rounded-sm border-neutral-300"
              />
              {cat}
            </label>
          ))}
        </div>
      </div>

      <hr className="border" />

      {/* Price Range Slider Section */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xs font-black uppercase tracking-wider text-neutral-400">
            Max Price
          </h3>
          <span className="text-sm font-black">${maxPrice}</span>
        </div>
        <input
          type="range"
          min="100"
          max="2000"
          step="50"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-black bg-neutral-200 h-1 rounded-sm cursor-pointer"
        />
      </div>

      <hr className="border" />

      {/* Star Rating Section */}
      <div>
        <h3 className="text-xs font-black uppercase tracking-wider text-neutral-400 mb-3">
          Customer Rating
        </h3>
        <div className="space-y-2">
          {[5, 4, 3].map((stars) => (
            <button
              key={stars}
              onClick={() => setMinRating(minRating === stars ? null : stars)}
              className={`flex items-center gap-2 w-full text-left text-sm py-1 px-2 rounded-sm transition-colors ${
                minRating === stars
                  ? "bg-neutral-100 font-bold"
                  : "hover:bg-neutral-50 text-neutral-700"
              }`}
            >
              <div className="flex text-[#FFAD33]">
                {[...Array(5)].map((_, i) => (
                  <i
                    key={i}
                    className={`${i < stars ? "fa-solid" : "fa-regular"} fa-star text-xs`}
                  ></i>
                ))}
              </div>
              <span className="text-xs font-medium text-neutral-500">& Up</span>
            </button>
          ))}
        </div>
      </div>

      <hr className="border" />

      {/* Availability/Stock Section */}
      <div>
        <h3 className="text-xs font-black uppercase tracking-wider text-neutral-400 mb-3">
          Availability
        </h3>
        <label className="flex items-center gap-3 text-sm font-semibold text-neutral-800 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={stockOnly}
            onChange={(e) => setStockOnly(e.target.checked)}
            className="w-4 h-4 accent-black rounded-sm border-neutral-300"
          />
          Exclude Out of Stock
        </label>
      </div>
    </div>
  );
};
