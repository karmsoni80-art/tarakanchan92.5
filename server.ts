import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { db } from './src/server/db';
import { estimateDelivery, validateCoupon } from './src/utils/pricing';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // Request logger for API calls
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      console.log(`[API] ${req.method} ${req.path}`);
    }
    next();
  });

  // --- API Endpoints ---

  // 1. Products
  app.get('/api/products', (req: Request, res: Response) => {
    try {
      let products = db.getProducts();
      const { category, collection, minPrice, maxPrice, rating, sort, search, inStock } = req.query;

      if (category && category !== 'All') {
        products = products.filter((p) => p.category.toLowerCase() === String(category).toLowerCase());
      }

      if (collection && collection !== 'All') {
        products = products.filter((p) => p.collection.some((c) => c.toLowerCase() === String(collection).toLowerCase()));
      }

      if (minPrice) {
        products = products.filter((p) => p.sellingPrice >= Number(minPrice));
      }

      if (maxPrice) {
        products = products.filter((p) => p.sellingPrice <= Number(maxPrice));
      }

      if (rating) {
        products = products.filter((p) => p.rating >= Number(rating));
      }

      if (inStock === 'true') {
        products = products.filter((p) => p.inStock);
      }

      if (search) {
        const query = String(search).toLowerCase().trim();
        products = products.filter(
          (p) =>
            p.name.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query) ||
            p.sku.toLowerCase().includes(query) ||
            p.collection.some((c) => c.toLowerCase().includes(query))
        );
      }

      // Sorting
      if (sort === 'price-low') {
        products.sort((a, b) => a.sellingPrice - b.sellingPrice);
      } else if (sort === 'price-high') {
        products.sort((a, b) => b.sellingPrice - a.sellingPrice);
      } else if (sort === 'rating') {
        products.sort((a, b) => b.rating - a.rating);
      } else if (sort === 'newest') {
        products.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
      } else {
        // default: featured first
        products.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
      }

      res.json({ success: true, count: products.length, products });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.get('/api/products/:id', (req: Request, res: Response) => {
    const product = db.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    // Also include related products from same category
    const related = db.getProducts()
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 4);

    res.json({ success: true, product, related });
  });

  app.post('/api/products', (req: Request, res: Response) => {
    try {
      const newProd = db.createProduct(req.body);
      res.status(201).json({ success: true, product: newProd });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  app.put('/api/products/:id', (req: Request, res: Response) => {
    try {
      const updated = db.updateProduct(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }
      res.json({ success: true, product: updated });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  app.delete('/api/products/:id', (req: Request, res: Response) => {
    const deleted = db.deleteProduct(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted' });
  });

  // 2. Categories
  app.get('/api/categories', (req: Request, res: Response) => {
    res.json({ success: true, categories: db.getCategories() });
  });

  // 3. Coupons
  app.get('/api/coupons', (req: Request, res: Response) => {
    res.json({ success: true, coupons: db.getCoupons() });
  });

  app.post('/api/coupons/validate', (req: Request, res: Response) => {
    const { code, subtotal } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, error: 'Coupon code is required' });
    }
    const result = validateCoupon(code, Number(subtotal) || 0, db.getCoupons());
    if (!result.valid) {
      return res.status(400).json({ success: false, error: result.error });
    }
    res.json({ success: true, coupon: result.coupon });
  });

  app.post('/api/coupons', (req: Request, res: Response) => {
    const saved = db.saveCoupon(req.body);
    res.json({ success: true, coupon: saved });
  });

  // 4. Cart & Wishlist persistence
  app.get('/api/cart', (req: Request, res: Response) => {
    const sessionKey = String(req.query.sessionKey || 'guest');
    res.json({ success: true, items: db.getCart(sessionKey) });
  });

  app.post('/api/cart', (req: Request, res: Response) => {
    const { sessionKey, items } = req.body;
    const saved = db.saveCart(String(sessionKey || 'guest'), items || []);
    res.json({ success: true, items: saved });
  });

  app.get('/api/wishlist', (req: Request, res: Response) => {
    const sessionKey = String(req.query.sessionKey || 'guest');
    const wishlistIds = db.getWishlist(sessionKey);
    const allProducts = db.getProducts();
    const products = allProducts.filter((p) => wishlistIds.includes(p.id));
    res.json({ success: true, wishlist: wishlistIds, products });
  });

  app.post('/api/wishlist/toggle', (req: Request, res: Response) => {
    const { sessionKey, productId } = req.body;
    if (!productId) return res.status(400).json({ success: false, error: 'productId required' });
    const result = db.toggleWishlist(String(sessionKey || 'guest'), productId);
    res.json({ success: true, ...result });
  });

  // 5. Auth
  app.post('/api/auth/register', (req: Request, res: Response) => {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Name, email, and password are required' });
    }
    const existing = db.getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ success: false, error: 'An account with this email already exists' });
    }

    const newUser = db.createUser({
      name,
      email,
      phone: phone || '',
      role: 'customer',
      addresses: [],
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to TARAKANCHAN.',
      user: newUser,
      token: `tk_token_${newUser.id}`,
    });
  });

  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    // Admin demo account check
    if (email.toLowerCase() === 'admin@tarakanchan.com') {
      const admin = db.getUserByEmail('admin@tarakanchan.com');
      return res.json({
        success: true,
        message: 'Admin access granted.',
        user: admin,
        token: 'tk_token_admin_super',
      });
    }

    const user = db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    res.json({
      success: true,
      message: 'Login successful',
      user,
      token: `tk_token_${user.id}`,
    });
  });

  app.post('/api/auth/forgot-password', (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }
    // Generate simulated 6-digit OTP
    const mockOtp = '925001';
    res.json({
      success: true,
      message: `A verification OTP has been sent to ${email}. (Test Demo OTP: ${mockOtp})`,
      demoOtp: mockOtp,
    });
  });

  app.post('/api/auth/verify-otp', (req: Request, res: Response) => {
    const { otp } = req.body;
    if (otp === '925001' || otp?.length === 6) {
      return res.json({ success: true, message: 'OTP verified successfully.' });
    }
    res.status(400).json({ success: false, error: 'Invalid verification code. Please enter 925001.' });
  });

  app.post('/api/auth/reset-password', (req: Request, res: Response) => {
    const { email, newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters' });
    }
    res.json({ success: true, message: 'Password has been reset successfully. Please log in.' });
  });

  app.get('/api/auth/me', (req: Request, res: Response) => {
    const userId = req.headers['x-user-id'] as string;
    if (!userId) {
      return res.json({ success: true, user: null });
    }
    const user = db.getUserById(userId);
    res.json({ success: true, user: user || null });
  });

  // 6. Orders & Razorpay Checkout Integration
  app.post('/api/razorpay/create-order', (req: Request, res: Response) => {
    const { amount, currency = 'INR', receipt } = req.body;
    if (!amount) return res.status(400).json({ success: false, error: 'Amount required' });

    // Official Razorpay test mode order simulation
    const testOrderId = `order_tk_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    res.json({
      success: true,
      orderId: testOrderId,
      amount,
      currency,
      keyId: db.getSettings().razorpayKeyId,
      receipt: receipt || `receipt_${Date.now()}`,
      mode: 'TEST_MODE',
      instructions: 'Razorpay Test Gateway activated. Any test card (e.g. 4111...) or test UPI (success@razorpay) will process successfully.',
    });
  });

  app.post('/api/orders', (req: Request, res: Response) => {
    try {
      const orderData = req.body;
      if (!orderData.items || orderData.items.length === 0) {
        return res.status(400).json({ success: false, error: 'Order must contain at least one item' });
      }
      if (!orderData.shippingAddress || !orderData.customerName) {
        return res.status(400).json({ success: false, error: 'Shipping details and customer name are required' });
      }

      const createdOrder = db.createOrder(orderData);
      res.status(201).json({
        success: true,
        message: 'Order placed successfully! 92.5 Hallmark Certificate and tracking details generated.',
        order: createdOrder,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.get('/api/orders', (req: Request, res: Response) => {
    const { userId, email } = req.query;
    const orders = db.getOrders(String(userId || email || ''));
    res.json({ success: true, orders });
  });

  app.get('/api/orders/:id', (req: Request, res: Response) => {
    const order = db.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    res.json({ success: true, order });
  });

  // 7. Pincode delivery checker
  app.get('/api/pincode/:code', (req: Request, res: Response) => {
    const result = estimateDelivery(req.params.code);
    res.json({ success: true, result });
  });

  // 8. Reviews
  app.get('/api/reviews', (req: Request, res: Response) => {
    const { productId } = req.query;
    const reviews = db.getReviews(productId ? String(productId) : undefined);
    res.json({ success: true, reviews });
  });

  app.post('/api/reviews', (req: Request, res: Response) => {
    try {
      const review = db.addReview(req.body);
      res.status(201).json({ success: true, review });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  // 9. Newsletter
  app.post('/api/newsletter', (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, error: 'Valid email address is required' });
    }
    const result = db.addSubscriber(email);
    res.json(result);
  });

  // 10. Admin Endpoints
  app.get('/api/admin/stats', (req: Request, res: Response) => {
    res.json({ success: true, stats: db.getAdminStats() });
  });

  app.get('/api/admin/orders', (req: Request, res: Response) => {
    res.json({ success: true, orders: db.getOrders() });
  });

  app.put('/api/admin/orders/:id/status', (req: Request, res: Response) => {
    const { status, trackingNumber } = req.body;
    const updated = db.updateOrderStatus(req.params.id, status, trackingNumber);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    res.json({ success: true, order: updated });
  });

  // 11. Settings
  app.get('/api/settings', (req: Request, res: Response) => {
    res.json({ success: true, settings: db.getSettings() });
  });

  app.put('/api/admin/settings', (req: Request, res: Response) => {
    const updated = db.updateSettings(req.body);
    res.json({ success: true, settings: updated });
  });

  // --- Vite Dev & Production Integration ---
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`✨ TARAKANCHAN 92.5 Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
