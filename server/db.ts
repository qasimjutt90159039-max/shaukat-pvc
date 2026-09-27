import fs from 'fs';
import path from 'path';
import {
  IUser,
  IProduct,
  ICategory,
  IOrder,
  IQuotation,
  IBulkOrder,
  IReview,
  IBlogPost,
  IContactMessage,
  IInventoryHistory,
} from './types';
import {
  initialCategories,
  initialProducts,
  initialBlogPosts,
  initialAdminUser,
  initialDemoUser,
} from './seedData';

interface DatabaseSchema {
  Users: IUser[];
  Products: IProduct[];
  Categories: ICategory[];
  Orders: IOrder[];
  Quotations: IQuotation[];
  BulkOrders: IBulkOrder[];
  Reviews: IReview[];
  BlogPosts: IBlogPost[];
  ContactMessages: IContactMessage[];
  InventoryHistory: IInventoryHistory[];
  Wishlists: Record<string, string[]>; // userId -> productIds
  Carts: Record<string, Array<{ productId: string; variantId?: string; quantity: number }>>;
  Addresses: Record<string, Array<{ id: string; label: string; address: string; city: string; phone: string }>>;
  SiteSettings: Record<string, unknown>;
}

const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const DATA_DIR = isServerless ? path.join('/tmp', 'shaukat-data') : path.resolve(process.cwd(), 'server/data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

class DatabaseStore {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.Products && parsed.Products.length > 0) {
          const existingIds = new Set(parsed.Products.map((p: any) => p.id));
          let changed = false;
          for (const initP of initialProducts) {
            if (!existingIds.has(initP.id)) {
              parsed.Products.push(initP);
              changed = true;
            }
          }
          // Also sync categories
          if (parsed.Categories) {
            const existingCatIds = new Set(parsed.Categories.map((c: any) => c.id));
            for (const initCat of initialCategories) {
              if (!existingCatIds.has(initCat.id)) {
                parsed.Categories.push(initCat);
                changed = true;
              }
            }
          }
          if (changed) {
            fs.writeFileSync(DATA_FILE, JSON.stringify(parsed, null, 2), 'utf-8');
          }
          return parsed;
        }
      }
    } catch (err) {
      console.error('Failed to load database store file, initializing fresh store:', err);
    }

    const defaultStore: DatabaseSchema = {
      Users: [initialAdminUser, initialDemoUser],
      Products: initialProducts,
      Categories: initialCategories,
      Orders: [
        {
          id: 'ord-1001',
          orderNumber: 'SH-ORD-2026-001',
          userId: initialDemoUser.id,
          customerName: 'Tariq Mehmood',
          phone: '+92-300-1234567',
          email: 'customer@example.com',
          address: 'Main Commercial Market, Bosan Road',
          city: 'Multan',
          postalCode: '60000',
          deliveryNotes: 'Please deliver to the construction site entrance.',
          items: [
            {
              productId: 'prod-pvc-01',
              productName: 'uPVC Class C Potable Water Supply Pipe',
              sku: 'SH-PVC-C01-10FT',
              variantDetails: '1 inch / 10 ft',
              quantity: 10,
              price: 890,
            },
            {
              productId: 'prod-fit-01',
              productName: '90-Degree uPVC Heavy Pressure Elbow Fitting',
              sku: 'SH-FIT-ELB90-10',
              variantDetails: '1 inch',
              quantity: 20,
              price: 75,
            },
          ],
          subtotal: 10400,
          discount: 0,
          deliveryFee: 350,
          total: 10750,
          paymentMethod: 'Cash on Delivery',
          paymentStatus: 'Pending',
          orderStatus: 'Confirmed',
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
        },
      ],
      Quotations: [
        {
          id: 'quote-101',
          quoteNumber: 'SH-RFQ-0921',
          name: 'Hassan Construction Co.',
          phone: '+92-301-7654321',
          email: 'hassan.builders@example.com',
          company: 'Hassan Builders Multan',
          productName: 'Schedule 40 High-Pressure uPVC Pipe',
          productId: 'prod-pvc-02',
          quantity: '500 lengths',
          size: '3 inch & 4 inch',
          deliveryLocation: 'New Multan Housing Colony Phase 2',
          message: 'Need batch rate for multi-story residential plumbing riser setup.',
          status: 'Quoted',
          internalNotes: 'Offered 8% contractor volume discount. Waiting on final approval.',
          quotedAmount: 1850000,
          createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
          updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        },
      ],
      BulkOrders: [
        {
          id: 'bulk-01',
          bulkOrderNumber: 'SH-BLK-4001',
          name: 'Ahmed & Sons Contractors',
          company: 'Ahmed Infrastructure Ltd',
          phone: '+92-321-9876543',
          email: 'ahmed.infra@example.com',
          product: 'uPVC Class C Potable Water Pipe 1.5"',
          requiredQuantity: '1200 lengths',
          requiredSize: '1.5 inch x 20 ft',
          deliveryCity: 'Multan',
          message: 'Supplying a 40-unit housing scheme main water reticulation line.',
          status: 'Contacted',
          internalNotes: 'Contacted over phone on 25th. Dispatch logistics discussed.',
          createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
        },
      ],
      Reviews: [
        {
          id: 'rev-01',
          productId: 'prod-pvc-01',
          productName: 'uPVC Class C Potable Water Supply Pipe',
          userId: initialDemoUser.id,
          customerName: 'Tariq M.',
          rating: 5,
          comment: 'Consistent wall thickness and smooth bore. Joints sealed tightly with standard solvent cement.',
          isApproved: true,
          createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        },
      ],
      BlogPosts: initialBlogPosts,
      ContactMessages: [
        {
          id: 'msg-01',
          name: 'Kashif Ali',
          phone: '+92-312-5551234',
          email: 'kashif@example.com',
          subject: 'Store Hours and Product Sizing',
          message: 'Inquiring if you stock 6-inch sewer pipes and rubberized couplings on site at Hassan Parnana Colony.',
          status: 'replied',
          createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
        },
      ],
      InventoryHistory: [
        {
          id: 'inv-h-01',
          productId: 'prod-pvc-01',
          productName: 'uPVC Class C Potable Water Supply Pipe',
          sku: 'SH-PVC-C01',
          change: 250,
          previousStock: 0,
          newStock: 250,
          reason: 'Initial warehouse intake',
          timestamp: new Date(Date.now() - 86400000 * 10).toISOString(),
        },
      ],
      Wishlists: {
        [initialDemoUser.id]: ['prod-pvc-01', 'prod-vlv-01'],
      },
      Carts: {},
      Addresses: {
        [initialDemoUser.id]: [
          {
            id: 'addr-01',
            label: 'Site Office',
            address: '12-B Bosan Road Commercial Area',
            city: 'Multan',
            phone: '+92-300-1234567',
          },
        ],
      },
      SiteSettings: {
        storeName: 'Shaukat PVC Plastic Pipe Shop',
        category: 'PVC / Plumbing',
        phone: '+92-61-4540198',
        address: '17-A Hassan Parnana Colony, Multan, Punjab, Pakistan',
        city: 'Multan',
        country: 'Pakistan',
        currency: 'PKR',
        taxRate: 0,
        flatShippingFee: 350,
        freeShippingThreshold: 15000,
      },
    };

    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(defaultStore, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed writing initial database store:', e);
    }

    return defaultStore;
  }

  public save(): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving database store:', err);
    }
  }

  // Users
  public getUsers(): IUser[] {
    return this.data.Users;
  }

  public findUserById(id: string): IUser | undefined {
    return this.data.Users.find((u) => u.id === id);
  }

  public findUserByEmail(email: string): IUser | undefined {
    return this.data.Users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public createUser(user: IUser): IUser {
    this.data.Users.push(user);
    this.save();
    return user;
  }

  public updateUser(id: string, updates: Partial<IUser>): IUser | undefined {
    const idx = this.data.Users.findIndex((u) => u.id === id);
    if (idx !== -1) {
      this.data.Users[idx] = { ...this.data.Users[idx], ...updates };
      this.save();
      return this.data.Users[idx];
    }
    return undefined;
  }

  // Products
  public getProducts(): IProduct[] {
    return this.data.Products;
  }

  public findProductById(id: string): IProduct | undefined {
    return this.data.Products.find((p) => p.id === id);
  }

  public findProductBySlug(slug: string): IProduct | undefined {
    return this.data.Products.find((p) => p.slug === slug);
  }

  public createProduct(product: IProduct): IProduct {
    this.data.Products.unshift(product);
    // Add inventory history
    this.data.InventoryHistory.unshift({
      id: `inv-h-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      change: product.stock,
      previousStock: 0,
      newStock: product.stock,
      reason: 'Product created',
      timestamp: new Date().toISOString(),
    });
    this.save();
    return product;
  }

  public updateProduct(id: string, updates: Partial<IProduct>): IProduct | undefined {
    const idx = this.data.Products.findIndex((p) => p.id === id);
    if (idx !== -1) {
      const prev = this.data.Products[idx];
      if (updates.stock !== undefined && updates.stock !== prev.stock) {
        this.data.InventoryHistory.unshift({
          id: `inv-h-${Date.now()}`,
          productId: id,
          productName: prev.name,
          sku: prev.sku,
          change: updates.stock - prev.stock,
          previousStock: prev.stock,
          newStock: updates.stock,
          reason: 'Stock level adjustment',
          timestamp: new Date().toISOString(),
        });
      }
      this.data.Products[idx] = {
        ...prev,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      this.save();
      return this.data.Products[idx];
    }
    return undefined;
  }

  public deleteProduct(id: string): boolean {
    const prevLen = this.data.Products.length;
    this.data.Products = this.data.Products.filter((p) => p.id !== id);
    if (this.data.Products.length !== prevLen) {
      this.save();
      return true;
    }
    return false;
  }

  // Categories
  public getCategories(): ICategory[] {
    return this.data.Categories;
  }

  public createCategory(cat: ICategory): ICategory {
    this.data.Categories.push(cat);
    this.save();
    return cat;
  }

  public updateCategory(id: string, updates: Partial<ICategory>): ICategory | undefined {
    const idx = this.data.Categories.findIndex((c) => c.id === id);
    if (idx !== -1) {
      this.data.Categories[idx] = { ...this.data.Categories[idx], ...updates };
      this.save();
      return this.data.Categories[idx];
    }
    return undefined;
  }

  public deleteCategory(id: string): boolean {
    const prev = this.data.Categories.length;
    this.data.Categories = this.data.Categories.filter((c) => c.id !== id);
    if (this.data.Categories.length !== prev) {
      this.save();
      return true;
    }
    return false;
  }

  // Orders
  public getOrders(): IOrder[] {
    return this.data.Orders;
  }

  public findOrderById(id: string): IOrder | undefined {
    return this.data.Orders.find((o) => o.id === id || o.orderNumber === id);
  }

  public getUserOrders(userId: string): IOrder[] {
    return this.data.Orders.filter((o) => o.userId === userId);
  }

  public createOrder(order: IOrder): IOrder {
    this.data.Orders.unshift(order);
    // Deduct stock for each item
    for (const item of order.items) {
      const prod = this.findProductById(item.productId);
      if (prod) {
        const newStock = Math.max(0, prod.stock - item.quantity);
        this.updateProduct(prod.id, { stock: newStock });
      }
    }
    this.save();
    return order;
  }

  public updateOrderStatus(id: string, status: IOrder['orderStatus']): IOrder | undefined {
    const idx = this.data.Orders.findIndex((o) => o.id === id);
    if (idx !== -1) {
      this.data.Orders[idx].orderStatus = status;
      this.data.Orders[idx].updatedAt = new Date().toISOString();
      this.save();
      return this.data.Orders[idx];
    }
    return undefined;
  }

  // Quotations
  public getQuotations(): IQuotation[] {
    return this.data.Quotations;
  }

  public createQuotation(quote: IQuotation): IQuotation {
    this.data.Quotations.unshift(quote);
    this.save();
    return quote;
  }

  public updateQuotation(id: string, updates: Partial<IQuotation>): IQuotation | undefined {
    const idx = this.data.Quotations.findIndex((q) => q.id === id);
    if (idx !== -1) {
      this.data.Quotations[idx] = {
        ...this.data.Quotations[idx],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      this.save();
      return this.data.Quotations[idx];
    }
    return undefined;
  }

  // Bulk Orders
  public getBulkOrders(): IBulkOrder[] {
    return this.data.BulkOrders;
  }

  public createBulkOrder(bulk: IBulkOrder): IBulkOrder {
    this.data.BulkOrders.unshift(bulk);
    this.save();
    return bulk;
  }

  public updateBulkOrder(id: string, updates: Partial<IBulkOrder>): IBulkOrder | undefined {
    const idx = this.data.BulkOrders.findIndex((b) => b.id === id);
    if (idx !== -1) {
      this.data.BulkOrders[idx] = { ...this.data.BulkOrders[idx], ...updates };
      this.save();
      return this.data.BulkOrders[idx];
    }
    return undefined;
  }

  // Reviews
  public getReviews(productId?: string, onlyApproved: boolean = true): IReview[] {
    let list = this.data.Reviews;
    if (productId) {
      list = list.filter((r) => r.productId === productId);
    }
    if (onlyApproved) {
      list = list.filter((r) => r.isApproved);
    }
    return list;
  }

  public createReview(rev: IReview): IReview {
    this.data.Reviews.unshift(rev);
    this.save();
    return rev;
  }

  public updateReviewStatus(id: string, isApproved: boolean): IReview | undefined {
    const idx = this.data.Reviews.findIndex((r) => r.id === id);
    if (idx !== -1) {
      this.data.Reviews[idx].isApproved = isApproved;
      this.save();
      return this.data.Reviews[idx];
    }
    return undefined;
  }

  public deleteReview(id: string): boolean {
    const prev = this.data.Reviews.length;
    this.data.Reviews = this.data.Reviews.filter((r) => r.id !== id);
    if (this.data.Reviews.length !== prev) {
      this.save();
      return true;
    }
    return false;
  }

  // Blog
  public getBlogPosts(publishedOnly: boolean = true): IBlogPost[] {
    if (publishedOnly) {
      return this.data.BlogPosts.filter((b) => b.published);
    }
    return this.data.BlogPosts;
  }

  public findBlogPostBySlug(slug: string): IBlogPost | undefined {
    return this.data.BlogPosts.find((b) => b.slug === slug);
  }

  public createBlogPost(post: IBlogPost): IBlogPost {
    this.data.BlogPosts.unshift(post);
    this.save();
    return post;
  }

  public updateBlogPost(id: string, updates: Partial<IBlogPost>): IBlogPost | undefined {
    const idx = this.data.BlogPosts.findIndex((b) => b.id === id);
    if (idx !== -1) {
      this.data.BlogPosts[idx] = { ...this.data.BlogPosts[idx], ...updates };
      this.save();
      return this.data.BlogPosts[idx];
    }
    return undefined;
  }

  public deleteBlogPost(id: string): boolean {
    const prev = this.data.BlogPosts.length;
    this.data.BlogPosts = this.data.BlogPosts.filter((b) => b.id !== id);
    if (this.data.BlogPosts.length !== prev) {
      this.save();
      return true;
    }
    return false;
  }

  // Contact Messages
  public getContactMessages(): IContactMessage[] {
    return this.data.ContactMessages;
  }

  public createContactMessage(msg: IContactMessage): IContactMessage {
    this.data.ContactMessages.unshift(msg);
    this.save();
    return msg;
  }

  public updateContactMessage(id: string, status: IContactMessage['status']): IContactMessage | undefined {
    const idx = this.data.ContactMessages.findIndex((m) => m.id === id);
    if (idx !== -1) {
      this.data.ContactMessages[idx].status = status;
      this.save();
      return this.data.ContactMessages[idx];
    }
    return undefined;
  }

  public deleteContactMessage(id: string): boolean {
    const prev = this.data.ContactMessages.length;
    this.data.ContactMessages = this.data.ContactMessages.filter((m) => m.id !== id);
    if (this.data.ContactMessages.length !== prev) {
      this.save();
      return true;
    }
    return false;
  }

  // Inventory History
  public getInventoryHistory(): IInventoryHistory[] {
    return this.data.InventoryHistory;
  }

  // Wishlists
  public getUserWishlist(userId: string): string[] {
    return this.data.Wishlists[userId] || [];
  }

  public toggleWishlistItem(userId: string, productId: string): string[] {
    const current = this.data.Wishlists[userId] || [];
    const exists = current.includes(productId);
    const updated = exists ? current.filter((id) => id !== productId) : [...current, productId];
    this.data.Wishlists[userId] = updated;
    this.save();
    return updated;
  }

  // Settings
  public getSettings(): Record<string, unknown> {
    return this.data.SiteSettings;
  }

  public updateSettings(settings: Record<string, unknown>): Record<string, unknown> {
    this.data.SiteSettings = { ...this.data.SiteSettings, ...settings };
    this.save();
    return this.data.SiteSettings;
  }
}

export const db = new DatabaseStore();
