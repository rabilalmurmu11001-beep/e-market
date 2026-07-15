import React, { useState } from "react";
import type { Order } from "./profileTypes";

interface OrderHistoryProps {
  orders: Order[];
}

export const OrderHistory: React.FC<OrderHistoryProps> = ({ orders }) => {
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);

  return (
    <div>
      {!trackingOrder ? (
        <div>
          <h3 className="text-xl font-black uppercase tracking-tight mb-6 pb-2 border-b border-neutral-100">
            Order History
          </h3>

          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="border border-neutral-200 rounded-sm overflow-hidden bg-white">
                
                {/* Header block */}
                <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-200 flex flex-wrap justify-between items-center gap-4 text-xs font-bold">
                  <div className="flex gap-6">
                    <div>
                      <p className="text-neutral-400 uppercase tracking-wider mb-0.5">Order Placed</p>
                      <p className="text-black font-semibold">{order.date}</p>
                    </div>
                    <div>
                      <p className="text-neutral-400 uppercase tracking-wider mb-0.5">Total Amount</p>
                      <p className="text-black font-black">${order.total}.00</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-neutral-400 uppercase tracking-wider mb-0.5">Order ID</p>
                    <p className="text-black font-mono font-bold">{order.id}</p>
                  </div>
                </div>

                {/* Items row block */}
                <div className="p-6 divide-y divide-neutral-100">
                  {order.items.map((item) => (
                    <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-neutral-100 rounded-sm overflow-hidden flex items-center justify-center shrink-0 border border-neutral-100">
                          <img src={item.imageUrl} alt={item.name} className="max-h-full object-contain" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-black leading-tight mb-1">{item.name}</h4>
                          <p className="text-xs text-neutral-400">Qty: {item.quantity} × ${item.price}.00</p>
                        </div>
                      </div>
                      
                      <div className="text-right flex flex-col items-end gap-2">
                        {/* Order Status Badge */}
                        <span className={`inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-sm border ${
                          order.status === "Delivered"
                            ? "bg-green-50 text-green-600 border-green-100"
                            : order.status === "Shipped"
                            ? "bg-blue-50 text-blue-600 border-blue-100"
                            : "bg-amber-50 text-amber-600 border-amber-100"
                        }`}>
                          <i className="fa-solid fa-circle text-[6px]"></i> {order.status}
                        </span>
                        
                        <button
                          onClick={() => setTrackingOrder(order)}
                          className="text-xs text-black border border-black hover:bg-black hover:text-white px-3.5 py-1.5 font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
                        >
                          Track Order
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>
        </div>
      ) : (
        /* ================= SIMULATED ORDER TRACKING ================= */
        <div>
          <div className="flex justify-between items-center mb-6 pb-2 border-b border-neutral-100">
            <h3 className="text-xl font-black uppercase tracking-tight">
              Tracking Order <span className="font-mono text-neutral-500 font-bold">{trackingOrder.id}</span>
            </h3>
            <button
              onClick={() => setTrackingOrder(null)}
              className="text-xs text-neutral-400 hover:text-black font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
            >
              <i className="fa-solid fa-arrow-left-long"></i> Back to Orders
            </button>
          </div>

          {/* Progress bar visual stepper */}
          <div className="py-8 max-w-xl mx-auto">
            <div className="relative flex justify-between items-center">
              
              {/* Background Progress bar line */}
              <div className="absolute left-0 top-1/2 w-full h-1 bg-neutral-200 -translate-y-1/2 -z-10 rounded-full" />
              
              {/* Colored Active Progress Line */}
              <div className={`absolute left-0 top-1/2 h-1 bg-black -translate-y-1/2 -z-10 rounded-full transition-all duration-500 ${
                trackingOrder.status === "Delivered" ? "w-full" : trackingOrder.status === "Shipped" ? "w-2/3" : "w-1/3"
              }`} />

              {/* Step 1: Placed */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-sm shadow-md font-bold">
                  <i className="fa-solid fa-receipt"></i>
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider mt-2.5 text-black">Placed</span>
              </div>

              {/* Step 2: Processing */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-sm shadow-md font-bold">
                  <i className="fa-solid fa-box-open"></i>
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider mt-2.5 text-black">Processing</span>
              </div>

              {/* Step 3: Shipped */}
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm shadow-md font-bold ${
                  trackingOrder.status === "Shipped" || trackingOrder.status === "Delivered" ? "bg-black text-white" : "bg-neutral-200 text-neutral-400"
                }`}>
                  <i className="fa-solid fa-truck-fast"></i>
                </div>
                <span className={`text-[10px] font-black uppercase tracking-wider mt-2.5 ${
                  trackingOrder.status === "Shipped" || trackingOrder.status === "Delivered" ? "text-black" : "text-neutral-400"
                }`}>Shipped</span>
              </div>

              {/* Step 4: Delivered */}
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm shadow-md font-bold ${
                  trackingOrder.status === "Delivered" ? "bg-black text-white" : "bg-neutral-200 text-neutral-400"
                }`}>
                  <i className="fa-solid fa-house-chimney"></i>
                </div>
                <span className={`text-[10px] font-black uppercase tracking-wider mt-2.5 ${
                  trackingOrder.status === "Delivered" ? "text-black" : "text-neutral-400"
                }`}>Delivered</span>
              </div>

            </div>
          </div>

          <div className="bg-neutral-50 border border-neutral-200 rounded-sm p-6 max-w-xl mx-auto space-y-4 text-xs font-semibold text-neutral-600">
            <h4 className="font-bold text-sm text-black uppercase tracking-wider pb-2 border-b">Courier Logistics Detail</h4>
            <div className="flex justify-between">
              <span>Carrier Services</span>
              <span className="font-bold text-black">DHL Express Logistics</span>
            </div>
            <div className="flex justify-between">
              <span>Tracking Number</span>
              <span className="font-bold text-black font-mono">DHL-284910284</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Shipping Address</span>
              <span className="font-bold text-black text-right">123 Main Street, Suite 4B, New York, NY 10001</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
