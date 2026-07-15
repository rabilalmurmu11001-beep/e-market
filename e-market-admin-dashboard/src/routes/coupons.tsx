import { createFileRoute } from '@tanstack/react-router'
import { useStore } from '../store/useStore'
import type { Coupon } from '../store/useStore'
import { useState } from 'react'

export const Route = createFileRoute('/coupons')({
  component: AdminCouponsComponent,
})

function AdminCouponsComponent() {
  const { coupons, addCoupon, updateCoupon, deleteCoupon } = useStore()

  // Modal State
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)

  // Form Fields
  const [code, setCode] = useState('')
  const [discountType, setDiscountType] = useState<'Percentage' | 'Flat'>('Percentage')
  const [discountValue, setDiscountValue] = useState(0)
  const [minPurchase, setMinPurchase] = useState(0)
  const [expiryDate, setExpiryDate] = useState('')
  const [usageLimit, setUsageLimit] = useState(100)
  const [isActive, setIsActive] = useState(true)

  // Feedback State
  const [notification, setNotification] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const showNotification = (message: string) => {
    setNotification(message)
    setTimeout(() => setNotification(null), 3000)
  }

  const openAddModal = () => {
    setEditingCoupon(null)
    setCode('')
    setDiscountType('Percentage')
    setDiscountValue(10)
    setMinPurchase(0)
    
    // Set default expiry date to 30 days from now
    const defaultDate = new Date()
    defaultDate.setDate(defaultDate.getDate() + 30)
    setExpiryDate(defaultDate.toISOString().split('T')[0])
    
    setUsageLimit(100)
    setIsActive(true)
    setErrors({})
    setModalOpen(true)
  }

  const openEditModal = (coupon: Coupon) => {
    setEditingCoupon(coupon)
    setCode(coupon.code)
    setDiscountType(coupon.discountType)
    setDiscountValue(coupon.discountValue)
    setMinPurchase(coupon.minPurchase)
    setExpiryDate(coupon.expiryDate)
    setUsageLimit(coupon.usageLimit)
    setIsActive(coupon.isActive)
    setErrors({})
    setModalOpen(true)
  }

  const handleDelete = (id: string, couponCode: string) => {
    if (confirm(`Are you sure you want to delete coupon: "${couponCode}"?`)) {
      deleteCoupon(id)
      showNotification(`Coupon "${couponCode}" deleted successfully`)
    }
  }

  const handleToggleActive = (id: string, currentStatus: boolean, couponCode: string) => {
    updateCoupon(id, { isActive: !currentStatus })
    showNotification(`Status updated for "${couponCode}"`)
  }

  const validateForm = () => {
    const errs: Record<string, string> = {}
    
    if (!code.trim()) {
      errs.code = 'Coupon code is required'
    } else if (!/^[A-Z0-9_-]+$/i.test(code)) {
      errs.code = 'Alphanumeric, uppercase, dashes, and underscores only'
    }
    
    if (discountValue <= 0) {
      errs.discountValue = 'Discount value must be greater than 0'
    } else if (discountType === 'Percentage' && discountValue > 100) {
      errs.discountValue = 'Percentage discount cannot exceed 100%'
    }
    
    if (minPurchase < 0) {
      errs.minPurchase = 'Minimum purchase cannot be negative'
    }
    
    if (usageLimit <= 0) {
      errs.usageLimit = 'Usage limit must be at least 1'
    }
    
    if (!expiryDate) {
      errs.expiryDate = 'Expiry date is required'
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    const couponPayload = {
      code: code.trim().toUpperCase(),
      discountType,
      discountValue: Number(discountValue),
      minPurchase: Number(minPurchase),
      expiryDate,
      usageLimit: Number(usageLimit),
      isActive
    }

    if (editingCoupon) {
      updateCoupon(editingCoupon.id, couponPayload)
      showNotification(`Coupon "${couponPayload.code}" updated successfully`)
    } else {
      addCoupon(couponPayload)
      showNotification(`Coupon "${couponPayload.code}" added successfully`)
    }

    setModalOpen(false)
  }

  const isExpired = (dateStr: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const expiry = new Date(dateStr)
    return expiry < today
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

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-neutral-200">
        <div>
          <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Promotions</span>
          <h1 className="text-3xl font-black uppercase tracking-tight text-black mt-1">Coupons Management</h1>
          <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            Create, audit, toggle, and expire active storefront discount codes.
          </p>
        </div>
        <div>
          <button
            onClick={openAddModal}
            className="bg-black hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-widest px-5 py-3 rounded-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm active-scale"
          >
            <i className="fa-solid fa-plus"></i> Add Coupon
          </button>
        </div>
      </div>

      {/* Coupons Table Container */}
      <div className="bg-white border border-neutral-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-neutral-200">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-wider text-neutral-400 bg-neutral-50/50">
                <th className="py-3.5 px-4">Coupon Code</th>
                <th className="py-3.5 px-4">Discount</th>
                <th className="py-3.5 px-4 text-right">Min Purchase</th>
                <th className="py-3.5 px-4 text-center">Usage Limit</th>
                <th className="py-3.5 px-4 text-center">Expiry Date</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-semibold text-neutral-600">
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-neutral-400 uppercase font-black tracking-wider">
                    No Coupons Found. Create one to get started!
                  </td>
                </tr>
              ) : (
                coupons.map((coupon) => {
                  const expired = isExpired(coupon.expiryDate)
                  return (
                    <tr key={coupon.id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <i className="fa-solid fa-ticket text-neutral-400"></i>
                          <span className="text-black font-black tracking-wider uppercase bg-neutral-100 px-2 py-1 rounded-xs border border-neutral-200">
                            {coupon.code}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-bold text-black">
                        {coupon.discountType === 'Percentage' ? (
                          <span className="text-red-500 font-black">{coupon.discountValue}% OFF</span>
                        ) : (
                          <span className="text-emerald-600 font-black">${coupon.discountValue} OFF</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right font-bold text-black">
                        {coupon.minPurchase > 0 ? (
                          <span>${coupon.minPurchase.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                        ) : (
                          <span className="text-neutral-400 font-bold uppercase tracking-wider text-[10px]">No Min</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="inline-block text-left">
                          <div className="flex items-center justify-between gap-4 text-[10px] text-neutral-500 font-bold mb-1">
                            <span>{coupon.usageCount} / {coupon.usageLimit}</span>
                            <span>{Math.round((coupon.usageCount / coupon.usageLimit) * 100)}%</span>
                          </div>
                          <div className="w-24 bg-neutral-100 h-1.5 rounded-full overflow-hidden border border-neutral-200">
                            <div 
                              className={`h-full ${coupon.usageCount >= coupon.usageLimit ? 'bg-red-500' : 'bg-black'}`}
                              style={{ width: `${Math.min((coupon.usageCount / coupon.usageLimit) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs ${
                          expired 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-neutral-100 text-neutral-800'
                        }`}>
                          {coupon.expiryDate} {expired && ' (Expired)'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => handleToggleActive(coupon.id, coupon.isActive, coupon.code)}
                          disabled={expired}
                          className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-xs transition-colors inline-block ${
                            expired
                              ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                              : coupon.isActive
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 cursor-pointer'
                                : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200 cursor-pointer'
                          }`}
                        >
                          {expired ? 'Expired' : coupon.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEditModal(coupon)}
                            className="text-neutral-400 hover:text-black p-1 transition-colors cursor-pointer"
                            title="Edit Coupon"
                          >
                            <i className="fa-solid fa-pen-to-square"></i>
                          </button>
                          <button
                            onClick={() => handleDelete(coupon.id, coupon.code)}
                            className="text-neutral-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                            title="Delete Coupon"
                          >
                            <i className="fa-solid fa-trash-can"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CRUD Coupon Modal */}
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
              <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Promotion Details</span>
              <h2 className="text-xl font-black uppercase tracking-tight text-black">
                {editingCoupon ? 'Edit Store Coupon' : 'Add New Store Coupon'}
              </h2>
              <p className="text-xs text-neutral-400 uppercase font-bold tracking-wider">
                Provide valid details for the promotional campaign.
              </p>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Coupon Code */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-black block">Coupon Code</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. WELCOME20, SUMMER50"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className={`w-full bg-white border px-3 py-2 text-xs font-semibold focus:outline-none focus:border-black rounded-xs uppercase ${
                      errors.code ? 'border-red-500' : 'border-neutral-200'
                    }`}
                  />
                  {errors.code && <span className="text-[9px] font-bold text-red-500 uppercase block">{errors.code}</span>}
                </div>

                {/* Discount Type */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-black block">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as 'Percentage' | 'Flat')}
                    className="w-full bg-white border border-neutral-200 px-3 py-2 text-xs font-semibold focus:outline-none focus:border-black rounded-xs cursor-pointer"
                  >
                    <option value="Percentage">Percentage (%)</option>
                    <option value="Flat">Flat Amount ($)</option>
                  </select>
                </div>

                {/* Discount Value */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-black block">
                    Discount Value {discountType === 'Percentage' ? '(%)' : '($ USD)'}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder={discountType === 'Percentage' ? '15' : '50.00'}
                    value={discountValue || ''}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className={`w-full bg-white border px-3 py-2 text-xs font-semibold focus:outline-none focus:border-black rounded-xs ${
                      errors.discountValue ? 'border-red-500' : 'border-neutral-200'
                    }`}
                  />
                  {errors.discountValue && <span className="text-[9px] font-bold text-red-500 uppercase block">{errors.discountValue}</span>}
                </div>

                {/* Min Purchase Requirement */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-black block">Min Purchase ($ USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0"
                    value={minPurchase || ''}
                    onChange={(e) => setMinPurchase(Number(e.target.value))}
                    className={`w-full bg-white border px-3 py-2 text-xs font-semibold focus:outline-none focus:border-black rounded-xs ${
                      errors.minPurchase ? 'border-red-500' : 'border-neutral-200'
                    }`}
                  />
                  {errors.minPurchase && <span className="text-[9px] font-bold text-red-500 uppercase block">{errors.minPurchase}</span>}
                </div>

                {/* Usage Limit */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-black block">Usage Limit</label>
                  <input
                    type="number"
                    required
                    placeholder="100"
                    value={usageLimit || ''}
                    onChange={(e) => setUsageLimit(Number(e.target.value))}
                    className={`w-full bg-white border px-3 py-2 text-xs font-semibold focus:outline-none focus:border-black rounded-xs ${
                      errors.usageLimit ? 'border-red-500' : 'border-neutral-200'
                    }`}
                  />
                  {errors.usageLimit && <span className="text-[9px] font-bold text-red-500 uppercase block">{errors.usageLimit}</span>}
                </div>

                {/* Expiry Date */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-black block">Expiration Date</label>
                  <input
                    type="date"
                    required
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className={`w-full bg-white border px-3 py-2 text-xs font-semibold focus:outline-none focus:border-black rounded-xs cursor-pointer ${
                      errors.expiryDate ? 'border-red-500' : 'border-neutral-200'
                    }`}
                  />
                  {errors.expiryDate && <span className="text-[9px] font-bold text-red-500 uppercase block">{errors.expiryDate}</span>}
                </div>

                {/* Toggle Visible Status */}
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
                    Set Coupon Campaign as Active & Redeemable
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
                  Save Coupon
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  )
}
