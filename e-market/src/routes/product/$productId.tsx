import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useCart } from "../../core/CartContext";


// Types for structural clarity
interface ProductReview {
  id: number;
  user: string;
  rating: number;
  date: string;
  comment: string;
}

interface ProductDetailsData {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  sku: string;
  category: string;
  rating: number;
  reviewsCount: number;
  description: string;
  images: string[];
  colors: string[];
  sizes: string[];
  specs: Record<string, string>;
  reviews: ProductReview[];
}

export const Route = createFileRoute("/product/$productId")({
  component: RouteComponent,
});

function RouteComponent() {
  const productId = Route.useParams().productId;
  console.log("productId:", productId);
  // 1. Mock Data Asset
  const product: ProductDetailsData = {
    id: 101,
    name: "CANON EOS DSLR Camera Premium Bundle",
    price: 360,
    oldPrice: 480,
    sku: "CN-EOS-250D",
    category: "Camera",
    rating: 4,
    reviewsCount: 95,
    description:
      "Capture life's definitive moments with stunning clarity. This bundle features a responsive autofocus system, refined low-light processing limits, and 4K ultra-high-definition video recording capacities built for professionals and hobbyists alike.",
    images: [
      "https://via.placeholder.com/500x500/F5F5F5/000000?text=Main+View",
      "https://via.placeholder.com/500x500/F5F5F5/000000?text=Side+Angle",
      "https://via.placeholder.com/500x500/F5F5F5/000000?text=Lens+Detail",
      "https://via.placeholder.com/500x500/F5F5F5/000000?text=Box+Contents",
    ],
    colors: ["#000000", "#DB4444", "#E0E0E0"],
    sizes: ["Standard Body", "18-55mm Kit", "55-250mm Telephoto"],
    specs: {
      "Sensor Resolution": "24.1 Megapixels",
      "Video Capture": "4K UHD at 24p / 1080p at 60p",
      "ISO Sensitivity Range": "100 - 25600 (Expandable to 51200)",
      "Screen Type": "3.0-inch Vari-angle Touchscreen LCD",
      Connectivity: "Wi-Fi, Bluetooth, Hi-Speed USB",
    },
    reviews: [
      {
        id: 1,
        user: "Alex M.",
        rating: 5,
        date: "June 14, 2026",
        comment:
          "Absolutely incredible camera body. The auto-focus acquisition speeds are remarkably consistent even under mixed studio lighting setups.",
      },
      {
        id: 2,
        user: "Sarah K.",
        rating: 4,
        date: "May 28, 2026",
        comment:
          "Stellar dynamic range out of the box. Battery drainage speeds up noticeably when continuously capturing 4K files, but otherwise highly dependable.",
      },
    ],
  };

  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  // 2. Interactive Selection States
  const [activeImage, setActiveImage] = useState<string>(product.images[0]);
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "reviews">(
    "desc",
  );

  // 3. Counter Controls
  const adjustQuantity = (amount: number) => {
    setQuantity((prev) => Math.max(1, prev + amount));
  };

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.images[0] || "https://via.placeholder.com/150",
      color: selectedColor,
      size: selectedSize
    }, quantity);
    
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 2000);
  };


  return (
    <div className="mx-auto px-4 py-8 font-sans text-black bg-white">
      {/* Breadcrumb Path */}
      <nav className="text-xs text-neutral-400 font-medium mb-6">
        Home / {product.category} /{" "}
        <span className="text-black font-semibold">{product.name}</span>
      </nav>

      {/* Main Structural View Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
        {/* ================= LEFT GALLERY COLUMN (5Cols Layout) ================= */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
          {/* Vertical Thumbnails Stems */}
          <div className="flex md:flex-col gap-3 md:w-24 shrink-0">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`bg-[#F5F5F5] border rounded-sm p-2 flex items-center justify-center h-20 w-20 md:w-full transition-all overflow-hidden ${
                  activeImage === img
                    ? "border-black ring-1 ring-black"
                    : "border-neutral-200 hover:border-neutral-400"
                }`}
              >
                <img
                  src={img}
                  alt={`Thumb ${idx}`}
                  className="max-h-full object-contain"
                />
              </button>
            ))}
          </div>

          {/* Expanded Core Preview Wrapper */}
          <div className="flex-1 bg-[#F5F5F5] border border-neutral-100 rounded-sm p-8 h-[400px] md:h-[500px] flex items-center justify-center relative overflow-hidden">
            <img
              src={activeImage}
              alt={product.name}
              className="max-h-full object-contain select-none"
            />

            {/* Quick Wish Floating Button */}
            <button className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white text-black flex items-center justify-center border border-neutral-200 shadow-xs hover:bg-black hover:text-white transition-colors">
              <i className="fa-regular fa-heart"></i>
            </button>
          </div>
        </div>

        {/* ================= RIGHT VARIANT BUY WINDOW (5Cols Layout) ================= */}
        <div className="lg:col-span-5 flex flex-col justify-start">
          {/* Product Header Summary */}
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-2 leading-tight">
            {product.name}
          </h1>

          {/* Social Feedback Rating Shelf */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex text-[#FFAD33] text-sm">
              {[...Array(5)].map((_, i) => (
                <i
                  key={i}
                  className={`${i < product.rating ? "fa-solid" : "fa-regular"} fa-star`}
                ></i>
              ))}
            </div>
            <span className="text-xs text-neutral-400 font-semibold border-r pr-3 border-neutral-300">
              ({product.reviewsCount} Customer Reviews)
            </span>
            <span className="text-xs text-[#00FF66] font-bold uppercase tracking-wider">
              <i className="fa-solid fa-circle text-[8px] mr-1 inline-block align-middle"></i>{" "}
              In Stock
            </span>
          </div>

          {/* Pricing Tags */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-black">${product.price}.00</span>
            {product.oldPrice && (
              <span className="text-neutral-400 line-through text-lg font-medium">
                ${product.oldPrice}.00
              </span>
            )}
          </div>

          <hr className="border-neutral-200 mb-6" />

          {/* Short Lead Copy */}
          <p className="text-sm leading-6 text-neutral-600 mb-6 font-medium">
            {product.description}
          </p>

          {/* Variant Variant 1: Color Picker */}
          <div className="mb-5">
            <h3 className="text-xs font-black uppercase tracking-wider text-neutral-400 mb-2">
              Select Color
            </h3>
            <div className="flex items-center gap-2.5">
              {product.colors.map((color) => {
                const isColorActive = selectedColor === color;
                return (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className="w-6 h-6 rounded-full flex items-center justify-center border transition-all hover:scale-105"
                    style={{
                      backgroundColor: color,
                      borderColor: isColorActive ? "#000000" : "transparent",
                    }}
                  >
                    {isColorActive && (
                      <span className="w-2 h-2 rounded-full bg-white block mix-blend-difference" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Variant Variant 2: Size Configuration Badges */}
          <div className="mb-6">
            <h3 className="text-xs font-black uppercase tracking-wider text-neutral-400 mb-2">
              Configuration Options
            </h3>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 border text-xs font-bold rounded-sm transition-all ${
                    selectedSize === size
                      ? "bg-black text-white border-black"
                      : "bg-white text-black border-neutral-300 hover:border-black"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Controls & Checkout Actions Deck */}
          <div className="flex flex-col sm:flex-row gap-4 items-stretch pt-4 border-t border-neutral-100">
            {/* Split Counter Box */}
            <div className="flex items-center border border-neutral-300 rounded-sm overflow-hidden h-12">
              <button
                onClick={() => adjustQuantity(-1)}
                className="w-12 h-full bg-white hover:bg-neutral-50 flex items-center justify-center text-sm border-r border-neutral-300 transition-colors"
              >
                <i className="fa-solid fa-minus"></i>
              </button>
              <span className="w-14 text-center text-sm font-black select-none">
                {quantity}
              </span>
              <button
                onClick={() => adjustQuantity(1)}
                className="w-12 h-full bg-white hover:bg-neutral-50 flex items-center justify-center text-sm border-l border-neutral-300 transition-colors"
              >
                <i className="fa-solid fa-plus"></i>
              </button>
            </div>

            {/* Direct Purchase Trigger Button */}
            <button
              onClick={handleAddToCart}
              className={`flex-1 font-bold text-sm h-12 px-8 uppercase tracking-wider rounded-sm transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                added
                  ? "bg-green-600 text-white"
                  : "bg-black hover:bg-neutral-800 text-white"
              }`}
            >
              <i className={added ? "fa-solid fa-check" : "fa-solid fa-bag-shopping"}></i>
              {added ? "Added to Cart" : "Add to Cart"}
            </button>

          </div>

          {/* SKU Information Stamp */}
          <div className="mt-6 pt-4 border-t border-neutral-100 space-y-1.5 text-xs font-semibold text-neutral-400">
            <p>
              SKU: <span className="text-black font-medium">{product.sku}</span>
            </p>
            <p>
              Category:{" "}
              <span className="text-black font-medium">{product.category}</span>
            </p>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM CONTENT EXTRA TAB EXPANSIONS ================= */}
      <div className="border border-neutral-200 rounded-sm">
        {/* Navigation Tab Headers Row */}
        <div className="flex border-b border-neutral-200 bg-neutral-50/50">
          <button
            onClick={() => setActiveTab("desc")}
            className={`px-6 py-4 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${activeTab === "desc" ? "border-black text-black bg-white" : "border-transparent text-neutral-400 hover:text-black"}`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab("specs")}
            className={`px-6 py-4 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${activeTab === "specs" ? "border-black text-black bg-white" : "border-transparent text-neutral-400 hover:text-black"}`}
          >
            Specifications
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-6 py-4 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${activeTab === "reviews" ? "border-black text-black bg-white" : "border-transparent text-neutral-400 hover:text-black"}`}
          >
            Reviews ({product.reviews.length})
          </button>
        </div>

        {/* Dynamic Inner Tab Output Panel */}
        <div className="p-6 md:p-8 text-sm leading-7 text-neutral-600">
          {activeTab === "desc" && (
            <div className="max-w-3xl space-y-4">
              <h4 className="font-bold text-black text-base uppercase tracking-tight">
                Product Overview
              </h4>
              <p>{product.description}</p>
              <p>
                Designed to fit perfectly within the framework of modern
                creative requirements, each unit brings standard-setting
                resilience alongside dynamic structural configuration
                flexibilities.
              </p>
            </div>
          )}

          {activeTab === "specs" && (
            <div className="max-w-2xl border border-neutral-200 rounded-sm overflow-hidden">
              {Object.entries(product.specs).map(([key, value], index) => (
                <div
                  key={key}
                  className={`grid grid-cols-3 p-3.5 text-xs font-medium border-b last:border-0 ${index % 2 === 0 ? "bg-neutral-50/50" : "bg-white"}`}
                >
                  <span className="text-neutral-400 font-bold uppercase tracking-wider">
                    {key}
                  </span>
                  <span className="col-span-2 text-black pl-4 font-semibold">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="max-w-3xl space-y-6">
              {product.reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="border-b border-neutral-100 pb-6 last:border-0 last:pb-0"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h5 className="font-bold text-black text-sm">
                        {rev.user}
                      </h5>
                      <span className="text-[10px] text-neutral-400 font-semibold">
                        {rev.date}
                      </span>
                    </div>
                    <div className="flex text-[#FFAD33] text-xs">
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className={`${i < rev.rating ? "fa-solid" : "fa-regular"} fa-star`}
                        ></i>
                      ))}
                    </div>
                  </div>
                  <p className="text-neutral-600 text-xs leading-5 font-medium">
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
