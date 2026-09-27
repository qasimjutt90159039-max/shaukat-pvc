import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from './db';
import { authenticate, optionalAuthenticate, requireAdmin, generateToken, AuthRequest } from './auth';
import { IOrder, IQuotation, IBulkOrder, IProduct, IBlogPost, IReview, IUser } from './types';

export const apiRouter = Router();

// ==========================================
// 1. AUTH ROUTES
// ==========================================
apiRouter.post('/auth/register', (req: Request, res: Response) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ error: 'Name, email, and password are required' });
    return;
  }

  const existing = db.findUserByEmail(email);
  if (existing) {
    res.status(400).json({ error: 'An account with this email already exists' });
    return;
  }

  const newUser: IUser = {
    id: `usr-${Date.now()}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone ? phone.trim() : undefined,
    passwordHash: bcrypt.hashSync(password, 10),
    role: 'customer',
    createdAt: new Date().toISOString(),
  };

  db.createUser(newUser);
  const token = generateToken(newUser);

  res.status(201).json({
    message: 'Account created successfully',
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
    },
  });
});

apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  const user = db.findUserByEmail(email);
  if (!user) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  const match = bcrypt.compareSync(password, user.passwordHash);
  if (!match) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  const token = generateToken(user);
  res.json({
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  });
});

apiRouter.get('/auth/me', authenticate, (req: AuthRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    phone: req.user.phone,
    role: req.user.role,
    createdAt: req.user.createdAt,
  });
});

apiRouter.put('/auth/profile', authenticate, (req: AuthRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const { name, phone, currentPassword, newPassword } = req.body;
  const updates: Partial<IUser> = {};

  if (name) updates.name = name.trim();
  if (phone !== undefined) updates.phone = phone.trim();

  if (newPassword) {
    if (!currentPassword) {
      res.status(400).json({ error: 'Current password is required to change password' });
      return;
    }
    const match = bcrypt.compareSync(currentPassword, req.user.passwordHash);
    if (!match) {
      res.status(400).json({ error: 'Current password does not match' });
      return;
    }
    updates.passwordHash = bcrypt.hashSync(newPassword, 10);
  }

  const updated = db.updateUser(req.user.id, updates);
  res.json({
    message: 'Profile updated',
    user: {
      id: updated?.id,
      name: updated?.name,
      email: updated?.email,
      phone: updated?.phone,
      role: updated?.role,
    },
  });
});

// ==========================================
// 2. PRODUCTS
// ==========================================
apiRouter.get('/products', (req: Request, res: Response) => {
  let products = db.getProducts();

  const {
    category,
    subcategory,
    search,
    diameter,
    material,
    application,
    minPrice,
    maxPrice,
    inStock,
    featured,
    isNew,
    sort,
    page = '1',
    limit = '12',
  } = req.query;

  // Filter by category
  if (category && category !== 'all') {
    products = products.filter((p) => p.category.toLowerCase() === String(category).toLowerCase());
  }

  // Filter by subcategory
  if (subcategory && subcategory !== 'all') {
    products = products.filter((p) => p.subcategory?.toLowerCase() === String(subcategory).toLowerCase());
  }

  // Search
  if (search) {
    const q = String(search).toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        (p.diameter && p.diameter.toLowerCase().includes(q)) ||
        (p.application && p.application.toLowerCase().includes(q))
    );
  }

  // Diameter
  if (diameter) {
    const d = String(diameter).toLowerCase();
    products = products.filter(
      (p) =>
        (p.diameter && p.diameter.toLowerCase().includes(d)) ||
        p.variants.some((v) => v.diameter && v.diameter.toLowerCase().includes(d))
    );
  }

  // Material
  if (material) {
    const m = String(material).toLowerCase();
    products = products.filter((p) => p.material.toLowerCase().includes(m));
  }

  // Application
  if (application) {
    const a = String(application).toLowerCase();
    products = products.filter((p) => p.application && p.application.toLowerCase().includes(a));
  }

  // Price
  if (minPrice) {
    const min = parseFloat(String(minPrice));
    products = products.filter((p) => (p.salePrice ?? p.price ?? 0) >= min);
  }
  if (maxPrice) {
    const max = parseFloat(String(maxPrice));
    products = products.filter((p) => (p.salePrice ?? p.price ?? 0) <= max);
  }

  // In Stock
  if (inStock === 'true') {
    products = products.filter((p) => p.stock > 0);
  }

  // Featured / New
  if (featured === 'true') {
    products = products.filter((p) => p.isFeatured);
  }
  if (isNew === 'true') {
    products = products.filter((p) => p.isNew);
  }

  // Sort
  if (sort === 'price-asc') {
    products.sort((a, b) => (a.salePrice ?? a.price ?? 0) - (b.salePrice ?? b.price ?? 0));
  } else if (sort === 'price-desc') {
    products.sort((a, b) => (b.salePrice ?? b.price ?? 0) - (a.salePrice ?? a.price ?? 0));
  } else if (sort === 'newest') {
    products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else {
    // featured or default
    products.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  }

  const total = products.length;
  const pageNum = parseInt(String(page), 10) || 1;
  const limitNum = parseInt(String(limit), 10) || 12;
  const startIndex = (pageNum - 1) * limitNum;
  const paginated = products.slice(startIndex, startIndex + limitNum);

  res.json({
    products: paginated,
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum),
  });
});

apiRouter.get('/products/:slug', (req: Request, res: Response) => {
  const { slug } = req.params;
  const product = db.findProductBySlug(slug) || db.findProductById(slug);
  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  res.json(product);
});

apiRouter.get('/products/related/:slug', (req: Request, res: Response) => {
  const { slug } = req.params;
  const current = db.findProductBySlug(slug) || db.findProductById(slug);
  if (!current) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  const related = db
    .getProducts()
    .filter((p) => p.id !== current.id && p.category === current.category)
    .slice(0, 4);

  res.json(related);
});

// ==========================================
// 3. CATEGORIES
// ==========================================
apiRouter.get('/categories', (_req: Request, res: Response) => {
  const categories = db.getCategories();
  const allProducts = db.getProducts();

  const enriched = categories.map((cat) => ({
    ...cat,
    productCount: allProducts.filter((p) => p.category.toLowerCase() === cat.slug.toLowerCase()).length,
  }));

  res.json(enriched);
});

// ==========================================
// 4. ORDERS & CHECKOUT (CASH ON DELIVERY)
// ==========================================
apiRouter.post('/orders', optionalAuthenticate, (req: AuthRequest, res: Response) => {
  const {
    customerName,
    phone,
    email,
    address,
    area,
    city,
    postalCode,
    deliveryNotes,
    items,
  } = req.body;

  if (!customerName || !phone || !address || !items || !Array.isArray(items) || items.length === 0) {
    res.status(400).json({ error: 'Missing required order fields (name, phone, address, items)' });
    return;
  }

  let subtotal = 0;
  const validItems = [];

  for (const it of items) {
    const product = db.findProductById(it.productId);
    if (!product) continue;

    let price = product.salePrice ?? product.price ?? 0;
    let variantDetails = '';
    if (it.variantId) {
      const v = product.variants.find((vr) => vr.id === it.variantId);
      if (v) {
        if (v.price) price = v.price;
        variantDetails = [v.diameter, v.length, v.color].filter(Boolean).join(' / ');
      }
    }

    const qty = Math.max(1, parseInt(it.quantity, 10) || 1);
    subtotal += price * qty;

    validItems.push({
      productId: product.id,
      productName: product.name,
      sku: it.sku || product.sku,
      variantId: it.variantId,
      variantDetails: variantDetails || undefined,
      quantity: qty,
      price,
      image: product.images[0],
    });
  }

  if (validItems.length === 0) {
    res.status(400).json({ error: 'No valid products in cart' });
    return;
  }

  const deliveryFee = subtotal >= 15000 ? 0 : 350;
  const discount = 0;
  const total = subtotal + deliveryFee - discount;

  const orderNumber = `SH-ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const newOrder: IOrder = {
    id: `ord-${Date.now()}`,
    orderNumber,
    userId: req.user?.id,
    customerName: customerName.trim(),
    phone: phone.trim(),
    email: email ? email.trim() : (req.user?.email || ''),
    address: address.trim(),
    area: area ? area.trim() : undefined,
    city: city ? city.trim() : 'Multan',
    postalCode: postalCode ? postalCode.trim() : undefined,
    deliveryNotes: deliveryNotes ? deliveryNotes.trim() : undefined,
    items: validItems,
    subtotal,
    discount,
    deliveryFee,
    total,
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'Pending',
    orderStatus: 'Pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.createOrder(newOrder);

  res.status(201).json({
    message: 'Order placed successfully via Cash on Delivery',
    order: newOrder,
  });
});

