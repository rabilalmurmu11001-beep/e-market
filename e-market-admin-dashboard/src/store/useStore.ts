import { create } from 'zustand'

export interface ProductColor {
  name: string
  code: string
  price: number
  stock: number
}

export interface ProductImage {
  id: string
  url: string
  color: string
}

export interface Product {
  id: string
  name: string
  category: string
  price: number
  sku: string
  stock: number
  imageUrl?: string
  images?: ProductImage[]
  colors: ProductColor[]
  isActive: boolean
}

export type OrderStatus = 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled'
export type PaymentStatus = 'Paid' | 'Failed' | 'Refunded'

export interface Order {
  id: string
  date: string
  customerName: string
  customerEmail: string
  totalValue: number
  paymentStatus: PaymentStatus
  orderStatus: OrderStatus
  items: string
}

export interface Customer {
  id: string
  name: string
  email: string
  joinedDate: string
  status: 'Active' | 'Suspended'
  ordersCount: number
}

export interface StoreSettings {
  shopName: string
  currency: string
  taxRate: number
  shippingFee: number
  supportEmail: string
}

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
}

export interface Coupon {
  id: string
  code: string
  discountType: 'Percentage' | 'Flat'
  discountValue: number
  minPurchase: number
  expiryDate: string
  isActive: boolean
  usageLimit: number
  usageCount: number
}

export interface Category {
  id: string
  name: string
  description: string
  isActive: boolean
}

interface CartItem {
  productId: string
  quantity: number
}

interface AppState {
  products: Product[]
  orders: Order[]
  customers: Customer[]
  settings: StoreSettings
  currentUser: User | null
  isAuthenticated: boolean
  cart: CartItem[]
  coupons: Coupon[]
  categories: Category[]
  
  // Actions
  addProduct: (product: Omit<Product, 'id'>) => void
  updateProduct: (id: string, product: Partial<Product>) => void
  deleteProduct: (id: string) => void
  
  updateOrderStatus: (id: string, status: OrderStatus) => void
  updateOrderPaymentStatus: (id: string, status: PaymentStatus) => void
  
  toggleCustomerStatus: (id: string) => void
  
  updateSettings: (settings: Partial<StoreSettings>) => void
  
  login: (email: string, role: 'admin' | 'user') => boolean
  logout: () => void
  
  // Cart Actions
  addToCart: (productId: string) => void
  removeFromCart: (productId: string) => void
  clearCart: () => void
  updateCartQuantity: (productId: string, quantity: number) => void

  // Coupon Actions
  addCoupon: (coupon: Omit<Coupon, 'id' | 'usageCount'>) => void
  updateCoupon: (id: string, coupon: Partial<Coupon>) => void
  deleteCoupon: (id: string) => void

  // Category Actions
  addCategory: (category: Omit<Category, 'id'>) => void
  updateCategory: (id: string, category: Partial<Category>) => void
  deleteCategory: (id: string) => void
}

const initialProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'CANON EOS R5 DSLR Camera',
    category: 'Electronics',
    price: 3899.00,
    sku: 'CAN-EOS-R5',
    stock: 14,
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    colors: [{ name: 'Black', code: '#000000', price: 3899.00, stock: 14 }],
    isActive: true,
  },
  {
    id: 'prod-2',
    name: 'ASUS TUF FHD Gaming Laptop',
    category: 'Electronics',
    price: 1199.00,
    sku: 'ASU-TUF-FHD',
    stock: 8,
    imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    colors: [
      { name: 'Gray', code: '#808080', price: 1199.00, stock: 4 },
      { name: 'Black', code: '#000000', price: 1249.00, stock: 4 }
    ],
    isActive: true,
  },
  {
    id: 'prod-3',
    name: 'Keychron Q1 Mechanical Keyboard',
    category: 'Accessories',
    price: 189.00,
    sku: 'KEY-Q1-MECH',
    stock: 42,
    imageUrl: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    colors: [
      { name: 'Carbon Black', code: '#1a1a1a', price: 189.00, stock: 15 },
      { name: 'Shell White', code: '#f5f6fa', price: 199.00, stock: 15 },
      { name: 'Navy Blue', code: '#000080', price: 209.00, stock: 12 }
    ],
    isActive: true,
  },
  {
    id: 'prod-4',
    name: 'Sony WH-1000XM5 Wireless Headphones',
    category: 'Audio',
    price: 399.00,
    sku: 'SON-WH1000-M5',
    stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    colors: [
      { name: 'Silver', code: '#c0c0c0', price: 399.00, stock: 12 },
      { name: 'Black', code: '#000000', price: 399.00, stock: 13 }
    ],
    isActive: true,
  },
  {
    id: 'prod-5',
    name: 'Patagonia Torrentshell Jacket',
    category: 'Apparel',
    price: 149.00,
    sku: 'PAT-TOR-JAC',
    stock: 19,
    imageUrl: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    colors: [
      { name: 'Navy', code: '#0a3d62', price: 149.00, stock: 7 },
      { name: 'Black', code: '#000000', price: 149.00, stock: 6 },
      { name: 'Red', code: '#FF0000', price: 159.00, stock: 6 }
    ],
    isActive: true,
  },
  {
    id: 'prod-6',
    name: 'Apple Watch Series 9',
    category: 'Wearables',
    price: 399.00,
    sku: 'APL-WAT-S9',
    stock: 31,
    imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    colors: [
      { name: 'Midnight', code: '#1e272e', price: 399.00, stock: 11 },
      { name: 'Starlight', code: '#f5f6fa', price: 399.00, stock: 10 },
      { name: 'Red', code: '#FF0000', price: 419.00, stock: 10 }
    ],
    isActive: true,
  },
]

