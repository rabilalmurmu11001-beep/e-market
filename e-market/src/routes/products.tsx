import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { ProductCard, type Product } from "../components/ProductCard";
// 1. Import the newly extracted filter element
import { ProductFilter } from "../components/ProductFilterOption";
import { useCart } from "../core/CartContext";


export const Route = createFileRoute("/products")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const allProducts: Product[] = [
    {
      id: 1,
      name: "iPhone 14 Pro",
      price: 999,
      rating: 5,
      reviewsCount: 65,
      imageUrl: "https://via.placeholder.com/150",
      category: "Phones",
      inStock: true,
    },
    {
      id: 2,
      name: "MacBook Pro M2",
      price: 1999,
      rating: 5,
      reviewsCount: 120,
      imageUrl: "https://via.placeholder.com/150",
      category: "Computers",
      inStock: true,
    },
    {
      id: 3,
      name: "Apple Watch Series 8",
      price: 399,
      rating: 4,
      reviewsCount: 45,
      imageUrl: "https://via.placeholder.com/150",
      category: "SmartWatch",
      inStock: true,
      hasBadge: true,
      badgeText: "Sale",
    },
    {
      id: 8,
      name: "Google Pixel 7 Pro",
      price: 899,
      rating: 4,
      reviewsCount: 52,
      imageUrl: "https://via.placeholder.com/150",
      category: "Phones",
      inStock: true,
    },
  ];

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [stockOnly, setStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);
  const [selectedColors, setSelectedColors] = useState<Record<number, string>>(
    {},
  );

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setMaxPrice(2000);
    setMinRating(null);
    setStockOnly(false);
  };

  const filteredProducts = useMemo(() => {
    let result = [...allProducts];
    if (selectedCategories.length > 0)
      result = result.filter((p) =>
        selectedCategories.includes(p?.category || ""),
      );
    result = result.filter((p) => p.price <= maxPrice);
    if (minRating) result = result.filter((p) => p.rating >= minRating);
    if (stockOnly) result = result.filter((p) => p.inStock);

    if (sortBy === "price-low") result.sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") result.sort((a, b) => b.price - a.price);
    if (sortBy === "rating") result.sort((a, b) => b.rating - a.rating);
    return result;
  }, [selectedCategories, maxPrice, minRating, stockOnly, sortBy]);
  return (
    <div className="mx-auto px-4 py-8 font-sans text-black bg-white">
      {/* Title block */}
      <div className="mb-6">
        <p className="text-xs text-neutral-400 font-medium mb-1">
          Home / Browse
        </p>
        <h1 className="text-3xl font-black uppercase tracking-tight">
          Browse Products
        </h1>
      </div>

      {/* Controls panel layout */}
      <div className="flex items-center justify-between border-b pb-4 mb-6">
        <p className="text-sm font-medium text-neutral-600">
          Showing{" "}
          <span className="font-bold text-black">
            {filteredProducts.length}
          </span>{" "}
          Products
        </p>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 border px-4 py-2 text-sm font-bold rounded-sm"
          >
            <i className="fa-solid fa-sliders"></i> Filters
          </button>

          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border bg-white text-sm font-bold py-2 px-3 rounded-sm focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Tags */}
      {(selectedCategories.length > 0 ||
        minRating !== null ||
        stockOnly ||
        maxPrice < 2000) && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-xs font-bold uppercase text-neutral-400">
            Active:
          </span>
          {selectedCategories.map((cat) => (
            <span
              key={cat}
              className="inline-flex items-center gap-1.5 bg-neutral-100 px-3 py-1 text-xs font-bold rounded-sm"
            >
              {cat}{" "}
              <i
                className="fa-solid fa-xmark text-neutral-400 cursor-pointer hover:text-black"
                onClick={() => handleCategoryToggle(cat)}
              ></i>
            </span>
          ))}
          {minRating && (
            <span className="inline-flex items-center gap-1.5 bg-neutral-100 px-3 py-1 text-xs font-bold rounded-sm">
              {minRating}+ Stars{" "}
              <i
                className="fa-solid fa-xmark text-neutral-400 cursor-pointer hover:text-black"
                onClick={() => setMinRating(null)}
              ></i>
            </span>
          )}
          <button
            onClick={clearAllFilters}
            className="text-xs font-bold text-red-600 underline ml-2 hover:text-red-800"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Page Framework splits */}
      <div className="flex gap-8">
        {/* DESKTOP SIDEBAR SCREEN RENDER */}
        <aside className="w-64 shrink-0 hidden lg:block border p-5 bg-neutral-50/50 rounded-sm">
          <ProductFilter
            selectedCategories={selectedCategories}
            handleCategoryToggle={handleCategoryToggle}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            minRating={minRating}
            setMinRating={setMinRating}
            stockOnly={stockOnly}
            setStockOnly={setStockOnly}
          />
        </aside>

        {/* ITEMS POPULATION ROW BOX */}
        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-neutral-200 rounded-sm">
              <h3 className="text-lg font-bold">No Products Found</h3>
              <button
                onClick={clearAllFilters}
                className="mt-4 bg-black text-white px-6 py-2 text-sm font-bold rounded-sm"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  selectedColor={selectedColors[product.id]}
                  onColorSelect={(id: any, color: any) =>
                    setSelectedColors((prev) => ({ ...prev, [id]: color }))
                  }
                  onAddToCart={(id) => {
                    const p = allProducts.find((item) => item.id === id);
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
                  onViewClick={(id) => {
                    navigate({ to: `/product/${id}` });
                  }}
                />
              ))}

            </div>
          )}
        </div>
      </div>

      {/* SLIDEOUT HANDLER DRAWER OVERLAY (MOBILE) */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          />
          <aside className="relative w-80 max-w-sm ml-auto bg-white h-full p-6 shadow-2xl overflow-y-auto flex flex-col">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h2 className="font-black uppercase tracking-wider text-lg">
                Filters
              </h2>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="text-neutral-400 hover:text-black text-xl"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Reused Mobile Variant */}
            <ProductFilter
              selectedCategories={selectedCategories}
              handleCategoryToggle={handleCategoryToggle}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              minRating={minRating}
              setMinRating={setMinRating}
              stockOnly={stockOnly}
              setStockOnly={setStockOnly}
            />
          </aside>
        </div>
      )}
    </div>
  );
}
