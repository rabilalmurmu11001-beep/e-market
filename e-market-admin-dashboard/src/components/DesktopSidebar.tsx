import { Link, useNavigate } from '@tanstack/react-router'
import { useStore } from '../store/useStore'

export function DesktopSidebar() {
  const { currentUser, logout } = useStore()
  const navigate = useNavigate()

  if (!currentUser) return null

  const handleLogout = () => {
    logout()
    navigate({ to: '/login' })
  }

  return (
    <aside className="hidden lg:flex lg:shrink-0 flex-col w-64 bg-white border-r border-neutral-200">
      {/* Brand Logo */}
      <div className="h-12 flex items-center px-6 border-b border-neutral-200 bg-white">
        <Link to="/" className="flex items-center gap-2 select-none">
          <span className="text-lg font-black uppercase tracking-tighter text-black">
            e-Market<span className="text-red-500 font-black">.</span>
          </span>
          <span className="bg-black text-white text-[8px] font-black tracking-widest px-2 py-0.5 uppercase rounded-xs">
            Admin
          </span>
        </Link>
      </div>

      {/* Sidebar Nav Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-black hover:bg-neutral-50 rounded-xs hover:translate-x-1 transition-transform"
          activeProps={{ className: 'text-black bg-neutral-100 font-black translate-x-1 border-l-2 border-black rounded-l-none' }}
          activeOptions={{ exact: true }}
        >
          <i className="fa-solid fa-chart-line w-4 text-center"></i>
          <span>Overview</span>
        </Link>
        <Link
          to="/products"
          className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-black hover:bg-neutral-50 rounded-xs hover:translate-x-1 transition-transform"
          activeProps={{ className: 'text-black bg-neutral-100 font-black translate-x-1 border-l-2 border-black rounded-l-none' }}
        >
          <i className="fa-solid fa-boxes-stacked w-4 text-center"></i>
          <span>Products</span>
        </Link>
        <Link
          to="/categories"
          className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-black hover:bg-neutral-50 rounded-xs hover:translate-x-1 transition-transform"
          activeProps={{ className: 'text-black bg-neutral-100 font-black translate-x-1 border-l-2 border-black rounded-l-none' }}
        >
          <i className="fa-solid fa-tags w-4 text-center"></i>
          <span>Categories</span>
        </Link>
        <Link
          to="/orders"
          className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-black hover:bg-neutral-50 rounded-xs hover:translate-x-1 transition-transform"
          activeProps={{ className: 'text-black bg-neutral-100 font-black translate-x-1 border-l-2 border-black rounded-l-none' }}
        >
          <i className="fa-solid fa-file-invoice-dollar w-4 text-center"></i>
          <span>Orders</span>
        </Link>
        <Link
          to="/customers"
          className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-black hover:bg-neutral-50 rounded-xs hover:translate-x-1 transition-transform"
          activeProps={{ className: 'text-black bg-neutral-100 font-black translate-x-1 border-l-2 border-black rounded-l-none' }}
        >
          <i className="fa-solid fa-users w-4 text-center"></i>
          <span>Customers</span>
        </Link>
        <Link
          to="/coupons"
          className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-black hover:bg-neutral-50 rounded-xs hover:translate-x-1 transition-transform"
          activeProps={{ className: 'text-black bg-neutral-100 font-black translate-x-1 border-l-2 border-black rounded-l-none' }}
        >
          <i className="fa-solid fa-ticket w-4 text-center"></i>
          <span>Coupons</span>
        </Link>
        <Link
          to="/settings"
          className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-black hover:bg-neutral-50 rounded-xs hover:translate-x-1 transition-transform"
          activeProps={{ className: 'text-black bg-neutral-100 font-black translate-x-1 border-l-2 border-black rounded-l-none' }}
        >
          <i className="fa-solid fa-sliders w-4 text-center"></i>
          <span>Settings</span>
        </Link>
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-neutral-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-circle-user text-neutral-400 text-lg"></i>
            <div className="text-left">
              <span className="text-[10px] font-black uppercase text-black block truncate max-w-3">
                {currentUser.name}
              </span>
              <span className="text-[9px] font-bold text-neutral-400 block truncate max-w-3">
                {currentUser.email}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-neutral-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
            title="Logout"
          >
            <i className="fa-solid fa-right-from-bracket"></i>
          </button>
        </div>
      </div>
    </aside>
  )
}
