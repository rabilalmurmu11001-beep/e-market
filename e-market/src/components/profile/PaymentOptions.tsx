import React, { useState } from "react";
import type { PaymentMethod } from "./profileTypes";

interface PaymentOptionsProps {
  payments: PaymentMethod[];
  onAdd: (newPayment: Omit<PaymentMethod, "id">) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}

export const PaymentOptions: React.FC<PaymentOptionsProps> = ({
  payments,
  onAdd,
  onDelete,
  onSetDefault,
}) => {
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState("");
  const [newPayment, setNewPayment] = useState<Omit<PaymentMethod, "id">>({
    cardholderName: "",
    cardNumber: "",
    cardType: "visa",
    expiryDate: "",
    isDefault: false,
  });

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(newPayment);
    setPaymentSuccess("Saved payment method added successfully.");
    setShowPaymentForm(false);
    setNewPayment({
      cardholderName: "",
      cardNumber: "",
      cardType: "visa",
      expiryDate: "",
      isDefault: false,
    });
    setTimeout(() => setPaymentSuccess(""), 4000);
  };

  const handleDelete = (id: string) => {
    onDelete(id);
    setPaymentSuccess("Payment method removed.");
    setTimeout(() => setPaymentSuccess(""), 4000);
  };

  const handleDefault = (id: string) => {
    onSetDefault(id);
    setPaymentSuccess("Default payment method updated.");
    setTimeout(() => setPaymentSuccess(""), 4000);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 pb-2 border-b border-neutral-100">
        <h3 className="text-xl font-black uppercase tracking-tight">
          Payment Options
        </h3>
        <button
          onClick={() => setShowPaymentForm(!showPaymentForm)}
          className="bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-sm transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <i className="fa-solid fa-plus"></i> Add Card
        </button>
      </div>

      {paymentSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 mb-6 rounded-sm text-xs font-semibold flex items-center gap-2">
          <i className="fa-solid fa-circle-check"></i> {paymentSuccess}
        </div>
      )}

      {showPaymentForm && (
        <form onSubmit={handleAddPayment} className="border border-neutral-200 p-6 rounded-sm mb-8 space-y-4 bg-neutral-50/50">
          <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-400 mb-2">New Card Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1">Cardholder Name</label>
              <input
                type="text"
                value={newPayment.cardholderName}
                onChange={(e) => setNewPayment({ ...newPayment, cardholderName: e.target.value })}
                className="w-full border border-neutral-300 px-3 py-2 text-sm rounded-sm bg-white focus:outline-none focus:border-black font-medium"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1">Card Type</label>
              <select
                value={newPayment.cardType}
                onChange={(e) => setNewPayment({ ...newPayment, cardType: e.target.value as any })}
                className="w-full border border-neutral-300 px-3 py-2 text-sm rounded-sm bg-white focus:outline-none focus:border-black font-medium cursor-pointer"
              >
                <option value="visa">Visa</option>
                <option value="mastercard">Mastercard</option>
                <option value="amex">American Express</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1">Card Number</label>
              <input
                type="text"
                placeholder="4111 2222 3333 4444"
                value={newPayment.cardNumber}
                onChange={(e) => setNewPayment({ ...newPayment, cardNumber: e.target.value })}
                className="w-full border border-neutral-300 px-3 py-2 text-sm rounded-sm bg-white focus:outline-none focus:border-black font-medium"
                maxLength={19}
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1">Expiry Date (MM/YY)</label>
              <input
                type="text"
                placeholder="09/29"
                value={newPayment.expiryDate}
                onChange={(e) => setNewPayment({ ...newPayment, expiryDate: e.target.value })}
                className="w-full border border-neutral-300 px-3 py-2 text-sm rounded-sm bg-white focus:outline-none focus:border-black font-medium"
                maxLength={5}
                required
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 text-xs font-bold text-neutral-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={newPayment.isDefault}
                onChange={(e) => setNewPayment({ ...newPayment, isDefault: e.target.checked })}
                className="w-4 h-4 accent-black"
              />
              Set as Default Payment Method
            </label>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-sm transition-colors cursor-pointer"
            >
              Save Card
            </button>
            <button
              type="button"
              onClick={() => setShowPaymentForm(false)}
              className="border border-neutral-300 hover:bg-neutral-50 text-neutral-600 text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-sm transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {payments.map((pay) => (
          <div
            key={pay.id}
            className={`relative rounded-xl p-6 text-white overflow-hidden shadow-lg h-44 flex flex-col justify-between transition-all duration-300 hover:scale-102 ${
              pay.cardType === "visa"
                ? "bg-gradient-to-br from-indigo-700 to-indigo-900"
                : pay.cardType === "mastercard"
                ? "bg-gradient-to-br from-neutral-800 to-neutral-950"
                : "bg-gradient-to-br from-slate-600 to-slate-800"
            }`}
          >
            <div className="flex justify-between items-start">
              {/* Card Type Brand */}
              <div className="font-extrabold italic uppercase tracking-wider text-sm">
                {pay.cardType === "visa" ? (
                  <i className="fa-brands fa-cc-visa text-2xl"></i>
                ) : pay.cardType === "mastercard" ? (
                  <i className="fa-brands fa-cc-mastercard text-2xl"></i>
                ) : (
                  <i className="fa-brands fa-cc-amex text-2xl"></i>
                )}
              </div>
              {pay.isDefault && (
                <span className="bg-white/20 text-white backdrop-blur-md text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-sm">
                  Default
                </span>
              )}
            </div>

            {/* Card Number display */}
            <div className="text-lg font-black font-mono tracking-widest text-center my-4">
              {pay.cardNumber}
            </div>

            <div className="flex justify-between items-end text-xs">
              <div>
                <p className="text-white/40 uppercase tracking-wider text-[8px] font-bold mb-0.5">Cardholder</p>
                <p className="font-bold tracking-wide uppercase">{pay.cardholderName}</p>
              </div>
              <div className="flex gap-4 items-end">
                <div>
                  <p className="text-white/40 uppercase tracking-wider text-[8px] font-bold mb-0.5">Expires</p>
                  <p className="font-bold">{pay.expiryDate}</p>
                </div>
                
                <div className="flex gap-2">
                  {!pay.isDefault && (
                    <button
                      onClick={() => handleDefault(pay.id)}
                      className="text-[10px] text-white/60 hover:text-white cursor-pointer"
                      title="Set Default"
                    >
                      <i className="fa-solid fa-star"></i>
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(pay.id)}
                    className="text-white/60 hover:text-red-400 cursor-pointer"
                    title="Remove card"
                  >
                    <i className="fa-regular fa-trash-can"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
