import { createFileRoute } from '@tanstack/react-router'
import { useStore } from '../store/useStore'
import type { Category } from '../store/useStore'
import { useState } from 'react'

export const Route = createFileRoute('/categories')({
  component: AdminCategoriesComponent,
})

function AdminCategoriesComponent() {
  const { categories, addCategory, updateCategory, deleteCategory, products } = useStore()

  // Modal State
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  // Form Fields
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isActive, setIsActive] = useState(true)

  // Feedback State
  const [notification, setNotification] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const showNotification = (message: string) => {
    setNotification(message)
    setTimeout(() => setNotification(null), 3000)
  }

  const openAddModal = () => {
    setEditingCategory(null)
    setName('')
    setDescription('')
    setIsActive(true)
    setErrors({})
    setModalOpen(true)
  }

  const openEditModal = (category: Category) => {
    setEditingCategory(category)
    setName(category.name)
    setDescription(category.description)
    setIsActive(category.isActive)
    setErrors({})
    setModalOpen(true)
  }

  const handleDelete = (id: string, categoryName: string) => {
    const affectedProductsCount = products.filter(p => p.category === categoryName).length
    const msg = affectedProductsCount > 0
      ? `Are you sure you want to delete category: "${categoryName}"? This will reassign ${affectedProductsCount} associated product(s) to "Uncategorized".`
      : `Are you sure you want to delete category: "${categoryName}"?`

    if (confirm(msg)) {
      deleteCategory(id)
      showNotification(`Category "${categoryName}" deleted successfully`)
    }
  }

  const handleToggleActive = (id: string, currentStatus: boolean, categoryName: string) => {
    updateCategory(id, { isActive: !currentStatus })
    showNotification(`Status updated for "${categoryName}"`)
  }

  const validateForm = () => {
    const errs: Record<string, string> = {}

    if (!name.trim()) {
      errs.name = 'Category name is required'
    } else {
      // Check for uniqueness (excluding current category being edited)
      const duplicateExists = categories.some(
        c => c.name.toLowerCase() === name.trim().toLowerCase() && c.id !== editingCategory?.id
      )
      if (duplicateExists) {
        errs.name = 'Category with this name already exists'
      }
    }

    if (!description.trim()) {
      errs.description = 'Category description is required'
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    const categoryPayload = {
      name: name.trim(),
      description: description.trim(),
      isActive,
    }

    if (editingCategory) {
      updateCategory(editingCategory.id, categoryPayload)
      showNotification(`Category "${categoryPayload.name}" updated successfully`)
    } else {
      addCategory(categoryPayload)
      showNotification(`Category "${categoryPayload.name}" added successfully`)
    }

    setModalOpen(false)
  }

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
          <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Workspace</span>
          <h1 className="text-3xl font-black uppercase tracking-tight text-black mt-1">Category Options</h1>
          <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            List, audit, edit, and append classification nodes for your products catalog.
          </p>
        </div>
        <div>
          <button
            onClick={openAddModal}
            className="bg-black hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-widest px-5 py-3 rounded-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm active-scale"
          >
            <i className="fa-solid fa-plus"></i> Add Category
          </button>
        </div>
      </div>

      {/* Categories Table container */}
      <div className="bg-white border border-neutral-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-neutral-200">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-wider text-neutral-400 bg-neutral-50/50">
                <th className="py-3.5 px-4 w-48">Category Name</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-4 text-center w-36">Associated Products</th>
                <th className="py-3.5 px-4 text-center w-28">Visibility</th>
                <th className="py-3.5 px-4 text-center w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-semibold text-neutral-600">
              {categories.map((category) => {
                const productCount = products.filter((p) => p.category === category.name).length
                return (
                  <tr key={category.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="text-black font-bold block">{category.name}</span>
                    </td>
                    <td className="py-3.5 px-4 font-normal text-neutral-500">
                      {category.description}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-bold bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded-xs">
                        {productCount} item(s)
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleToggleActive(category.id, category.isActive, category.name)}
                        className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-xs transition-colors cursor-pointer inline-block ${
                          category.isActive
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                        }`}
                      >
                        {category.isActive ? 'Active' : 'Hidden'}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(category)}
                          className="text-neutral-400 hover:text-black p-1 transition-colors cursor-pointer"
                          title="Edit Category"
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(category.id, category.name)}
                          className="text-neutral-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                          title="Delete Category"
                        >
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Category Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-200 max-w-md w-full p-6 space-y-6 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-black transition-colors"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Classification Nodes</span>
              <h2 className="text-xl font-black uppercase tracking-tight text-black">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h2>
              <p className="text-xs text-neutral-400 uppercase font-bold tracking-wider">
                Define classification options for products storefront navigation.
              </p>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              
              {/* Category Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-black block">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="Electronics"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full bg-white border px-3 py-2 text-xs font-semibold focus:outline-none focus:border-black rounded-xs ${
                    errors.name ? 'border-red-500' : 'border-neutral-200'
                  }`}
                />
                {errors.name && <span className="text-[9px] font-bold text-red-500 uppercase block">{errors.name}</span>}
              </div>

              {/* Category Description */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-black block">Description</label>
                <textarea
                  required
                  placeholder="Gadgets, electronic devices, and tech peripherals."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className={`w-full bg-white border px-3 py-2 text-xs font-semibold focus:outline-none focus:border-black rounded-xs resize-none ${
                    errors.description ? 'border-red-500' : 'border-neutral-200'
                  }`}
                />
                {errors.description && <span className="text-[9px] font-bold text-red-500 uppercase block">{errors.description}</span>}
              </div>

              {/* Toggle visibility */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="isActiveCategoryToggle"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 text-black border-neutral-300 focus:ring-black cursor-pointer"
                />
                <label
                  htmlFor="isActiveCategoryToggle"
                  className="text-[10px] font-black uppercase tracking-wider text-black select-none cursor-pointer"
                >
                  Set Category as Active & Visible for filtering
                </label>
              </div>

              {/* Modal Buttons */}
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

    </div>
  )
}
