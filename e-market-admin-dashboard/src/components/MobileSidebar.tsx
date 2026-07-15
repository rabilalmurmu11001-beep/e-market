import { Link, useNavigate } from '@tanstack/react-router'
import { useStore } from '../store/useStore'

interface MobileSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const { currentUser, logout } = useStore()
  const navigate = useNavigate()

  if (!isOpen || !currentUser) return null

  const handleLogout = () => {
    logout()
    onClose()
    navigate({ to: '/login' })
  }

  return (
    <div className="fixed inset-0 z-50 flex lg:hidden">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        onClick={onClose}
      ></div>
      <div className="relative flex flex-col w-64 max-w-xs bg-white border-r border-neutral-200 animate-in slide-in-from-left duration-250">
        <div className="h-16 flex items-center justify-between px-6 border-b border-neutral-200">
          <span className="font-black uppercase tracking-tighter text-black">
            e-Market.
          </span>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-black"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <Link
            to="/"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-black hover:bg-neutral-50 rounded-xs"
            activeProps={{ className: 'text-black bg-neutral-100 font-black border-l-2 border-black rounded-l-none' }}
            activeOptions={{ exact: true }}
          >
            <i className="fa-solid fa-chart-line w-4 text-center"></i>
            <span>Overview</span>
          </Link>
          <Link
            to="/products"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-black hover:bg-neutral-50 rounded-xs"
            activeProps={{ className: 'text-black bg-neutral-100 font-black border-l-2 border-black rounded-l-none' }}
          >
            <i className="fa-solid fa-boxes-stacked w-4 text-center"></i>
            <span>Products</span>
          </Link>
          <Link
            to="/categories"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-black hover:bg-neutral-50 rounded-xs"
            activeProps={{ className: 'text-black bg-neutral-100 font-black border-l-2 border-black rounded-l-none' }}
          >
            <i className="fa-solid fa-tags w-4 text-center"></i>
            <span>Categories</span>
          </Link>
          <Link
            to="/orders"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-black hover:bg-neutral-50 rounded-xs"
            activeProps={{ className: 'text-black bg-neutral-100 font-black border-l-2 border-black rounded-l-none' }}
          >
            <i className="fa-solid fa-file-invoice-dollar w-4 text-center"></i>
            <span>Orders</span>
          </Link>
          <Link
            to="/customers"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-black hover:bg-neutral-50 rounded-xs"
            activeProps={{ className: 'text-black bg-neutral-100 font-black border-l-2 border-black rounded-l-none' }}
          >
            <i className="fa-solid fa-users w-4 text-center"></i>
            <span>Customers</span>
          </Link>
          <Link
            to="/coupons"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-black hover:bg-neutral-50 rounded-xs"
            activeProps={{ className: 'text-black bg-neutral-100 font-black border-l-2 border-black rounded-l-none' }}
          >
            <i className="fa-solid fa-ticket w-4 text-center"></i>
            <span>Coupons</span>
          </Link>
          <Link
            to="/settings"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-black hover:bg-neutral-50 rounded-xs"
            activeProps={{ className: 'text-black bg-neutral-100 font-black border-l-2 border-black rounded-l-none' }}
          >
            <i className="fa-solid fa-sliders w-4 text-center"></i>
            <span>Settings</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-neutral-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-circle-user text-neutral-400"></i>
              <span className="text-[10px] font-black uppercase text-black">
                {currentUser.name}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-neutral-400 hover:text-red-500 cursor-pointer"
            >
              <i className="fa-solid fa-right-from-bracket text-sm"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
