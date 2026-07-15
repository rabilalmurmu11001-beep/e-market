import { createFileRoute } from '@tanstack/react-router'
import { useStore } from '../store/useStore'
import { useState } from 'react'

export const Route = createFileRoute('/customers')({
  component: AdminCustomersComponent,
})

function AdminCustomersComponent() {
  const { customers, toggleCustomerStatus } = useStore()
  const [notification, setNotification] = useState<string | null>(null)

  const showNotification = (message: string) => {
    setNotification(message)
    setTimeout(() => setNotification(null), 3000)
  }

  const handleToggleStatus = (id: string, name: string, currentStatus: string) => {
    toggleCustomerStatus(id)
    const nextStatus = currentStatus === 'Active' ? 'Suspended' : 'Active'
    showNotification(`Customer "${name}" status toggled to "${nextStatus}"`)
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Toast Alert */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-black text-white text-xs font-black uppercase tracking-wider py-3 px-5 border border-neutral-800 shadow-xl flex items-center gap-3 animate-bounce">
          {notification.includes('Suspended') ? (
            <i className="fa-solid fa-user-slash text-red-400 text-sm"></i>
          ) : (
            <i className="fa-solid fa-user-check text-emerald-400 text-sm"></i>
          )}
          <span>{notification}</span>
        </div>
      )}

      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-neutral-200">
        <div>
          <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Workspace</span>
          <h1 className="text-3xl font-black uppercase tracking-tight text-black mt-1">Customer Registry</h1>
          <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            Review registered user accounts, track engagement, and toggle access clearances.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-bold text-neutral-400">Total users:</span>
          <span className="text-sm font-black text-black">{customers.length}</span>
        </div>
      </div>

      {/* Registry Table container */}
      <div className="bg-white border border-neutral-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-neutral-200">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-wider text-neutral-400 bg-neutral-50/50">
                <th className="py-3.5 px-4">Customer ID</th>
                <th className="py-3.5 px-4">Profile Name</th>
                <th className="py-3.5 px-4">Email Address</th>
                <th className="py-3.5 px-4 text-center">Joined Date</th>
                <th className="py-3.5 px-4 text-center">Orders Count</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-semibold text-neutral-600">
              {customers.map((cust) => (
                <tr key={cust.id} className="hover:bg-neutral-50/50 transition-colors">
                  
                  {/* ID */}
                  <td className="py-3.5 px-4 font-bold text-black uppercase tracking-wider">
                    {cust.id}
                  </td>
                  
                  {/* Name */}
                  <td className="py-3.5 px-4 text-black font-bold">
                    {cust.name}
                  </td>

                  {/* Email */}
                  <td className="py-3.5 px-4">
                    {cust.email}
                  </td>

                  {/* Joined Date */}
                  <td className="py-3.5 px-4 text-center text-neutral-500 font-bold uppercase tracking-widest text-[10px]">
                    {cust.joinedDate}
                  </td>

                  {/* Orders */}
                  <td className="py-3.5 px-4 text-center font-bold text-neutral-700">
                    {cust.ordersCount}
                  </td>

                  {/* Status label */}
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-xs inline-block ${
                        cust.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {cust.status}
                    </span>
                  </td>

                  {/* Toggle status action */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => handleToggleStatus(cust.id, cust.name, cust.status)}
                      className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xs transition-colors cursor-pointer inline-block w-full text-center ${
                        cust.status === 'Active'
                          ? 'bg-red-50 hover:bg-red-100 border border-red-200 text-red-600'
                          : 'bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-600'
                      }`}
                    >
                      {cust.status === 'Active' ? 'Suspend' : 'Activate'}
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
