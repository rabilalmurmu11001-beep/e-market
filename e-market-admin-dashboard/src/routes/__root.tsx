import { createRootRoute, Outlet, useLocation, Navigate } from '@tanstack/react-router'
import { useStore } from '../store/useStore'
import { useState } from 'react'
import { DesktopSidebar } from '../components/DesktopSidebar'
import { MobileSidebar } from '../components/MobileSidebar'

export const Route = createRootRoute({
  component: AdminRootLayout,
})

function AdminRootLayout() {
  const { currentUser } = useStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  const isLoginPage = location.pathname === '/login'

  // Full-screen layout for the login route
  if (isLoginPage) {
    return (
      <div className="min-h-screen flex flex-col font-sans">
        <Outlet />
      </div>
    )
  }

  // Automatically redirect unauthenticated visits to the login screen
  if (!currentUser) {
    return <Navigate to="/login" />
  }

  return (
    <div className="h-screen w-screen flex bg-neutral-50 text-slate-800 font-sans overflow-hidden">
      
      <DesktopSidebar />

      <MobileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Panel Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header Controls */}
        <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-6 z-10">
          
          <div className="flex items-center gap-4">
            {/* Hamburger for mobile */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 text-neutral-500 hover:text-black focus:outline-none"
            >
              <i className="fa-solid fa-bars text-lg"></i>
            </button>
            <div className="hidden sm:block relative">
              <input
                type="text"
                placeholder="Search resources..."
                className="bg-neutral-50 border border-neutral-200 px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-black rounded-xs w-48 focus:w-64 transition-all"
              />
              <i className="fa-solid fa-magnifying-glass absolute right-3 top-2.5 text-neutral-400 text-[10px]"></i>
            </div>
          </div>

          <div className="flex items-center gap-4">
            
            {/* Notification Bell */}
            <button className="relative p-2 text-neutral-500 hover:text-black transition-colors cursor-pointer" title="Notifications">
              <i className="fa-solid fa-bell text-sm"></i>
              <span className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[8px] font-black w-3.5 h-3.5 flex items-center justify-center rounded-full">
                3
              </span>
            </button>

            {/* Profile Indicator */}
            <div className="flex items-center gap-2 border-l border-neutral-200 pl-4">
              <span className="hidden md:inline text-xs font-bold text-neutral-500 uppercase">
                Admin Area
              </span>
              <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center border border-neutral-200 text-black font-black text-xs">
                A
              </div>
            </div>

          </div>

        </header>

        {/* Route Dashboard Page Outlet */}
        <main className="grow overflow-y-auto bg-neutral-50 p-6 md:p-8">
          <Outlet />
        </main>
      </div>

    </div>
  )
}
