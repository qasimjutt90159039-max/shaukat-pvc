import React from 'react';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  FileText,
  Building2,
  Users,
  Star,
  Mail,
  BookOpen,
  ArrowLeft,
  ShieldCheck,
  Warehouse,
} from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { useAuth } from '../context/AuthContext';

interface AdminLayoutProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ currentTab, onTabChange, children }) => {
  const { navigate } = useRouter();
  const { user, isAdmin } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products Management', icon: Package },
    { id: 'inventory', label: 'Stock & Inventory', icon: Warehouse },
    { id: 'categories', label: 'Categories', icon: Layers },
    { id: 'orders', label: 'Customer Orders', icon: ShoppingBag },
    { id: 'quotations', label: 'Quote RFQs', icon: FileText },
    { id: 'bulk-orders', label: 'Bulk Inquiries', icon: Building2 },
    { id: 'customers', label: 'Customer Directory', icon: Users },
    { id: 'reviews', label: 'Review Moderation', icon: Star },
    { id: 'messages', label: 'Contact Messages', icon: Mail },
    { id: 'blog', label: 'Technical Blog', icon: BookOpen },
  ];

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#F4F8FA] flex items-center justify-center p-4">
        <div className="bg-white border border-slate-200 rounded p-8 max-w-md w-full text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="font-tech text-xl font-bold uppercase text-[#17212B]">
            Administrator Access Required
          </h1>
          <p className="text-xs text-slate-600">
            Please log in with the administrator account (<code className="bg-slate-100 px-1 py-0.5 rounded">admin@shaukatpvc.local</code> / <code className="bg-slate-100 px-1 py-0.5 rounded">admin123</code>).
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full py-2.5 bg-[#005B96] text-white text-xs font-bold uppercase rounded"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F8FA] flex flex-col">
      {/* Admin Top Header */}
      <header className="bg-[#17212B] text-white border-b-2 border-[#005B96] px-4 py-3 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
              title="Return to Public Storefront"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <span className="font-tech font-bold text-sm text-[#00A6A6] uppercase tracking-wider">
                SHAUKAT PVC ADMIN CONSOLE
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-xs text-slate-400 font-mono-spec">Multan Shop Operations</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono-spec">
            <span className="text-slate-400">Admin: <strong className="text-white">{user.name}</strong></span>
            <button
              onClick={() => navigate('/')}
              className="px-3 py-1 bg-[#005B96] hover:bg-[#004370] text-white rounded text-[11px] font-bold uppercase"
            >
              Storefront View
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 py-6 w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-3 bg-white border border-slate-200 rounded p-3 shadow-xs space-y-1 sticky top-16">
          <div className="px-3 py-2 text-[10px] font-mono-spec font-bold text-slate-400 uppercase tracking-widest">
            MANAGEMENT MODULES
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isSelected = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#005B96] text-white font-bold shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Content Body */}
        <main className="lg:col-span-9 bg-white border border-slate-200 rounded p-6 shadow-xs min-h-[600px]">
          {children}
        </main>
      </div>
    </div>
  );
};