const initialOrders: Order[] = [
  {
    id: 'ORD-9824',
    date: '2026-07-14',
    customerName: 'Sarah Jenkins',
    customerEmail: 'sarah.j@example.com',
    totalValue: 4088.00,
    paymentStatus: 'Paid',
    orderStatus: 'Pending',
    items: 'CANON EOS R5 DSLR Camera (1), Keychron Q1 Keyboard (1)',
  },
  {
    id: 'ORD-9823',
    date: '2026-07-13',
    customerName: 'Michael Chen',
    customerEmail: 'm.chen@example.com',
    totalValue: 1199.00,
    paymentStatus: 'Paid',
    orderStatus: 'Shipped',
    items: 'ASUS TUF FHD Gaming Laptop (1)',
  },
  {
    id: 'ORD-9822',
    date: '2026-07-12',
    customerName: 'Elena Rostova',
    customerEmail: 'elena.r@example.com',
    totalValue: 548.00,
    paymentStatus: 'Failed',
    orderStatus: 'Cancelled',
    items: 'Sony WH-1000XM5 Wireless Headphones (1), Patagonia Torrentshell Jacket (1)',
  },
  {
    id: 'ORD-9821',
    date: '2026-07-11',
    customerName: 'Marcus Brody',
    customerEmail: 'marcus.b@example.com',
    totalValue: 399.00,
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    items: 'Apple Watch Series 9 (1)',
  },
  {
    id: 'ORD-9820',
    date: '2026-07-10',
    customerName: 'Amina Diallo',
    customerEmail: 'amina.d@example.com',
    totalValue: 189.00,
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    items: 'Keychron Q1 Keyboard (1)',
  },
]

const initialCustomers: Customer[] = [
  {
    id: 'CUST-001',
    name: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    joinedDate: '2025-11-12',
    status: 'Active',
    ordersCount: 4,
  },
  {
    id: 'CUST-002',
    name: 'Michael Chen',
    email: 'm.chen@example.com',
    joinedDate: '2026-01-15',
    status: 'Active',
    ordersCount: 2,
  },
  {
    id: 'CUST-003',
    name: 'Elena Rostova',
    email: 'elena.r@example.com',
    joinedDate: '2026-03-22',
    status: 'Suspended',
    ordersCount: 1,
  },
  {
    id: 'CUST-004',
    name: 'Marcus Brody',
    email: 'marcus.b@example.com',
    joinedDate: '2026-04-05',
    status: 'Active',
    ordersCount: 3,
  },
  {
    id: 'CUST-005',
    name: 'Amina Diallo',
    email: 'amina.d@example.com',
    joinedDate: '2026-06-18',
    status: 'Active',
    ordersCount: 1,
  },
]

const initialCoupons: Coupon[] = [
  {
    id: 'coup-1',
    code: 'WELCOME10',
    discountType: 'Percentage',
    discountValue: 10,
    minPurchase: 0,
    expiryDate: '2026-12-31',
    isActive: true,
    usageLimit: 100,
    usageCount: 15,
  },
  {
    id: 'coup-2',
    code: 'SUMMER50',
    discountType: 'Flat',
    discountValue: 50,
    minPurchase: 200,
    expiryDate: '2026-08-31',
    isActive: true,
    usageLimit: 50,
    usageCount: 8,
  },
  {
    id: 'coup-3',
    code: 'BF2026',
    discountType: 'Percentage',
    discountValue: 20,
    minPurchase: 75,
    expiryDate: '2026-11-30',
    isActive: false,
    usageLimit: 500,
    usageCount: 0,
  }
]

