export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
}

export interface Address {
  id: string;
  type: string;
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
}

export interface PaymentMethod {
  id: string;
  cardholderName: string;
  cardNumber: string;
  cardType: "visa" | "mastercard" | "amex";
  expiryDate: string;
  isDefault: boolean;
}

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface Order {
  id: string;
  date: string;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  total: number;
  items: OrderItem[];
}
