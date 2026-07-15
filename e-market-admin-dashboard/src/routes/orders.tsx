import { createFileRoute } from '@tanstack/react-router'
import { useStore } from '../store/useStore'
import type { OrderStatus, PaymentStatus } from '../store/useStore'
import { useState } from 'react'

export const Route = createFileRoute('/orders')({
  component: AdminOrdersComponent,
})

function AdminOrdersComponent() {
  const { orders, products, settings, updateOrderStatus, updateOrderPaymentStatus } = useStore()
  const [notification, setNotification] = useState<string | null>(null)
  
  // Track selected order ID for details modal
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)

  // Dynamically resolve current state of selected order from the store to prevent state desync
  const selectedOrder = orders.find(o => o.id === selectedOrderId) || null

  const showNotification = (message: string) => {
    setNotification(message)
    setTimeout(() => setNotification(null), 3000)
  }

  const handleOrderStatusChange = (id: string, newStatus: OrderStatus) => {
    updateOrderStatus(id, newStatus)
    showNotification(`Order ${id} transitioned to "${newStatus}"`)
  }

  const handlePaymentStatusChange = (id: string, newStatus: PaymentStatus) => {
    updateOrderPaymentStatus(id, newStatus)
    showNotification(`Order ${id} payment set to "${newStatus}"`)
  }

  // Helper to parse comma-separated order items
  const parseOrderItems = (itemsStr: string) => {
    return itemsStr.split(',').map(item => {
      const trimmed = item.trim()
      const match = trimmed.match(/(.+)\s\((\d+)\)$/)
      if (match) {
        return {
          name: match[1].trim(),
          quantity: parseInt(match[2], 10)
        }
      }
      return {
        name: trimmed,
        quantity: 1
      }
    })
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
          <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Logistics Workspace</span>
          <h1 className="text-3xl font-black uppercase tracking-tight text-black mt-1">Orders Logistics</h1>
          <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            Monitor transaction records, clear invoices, and manage shipment schedules.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-bold text-neutral-400">Total orders:</span>
          <span className="text-sm font-black text-black">{orders.length}</span>
        </div>
      </div>

      {/* Orders Table container */}
      <div className="bg-white border border-neutral-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-neutral-200">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-wider text-neutral-400 bg-neutral-50/50">
                <th className="py-3.5 px-4">Order ID</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Customer Details</th>
                <th className="py-3.5 px-4">Ordered Items</th>
                <th className="py-3.5 px-4 text-right">Invoice Total</th>
                <th className="py-3.5 px-4 text-center">Payment Status</th>
                <th className="py-3.5 px-4 text-center">Logistics Status</th>
                <th className="py-3.5 px-4 text-center w-20">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-semibold text-neutral-600">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-neutral-50/50 transition-colors">
                  {/* Order ID */}
                  <td className="py-4 px-4 font-bold text-black uppercase tracking-wider">
                    <button
                      onClick={() => setSelectedOrderId(order.id)}
                      className="hover:underline hover:text-neutral-600 transition-colors cursor-pointer text-left font-black"
                    >
                      {order.id}
                    </button>
                  </td>
                  
                  {/* Date */}
                  <td className="py-4 px-4 text-neutral-500 font-bold uppercase tracking-widest text-[10px]">
                    {order.date}
                  </td>

                  {/* Customer Info */}
                  <td className="py-4 px-4">
                    <div>
                      <span className="text-black font-bold block">{order.customerName}</span>
                      <span className="text-[10px] text-neutral-400 block mt-0.5">{order.customerEmail}</span>
                    </div>
                  </td>

                  {/* Items */}
                  <td className="py-4 px-4 max-w-xs truncate" title={order.items}>
                    {order.items}
                  </td>

                  {/* Value */}
                  <td className="py-4 px-4 text-right font-bold text-black">
                    ${order.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>

                  {/* Payment Status Dropdown */}
                  <td className="py-4 px-4 text-center">
                    <select
                      value={order.paymentStatus}
                      onChange={(e) => handlePaymentStatusChange(order.id, e.target.value as PaymentStatus)}
                      className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 border rounded-xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-black ${
                        order.paymentStatus === 'Paid'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                          : order.paymentStatus === 'Failed'
                            ? 'bg-red-50 border-red-200 text-red-800'
                            : 'bg-neutral-50 border-neutral-200 text-neutral-800'
                      }`}
                    >
                      <option value="Paid">Paid</option>
                      <option value="Failed">Failed</option>
                      <option value="Refunded">Refunded</option>
                    </select>
                  </td>

                  {/* Order Status Dropdown */}
                  <td className="py-4 px-4 text-center">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleOrderStatusChange(order.id, e.target.value as OrderStatus)}
                      className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 border rounded-xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-black ${
                        order.orderStatus === 'Delivered'
                          ? 'bg-neutral-100 border-neutral-300 text-neutral-800'
                          : order.orderStatus === 'Shipped'
                            ? 'bg-blue-50 border-blue-200 text-blue-800'
                            : order.orderStatus === 'Cancelled'
                              ? 'bg-red-100 border-red-200 text-red-800'
                              : 'bg-yellow-50 border-yellow-200 text-yellow-800'
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>

                  {/* View Details Button */}
                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={() => setSelectedOrderId(order.id)}
                      className="text-neutral-400 hover:text-black p-1 transition-colors cursor-pointer"
                      title="View Order Details"
                    >
                      <i className="fa-solid fa-file-invoice text-sm"></i>
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-200 max-w-2xl w-full p-6 sm:p-8 space-y-6 relative animate-in fade-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setSelectedOrderId(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-black transition-colors"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>

            {/* Header info */}
            <div className="space-y-1">
              <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Receipt Summary</span>
              <h2 className="text-2xl font-black uppercase tracking-tight text-black flex items-center gap-2">
                Order {selectedOrder.id}
              </h2>
              <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">
                Placed on {selectedOrder.date}
              </p>
            </div>

            {/* Customer & Shipping information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-neutral-200">
              <div className="space-y-2 text-xs">
                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-wider block">Customer Details</span>
                <div className="font-bold text-neutral-700 space-y-0.5">
                  <p className="text-black font-black">{selectedOrder.customerName}</p>
                  <p>{selectedOrder.customerEmail}</p>
                  <p>ID: CUST-{selectedOrder.customerName.replace(' ', '-').substring(0, 5).toUpperCase()}</p>
                </div>
              </div>
              <div className="space-y-2 text-xs">
                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-wider block">Logistics / Shipping</span>
                <div className="font-bold text-neutral-700 space-y-0.5">
                  <p className="text-black font-black">Standard Delivery Address</p>
                  <p>123 Dev Lane, Apt 4B</p>
                  <p>Tech City, TC 94021</p>
                </div>
              </div>
            </div>

            {/* Invoice item breakdown */}
            <div className="space-y-3">
              <span className="text-[10px] font-black text-neutral-400 uppercase tracking-wider block">Invoice breakdown</span>
              <div className="border border-neutral-200">
                <table className="w-full text-left text-xs divide-y divide-neutral-200">
                  <thead>
                    <tr className="bg-neutral-50/50 text-[10px] font-black uppercase tracking-wider text-neutral-400">
                      <th className="py-2.5 px-4 w-12">Image</th>
                      <th className="py-2.5 px-4">Item Name</th>
                      <th className="py-2.5 px-4 text-right">Price</th>
                      <th className="py-2.5 px-4 text-center">Qty</th>
                      <th className="py-2.5 px-4 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 font-semibold text-neutral-600">
                    {parseOrderItems(selectedOrder.items).map((item, idx) => {
                      const product = products.find(p => p.name === item.name)
                      const itemPrice = product ? product.price : (selectedOrder.totalValue / item.quantity)
                      const itemImg = product ? (product.images?.[0]?.url || product.imageUrl || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=100') : 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=100'
                      
                      return (
                        <tr key={idx}>
                          <td className="py-2.5 px-4">
                            <img src={itemImg} alt={item.name} className="w-8 h-8 object-cover border border-neutral-200 bg-neutral-50" />
                          </td>
                          <td className="py-2.5 px-4 font-bold text-black uppercase tracking-tight">{item.name}</td>
                          <td className="py-2.5 px-4 text-right">
                            ${itemPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="py-2.5 px-4 text-center text-black font-black">{item.quantity}</td>
                          <td className="py-2.5 px-4 text-right text-black font-bold">
                            ${(itemPrice * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Status selectors and Total calculations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              
              {/* Dynamic Status modifier inside the detail card */}
              <div className="space-y-3">
                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-wider block">Modify Statuses</span>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-neutral-400 uppercase">Payment</label>
                    <select
                      value={selectedOrder.paymentStatus}
                      onChange={(e) => handlePaymentStatusChange(selectedOrder.id, e.target.value as PaymentStatus)}
                      className={`w-full text-[9px] font-black uppercase tracking-widest px-2.5 py-1.5 border rounded-xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-black ${
                        selectedOrder.paymentStatus === 'Paid'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                          : selectedOrder.paymentStatus === 'Failed'
                            ? 'bg-red-50 border-red-200 text-red-800'
                            : 'bg-neutral-50 border-neutral-200 text-neutral-800'
                      }`}
                    >
                      <option value="Paid">Paid</option>
                      <option value="Failed">Failed</option>
                      <option value="Refunded">Refunded</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-neutral-400 uppercase">Logistics</label>
                    <select
                      value={selectedOrder.orderStatus}
                      onChange={(e) => handleOrderStatusChange(selectedOrder.id, e.target.value as OrderStatus)}
                      className={`w-full text-[9px] font-black uppercase tracking-widest px-2.5 py-1.5 border rounded-xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-black ${
                        selectedOrder.orderStatus === 'Delivered'
                          ? 'bg-neutral-100 border-neutral-300 text-neutral-800'
                          : selectedOrder.orderStatus === 'Shipped'
                            ? 'bg-blue-50 border-blue-200 text-blue-800'
                            : selectedOrder.orderStatus === 'Cancelled'
                              ? 'bg-red-100 border-red-200 text-red-800'
                              : 'bg-yellow-50 border-yellow-200 text-yellow-800'
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Invoice calculation block */}
              <div className="bg-neutral-50 border border-neutral-200 p-4 font-bold text-xs text-neutral-500 uppercase tracking-wider space-y-1.5">
                <div className="flex justify-between">
                  <span>Shipping Cost:</span>
                  <span className="text-black">
                    {selectedOrder.totalValue > 500 ? 'FREE' : `$${settings.shippingFee.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Sales Tax ({settings.taxRate}%):</span>
                  <span className="text-black">Calculated</span>
                </div>
                <div className="border-t border-neutral-200 my-2"></div>
                <div className="flex justify-between text-sm font-black text-black">
                  <span>Charged Total:</span>
                  <span>${selectedOrder.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

            </div>

            {/* Shipment progress tracking timeline */}
            <div className="space-y-3 pt-2">
              <span className="text-[10px] font-black text-neutral-400 uppercase tracking-wider block">Logistics Tracker</span>
              <div className="relative border-l border-neutral-200 pl-4 space-y-4">
                <div className="relative">
                  <span className="absolute -left-[21px] top-1 bg-emerald-500 w-2.5 h-2.5 rounded-full border-2 border-white"></span>
                  <p className="text-[10px] font-black text-black uppercase tracking-wider">Order Placed & Confirmed</p>
                  <p className="text-[9px] text-neutral-400 uppercase font-bold tracking-widest mt-0.5">Completed • July 15, 12:04 PM</p>
                </div>
                <div className="relative">
                  <span className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white ${selectedOrder.paymentStatus === 'Paid' ? 'bg-emerald-500' : 'bg-neutral-300'}`}></span>
                  <p className="text-[10px] font-black text-black uppercase tracking-wider">Payment Verification</p>
                  <p className="text-[9px] text-neutral-400 uppercase font-bold tracking-widest mt-0.5">
                    {selectedOrder.paymentStatus === 'Paid' ? 'Completed • July 15, 12:05 PM' : 'Verification Pending / Failed'}
                  </p>
                </div>
                <div className="relative">
                  <span className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white ${
                    selectedOrder.orderStatus === 'Shipped' || selectedOrder.orderStatus === 'Delivered'
                      ? 'bg-emerald-500'
                      : selectedOrder.orderStatus === 'Cancelled'
                        ? 'bg-red-500'
                        : 'bg-neutral-300'
                  }`}></span>
                  <p className="text-[10px] font-black text-black uppercase tracking-wider">Fulfillment & Shipment</p>
                  <p className="text-[9px] text-neutral-400 uppercase font-bold tracking-widest mt-0.5">
                    {selectedOrder.orderStatus === 'Shipped' || selectedOrder.orderStatus === 'Delivered' 
                      ? 'Dispatched from logistics warehouse' 
                      : selectedOrder.orderStatus === 'Cancelled'
                        ? 'Fulfillment Voided'
                        : 'Fulfillment Processing'
                    }
                  </p>
                </div>
                <div className="relative">
                  <span className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white ${selectedOrder.orderStatus === 'Delivered' ? 'bg-emerald-500' : 'bg-neutral-300'}`}></span>
                  <p className="text-[10px] font-black text-black uppercase tracking-wider">Delivery Carrier drop-off</p>
                  <p className="text-[9px] text-neutral-400 uppercase font-bold tracking-widest mt-0.5">
                    {selectedOrder.orderStatus === 'Delivered' ? 'Delivered & Signed' : 'Transit Pending'}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-100 flex justify-end">
              <button
                onClick={() => setSelectedOrderId(null)}
                className="bg-black hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-widest px-5 py-3 rounded-xs transition-colors cursor-pointer"
              >
                Close Receipt
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