apiRouter.get('/orders/my-orders', authenticate, (req: AuthRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const orders = db.getUserOrders(req.user.id);
  res.json(orders);
});

apiRouter.get('/orders/:id', optionalAuthenticate, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const order = db.findOrderById(id);
  if (!order) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }

  // Access check: admin or owner or matching phone
  if (req.user?.role === 'admin' || (req.user && order.userId === req.user.id)) {
    res.json(order);
    return;
  }

  // If accessed by tracking number, allow view
  res.json(order);
});

// ==========================================
// 5. QUOTATIONS (REQUEST A QUOTE)
// ==========================================
apiRouter.post('/quotations', (req: Request, res: Response) => {
  const {
    name,
    phone,
    email,
    company,
    product,
    productId,
    quantity,
    size,
    requiredDate,
    deliveryLocation,
    message,
  } = req.body;

  if (!name || !phone || !quantity || !deliveryLocation) {
    res.status(400).json({ error: 'Name, phone, quantity, and delivery location are required' });
    return;
  }

  const quoteNumber = `SH-RFQ-${Math.floor(1000 + Math.random() * 9000)}`;
  const newQuote: IQuotation = {
    id: `quote-${Date.now()}`,
    quoteNumber,
    name: name.trim(),
    phone: phone.trim(),
    email: email ? email.trim() : '',
    company: company ? company.trim() : undefined,
    productName: product ? product.trim() : undefined,
    productId: productId || undefined,
    quantity,
    size: size ? size.trim() : undefined,
    requiredDate: requiredDate || undefined,
    deliveryLocation: deliveryLocation.trim(),
    message: message ? message.trim() : undefined,
    status: 'New',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.createQuotation(newQuote);

  res.status(201).json({
    message: 'Quotation request submitted successfully. Our team will review specifications and contact you.',
    quotation: newQuote,
  });
});

// ==========================================
// 6. BULK ORDERS
// ==========================================
apiRouter.post('/bulk-orders', (req: Request, res: Response) => {
  const {
    name,
    company,
    phone,
    email,
    product,
    requiredQuantity,
    requiredSize,
    deliveryCity,
    message,
  } = req.body;

  if (!name || !phone || !product || !requiredQuantity || !requiredSize || !deliveryCity) {
    res.status(400).json({ error: 'Please fill in all required bulk supply fields' });
    return;
  }

  const bulkOrderNumber = `SH-BLK-${Math.floor(1000 + Math.random() * 9000)}`;
  const newBulk: IBulkOrder = {
    id: `bulk-${Date.now()}`,
    bulkOrderNumber,
    name: name.trim(),
    company: company ? company.trim() : undefined,
    phone: phone.trim(),
    email: email ? email.trim() : '',
    product: product.trim(),
    requiredQuantity,
    requiredSize: requiredSize.trim(),
    deliveryCity: deliveryCity.trim(),
    message: message ? message.trim() : undefined,
    status: 'New',
    createdAt: new Date().toISOString(),
  };

  db.createBulkOrder(newBulk);

  res.status(201).json({
    message: 'Bulk order inquiry logged. A commercial supply representative will call you shortly.',
    bulkOrder: newBulk,
  });
});

// ==========================================
// 7. REVIEWS (MODERATED)
// ==========================================
apiRouter.get('/reviews', (req: Request, res: Response) => {
  const { productId } = req.query;
  const reviews = db.getReviews(productId ? String(productId) : undefined, true);
  res.json(reviews);
});

apiRouter.post('/reviews', authenticate, (req: AuthRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  const { productId, rating, comment } = req.body;
  if (!productId || !rating || !comment) {
    res.status(400).json({ error: 'Product ID, rating (1-5), and feedback comment are required' });
    return;
  }

  const product = db.findProductById(productId);
  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }

  const newReview: IReview = {
    id: `rev-${Date.now()}`,
    productId,
    productName: product.name,
    userId: req.user.id,
    customerName: req.user.name,
    rating: Math.min(5, Math.max(1, parseInt(rating, 10))),
    comment: comment.trim(),
    isApproved: false, // Moderator approval required
    createdAt: new Date().toISOString(),
  };

  db.createReview(newReview);

  res.status(201).json({
    message: 'Review submitted! It will appear publicly after administrative moderation.',
    review: newReview,
  });
});

