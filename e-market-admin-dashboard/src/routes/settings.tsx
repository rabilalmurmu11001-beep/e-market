import { createFileRoute } from '@tanstack/react-router'
import { useStore } from '../store/useStore'
import type { StoreSettings } from '../store/useStore'
import { useState } from 'react'

export const Route = createFileRoute('/settings')({
  component: AdminSettingsComponent,
})

function AdminSettingsComponent() {
  const { settings, updateSettings } = useStore()
  
  // Fields state
  const [shopName, setShopName] = useState(settings.shopName)
  const [currency, setCurrency] = useState(settings.currency)
  const [taxRate, setTaxRate] = useState(settings.taxRate)
  const [shippingFee, setShippingFee] = useState(settings.shippingFee)
  const [supportEmail, setSupportEmail] = useState(settings.supportEmail)

  // Notifications
  const [notification, setNotification] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const showNotification = (message: string) => {
    setNotification(message)
    setTimeout(() => setNotification(null), 3000)
  }

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!shopName.trim()) errs.shopName = 'Shop name is required'
    if (taxRate < 0 || taxRate > 100) errs.taxRate = 'Tax rate must be between 0% and 100%'
    if (shippingFee < 0) errs.shippingFee = 'Shipping fee cannot be negative'
    if (!supportEmail.trim() || !supportEmail.includes('@')) errs.supportEmail = 'Provide a valid support email'

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const payload: StoreSettings = {
      shopName,
      currency,
      taxRate: Number(taxRate),
      shippingFee: Number(shippingFee),
      supportEmail
    }

    updateSettings(payload)
    showNotification('Store configurations saved successfully')
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
      <div className="pb-4 border-b border-neutral-200">
        <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Storefront</span>
        <h1 className="text-3xl font-black uppercase tracking-tight text-black mt-1">Shop Settings</h1>
        <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
          Configure default retail rates, currencies, invoice details, and support emails.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Settings Form */}
        <form onSubmit={handleSave} className="bg-white border border-neutral-200 p-6 sm:p-8 space-y-6 lg:col-span-2">
          
          <div className="space-y-4">
            
            {/* Shop Name */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-wider text-black block">Shop Name</label>
              <input
                type="text"
                required
                placeholder="e-Market Co."
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className={`w-full bg-white border px-3 py-2 text-xs font-semibold focus:outline-none focus:border-black rounded-xs ${
                  errors.shopName ? 'border-red-500' : 'border-neutral-200'
                }`}
              />
              {errors.shopName && <span className="text-[9px] font-bold text-red-500 uppercase block">{errors.shopName}</span>}
            </div>

            {/* Currency selector */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-wider text-black block">Base Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-white border border-neutral-200 px-3 py-2 text-xs font-semibold focus:outline-none focus:border-black rounded-xs cursor-pointer"
              >
                <option value="USD">USD ($) - US Dollar</option>
                <option value="EUR">EUR (€) - Euro</option>
                <option value="GBP">GBP (£) - British Pound</option>
                <option value="JPY">JPY (¥) - Japanese Yen</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Tax Rate */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-black block">Tax Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder="8.5"
                  value={taxRate || ''}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  className={`w-full bg-white border px-3 py-2 text-xs font-semibold focus:outline-none focus:border-black rounded-xs ${
                    errors.taxRate ? 'border-red-500' : 'border-neutral-200'
                  }`}
                />
                {errors.taxRate && <span className="text-[9px] font-bold text-red-500 uppercase block">{errors.taxRate}</span>}
              </div>

              {/* Shipping Fee */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-black block">Default Shipping Fee ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="15.00"
                  value={shippingFee || ''}
                  onChange={(e) => setShippingFee(Number(e.target.value))}
                  className={`w-full bg-white border px-3 py-2 text-xs font-semibold focus:outline-none focus:border-black rounded-xs ${
                    errors.shippingFee ? 'border-red-500' : 'border-neutral-200'
                  }`}
                />
                {errors.shippingFee && <span className="text-[9px] font-bold text-red-500 uppercase block">{errors.shippingFee}</span>}
              </div>

            </div>

            {/* Support Email */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-wider text-black block">Customer Support Email</label>
              <input
                type="email"
                required
                placeholder="support@e-market.com"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className={`w-full bg-white border px-3 py-2 text-xs font-semibold focus:outline-none focus:border-black rounded-xs ${
                  errors.supportEmail ? 'border-red-500' : 'border-neutral-200'
                }`}
              />
              {errors.supportEmail && <span className="text-[9px] font-bold text-red-500 uppercase block">{errors.supportEmail}</span>}
            </div>

          </div>

          <div className="pt-4 border-t border-neutral-100 flex justify-end">
            <button
              type="submit"
              className="bg-black hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-widest px-6 py-3.5 rounded-xs transition-colors cursor-pointer active-scale"
            >
              Save Configurations
            </button>
          </div>

        </form>

        {/* Info Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-neutral-200 p-6 space-y-4 text-xs">
            <h3 className="text-xs font-black uppercase tracking-wider text-black pb-2 border-b border-neutral-200">
              Taxation & Logistics Info
            </h3>
            <p className="text-neutral-500 leading-relaxed">
              These values govern global calculation fields in the storefront checkout. Modifying these settings instantly influences customer totals.
            </p>
            <div className="bg-neutral-50 p-4 border border-neutral-200 space-y-2 uppercase font-bold text-[10px] text-neutral-500">
              <div className="flex justify-between">
                <span>Free shipping cutoff:</span>
                <span className="text-black font-black">$500.00</span>
              </div>
              <div className="flex justify-between">
                <span>Payment gateway:</span>
                <span className="text-black font-black">Decoupled API</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}
