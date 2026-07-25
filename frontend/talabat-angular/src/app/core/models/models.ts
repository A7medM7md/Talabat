export interface Product {
  id: number;
  name: string;
  description: string;
  pictureUrl: string;
  price: number;
  productType: string;
  productBrand: string;
}

export interface Pagination<T> {
  pageIndex: number;
  pageSize: number;
  count: number;
  data: T[];
}

export interface CategoryType {
  id: number;
  name: string;
}

export interface BasketItem {
  id: number;
  productName: string;
  price: number;
  quantity: number;
  pictureUrl: string;
  brand: string;
  type: string;
}

export interface Basket {
  id: string;
  items: BasketItem[];
}

export interface DeliveryMethod {
  id: number;
  shortName: string;
  description: string;
  deliveryTime: string;
  cost: number;
}

export interface Address {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  country: string;
}

export interface CurrentUser {
  email: string;
  displayName: string;
  token: string;
}

export interface OrderItem {
  productId: number;
  productName: string;
  pictureUrl: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: number;
  buyerEmail: string;
  orderDate: string;
  shippingAddress?: Address;
  deliveryMethod?: string;
  shippingPrice?: number;
  orderItems?: OrderItem[];
  subtotal?: number;
  total?: number;
  status?: string;
  paymentIntentId?: string;
}

export interface PaymentIntentResponse {
  paymentIntentId?: string;
  clientSecret?: string;
}