// ==========================================
// 8. WISHLIST
// ==========================================
apiRouter.get('/wishlist', authenticate, (req: AuthRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const productIds = db.getUserWishlist(req.user.id);
  const products = productIds
    .map((id) => db.findProductById(id))
    .filter((p): p is IProduct => p !== undefined);
  res.json(products);
});

apiRouter.post('/wishlist/toggle', authenticate, (req: AuthRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const { productId } = req.body;
  if (!productId) {
    res.status(400).json({ error: 'productId is required' });
    return;
  }
  const updatedIds = db.toggleWishlistItem(req.user.id, productId);
  res.json({
    wishlist: updatedIds,
    isSaved: updatedIds.includes(productId),
  });
});

// ==========================================
// 9. BLOG
// ==========================================
apiRouter.get('/blog', (_req: Request, res: Response) => {
  const posts = db.getBlogPosts(true);
  res.json(posts);
});

apiRouter.get('/blog/:slug', (req: Request, res: Response) => {
  const { slug } = req.params;
  const post = db.findBlogPostBySlug(slug);
  if (!post) {
    res.status(404).json({ error: 'Blog post not found' });
    return;
  }
  res.json(post);
});

// ==========================================
// 10. CONTACT FORM
// ==========================================
apiRouter.post('/contact', (req: Request, res: Response) => {
  const { name, phone, email, subject, message } = req.body;
  if (!name || !phone || !message) {
    res.status(400).json({ error: 'Name, phone, and message are required' });
    return;
  }

  const newMsg = db.createContactMessage({
    id: `msg-${Date.now()}`,
    name: name.trim(),
    phone: phone.trim(),
    email: email ? email.trim() : '',
    subject: subject ? subject.trim() : undefined,
    message: message.trim(),
    status: 'unread',
    createdAt: new Date().toISOString(),
  });

  res.status(201).json({
    message: 'Your message has been sent to Shaukat PVC Plastic Pipe Shop. We will respond promptly.',
    contactMessage: newMsg,
  });
});

