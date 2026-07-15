import React, { useState } from "react";
import type { Address } from "./profileTypes";

interface AddressBookProps {
  addresses: Address[];
  onAdd: (newAddr: Omit<Address, "id">) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string, type: "shipping" | "billing") => void;
}

export const AddressBook: React.FC<AddressBookProps> = ({
  addresses,
  onAdd,
  onDelete,
  onSetDefault,
}) => {
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressSuccess, setAddressSuccess] = useState("");
  const [newAddress, setNewAddress] = useState<Omit<Address, "id">>({
    type: "Home",
    fullName: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    isDefaultShipping: false,
    isDefaultBilling: false,
  });

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(newAddress);
    setAddressSuccess("New address added successfully.");
    setShowAddressForm(false);
    setNewAddress({
      type: "Home",
      fullName: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      isDefaultShipping: false,
      isDefaultBilling: false,
    });
    setTimeout(() => setAddressSuccess(""), 4000);
  };

  const handleDelete = (id: string) => {
    onDelete(id);
    setAddressSuccess("Address deleted.");
    setTimeout(() => setAddressSuccess(""), 4000);
  };

  const handleDefault = (id: string, type: "shipping" | "billing") => {
    onSetDefault(id, type);
    setAddressSuccess(`Default ${type} address updated.`);
    setTimeout(() => setAddressSuccess(""), 4000);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 pb-2 border-b border-neutral-100">
        <h3 className="text-xl font-black uppercase tracking-tight">
          Address Book
        </h3>
        <button
          onClick={() => setShowAddressForm(!showAddressForm)}
          className="bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-sm transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <i className="fa-solid fa-plus"></i> Add Address
        </button>
      </div>

      {addressSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 mb-6 rounded-sm text-xs font-semibold flex items-center gap-2">
          <i className="fa-solid fa-circle-check"></i> {addressSuccess}
        </div>
      )}

      {showAddressForm && (
        <form onSubmit={handleAddAddress} className="border border-neutral-200 p-6 rounded-sm mb-8 space-y-4 bg-neutral-50/50">
          <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-400 mb-2">New Address Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1">Address Name (e.g. Office, Home)</label>
              <input
                type="text"
                value={newAddress.type}
                onChange={(e) => setNewAddress({ ...newAddress, type: e.target.value })}
                className="w-full border border-neutral-300 px-3 py-2 text-sm rounded-sm bg-white focus:outline-none focus:border-black font-medium"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1">Full Name</label>
              <input
                type="text"
                value={newAddress.fullName}
                onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                className="w-full border border-neutral-300 px-3 py-2 text-sm rounded-sm bg-white focus:outline-none focus:border-black font-medium"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1">Street Address</label>
              <input
                type="text"
                value={newAddress.street}
                onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                className="w-full border border-neutral-300 px-3 py-2 text-sm rounded-sm bg-white focus:outline-none focus:border-black font-medium"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1">City</label>
              <input
                type="text"
                value={newAddress.city}
                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                className="w-full border border-neutral-300 px-3 py-2 text-sm rounded-sm bg-white focus:outline-none focus:border-black font-medium"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1">State</label>
                <input
                  type="text"
                  value={newAddress.state}
                  onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                  className="w-full border border-neutral-300 px-3 py-2 text-sm rounded-sm bg-white focus:outline-none focus:border-black font-medium"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1">Zip Code</label>
                <input
                  type="text"
                  value={newAddress.zipCode}
                  onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                  className="w-full border border-neutral-300 px-3 py-2 text-sm rounded-sm bg-white focus:outline-none focus:border-black font-medium"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-2">
            <label className="flex items-center gap-2 text-xs font-bold text-neutral-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={newAddress.isDefaultShipping}
                onChange={(e) => setNewAddress({ ...newAddress, isDefaultShipping: e.target.checked })}
                className="w-4 h-4 accent-black"
              />
              Default Shipping Address
            </label>
            <label className="flex items-center gap-2 text-xs font-bold text-neutral-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={newAddress.isDefaultBilling}
                onChange={(e) => setNewAddress({ ...newAddress, isDefaultBilling: e.target.checked })}
                className="w-4 h-4 accent-black"
              />
              Default Billing Address
            </label>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-sm transition-colors cursor-pointer"
            >
              Save Address
            </button>
            <button
              type="button"
              onClick={() => setShowAddressForm(false)}
              className="border border-neutral-300 hover:bg-neutral-50 text-neutral-600 text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-sm transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((addr) => (
          <div key={addr.id} className="border border-neutral-200 rounded-sm p-6 bg-white space-y-4 relative flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-black text-sm uppercase tracking-tight">{addr.type}</h4>
                <div className="flex gap-1">
                  {addr.isDefaultShipping && (
                    <span className="bg-neutral-100 text-black border border-neutral-300 text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-sm">
                      Shipping
                    </span>
                  )}
                  {addr.isDefaultBilling && (
                    <span className="bg-neutral-100 text-black border border-neutral-300 text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-sm">
                      Billing
                    </span>
                  )}
                </div>
              </div>
              <div className="text-xs font-semibold text-neutral-600 space-y-1">
                <p className="font-bold text-black">{addr.fullName}</p>
                <p>{addr.street}</p>
                <p>{addr.city}, {addr.state} {addr.zipCode}</p>
              </div>
            </div>

            <div className="border-t border-neutral-100 pt-4 flex justify-between items-center text-xs font-bold">
              <div className="flex gap-3">
                {!addr.isDefaultShipping && (
                  <button
                    onClick={() => handleDefault(addr.id, "shipping")}
                    className="text-[10px] text-neutral-400 hover:text-black cursor-pointer uppercase tracking-wider font-bold"
                  >
                    Set Default Shipping
                  </button>
                )}
                {!addr.isDefaultBilling && (
                  <button
                    onClick={() => handleDefault(addr.id, "billing")}
                    className="text-[10px] text-neutral-400 hover:text-black cursor-pointer uppercase tracking-wider font-bold"
                  >
                    Set Default Billing
                  </button>
                )}
              </div>
              <button
                onClick={() => handleDelete(addr.id)}
                className="text-red-500 hover:text-red-700 cursor-pointer"
                title="Delete address"
              >
                <i className="fa-regular fa-trash-can"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