const initialCategories: Category[] = [
  { id: 'cat-1', name: 'Electronics', description: 'Gadgets, devices, and compute equipment.', isActive: true },
  { id: 'cat-2', name: 'Accessories', description: 'Tech add-ons, desktop components, and gear.', isActive: true },
  { id: 'cat-3', name: 'Audio', description: 'Headphones, speakers, sound systems, and studio gear.', isActive: true },
  { id: 'cat-4', name: 'Apparel', description: 'Outdoor jackets, activewear, and lifestyle clothing.', isActive: true },
  { id: 'cat-5', name: 'Wearables', description: 'Smartwatches, fitness bands, and tracking devices.', isActive: true },
]

export const useStore = create<AppState>((set) => ({
  products: initialProducts,
  orders: initialOrders,
  customers: initialCustomers,
  coupons: initialCoupons,
  categories: initialCategories,
  settings: {
    shopName: 'e-Market Co.',
    currency: 'USD',
    taxRate: 8.5,
    shippingFee: 15.00,
    supportEmail: 'support@e-market.com',
  },
  currentUser: null,
  isAuthenticated: false,
  cart: [],

  addProduct: (product) => set((state) => ({
    products: [
      ...state.products,
      {
        ...product,
        id: `prod-${state.products.length + 1}-${Math.random().toString(36).substr(2, 4)}`,
      },
    ],
  })),

  updateProduct: (id, updatedProduct) => set((state) => ({
    products: state.products.map((p) => (p.id === id ? { ...p, ...updatedProduct } : p)),
  })),

  deleteProduct: (id) => set((state) => ({
    products: state.products.filter((p) => p.id !== id),
  })),

  updateOrderStatus: (id, status) => set((state) => ({
    orders: state.orders.map((o) => (o.id === id ? { ...o, orderStatus: status } : o)),
  })),

  updateOrderPaymentStatus: (id, status) => set((state) => ({
    orders: state.orders.map((o) => (o.id === id ? { ...o, paymentStatus: status } : o)),
  })),

  toggleCustomerStatus: (id) => set((state) => ({
    customers: state.customers.map((c) => 
      c.id === id 
        ? { ...c, status: c.status === 'Active' ? 'Suspended' : 'Active' } 
        : c
    ),
  })),

  updateSettings: (newSettings) => set((state) => ({
    settings: { ...state.settings, ...newSettings },
  })),

  login: (email, role) => {
    const name = role === 'admin' ? 'Administrator' : 'Demo Customer'
    set({
      currentUser: { id: `user-${Date.now()}`, name, email, role },
      isAuthenticated: true,
    })
    return true
  },

  logout: () => set({ currentUser: null, isAuthenticated: false, cart: [] }),

  addToCart: (productId) => set((state) => {
    const existing = state.cart.find((item) => item.productId === productId)
    if (existing) {
      return {
        cart: state.cart.map((item) => 
          item.productId === productId 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        )
      }
    }
    return { cart: [...state.cart, { productId, quantity: 1 }] }
  }),

  removeFromCart: (productId) => set((state) => ({
    cart: state.cart.filter((item) => item.productId !== productId)
  })),

  clearCart: () => set({ cart: [] }),

  updateCartQuantity: (productId, quantity) => set((state) => ({
    cart: quantity <= 0 
      ? state.cart.filter((item) => item.productId !== productId)
      : state.cart.map((item) => item.productId === productId ? { ...item, quantity } : item)
  })),

  addCoupon: (coupon) => set((state) => ({
    coupons: [
      ...state.coupons,
      {
        ...coupon,
        id: `coup-${state.coupons.length + 1}-${Math.random().toString(36).substr(2, 4)}`,
        usageCount: 0,
      },
    ],
  })),

  updateCoupon: (id, updatedCoupon) => set((state) => ({
    coupons: state.coupons.map((c) => (c.id === id ? { ...c, ...updatedCoupon } : c)),
  })),
  
  deleteCoupon: (id) => set((state) => ({
    coupons: state.coupons.filter((c) => c.id !== id),
  })),

  addCategory: (category) => set((state) => ({
    categories: [
      ...state.categories,
      {
        ...category,
        id: `cat-${state.categories.length + 1}-${Math.random().toString(36).substr(2, 4)}`,
      },
    ],
  })),

  updateCategory: (id, updatedCategory) => set((state) => ({
    categories: state.categories.map((c) => (c.id === id ? { ...c, ...updatedCategory } : c)),
  })),

  deleteCategory: (id) => set((state) => {
    const categoryToDelete = state.categories.find((c) => c.id === id);
    if (!categoryToDelete) return {};
    return {
      categories: state.categories.filter((c) => c.id !== id),
      products: state.products.map((p) =>
        p.category === categoryToDelete.name ? { ...p, category: 'Uncategorized' } : p
      ),
    };
  })
}))