// ==========================================
// 11. ADMIN DASHBOARD & CONTROLS
// ==========================================
apiRouter.get('/admin/dashboard', authenticate, requireAdmin, (_req: AuthRequest, res: Response) => {
  const products = db.getProducts();
  const orders = db.getOrders();
  const quotations = db.getQuotations();
  const bulkOrders = db.getBulkOrders();
  const reviews = db.getReviews(undefined, false);
  const messages = db.getContactMessages();
  const users = db.getUsers().filter((u) => u.role === 'customer');

  const totalRevenue = orders
    .filter((o) => o.orderStatus !== 'Cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = orders.filter((o) => o.orderStatus === 'Pending').length;
  const lowStockProducts = products.filter((p) => p.stock <= 10).length;
  const unreadMessages = messages.filter((m) => m.status === 'unread').length;
  const pendingReviews = reviews.filter((r) => !r.isApproved).length;

  res.json({
    stats: {
      totalProducts: products.length,
      totalOrders: orders.length,
      pendingOrders,
      totalCustomers: users.length,
      totalRevenue,
      totalQuotations: quotations.length,
      totalBulkOrders: bulkOrders.length,
      lowStockProducts,
      unreadMessages,
      pendingReviews,
    },
    recentOrders: orders.slice(0, 5),
    recentQuotations: quotations.slice(0, 5),
    lowStockList: products.filter((p) => p.stock <= 15).slice(0, 6),
  });
});

// Admin Product CRUD
apiRouter.post('/admin/products', authenticate, requireAdmin, (req: AuthRequest, res: Response) => {
  const {
    name,
    slug,
    category,
    subcategory,
    sku,
    price,
    salePrice,
    stock,
    shortDescription,
    description,
    material,
    diameter,
    length,
    color,
    application,
    pressureRating,
    brand,
    images,
    variants,
    technicalSpecifications,
    isNew,
    isFeatured,
    isSale,
  } = req.body;

  if (!name || !category || !sku) {
    res.status(400).json({ error: 'Name, category, and SKU are required' });
    return;
  }

  const generatedSlug = slug
    ? slug.toLowerCase().replace(/\s+/g, '-')
    : name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const newProd: IProduct = {
    id: `prod-${Date.now()}`,
    name: name.trim(),
    slug: generatedSlug,
    category: category.trim(),
    subcategory: subcategory ? subcategory.trim() : undefined,
    sku: sku.trim(),
    price: price ? parseFloat(price) : undefined,
    salePrice: salePrice ? parseFloat(salePrice) : undefined,
    stock: parseInt(stock, 10) || 0,
    shortDescription: shortDescription || '',
    description: description || '',
    material: material || 'PVC',
    diameter,
    length,
    color,
    application,
    pressureRating,
    brand,
    images: Array.isArray(images) && images.length > 0 ? images : ['https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=800&q=80'],
    variants: Array.isArray(variants) ? variants : [],
    technicalSpecifications: technicalSpecifications || {},
    isNew: Boolean(isNew),
    isFeatured: Boolean(isFeatured),
    isSale: Boolean(isSale),
    isDemo: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.createProduct(newProd);
  res.status(201).json(newProd);
});

apiRouter.put('/admin/products/:id', authenticate, requireAdmin, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const updated = db.updateProduct(id, req.body);
  if (!updated) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  res.json(updated);
});

apiRouter.delete('/admin/products/:id', authenticate, requireAdmin, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const deleted = db.deleteProduct(id);
  if (!deleted) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  res.json({ message: 'Product deleted' });
});

