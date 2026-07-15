import { createFileRoute, Link } from '@tanstack/react-router'
import { useStore } from '../store/useStore'
import type { OrderStatus, PaymentStatus } from '../store/useStore'
import { useMemo, useState } from 'react'

export const Route = createFileRoute('/')({
  component: AdminOverviewComponent,
})

function AdminOverviewComponent() {
  const { orders, products, settings, updateOrderStatus, updateOrderPaymentStatus } = useStore()
  
  // Track selected order ID for details modal
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [notification, setNotification] = useState<string | null>(null)

  // Dynamically resolve current state of selected order from the store
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

  // Helper to parse order item strings
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

  // Calculate dynamic stats
  const stats = useMemo(() => {
    const totalSales = orders
      .filter(o => o.orderStatus !== 'Cancelled' && o.paymentStatus === 'Paid')
      .reduce((sum, o) => sum + o.totalValue, 0)

    const activeOrders = orders.filter(o => o.orderStatus === 'Pending' || o.orderStatus === 'Shipped').length
    
    const totalInventoryStock = products.reduce((sum, p) => sum + p.stock, 0)
    const productCount = products.length

    return {
      totalSales,
      activeOrders,
      totalInventoryStock,
      productCount
    }
  }, [orders, products])

  // Get recent 5 orders
  const recentOrders = useMemo(() => {
    return orders.slice(0, 5)
  }, [orders])

  // Mock sales data for the chart (representing dollar amounts for Mon-Sun)
  const chartData = [
    { day: 'MON', value: 1420, height: '42%' },
    { day: 'TUE', value: 2190, height: '64%' },
    { day: 'WED', value: 1890, height: '56%' },
    { day: 'THU', value: 3410, height: '90%' },
    { day: 'FRI', value: 2900, height: '82%' },
    { day: 'SAT', value: 1200, height: '36%' },
    { day: 'SUN', value: 1600, height: '48%' },
  ]

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
          <h1 className="text-3xl font-black uppercase tracking-tight text-black mt-1">Dashboard Overview</h1>
          <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            Real-time operations, logistics tracking, and inventory levels.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-bold text-neutral-400">System Live</span>
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
        </div>
      </div>

      {/* KPI Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Sales */}
        <div className="bg-white border border-neutral-200 p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[10px] font-black uppercase tracking-wider">Total Sales</span>
            <i className="fa-solid fa-dollar-sign text-xs"></i>
          </div>
          <div>
            <h3 className="text-2xl font-black text-black leading-none">
              ${stats.totalSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
            <div className="flex items-center gap-1 mt-2">
              <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-xs">
                +14.2%
              </span>
              <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">vs last week</span>
            </div>
          </div>
        </div>

        {/* Active Orders */}
        <div className="bg-white border border-neutral-200 p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[10px] font-black uppercase tracking-wider">Active Orders</span>
            <i className="fa-solid fa-truck text-xs"></i>
          </div>
          <div>
            <h3 className="text-2xl font-black text-black leading-none">
              {stats.activeOrders}
            </h3>
            <div className="flex items-center gap-1 mt-2">
              <span className="bg-yellow-100 text-yellow-800 text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-xs">
                Pending
              </span>
              <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Logistics queue</span>
            </div>
          </div>
        </div>

        {/* Inventory Items */}
        <div className="bg-white border border-neutral-200 p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[10px] font-black uppercase tracking-wider">Inventory Stock</span>
            <i className="fa-solid fa-warehouse text-xs"></i>
          </div>
          <div>
            <h3 className="text-2xl font-black text-black leading-none">
              {stats.totalInventoryStock} Units
            </h3>
            <div className="flex items-center gap-1 mt-2">
              <span className="text-[9px] font-bold text-neutral-800 uppercase tracking-wider bg-neutral-100 px-1.5 py-0.5 rounded-xs">
                {stats.productCount} SKUs
              </span>
              <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Active catalog</span>
            </div>
          </div>
        </div>

        {/* Monthly Visitors */}
        <div className="bg-white border border-neutral-200 p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[10px] font-black uppercase tracking-wider">Monthly Visitors</span>
            <i className="fa-solid fa-eye text-xs"></i>
          </div>
          <div>
            <h3 className="text-2xl font-black text-black leading-none">
              42,912
            </h3>
            <div className="flex items-center gap-1 mt-2">
              <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-xs">
                +4.3%
              </span>
              <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">vs last month</span>
            </div>
          </div>
        </div>

      </div>

      {/* Sales Graph and Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sales Graph Placeholder */}
        <div className="bg-white border border-neutral-200 p-6 lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-black">Weekly Volume</h3>
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Gross revenue distribution by day</p>
            </div>
            <span className="text-xs font-black uppercase text-neutral-500">
              Total: $17,610.00
            </span>
          </div>

          {/* Premium CSS Chart Container */}
          <div className="relative h-64 pt-4">
            {/* Background Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none select-none pb-8 pt-4">
              <div className="border-b border-neutral-100 w-full text-right pr-2 h-0 flex justify-end items-center"><span className="text-[8px] font-bold text-neutral-300 uppercase tracking-wider">$3,500</span></div>
              <div className="border-b border-neutral-100 w-full text-right pr-2 h-0 flex justify-end items-center"><span className="text-[8px] font-bold text-neutral-300 uppercase tracking-wider">$2,500</span></div>
              <div className="border-b border-neutral-100 w-full text-right pr-2 h-0 flex justify-end items-center"><span className="text-[8px] font-bold text-neutral-300 uppercase tracking-wider">$1,500</span></div>
              <div className="border-b border-neutral-100 w-full text-right pr-2 h-0 flex justify-end items-center"><span className="text-[8px] font-bold text-neutral-300 uppercase tracking-wider">$500</span></div>
            </div>

            {/* Bars container */}
            <div className="absolute inset-0 flex items-end justify-between gap-3 sm:gap-6 px-2 pb-6">
              {chartData.map((data) => (
                <div key={data.day} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end z-10">
                  <span className="text-[9px] font-black text-neutral-800 select-none group-hover:text-black group-hover:scale-105 transition-all">
                    ${data.value}
                  </span>
                  <div
                    style={{ height: data.height }}
                    className="w-full bg-neutral-800 group-hover:bg-black border border-neutral-700 group-hover:border-black transition-all duration-300 rounded-t-xs"
                  ></div>
                  <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mt-1">
                    {data.day}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-white border border-neutral-200 p-6 lg:col-span-1 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="pb-3 border-b border-neutral-200">
              <h3 className="text-xs font-black uppercase tracking-wider text-black">Admin Quick Links</h3>
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">System operations panel</p>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <Link
                to="/products"
                className="flex items-center justify-between border border-neutral-200 hover:border-black p-3 text-xs font-bold uppercase tracking-wider text-neutral-700 hover:text-black transition-all active-scale"
              >
                <span>Add & Manage Products</span>
                <i className="fa-solid fa-chevron-right text-[10px]"></i>
              </Link>
              <Link
                to="/orders"
                className="flex items-center justify-between border border-neutral-200 hover:border-black p-3 text-xs font-bold uppercase tracking-wider text-neutral-700 hover:text-black transition-all active-scale"
              >
                <span>Verify Active Orders</span>
                <i className="fa-solid fa-chevron-right text-[10px]"></i>
              </Link>
              <Link
                to="/customers"
                className="flex items-center justify-between border border-neutral-200 hover:border-black p-3 text-xs font-bold uppercase tracking-wider text-neutral-700 hover:text-black transition-all active-scale"
              >
                <span>Browse Registry List</span>
                <i className="fa-solid fa-chevron-right text-[10px]"></i>
              </Link>
            </div>
          </div>

          <div className="bg-neutral-50 p-4 border border-neutral-200 space-y-2 mt-4 lg:mt-0">
            <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400 block">Current Config</span>
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-700 space-y-1">
              <div className="flex justify-between">
                <span>Tax Rate:</span>
                <span className="text-black font-black">8.5%</span>
              </div>
              <div className="flex justify-between">
                <span>Currency:</span>
                <span className="text-black font-black">USD ($)</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Recent Activity Table */}
      <div className="bg-white border border-neutral-200 p-6 space-y-6">
        <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-black">Recent Activity</h3>
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Latest 5 sales transactions</p>
          </div>
          <Link
            to="/orders"
            className="text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-black transition-colors"
          >
            View all orders
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-neutral-200">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-wider text-neutral-400">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-semibold text-neutral-600">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-black uppercase tracking-wider">
                    <button
                      onClick={() => setSelectedOrderId(order.id)}
                      className="hover:underline hover:text-neutral-600 transition-colors cursor-pointer text-left font-black"
                    >
                      {order.id}
                    </button>
                  </td>
                  <td className="py-3.5 px-4">
                    <div>
                      <span className="text-black font-bold block">{order.customerName}</span>
                      <span className="text-[10px] text-neutral-400 block">{order.customerEmail}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 max-w-xs truncate">{order.items}</td>
                  <td className="py-3.5 px-4 font-bold text-black">
                    ${order.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-xs inline-block ${
                        order.orderStatus === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.orderStatus === 'Shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : order.orderStatus === 'Cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {order.orderStatus}
                    </span>
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
