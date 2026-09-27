import React, { useState } from 'react';
import { RouterProvider, useRouter } from './context/RouterContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// Components
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FloatingShopContact } from './components/FloatingShopContact';

// Pages
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetails } from './pages/ProductDetails';
import { BulkOrders } from './pages/BulkOrders';
import { RequestQuote } from './pages/RequestQuote';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Wishlist } from './pages/Wishlist';
import { Projects } from './pages/Projects';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { FAQ } from './pages/FAQ';
import { Blog } from './pages/Blog';
import { BlogDetails } from './pages/BlogDetails';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Account } from './pages/Account';

// Admin
import { AdminLayout } from './admin/AdminLayout';
import { AdminDashboard } from './admin/AdminDashboard';
import { AdminProducts } from './admin/AdminProducts';
import { AdminInventory } from './admin/AdminInventory';
import { AdminCategories } from './admin/AdminCategories';
import { AdminOrders } from './admin/AdminOrders';
import { AdminQuotations } from './admin/AdminQuotations';
import { AdminBulkOrders } from './admin/AdminBulkOrders';
import { AdminCustomers } from './admin/AdminCustomers';
import { AdminReviews } from './admin/AdminReviews';
import { AdminMessages } from './admin/AdminMessages';
import { AdminBlog } from './admin/AdminBlog';

const AppContent: React.FC = () => {
  const { path } = useRouter();
  const [adminTab, setAdminTab] = useState<string>('dashboard');

  // Handle Admin Routing
  if (path.startsWith('/admin')) {
    return (
      <AdminLayout currentTab={adminTab} onTabChange={(tab) => setAdminTab(tab)}>
        {adminTab === 'dashboard' && <AdminDashboard onNavigateTab={(t) => setAdminTab(t)} />}
        {adminTab === 'products' && <AdminProducts />}
        {adminTab === 'inventory' && <AdminInventory />}
        {adminTab === 'categories' && <AdminCategories />}
        {adminTab === 'orders' && <AdminOrders />}
        {adminTab === 'quotations' && <AdminQuotations />}
        {adminTab === 'bulk-orders' && <AdminBulkOrders />}
        {adminTab === 'customers' && <AdminCustomers />}
        {adminTab === 'reviews' && <AdminReviews />}
        {adminTab === 'messages' && <AdminMessages />}
        {adminTab === 'blog' && <AdminBlog />}
      </AdminLayout>
    );
  }

  // Handle Public Routing
  const renderPublicPage = () => {
    // 1. Home
    if (path === '/' || path === '') {
      return <Home />;
    }

    // 2. Shop & Direct Category Shortcuts
    if (path === '/shop') {
      return <Shop />;
    }
    if (path === '/pvc-pipes') {
      return <Shop fixedCategory="pvc-pipes" categoryTitle="PVC Water & Pressure Pipes" />;
    }
    if (path === '/pipe-fittings') {
      return <Shop fixedCategory="pipe-fittings" categoryTitle="Precision Pipe Fittings" />;
    }
    if (path === '/plumbing' || path === '/accessories') {
      return <Shop fixedCategory="plumbing" categoryTitle="Plumbing Supplies & Accessories" />;
    }
    if (path === '/drainage') {
      return <Shop fixedCategory="drainage" categoryTitle="Sanitary Drainage Systems" />;
    }
    if (path === '/valves') {
      return <Shop fixedCategory="valves" categoryTitle="Plumbing & Industrial Valves" />;
    }
    if (path === '/water-supply') {
      return <Shop fixedCategory="pvc-pipes" categoryTitle="Potable Water Supply Pipes" />;
    }
    if (path === '/connectors') {
      return <Shop fixedCategory="pipe-fittings" categoryTitle="Plumbing Connectors & Adapters" />;
    }

    // 3. Product Details
    if (path.startsWith('/product/')) {
      const slug = path.replace('/product/', '');
      return <ProductDetails slug={slug} />;
    }

    // 4. Procurement & Quotations
    if (path === '/bulk-orders') {
      return <BulkOrders />;
    }
    if (path === '/request-quote') {
      return <RequestQuote />;
    }

    // 5. Commerce flows
    if (path === '/cart') {
      return <Cart />;
    }
    if (path === '/checkout') {
      return <Checkout />;
    }
    if (path === '/wishlist') {
      return <Wishlist />;
    }

    // 6. Educational & Company Information
    if (path === '/projects') {
      return <Projects />;
    }
    if (path === '/about') {
      return <About />;
    }
    if (path === '/contact') {
      return <Contact />;
    }
    if (path === '/faq') {
      return <FAQ />;
    }
    if (path === '/blog') {
      return <Blog />;
    }
    if (path.startsWith('/blog/')) {
      const slug = path.replace('/blog/', '');
      return <BlogDetails slug={slug} />;
    }

    // 7. Customer Auth & Account
    if (path === '/login') {
      return <Login />;
    }
    if (path === '/register') {
      return <Register />;
    }
    if (path.startsWith('/account') || path === '/my-orders' || path.startsWith('/order-details')) {
      return <Account />;
    }

    // Fallback: 404
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
        <h1 className="font-tech text-3xl font-bold uppercase text-[#17212B] mb-2">
          Page Not Found (404)
        </h1>
        <p className="text-xs text-slate-500 max-w-sm mb-6">
          The requested page URL was not located in Shaukat PVC Plastic Pipe Shop directory.
        </p>
        <a
          href="/"
          className="px-6 py-2.5 bg-[#005B96] text-white text-xs font-bold uppercase rounded"
        >
          Return to Home
        </a>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1">{renderPublicPage()}</div>
      <FloatingShopContact />
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <RouterProvider>
            <AppContent />
          </RouterProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