// Admin Inventory
apiRouter.get('/admin/inventory', authenticate, requireAdmin, (_req: AuthRequest, res: Response) => {
  const products = db.getProducts();
  const history = db.getInventoryHistory();
  res.json({
    inventory: products.map((p) => ({
      id: p.id,
      name: p.name,
      sku: p.sku,
      category: p.category,
      stock: p.stock,
      price: p.price,
      variantsCount: p.variants.length,
      status: p.stock > 10 ? 'In Stock' : p.stock > 0 ? 'Low Stock' : 'Out of Stock',
    })),
    history: history.slice(0, 20),
  });
});

apiRouter.post('/admin/inventory/adjust', authenticate, requireAdmin, (req: AuthRequest, res: Response) => {
  const { productId, newStock, reason } = req.body;
  if (!productId || newStock === undefined) {
    res.status(400).json({ error: 'productId and newStock are required' });
    return;
  }

  const updated = db.updateProduct(productId, { stock: parseInt(newStock, 10) });
  if (!updated) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }

  res.json({ message: 'Stock updated', product: updated });
});

// Admin Orders
apiRouter.get('/admin/orders', authenticate, requireAdmin, (_req: AuthRequest, res: Response) => {
  res.json(db.getOrders());
});

apiRouter.put('/admin/orders/:id/status', authenticate, requireAdmin, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const updated = db.updateOrderStatus(id, status);
  if (!updated) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }
  res.json(updated);
});

// Admin Quotations
apiRouter.get('/admin/quotations', authenticate, requireAdmin, (_req: AuthRequest, res: Response) => {
  res.json(db.getQuotations());
});

apiRouter.put('/admin/quotations/:id', authenticate, requireAdmin, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const updated = db.updateQuotation(id, req.body);
  if (!updated) {
    res.status(404).json({ error: 'Quotation not found' });
    return;
  }
  res.json(updated);
});

// Admin Bulk Orders
apiRouter.get('/admin/bulk-orders', authenticate, requireAdmin, (_req: AuthRequest, res: Response) => {
  res.json(db.getBulkOrders());
});

