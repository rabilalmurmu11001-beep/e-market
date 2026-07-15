import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PersonalProfile } from "../components/profile/PersonalProfile";
import { AddressBook } from "../components/profile/AddressBook";
import { OrderHistory } from "../components/profile/OrderHistory";
import { PaymentOptions } from "../components/profile/PaymentOptions";
import { useAuthStore } from "../core/useAuthStore";
import type {
  Address,
  Order,
  PaymentMethod,
} from "../components/profile/profileTypes";

export const Route = createFileRoute("/profile")({
  component: ProfileComponent,
});

function ProfileComponent() {
  const { isAuthenticated, user, logout, updateProfile } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, navigate]);

  // Tab State
  const [activeTab, setActiveTab] = useState<
    "profile" | "orders" | "addresses" | "payments"
  >("profile");


  // Addresses data state
  const [addresses, setAddresses] = useState<Address[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("e_market_addresses");
      if (saved) return JSON.parse(saved);
    }
    return [
      {
        id: "addr-1",
        type: "Home Address",
        fullName: "John Doe",
        street: "123 Main Street, Suite 4B",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        isDefaultShipping: true,
        isDefaultBilling: true,
      },
      {
        id: "addr-2",
        type: "Office Address",
        fullName: "John Doe",
        street: "456 Broadway Ave, Floor 12",
        city: "New York",
        state: "NY",
        zipCode: "10013",
        isDefaultShipping: false,
        isDefaultBilling: false,
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem("e_market_addresses", JSON.stringify(addresses));
  }, [addresses]);

  // Payment methods state
  const [payments, setPayments] = useState<PaymentMethod[]>([
    {
      id: "pay-1",
      cardholderName: "John Doe",
      cardNumber: "•••• •••• •••• 4242",
      cardType: "visa",
      expiryDate: "12/28",
      isDefault: true,
    },
    {
      id: "pay-2",
      cardholderName: "John Doe",
      cardNumber: "•••• •••• •••• 9988",
      cardType: "mastercard",
      expiryDate: "06/27",
      isDefault: false,
    },
  ]);

  // Order history mock data
  const orders: Order[] = [
    {
      id: "EM-834920",
      date: "July 12, 2026",
      status: "Shipped",
      total: 375,
      items: [
        {
          id: 101,
          name: "CANON EOS DSLR Camera Premium Bundle",
          price: 360,
          quantity: 1,
          imageUrl: "https://via.placeholder.com/150",
        },
      ],
    },
    {
      id: "EM-183029",
      date: "June 15, 2026",
      status: "Delivered",
      total: 1999,
      items: [
        {
          id: 2,
          name: "MacBook Pro M2",
          price: 1999,
          quantity: 1,
          imageUrl: "https://via.placeholder.com/150",
        },
      ],
    },
    {
      id: "EM-102948",
      date: "May 20, 2026",
      status: "Delivered",
      total: 798,
      items: [
        {
          id: 3,
          name: "Apple Watch Series 8",
          price: 399,
          quantity: 2,
          imageUrl: "https://via.placeholder.com/150",
        },
      ],
    },
  ];

  // Address Handlers
  const handleAddAddress = (newAddr: Omit<Address, "id">) => {
    const id = "addr-" + Math.floor(Math.random() * 10000);
    const addedAddress: Address = {
      ...newAddr,
      id,
      isDefaultShipping: newAddr.isDefaultShipping || addresses.length === 0,
      isDefaultBilling: newAddr.isDefaultBilling || addresses.length === 0,
    };

    setAddresses((prev) => {
      let updated = [...prev];
      if (addedAddress.isDefaultShipping) {
        updated = updated.map((a) => ({ ...a, isDefaultShipping: false }));
      }
      if (addedAddress.isDefaultBilling) {
        updated = updated.map((a) => ({ ...a, isDefaultBilling: false }));
      }
      return [...updated, addedAddress];
    });
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSetDefaultAddress = (
    id: string,
    type: "shipping" | "billing",
  ) => {
    setAddresses((prev) =>
      prev.map((a) => {
        if (type === "shipping") {
          return { ...a, isDefaultShipping: a.id === id };
        } else {
          return { ...a, isDefaultBilling: a.id === id };
        }
      }),
    );
  };

  // Payment Handlers
  const handleAddPayment = (newPay: Omit<PaymentMethod, "id">) => {
    const id = "pay-" + Math.floor(Math.random() * 10000);
    const rawNumber = newPay.cardNumber.replace(/\s+/g, "");
    const lastFour = rawNumber.slice(-4);
    const masked = `•••• •••• •••• ${lastFour || "4444"}`;

    const addedPayment: PaymentMethod = {
      ...newPay,
      id,
      cardNumber: masked,
      isDefault: newPay.isDefault || payments.length === 0,
    };

    setPayments((prev) => {
      let updated = [...prev];
      if (addedPayment.isDefault) {
        updated = updated.map((p) => ({ ...p, isDefault: false }));
      }
      return [...updated, addedPayment];
    });
  };

  const handleDeletePayment = (id: string) => {
    setPayments((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSetDefaultPayment = (id: string) => {
    setPayments((prev) => prev.map((p) => ({ ...p, isDefault: p.id === id })));
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="mx-auto px-4 py-8 font-sans text-black bg-white min-h-[85vh]">
      {/* Breadcrumb Path */}
      <nav className="text-xs text-neutral-400 font-medium mb-6">
        <Link to="/" className="hover:text-black transition-colors">
          Home
        </Link>{" "}
        / <span className="text-black font-semibold">Profile</span>
      </nav>

      {/* ================= PROFILE DASHBOARD (Logged In) ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT SIDEBAR NAVIGATION MENU (3 Cols) */}
        <aside className="lg:col-span-3 border border-neutral-200 rounded-sm p-6 bg-white space-y-6">
          <div className="flex flex-col items-center text-center pb-6 border-b border-neutral-100">
            {/* User Avatar */}
            <div className="w-20 h-20 bg-neutral-900 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 shadow-md relative overflow-hidden group">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>
                  {user.firstName[0]}
                  {user.lastName[0]}
                </span>
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-xs font-semibold">
                Update
              </div>
            </div>
            <h2 className="font-black text-lg tracking-tight">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-xs text-neutral-400 font-semibold">
              {user.email}
            </p>
          </div>

          <nav className="flex flex-col gap-1 text-sm">
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full text-left px-4 py-3 font-bold rounded-sm transition-all flex items-center gap-3 cursor-pointer ${
                activeTab === "profile"
                  ? "bg-black text-white"
                  : "text-neutral-500 hover:text-black hover:bg-neutral-50"
              }`}
            >
              <i className="fa-regular fa-user w-5 text-center"></i> Personal
              Profile
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full text-left px-4 py-3 font-bold rounded-sm transition-all flex items-center gap-3 cursor-pointer ${
                activeTab === "orders"
                  ? "bg-black text-white"
                  : "text-neutral-500 hover:text-black hover:bg-neutral-50"
              }`}
            >
              <i className="fa-solid fa-bag-shopping w-5 text-center"></i>{" "}
              Order History
            </button>
            <button
              onClick={() => setActiveTab("addresses")}
              className={`w-full text-left px-4 py-3 font-bold rounded-sm transition-all flex items-center gap-3 cursor-pointer ${
                activeTab === "addresses"
                  ? "bg-black text-white"
                  : "text-neutral-500 hover:text-black hover:bg-neutral-50"
              }`}
            >
              <i className="fa-regular fa-map w-5 text-center"></i> Address
              Book
            </button>
            <button
              onClick={() => setActiveTab("payments")}
              className={`w-full text-left px-4 py-3 font-bold rounded-sm transition-all flex items-center gap-3 cursor-pointer ${
                activeTab === "payments"
                  ? "bg-black text-white"
                  : "text-neutral-500 hover:text-black hover:bg-neutral-50"
              }`}
            >
              <i className="fa-regular fa-credit-card w-5 text-center"></i>{" "}
              Payment Options
            </button>
            <hr className="border-neutral-100 my-2" />
            <button
              onClick={logout}
              className="w-full text-left px-4 py-3 font-bold text-red-500 rounded-sm hover:bg-red-50 transition-colors flex items-center gap-3 cursor-pointer"
            >
              <i className="fa-solid fa-sign-out-alt w-5 text-center"></i> Log
              Out
            </button>
          </nav>
        </aside>

        {/* RIGHT VIEW WINDOW (9 Cols) */}
        <main className="lg:col-span-9 border border-neutral-200 rounded-sm p-8 bg-white min-h-[500px]">
          {activeTab === "profile" && (
            <PersonalProfile profile={user} onSave={updateProfile} />
          )}

          {activeTab === "orders" && <OrderHistory orders={orders} />}

          {activeTab === "addresses" && (
            <AddressBook
              addresses={addresses}
              onAdd={handleAddAddress}
              onDelete={handleDeleteAddress}
              onSetDefault={handleSetDefaultAddress}
            />
          )}

          {activeTab === "payments" && (
            <PaymentOptions
              payments={payments}
              onAdd={handleAddPayment}
              onDelete={handleDeletePayment}
              onSetDefault={handleSetDefaultPayment}
            />
          )}
        </main>
      </div>
    </div>
  );

}
