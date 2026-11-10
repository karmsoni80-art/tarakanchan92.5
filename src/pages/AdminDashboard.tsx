import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Package, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  Plus, 
  Edit, 
  Trash2, 
  Tag, 
  Settings, 
  AlertTriangle,
  ArrowRight,
  X,
  Lock,
  Search,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Product, Order, Coupon, ProductCategory, OrderStatus } from '../types';
import { formatINR } from '../utils/pricing';
import { api } from '../services/api';
import { useCartWishlist } from '../context/CartWishlistContext';

export const AdminDashboard: React.FC = () => {
  const { currentUser, isAdmin, login } = useAuth();
  const { showToast } = useCartWishlist();

  // Admin login state if not logged in as admin
  const [adminEmail, setAdminEmail] = useState('admin@tarakanchan.com');
  const [adminPassword, setAdminPassword] = useState('admin');
  const [loginLoading, setLoginLoading] = useState(false);

  // Tab state
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'coupons' | 'settings'>('overview');

  // Stats & Data
  const [stats, setStats] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  // Product modal
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [prodName, setProdName] = useState('');
  const [prodSku, setProdSku] = useState('');
  const [prodCategory, setProdCategory] = useState<ProductCategory>('Rings');
  const [prodPrice, setProdPrice] = useState(2999);
  const [prodOrigPrice, setProdOrigPrice] = useState(3999);
  const [prodWeight, setProdWeight] = useState(6.5);
  const [prodStock, setProdStock] = useState(15);
  const [prodImage, setProdImage] = useState('https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80');

  // Order status update modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>('Processing');
  const [trackingNumber, setTrackingNumber] = useState('');

  // Settings
  const [silverRate, setSilverRate] = useState('92.5 Pure Silver: ₹98.50 / gm');
  const [announcement, setAnnouncement] = useState('✨ Certified 92.5 Sterling Silver | Complimentary Velvet Gifting Box & Insured Shipping above ₹1,999');

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [statsData, prodsData, ordersData, couponsData, settingsData] = await Promise.all([
        api.getAdminStats(),
        api.getProducts(),
        api.getOrders(),
        api.getCoupons(),
        api.getSettings(),
      ]);
      setStats(statsData);
      setProducts(prodsData.products);
      setOrders(ordersData);
      setCoupons(couponsData);
      if (settingsData) {
        setSilverRate(settingsData.silverRateToday);
        setAnnouncement(settingsData.announcementText);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadAllAdminData();
    }
  }, [isAdmin]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      await login(adminEmail, adminPassword);
      showToast('Admin access granted', 'success');
    } catch (err: any) {
      showToast(err.message || 'Admin login failed', 'error');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        const updated = await api.updateProduct(editingProduct.id, {
          name: prodName,
          sku: prodSku,
          category: prodCategory,
          sellingPrice: Number(prodPrice),
          originalPrice: Number(prodOrigPrice),
          weightGrams: Number(prodWeight),
          stockCount: Number(prodStock),
          inStock: Number(prodStock) > 0,
          images: [prodImage, editingProduct.images[1] || prodImage],
        });
        setProducts(products.map((p) => (p.id === updated.id ? updated : p)));
        showToast(`Product ${updated.name} updated!`, 'success');
      } else {
        const created = await api.createProduct({
          name: prodName,
          sku: prodSku || `TK-NEW-${Date.now().toString().slice(-4)}`,
          category: prodCategory,
          collection: ['New Arrivals'],
          sellingPrice: Number(prodPrice),
          originalPrice: Number(prodOrigPrice),
          discount: Math.round(((prodOrigPrice - prodPrice) / prodOrigPrice) * 100),
          rating: 5.0,
          reviewCount: 1,
          weightGrams: Number(prodWeight),
          silverPurity: '92.5 Sterling Silver (BIS Hallmarked)',
          sizes: ['Standard / Adjustable'],
          inStock: Number(prodStock) > 0,
          stockCount: Number(prodStock),
          images: [prodImage],
          description: 'Handcrafted master jewel in 92.5 pure sterling silver with certificate.',
          specifications: {
            metal: '92.5 Sterling Silver',
            hallmark: 'BIS 925 Hallmarked',
            plating: 'Anti-Tarnish Rhodium',
            warranty: 'Lifetime Authenticity Certificate',
          },
          features: ['BIS Certified', 'Hypoallergenic'],
        });
        setProducts([created, ...products]);
        showToast(`Product ${created.name} added to live catalogue!`, 'success');
      }
      setIsProductModalOpen(false);
      setEditingProduct(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to save product', 'error');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to remove this piece from the catalogue?')) return;
    try {
      await api.deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
      showToast('Product removed from database', 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete product', 'error');
    }
  };

  const handleUpdateOrderStatus = async () => {
    if (!selectedOrder) return;
    try {
      const updated = await api.updateOrderStatus(selectedOrder.id, newStatus, trackingNumber);
      setOrders(orders.map((o) => (o.id === updated.id ? updated : o)));
      setSelectedOrder(null);
      showToast(`Order #${updated.orderNumber} status changed to ${newStatus}`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update order', 'error');
    }
  };

  // IF NOT LOGGED IN AS ADMIN: SECURE LOGIN SCREEN
  if (!isAdmin) {
    return (
      <div className="bg-[#3E2630] min-h-screen py-20 px-4 flex items-center justify-center text-[#F8F1F1]">
        <div className="bg-[#2B1921] border border-[#D4AF37] rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6">
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center mx-auto text-[#D4AF37] mb-3">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="font-playfair text-2xl font-bold text-white">
              TARAKANCHAN Admin Portal
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Protected staff and jeweller administrative command centre
            </p>
          </div>

          {/* Pre-filled credentials hint */}
          <div className="p-3 rounded-xl bg-[#6F4C57]/30 border border-[#D4AF37]/40 text-xs space-y-1">
            <p className="text-[#D4AF37] font-semibold">Demo Admin Credentials:</p>
            <p className="text-zinc-300">Email: <strong className="text-white">admin@tarakanchan.com</strong></p>
            <p className="text-zinc-300">Password: <strong className="text-white">admin</strong></p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-[#E8C7CC] mb-1 font-medium">Administrator Email</label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full bg-[#3E2630] border border-[#6F4C57] rounded-xl p-2.5 text-white"
              />
            </div>

            <div>
              <label className="block text-[#E8C7CC] mb-1 font-medium">Password</label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full bg-[#3E2630] border border-[#6F4C57] rounded-xl p-2.5 text-white"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3.5 rounded-xl bg-[#B76E79] hover:bg-[#C8A4A6] text-white font-medium tracking-wider shadow cursor-pointer transition"
            >
              {loginLoading ? 'Authenticating...' : 'Sign In as Administrator'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#3E2630] min-h-screen py-10 px-4 sm:px-6 lg:px-8 text-[#F8F1F1]">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#6F4C57]/60 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs text-[#D4AF37] font-semibold uppercase tracking-widest mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Master Administrative Console</span>
            </div>
            <h1 className="font-playfair text-3xl font-bold text-white tracking-wide">
              TARAKANCHAN 92.5 Store Management
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={loadAllAdminData}
              className="px-3 py-2 rounded-xl bg-[#6F4C57]/40 hover:bg-[#6F4C57] text-xs text-zinc-300 flex items-center space-x-1.5 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Data</span>
            </button>
            <span className="px-3 py-1.5 rounded-xl bg-[#D4AF37] text-[#3E2630] text-xs font-bold">
              Admin: {currentUser?.name}
            </span>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-[#6F4C57]/40 pb-3 text-xs">
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: TrendingUp },
            { id: 'products', label: `Catalogue Products (${products.length})`, icon: Package },
            { id: 'orders', label: `Customer Orders (${orders.length})`, icon: ShoppingBag },
            { id: 'coupons', label: `Coupons & Discounts (${coupons.length})`, icon: Tag },
            { id: 'settings', label: 'Store Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl font-medium flex items-center space-x-2 transition cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#B76E79] text-white shadow'
                    : 'bg-[#2B1921] text-zinc-300 hover:bg-[#6F4C57]/40'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* 4 Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl bg-[#2B1921] border border-[#6F4C57]/60 shadow-xl space-y-2">
                <span className="text-[11px] text-[#E8C7CC] font-medium uppercase tracking-wider">Gross Sales Revenue</span>
                <p className="font-playfair text-3xl font-extrabold text-[#D4AF37]">
                  {formatINR(stats?.totalRevenue || 0)}
                </p>
                <p className="text-[10px] text-emerald-400">↑ 18.4% growth this month</p>
              </div>

              <div className="p-6 rounded-2xl bg-[#2B1921] border border-[#6F4C57]/60 shadow-xl space-y-2">
                <span className="text-[11px] text-[#E8C7CC] font-medium uppercase tracking-wider">Total Customer Orders</span>
                <p className="font-playfair text-3xl font-extrabold text-white">
                  {stats?.totalOrders || orders.length}
                </p>
                <p className="text-[10px] text-zinc-400">100% BIS Hallmarked dispatches</p>
              </div>

              <div className="p-6 rounded-2xl bg-[#2B1921] border border-[#6F4C57]/60 shadow-xl space-y-2">
                <span className="text-[11px] text-[#E8C7CC] font-medium uppercase tracking-wider">Active Catalogue Pieces</span>
                <p className="font-playfair text-3xl font-extrabold text-white">
                  {stats?.totalProducts || products.length}
                </p>
                <p className="text-[10px] text-zinc-400">Across 8 Luxury Categories</p>
              </div>

              <div className="p-6 rounded-2xl bg-[#2B1921] border border-[#6F4C57]/60 shadow-xl space-y-2">
                <span className="text-[11px] text-[#E8C7CC] font-medium uppercase tracking-wider">Low Stock Alerts</span>
                <p className="font-playfair text-3xl font-extrabold text-amber-400">
                  {stats?.lowStockCount || 0}
                </p>
                <p className="text-[10px] text-amber-300">Requires atelier re-order</p>
              </div>
            </div>

            {/* Monthly Sales Revenue Chart */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#2B1921] border border-[#6F4C57]/60 shadow-xl space-y-4">
              <h3 className="font-playfair text-xl font-bold text-white">
                Monthly Silver Jewellery Sales Trend
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 pt-4">
                {(stats?.salesChart || []).map((mo: any, idx: number) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#3E2630]/60 border border-[#6F4C57]/40 text-center space-y-1">
                    <span className="text-[11px] text-zinc-400">{mo.month}</span>
                    <p className="font-playfair text-sm font-bold text-[#D4AF37]">{formatINR(mo.sales)}</p>
                    <span className="text-[10px] text-emerald-400">{mo.orders} Orders</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#2B1921] border border-[#6F4C57]/60 shadow-xl space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-playfair text-xl font-bold text-white">Recent Customer Acquisitions</h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-[#D4AF37] hover:underline"
                >
                  View All Orders →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-[#6F4C57]/40 text-[#E8C7CC]">
                    <tr>
                      <th className="py-2.5">Order No</th>
                      <th className="py-2.5">Patron</th>
                      <th className="py-2.5">Amount</th>
                      <th className="py-2.5">Payment</th>
                      <th className="py-2.5">Status</th>
                      <th className="py-2.5">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#6F4C57]/20">
                    {orders.slice(0, 5).map((o) => (
                      <tr key={o.id} className="hover:bg-[#6F4C57]/20">
                        <td className="py-3 font-mono font-bold text-white">{o.orderNumber}</td>
                        <td className="py-3">{o.customerName}</td>
                        <td className="py-3 font-bold text-[#D4AF37]">{formatINR(o.totalAmount)}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px]">
                            {o.paymentStatus}
                          </span>
                        </td>
                        <td className="py-3 font-medium text-white">{o.orderStatus}</td>
                        <td className="py-3">
                          <button
                            onClick={() => {
                              setSelectedOrder(o);
                              setNewStatus(o.orderStatus);
                              setTrackingNumber(o.trackingNumber || '');
                            }}
                            className="px-2.5 py-1 rounded bg-[#6F4C57] hover:bg-[#B76E79] text-white text-[11px]"
                          >
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-playfair text-xl font-bold text-white">Jewellery Inventory & Catalogue</h3>
                <p className="text-xs text-zinc-400">Add, edit, adjust prices and stock counts</p>
              </div>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setProdName('');
                  setProdSku(`TK-${Date.now().toString().slice(-4)}`);
                  setProdPrice(2999);
                  setProdOrigPrice(3999);
                  setProdWeight(6.5);
                  setProdStock(15);
                  setIsProductModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-[#B76E79] hover:bg-[#C8A4A6] text-white text-xs font-medium flex items-center space-x-1.5 shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Creation</span>
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-[#2B1921] border border-[#6F4C57]/60 shadow-xl overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-[#6F4C57]/40 text-[#E8C7CC]">
                  <tr>
                    <th className="py-3">Piece</th>
                    <th className="py-3">SKU</th>
                    <th className="py-3">Category</th>
                    <th className="py-3">Price</th>
                    <th className="py-3">Weight</th>
                    <th className="py-3">Stock</th>
                    <th className="py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#6F4C57]/20">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-[#6F4C57]/20">
                      <td className="py-3 flex items-center space-x-3">
                        <img src={p.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover" />
                        <span className="font-semibold text-white truncate max-w-xs">{p.name}</span>
                      </td>
                      <td className="py-3 font-mono text-zinc-400">{p.sku}</td>
                      <td className="py-3">{p.category}</td>
                      <td className="py-3 font-bold text-[#D4AF37]">{formatINR(p.sellingPrice)}</td>
                      <td className="py-3">{p.weightGrams}g</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          p.stockCount <= 5 ? 'bg-red-950 text-red-300' : 'bg-emerald-950 text-emerald-300'
                        }`}>
                          {p.stockCount} in stock
                        </span>
                      </td>
                      <td className="py-3 text-right space-x-2">
                        <button
                          onClick={() => {
                            setEditingProduct(p);
                            setProdName(p.name);
                            setProdSku(p.sku);
                            setProdCategory(p.category);
                            setProdPrice(p.sellingPrice);
                            setProdOrigPrice(p.originalPrice);
                            setProdWeight(p.weightGrams);
                            setProdStock(p.stockCount);
                            setProdImage(p.images[0]);
                            setIsProductModalOpen(true);
                          }}
                          className="p-1.5 rounded bg-[#6F4C57]/50 hover:bg-[#6F4C57] text-[#D4AF37]"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 rounded bg-red-950/60 hover:bg-red-900 text-red-300"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h3 className="font-playfair text-xl font-bold text-white">Full Customer Orders Register</h3>

            <div className="p-6 rounded-2xl bg-[#2B1921] border border-[#6F4C57]/60 shadow-xl overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-[#6F4C57]/40 text-[#E8C7CC]">
                  <tr>
                    <th className="py-3">Order #</th>
                    <th className="py-3">Date</th>
                    <th className="py-3">Customer</th>
                    <th className="py-3">Items</th>
                    <th className="py-3">Total</th>
                    <th className="py-3">Status</th>
                    <th className="py-3">Courier AWB</th>
                    <th className="py-3 text-right">Update</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#6F4C57]/20">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-[#6F4C57]/20">
                      <td className="py-3 font-mono font-bold text-white">{o.orderNumber}</td>
                      <td className="py-3 text-zinc-400">{new Date(o.createdAt).toLocaleDateString()}</td>
                      <td className="py-3">
                        <p className="font-medium text-white">{o.customerName}</p>
                        <p className="text-[10px] text-zinc-400">{o.customerPhone}</p>
                      </td>
                      <td className="py-3">{o.items.length} jewels</td>
                      <td className="py-3 font-bold text-[#D4AF37]">{formatINR(o.totalAmount)}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-[#6F4C57] font-semibold text-white">
                          {o.orderStatus}
                        </span>
                      </td>
                      <td className="py-3 font-mono text-[11px] text-zinc-300">{o.trackingNumber || 'Unassigned'}</td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => {
                            setSelectedOrder(o);
                            setNewStatus(o.orderStatus);
                            setTrackingNumber(o.trackingNumber || '');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[#B76E79] hover:bg-[#C8A4A6] text-white text-xs font-medium"
                        >
                          Change Status
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: COUPONS */}
        {activeTab === 'coupons' && (
          <div className="space-y-6">
            <h3 className="font-playfair text-xl font-bold text-white">Active Promotional Coupons</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {coupons.map((c) => (
                <div key={c.code} className="p-4 rounded-xl bg-[#2B1921] border border-[#D4AF37]/40 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-sm text-[#D4AF37]">{c.code}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px]">
                      {c.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                  <p className="text-zinc-300 font-light">{c.description}</p>
                  <p className="text-[11px] text-zinc-400">Min Order: {formatINR(c.minOrderAmount)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#2B1921] border border-[#6F4C57]/60 max-w-xl space-y-4 text-xs">
            <h3 className="font-playfair text-xl font-bold text-white border-b border-[#6F4C57]/40 pb-3">
              Store & Silver Rate Configuration
            </h3>

            <div>
              <label className="block text-[#E8C7CC] mb-1">Today's Silver Rate Ticker</label>
              <input
                type="text"
                value={silverRate}
                onChange={(e) => setSilverRate(e.target.value)}
                className="w-full bg-[#3E2630] border border-[#6F4C57] rounded-xl p-2.5 text-white"
              />
            </div>

            <div>
              <label className="block text-[#E8C7CC] mb-1">Announcement Bar Message</label>
              <textarea
                rows={3}
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
                className="w-full bg-[#3E2630] border border-[#6F4C57] rounded-xl p-2.5 text-white"
              />
            </div>

            <button
              onClick={() => showToast('Store settings updated!', 'success')}
              className="py-3 px-6 rounded-xl bg-[#B76E79] text-white font-medium shadow"
            >
              Save Configuration
            </button>
          </div>
        )}
      </div>

      {/* Product Add/Edit Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="bg-[#2B1921] border border-[#D4AF37] rounded-3xl max-w-lg w-full p-6 text-[#F8F1F1] space-y-4 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center border-b border-[#6F4C57]/60 pb-3">
              <h3 className="font-playfair text-xl font-bold">
                {editingProduct ? 'Edit Silver Creation' : 'Add New Silver Creation'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)}>
                <X className="w-5 h-5 text-zinc-300" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#E8C7CC] mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="e.g. Royal Solitaire Sterling Band"
                  className="w-full bg-[#3E2630] border border-[#6F4C57] rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#E8C7CC] mb-1">Category</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value as any)}
                    className="w-full bg-[#3E2630] border border-[#6F4C57] rounded-xl p-2.5 text-white"
                  >
                    {['Rings', 'Earrings', 'Necklaces', 'Bracelets', 'Anklets', 'Pendants', 'Chains', 'Gift Sets'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[#E8C7CC] mb-1">SKU</label>
                  <input
                    type="text"
                    required
                    value={prodSku}
                    onChange={(e) => setProdSku(e.target.value)}
                    className="w-full bg-[#3E2630] border border-[#6F4C57] rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#E8C7CC] mb-1">Selling Price (INR ₹)</label>
                  <input
                    type="number"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(Number(e.target.value))}
                    className="w-full bg-[#3E2630] border border-[#6F4C57] rounded-xl p-2.5 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[#E8C7CC] mb-1">Original Price (INR ₹)</label>
                  <input
                    type="number"
                    required
                    value={prodOrigPrice}
                    onChange={(e) => setProdOrigPrice(Number(e.target.value))}
                    className="w-full bg-[#3E2630] border border-[#6F4C57] rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#E8C7CC] mb-1">Gross Weight (grams)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={prodWeight}
                    onChange={(e) => setProdWeight(Number(e.target.value))}
                    className="w-full bg-[#3E2630] border border-[#6F4C57] rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[#E8C7CC] mb-1">Stock Count</label>
                  <input
                    type="number"
                    required
                    value={prodStock}
                    onChange={(e) => setProdStock(Number(e.target.value))}
                    className="w-full bg-[#3E2630] border border-[#6F4C57] rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#E8C7CC] mb-1">Primary Image URL</label>
                <input
                  type="url"
                  required
                  value={prodImage}
                  onChange={(e) => setProdImage(e.target.value)}
                  className="w-full bg-[#3E2630] border border-[#6F4C57] rounded-xl p-2.5 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#B76E79] hover:bg-[#C8A4A6] text-white font-bold tracking-wider shadow mt-4"
              >
                {editingProduct ? 'Save Product Changes' : 'Publish Product to Live Catalogue'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Order Status Update Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="bg-[#2B1921] border border-[#D4AF37] rounded-3xl max-w-md w-full p-6 text-[#F8F1F1] space-y-4">
            <div className="flex justify-between items-center border-b border-[#6F4C57]/60 pb-3">
              <h3 className="font-playfair text-xl font-bold">Manage Order #{selectedOrder.orderNumber}</h3>
              <button onClick={() => setSelectedOrder(null)}>✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-zinc-300">Customer: <strong className="text-white">{selectedOrder.customerName}</strong></p>
              <p className="text-zinc-300">Total: <strong className="text-[#D4AF37]">{formatINR(selectedOrder.totalAmount)}</strong></p>

              <div>
                <label className="block text-[#E8C7CC] mb-1 font-semibold">Change Dispatch Stage</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full bg-[#3E2630] border border-[#6F4C57] rounded-xl p-2.5 text-white"
                >
                  {['Pending', 'Confirmed', 'Processing', 'Dispatched', 'Out for Delivery', 'Delivered', 'Cancelled'].map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#E8C7CC] mb-1 font-semibold">BlueDart Courier Tracking Number (AWB)</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. BLUDART-TK-992144"
                  className="w-full bg-[#3E2630] border border-[#6F4C57] rounded-xl p-2.5 text-white font-mono"
                />
              </div>

              <button
                onClick={handleUpdateOrderStatus}
                className="w-full py-3 rounded-xl bg-[#B76E79] hover:bg-[#C8A4A6] text-white font-bold"
              >
                Update Status & Notify Patron
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
