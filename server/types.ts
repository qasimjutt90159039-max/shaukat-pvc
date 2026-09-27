export interface IUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  phone?: string;
  role: 'customer' | 'admin';
  createdAt: string;
}

export interface IProductVariant {
  id: string;
  sku: string;
  diameter?: string;
  length?: string;
  color?: string;
  price?: number;
  stock: number;
}

export interface ITechnicalSpecs {
  material?: string;
  productType?: string;
  diameter?: string;
  length?: string;
  color?: string;
  application?: string;
  connectionType?: string;
  pressureRating?: string;
  standardCompliance?: string;
  wallThickness?: string;
  operatingTemp?: string;
  [key: string]: string | undefined;
}

export interface IProduct {
  id: string;
  name: string;
  slug: string;
  category: string; // e.g. "pvc-pipes", "pipe-fittings", "valves", "drainage", "plumbing"
  subcategory?: string;
  sku: string;
  price?: number;
  salePrice?: number;
  stock: number;
  shortDescription: string;
  description: string;
  material: string;
  diameter?: string;
  length?: string;
  color?: string;
  application?: string;
  pressureRating?: string;
  brand?: string;
  images: string[];
  variants: IProductVariant[];
  technicalSpecifications: ITechnicalSpecs;
  isNew?: boolean;
  isFeatured?: boolean;
  isSale?: boolean;
  isDemo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  subcategories: string[];
  productCount?: number;
  image?: string;
}

export interface IOrderItem {
  productId: string;
  productName: string;
  sku: string;
  variantId?: string;
  variantDetails?: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface IOrder {
  id: string;
  orderNumber: string;
  userId?: string;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  area?: string;
  city: string;
  postalCode?: string;
  deliveryNotes?: string;
  items: IOrderItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  paymentMethod: 'Cash on Delivery';
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  orderStatus: 'Pending' | 'Confirmed' | 'Processing' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned';
  createdAt: string;
  updatedAt: string;
}

export interface IQuotation {
  id: string;
  quoteNumber: string;
  name: string;
  phone: string;
  email: string;
  company?: string;
  productName?: string;
  productId?: string;
  quantity: string | number;
  size?: string;
  requiredDate?: string;
  deliveryLocation: string;
  message?: string;
  status: 'New' | 'Contacted' | 'Quoted' | 'Negotiation' | 'Approved' | 'Rejected' | 'Completed';
  internalNotes?: string;
  quotedAmount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface IBulkOrder {
  id: string;
  bulkOrderNumber: string;
  name: string;
  company?: string;
  phone: string;
  email: string;
  product: string;
  requiredQuantity: string | number;
  requiredSize: string;
  deliveryCity: string;
  message?: string;
  status: 'New' | 'Contacted' | 'Quoted' | 'In Progress' | 'Completed' | 'Closed';
  internalNotes?: string;
  createdAt: string;
}

export interface IReview {
  id: string;
  productId: string;
  productName: string;
  userId?: string;
  customerName: string;
  rating: number; // 1-5
  comment: string;
  isApproved: boolean;
  createdAt: string;
}

export interface IBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  published: boolean;
  image?: string;
  readTime: string;
  createdAt: string;
}

export interface IContactMessage {
  id: string;
  name: string;
  phone: string;
  email: string;
  subject?: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: string;
}

export interface IInventoryHistory {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  change: number;
  previousStock: number;
  newStock: number;
  reason: string;
  timestamp: string;
}
