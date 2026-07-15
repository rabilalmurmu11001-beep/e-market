import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Navbar } from "../core/Navbar";
import { Footer } from "../core/Footer";
import { CartProvider } from "../core/CartContext";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col justify-between container mx-auto bg-size-[100%_100%] text-slate-800">
        <div>
          <Navbar />
          <div className="mt-2">
            <Outlet />
          </div>
        </div>
        <Footer />
      </div>
    </CartProvider>
  );
}

