import { createFileRoute } from "@tanstack/react-router";
import { useStore } from "../store/useStore";
import type { Product, ProductColor } from "../store/useStore";
import { useState } from "react";

export const Route = createFileRoute("/products")({
  component: AdminProductsComponent,
});

function AdminProductsComponent() {
  const { products, addProduct, updateProduct, deleteProduct, categories } =
    useStore();

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form fields
  const [name, setName] = useState("");
  const [category, setCategory] = useState(
    categories[0]?.name || "Uncategorized",
  );
  const [sku, setSku] = useState("");
  const [productColors, setProductColors] = useState<ProductColor[]>([]);
  const [newColorName, setNewColorName] = useState("");
  const [newColorCode, setNewColorCode] = useState("#000000");
  const [newColorPrice, setNewColorPrice] = useState<number>(0);
  const [newColorStock, setNewColorStock] = useState<number>(0);
  const [isActive, setIsActive] = useState(true);

  // Image Upload Modal State
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [uploadColor, setUploadColor] = useState("General");

  // Notifications
  const [notification, setNotification] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setName("");
    setCategory(categories[0]?.name || "Uncategorized");
    setSku("");
    setProductColors([]);
    setNewColorName("");
    setNewColorCode("#000000");
    setNewColorPrice(0);
    setNewColorStock(0);
    setIsActive(true);
    setErrors({});
    setModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setCategory(product.category);
    setSku(product.sku);
    setProductColors(product.colors || []);
    setNewColorName("");
    setNewColorCode("#000000");
    setNewColorPrice(0);
    setNewColorStock(0);
    setIsActive(product.isActive);
    setErrors({});
    setModalOpen(true);
  };

  const handleDelete = (id: string, productName: string) => {
    if (confirm(`Are you sure you want to delete product: "${productName}"?`)) {
      deleteProduct(id);
      showNotification(`Product "${productName}" deleted successfully`);
    }
  };

  const handleToggleActive = (
    id: string,
    currentStatus: boolean,
    productName: string,
  ) => {
    updateProduct(id, { isActive: !currentStatus });
    showNotification(`Status updated for "${productName}"`);
  };

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Name is required";
    if (!sku.trim()) errs.sku = "SKU code is required";
    if (productColors.length === 0) {
      errs.colors = "At least one color variant is required";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAddColorVariant = () => {
    if (!newColorName.trim()) return;
    if (newColorPrice <= 0) {
      alert("Variant price must be greater than 0");
      return;
    }
    if (newColorStock < 0) {
      alert("Variant stock level cannot be negative");
      return;
    }
    if (
      productColors.some(
        (c) => c.name.toLowerCase() === newColorName.trim().toLowerCase(),
      )
    ) {
      alert("Color variant name already added.");
      return;
    }
    setProductColors([
      ...productColors,
      {
        name: newColorName.trim(),
        code: newColorCode,
        price: Number(newColorPrice),
        stock: Number(newColorStock),
      },
    ]);
    setNewColorName("");
    setNewColorCode("#000000");
    setNewColorPrice(0);
    setNewColorStock(0);
  };

  const handleSave = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const prices = productColors.map((c) => c.price);
    const computedPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const computedStock = productColors.reduce((sum, c) => sum + c.stock, 0);

    const productPayload = {
      name,
      category,
      price: computedPrice,
      sku,
      stock: computedStock,
      colors: productColors,
      isActive,
      ...(editingProduct
        ? {
            imageUrl: editingProduct.imageUrl,
            images: editingProduct.images || [],
          }
        : {
            images: [],
          }),
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productPayload);
      showNotification(`Product "${name}" updated successfully`);
      console.log(productPayload);
    } else {
      addProduct(productPayload);
      showNotification(`Product "${name}" added successfully`);
    }

    setModalOpen(false);
  };

  const getProductPriceDisplay = (product: Product) => {
    if (!product.colors || product.colors.length === 0) {
      return `$${product.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    const prices = product.colors.map((c) => c.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    if (minPrice === maxPrice) {
      return `$${minPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `$${minPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })} - $${maxPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
  };

  const getProductStock = (product: Product) => {
    if (!product.colors || product.colors.length === 0) return product.stock;
    return product.colors.reduce((sum, c) => sum + (c.stock || 0), 0);
  };

  const openImageUploadModal = (product: Product) => {
    setSelectedProduct(product);
    setUploadColor("General");
    setImageModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedProduct || !e.target.files) return;
    const files = Array.from(e.target.files);

    const loadedImages: string[] = [];
    let filesRead = 0;

    if (files.length === 0) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result && typeof event.target.result === "string") {
          loadedImages.push(event.target.result);
        }
        filesRead++;
        if (filesRead === files.length) {
          const currentImages = selectedProduct.images || [];
          const newImages = loadedImages.map((url) => ({
            id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            url,
            color: uploadColor,
          }));
          const updatedImages = [...currentImages, ...newImages];
          console.log({ images: updatedImages })
          updateProduct(selectedProduct.id, { images: updatedImages });
          setSelectedProduct({
            ...selectedProduct,
            images: updatedImages,
          });
          showNotification(
            `Successfully uploaded ${loadedImages.length} image(s)`,
          );
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (indexToRemove: number) => {
    if (!selectedProduct) return;
    const currentImages = selectedProduct.images || [];
    const updatedImages = currentImages.filter(
      (_, idx) => idx !== indexToRemove,
    );

    updateProduct(selectedProduct.id, { images: updatedImages });
    setSelectedProduct({
      ...selectedProduct,
      images: updatedImages,
    });
    showNotification("Image removed successfully");
  };

  const handleUpdateImageColor = (imageIdx: number, newColor: string) => {
    if (!selectedProduct) return;
    const currentImages = selectedProduct.images || [];
    const updatedImages = currentImages.map((img, idx) =>
      idx === imageIdx ? { ...img, color: newColor } : img,
    );
    updateProduct(selectedProduct.id, { images: updatedImages });
    setSelectedProduct({
      ...selectedProduct,
      images: updatedImages,
    });
    showNotification("Image color association updated");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Toast Alert */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-black text-white text-xs font-black uppercase tracking-wider py-3 px-5 border border-neutral-800 shadow-xl flex items-center gap-3 animate-bounce">
          <i className="fa-solid fa-circle-check text-emerald-400 text-sm"></i>
          <span>{notification}</span>
        </div>
      )}

      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-neutral-200">
        <div>
          <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">
            Workspace
          </span>
          <h1 className="text-3xl font-black uppercase tracking-tight text-black mt-1">
            Inventory Management
          </h1>
          <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            List, audit, edit, and append items within your active store
            catalog.
          </p>
        </div>
        <div>
          <button
            onClick={openAddModal}
            className="bg-black hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-widest px-5 py-3 rounded-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm active-scale"
          >
            <i className="fa-solid fa-plus"></i> Add Product
          </button>
        </div>
      </div>

      {/* Products Table container */}
      <div className="bg-white border border-neutral-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-neutral-200">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-wider text-neutral-400 bg-neutral-50/50">
                <th className="py-3.5 px-4 w-16">Image</th>
                <th className="py-3.5 px-4">Title / SKU</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4 text-right">Price</th>
                <th className="py-3.5 px-4 text-center">Stock</th>
                <th className="py-3.5 px-4 text-center">Visibility</th>
                <th className="py-3.5 px-4 text-center w-36">Add Images</th>
                <th className="py-3.5 px-4 text-center w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-semibold text-neutral-600">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-neutral-50/50 transition-colors"
                >
                  <td className="py-3 px-4">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                        className="w-10 h-10 object-cover bg-neutral-100 border border-neutral-200"
                      />
                    ) : product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-10 h-10 object-cover bg-neutral-100 border border-neutral-200"
                      />
                    ) : (
                      <div className="w-10 h-10 flex items-center justify-center bg-neutral-50 border border-neutral-200 text-neutral-400">
                        <i className="fa-solid fa-image text-sm"></i>
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <span className="text-black font-bold block leading-tight">
                        {product.name}
                      </span>
                      <span className="text-[10px] text-neutral-400 block mt-0.5 tracking-wider uppercase">
                        SKU: {product.sku}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] font-bold bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded-xs uppercase tracking-wider">
                      {product.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-black whitespace-nowrap">
                    {getProductPriceDisplay(product)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`font-black ${
                        getProductStock(product) <= 5
                          ? "text-red-500"
                          : getProductStock(product) <= 15
                            ? "text-yellow-600"
                            : "text-neutral-700"
                      }`}
                    >
                      {getProductStock(product)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() =>
                        handleToggleActive(
                          product.id,
                          product.isActive,
                          product.name,
                        )
                      }
                      className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-xs transition-colors cursor-pointer inline-block ${
                        product.isActive
                          ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                          : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                      }`}
                    >
                      {product.isActive ? "Active" : "Hidden"}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => openImageUploadModal(product)}
                      className="bg-neutral-100 hover:bg-neutral-200 text-black text-[9px] font-black uppercase tracking-widest px-2.5 py-1.5 border border-neutral-300 rounded-xs cursor-pointer inline-flex items-center gap-1 transition-colors active-scale"
                    >
                      <i className="fa-solid fa-images text-[9px]"></i>
                      <span>Add Images ({product.images?.length || 0})</span>
                    </button>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openEditModal(product)}
                        className="text-neutral-400 hover:text-black p-1 transition-colors cursor-pointer"
                        title="Edit Product"
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className="text-neutral-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                        title="Delete Product"
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CRUD Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-200 max-w-lg w-full p-6 space-y-6 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-black transition-colors"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">
                Inventory Details
              </span>
              <h2 className="text-xl font-black uppercase tracking-tight text-black">
                {editingProduct
                  ? "Edit Catalog Product"
                  : "Add New Catalog Product"}
              </h2>
              <p className="text-xs text-neutral-400 uppercase font-bold tracking-wider">
                Provide valid details for the storefront listings.
              </p>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Product Name */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-black block">
                    Product Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="CANON EOS R5 DSLR Camera"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full bg-white border px-3 py-2 text-xs font-semibold focus:outline-none focus:border-black rounded-xs ${
                      errors.name ? "border-red-500" : "border-neutral-200"
                    }`}
                  />
                  {errors.name && (
                    <span className="text-[9px] font-bold text-red-500 uppercase block">
                      {errors.name}
                    </span>
                  )}
                </div>

                {/* SKU */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-black block">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="CAN-EOS-R5"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className={`w-full bg-white border px-3 py-2 text-xs font-semibold focus:outline-none focus:border-black rounded-xs ${
                      errors.sku ? "border-red-500" : "border-neutral-200"
                    }`}
                  />
                  {errors.sku && (
                    <span className="text-[9px] font-bold text-red-500 uppercase block">
                      {errors.sku}
                    </span>
                  )}
                </div>

                {/* Category selection */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-black block">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white border border-neutral-200 px-3 py-2 text-xs font-semibold focus:outline-none focus:border-black rounded-xs cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                    {!categories.some((c) => c.name === category) &&
                      category && <option value={category}>{category}</option>}
                  </select>
                </div>

                {/* Color tags name and code */}
                <div className="space-y-3 sm:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-black block">
                    Color Variants (Add at least one)
                  </label>

                  {/* List of current colors */}
                  {productColors.length > 0 ? (
                    <div className="grid grid-cols-1 gap-2 p-2 border border-neutral-200 bg-neutral-50/50">
                      {productColors.map((color, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 bg-white border border-neutral-100 rounded-xs text-[10px] font-black uppercase"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-neutral-300"
                              style={{ backgroundColor: color.code }}
                            ></span>
                            <span className="text-black">
                              {color.name} ({color.code})
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-neutral-500 font-bold">
                              Price:{" "}
                              <span className="text-black font-black">
                                $
                                {color.price.toLocaleString("en-US", {
                                  minimumFractionDigits: 2,
                                })}
                              </span>
                            </span>
                            <span className="text-neutral-500 font-bold">
                              Stock:{" "}
                              <span className="text-black font-black">
                                {color.stock}
                              </span>
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setProductColors(
                                  productColors.filter((_, i) => i !== idx),
                                )
                              }
                              className="text-neutral-400 hover:text-red-500 font-bold ml-1 transition-colors cursor-pointer text-xs"
                              title="Remove Color"
                            >
                              <i className="fa-solid fa-xmark"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[9px] font-bold text-neutral-400 uppercase italic">
                      No color variants added yet.
                    </p>
                  )}

                  {/* Inputs to add new color variant */}
                  <div className="space-y-2 pt-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-wider text-neutral-500 block">
                          Variant Color Name
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="e.g. Space Gray"
                            value={newColorName}
                            onChange={(e) => setNewColorName(e.target.value)}
                            className="flex-1 bg-white border border-neutral-200 px-3 py-2 text-xs font-semibold focus:outline-none focus:border-black rounded-xs"
                          />
                          <input
                            type="color"
                            value={newColorCode}
                            onChange={(e) => setNewColorCode(e.target.value)}
                            className="w-8 h-8 p-0.5 border border-neutral-200 rounded-xs cursor-pointer bg-white"
                            title="Choose Color Code"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase tracking-wider text-neutral-500 block">
                            Variant Price ($)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            placeholder="199.00"
                            value={newColorPrice || ""}
                            onChange={(e) =>
                              setNewColorPrice(Number(e.target.value))
                            }
                            className="w-full bg-white border border-neutral-200 px-3 py-2 text-xs font-semibold focus:outline-none focus:border-black rounded-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase tracking-wider text-neutral-500 block">
                            Variant Stock
                          </label>
                          <input
                            type="number"
                            placeholder="10"
                            value={newColorStock || ""}
                            onChange={(e) =>
                              setNewColorStock(Number(e.target.value))
                            }
                            className="w-full bg-white border border-neutral-200 px-3 py-2 text-xs font-semibold focus:outline-none focus:border-black rounded-xs"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleAddColorVariant}
                        className="bg-black hover:bg-neutral-800 text-white text-[9px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xs transition-colors cursor-pointer active-scale flex items-center gap-1.5"
                      >
                        <i className="fa-solid fa-plus text-[9px]"></i> Add
                        Variant
                      </button>
                    </div>
                  </div>
                  {errors.colors && (
                    <span className="text-[9px] font-bold text-red-500 uppercase block">
                      {errors.colors}
                    </span>
                  )}
                </div>

                {/* Toggle visible status */}
                <div className="sm:col-span-2 flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="isActiveToggle"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 text-black border-neutral-300 focus:ring-black cursor-pointer"
                  />
                  <label
                    htmlFor="isActiveToggle"
                    className="text-[10px] font-black uppercase tracking-wider text-black select-none cursor-pointer"
                  >
                    Set Product as Active & Visible in Storefront Catalog
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="w-1/2 border border-neutral-200 hover:bg-neutral-50 text-neutral-600 text-xs font-black uppercase tracking-widest py-3 rounded-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-black hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-widest py-3 rounded-xs transition-colors cursor-pointer"
                >
                  Save Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload/Manage Images Modal */}
      {imageModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-200 max-w-xl w-full p-6 space-y-6 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => {
                setImageModalOpen(false);
                setSelectedProduct(null);
              }}
              className="absolute top-4 right-4 text-neutral-400 hover:text-black transition-colors"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">
                Product Gallery
              </span>
              <h2 className="text-xl font-black uppercase tracking-tight text-black">
                Manage Images
              </h2>
              <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">
                {selectedProduct.name} ({selectedProduct.sku})
              </p>
            </div>

            {/* Current Images Gallery Grouped by Color */}
            <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
              <label className="text-[10px] font-black uppercase tracking-wider text-black block">
                Current Images ({selectedProduct.images?.length || 0})
              </label>

              {["General", ...selectedProduct.colors.map((c) => c.name)].map(
                (colorGroup) => {
                  const groupImages = (selectedProduct.images || []).filter(
                    (img) => (img.color || "General") === colorGroup,
                  );

                  return (
                    <div
                      key={colorGroup}
                      className="space-y-2 border-b border-neutral-100 pb-3 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black uppercase tracking-wider text-black bg-neutral-100 px-2 py-0.5 rounded-xs border border-neutral-200">
                          {colorGroup}
                        </span>
                        <span className="text-[8px] font-black text-neutral-400 uppercase">
                          {groupImages.length} image(s)
                        </span>
                      </div>

                      {groupImages.length > 0 ? (
                        <div className="grid grid-cols-4 gap-3 mt-1">
                          {groupImages.map((imgObj) => {
                            const originalIdx = (
                              selectedProduct.images || []
                            ).findIndex((x) => x.id === imgObj.id);

                            return (
                              <div
                                key={imgObj.id}
                                className="relative group border border-neutral-200 bg-neutral-50 p-0.5 flex flex-col justify-between h-24"
                              >
                                <div className="flex-1 relative overflow-hidden bg-white">
                                  <img
                                    src={imgObj.url}
                                    alt=""
                                    className="w-full h-full object-cover"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleRemoveImage(originalIdx)
                                    }
                                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white cursor-pointer"
                                    title="Remove Image"
                                  >
                                    <i className="fa-solid fa-trash-can text-xs"></i>
                                  </button>
                                </div>
                                <select
                                  value={imgObj.color || "General"}
                                  onChange={(e) =>
                                    handleUpdateImageColor(
                                      originalIdx,
                                      e.target.value,
                                    )
                                  }
                                  className="w-full text-[8px] font-bold uppercase mt-1 border border-neutral-200 focus:outline-none focus:border-black bg-white py-0.5 px-0.5 cursor-pointer text-center"
                                  title="Change Color Variant"
                                >
                                  <option value="General">General</option>
                                  {selectedProduct.colors.map((col) => (
                                    <option key={col.name} value={col.name}>
                                      {col.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-[9px] font-bold text-neutral-400 uppercase italic pl-1">
                          No images assigned
                        </p>
                      )}
                    </div>
                  );
                },
              )}

              {!selectedProduct.images?.length && selectedProduct.imageUrl && (
                <div className="space-y-2 border-t border-neutral-100 pt-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block">
                    Legacy Default Image
                  </span>
                  <div className="relative border border-neutral-200 bg-neutral-50 h-20 w-20">
                    <img
                      src={selectedProduct.imageUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1 right-1 bg-black/75 text-white text-[7px] font-black uppercase px-1 rounded-xs">
                      Default
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* File Dropzone & Color selector */}
            <div className="space-y-3 pt-2 border-t border-neutral-100">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-black block">
                    Associate Uploaded Image with Color
                  </label>
                  <select
                    value={uploadColor}
                    onChange={(e) => setUploadColor(e.target.value)}
                    className="w-full bg-white border border-neutral-200 px-3 py-2 text-xs font-semibold focus:outline-none focus:border-black rounded-xs cursor-pointer"
                  >
                    <option value="General">General</option>
                    {selectedProduct.colors.map((color) => (
                      <option key={color.name} value={color.name}>
                        {color.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-black block">
                    Upload New Files
                  </label>
                  <label className="flex flex-col items-center justify-center border border-dashed border-neutral-200 hover:border-black rounded-xs py-2 cursor-pointer bg-neutral-50/50 transition-colors h-[38px]">
                    <span className="text-[10px] font-black uppercase tracking-wider text-black inline-flex items-center gap-1">
                      <i className="fa-solid fa-cloud-arrow-up text-neutral-400"></i>{" "}
                      Browse files
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-100 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setImageModalOpen(false);
                  setSelectedProduct(null);
                }}
                className="bg-black hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-widest px-6 py-3 rounded-xs transition-colors cursor-pointer"
              >
                Close Gallery
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