apiRouter.put('/admin/bulk-orders/:id', authenticate, requireAdmin, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const updated = db.updateBulkOrder(id, req.body);
  if (!updated) {
    res.status(404).json({ error: 'Bulk order not found' });
    return;
  }
  res.json(updated);
});

// Admin Customers
apiRouter.get('/admin/customers', authenticate, requireAdmin, (_req: AuthRequest, res: Response) => {
  const customers = db.getUsers().filter((u) => u.role === 'customer');
  const orders = db.getOrders();

  const data = customers.map((c) => {
    const userOrders = orders.filter((o) => o.userId === c.id);
    const spent = userOrders.reduce((sum, o) => sum + o.total, 0);
    return {
      id: c.id,
      name: c.name,
      email: c.email,
      phone: c.phone || 'N/A',
      orderCount: userOrders.length,
      totalSpent: spent,
      createdAt: c.createdAt,
    };
  });

  res.json(data);
});

// Admin Reviews
apiRouter.get('/admin/reviews', authenticate, requireAdmin, (_req: AuthRequest, res: Response) => {
  res.json(db.getReviews(undefined, false));
});

apiRouter.put('/admin/reviews/:id', authenticate, requireAdmin, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { isApproved } = req.body;
  const updated = db.updateReviewStatus(id, Boolean(isApproved));
  if (!updated) {
    res.status(404).json({ error: 'Review not found' });
    return;
  }
  res.json(updated);
});

apiRouter.delete('/admin/reviews/:id', authenticate, requireAdmin, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const deleted = db.deleteReview(id);
  if (!deleted) {
    res.status(404).json({ error: 'Review not found' });
    return;
  }
  res.json({ message: 'Review deleted' });
});

// Admin Contact Messages
apiRouter.get('/admin/messages', authenticate, requireAdmin, (_req: AuthRequest, res: Response) => {
  res.json(db.getContactMessages());
});

apiRouter.put('/admin/messages/:id', authenticate, requireAdmin, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const updated = db.updateContactMessage(id, status);
  if (!updated) {
    res.status(404).json({ error: 'Message not found' });
    return;
  }
  res.json(updated);
});

apiRouter.delete('/admin/messages/:id', authenticate, requireAdmin, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const deleted = db.deleteContactMessage(id);
  if (!deleted) {
    res.status(404).json({ error: 'Message not found' });
    return;
  }
  res.json({ message: 'Message deleted' });
});

// Admin Blog CRUD
apiRouter.get('/admin/blog', authenticate, requireAdmin, (_req: AuthRequest, res: Response) => {
  res.json(db.getBlogPosts(false));
});

apiRouter.post('/admin/blog', authenticate, requireAdmin, (req: AuthRequest, res: Response) => {
  const { title, slug, excerpt, content, category, tags, readTime, published } = req.body;
  if (!title || !content) {
    res.status(400).json({ error: 'Title and content are required' });
    return;
  }

  const generatedSlug = slug
    ? slug.toLowerCase().replace(/\s+/g, '-')
    : title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const newPost: IBlogPost = {
    id: `blog-${Date.now()}`,
    title: title.trim(),
    slug: generatedSlug,
    excerpt: excerpt || title.slice(0, 120),
    content,
    category: category || 'Plumbing Engineering',
    tags: Array.isArray(tags) ? tags : ['Plumbing', 'PVC'],
    author: req.user?.name || 'Technical Editor',
    published: published !== false,
    readTime: readTime || '5 min read',
    createdAt: new Date().toISOString(),
  };

  db.createBlogPost(newPost);
  res.status(201).json(newPost);
});

apiRouter.put('/admin/blog/:id', authenticate, requireAdmin, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const updated = db.updateBlogPost(id, req.body);
  if (!updated) {
    res.status(404).json({ error: 'Blog post not found' });
    return;
  }
  res.json(updated);
});

apiRouter.delete('/admin/blog/:id', authenticate, requireAdmin, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const deleted = db.deleteBlogPost(id);
  if (!deleted) {
    res.status(404).json({ error: 'Blog post not found' });
    return;
  }
  res.json({ message: 'Blog post deleted' });
});
