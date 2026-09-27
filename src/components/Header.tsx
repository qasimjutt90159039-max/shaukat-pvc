import React, { useState } from 'react';
import {
  Phone,
  MapPin,
  Search,
  Heart,
  ShoppingCart,
  User,
  Menu,
  X,
  FileText,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

export const Header: React.FC = () => {
  const { path, navigate } = useRouter();
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAdmin, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'PVC Pipes', href: '/pvc-pipes' },
    { label: 'Fittings', href: '/pipe-fittings' },
    { label: 'Plumbing', href: '/plumbing' },
    { label: 'Drainage', href: '/drainage' },
    { label: 'Valves', href: '/valves' },
    { label: 'Bulk Orders', href: '/bulk-orders' },
    { label: 'Request Quote', href: '/request-quote' },
    { label: 'Projects', href: '/projects' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Blog', href: '/blog' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      {/* Top Announcement Bar */}
      <div className="bg-[#17212B] text-slate-300 text-xs px-4 py-2 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-white tracking-wide uppercase">
              Shaukat PVC Plastic Pipe Shop | Multan
            </span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:flex items-center gap-1 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-[#00A6A6]" />
              17-A Hassan Parnana Colony, Multan, Punjab, Pakistan
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="tel:+92614540198"
              className="flex items-center gap-1.5 text-white hover:text-[#00A6A6] transition-colors font-mono-spec"
            >
              <Phone className="w-3.5 h-3.5 text-[#00A6A6]" />
              +92-61-4540198
            </a>
            <span className="text-slate-600">|</span>
            {isAdmin && (
              <button
                onClick={() => navigate('/admin')}
                className="text-[#F5A623] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin Panel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded bg-[#005B96] text-white flex items-center justify-center font-tech font-bold text-xl tracking-wider shadow-inner group-hover:bg-[#004370] transition-colors border border-[#004370]">
            SP
          </div>
          <div>
            <span className="block font-tech text-base md:text-lg font-bold text-[#17212B] tracking-tight leading-none">
              SHAUKAT PVC PLASTIC PIPE SHOP
            </span>
            <span className="text-[11px] text-slate-500 uppercase tracking-widest font-mono-spec font-medium">
              PVC · Fittings · Plumbing Supplies
            </span>
          </div>
        </div>

        {/* Search Bar (Desktop) */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden lg:flex items-center flex-1 max-w-md mx-6"
        >
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search PVC pipes, fittings, valves, SKU (e.g. uPVC, 1 inch)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F4F8FA] border border-slate-300 rounded px-3.5 py-2 pl-9 text-xs text-[#17212B] placeholder-slate-400 focus:outline-none focus:border-[#005B96] focus:ring-1 focus:ring-[#005B96] transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
          <button
            type="submit"
            className="ml-2 px-3.5 py-2 bg-[#005B96] hover:bg-[#004370] text-white text-xs font-semibold rounded transition-colors cursor-pointer"
          >
            Search
          </button>
        </form>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Wishlist */}
          <button
            onClick={() => navigate('/wishlist')}
            aria-label="Wishlist"
            className="relative p-2 text-slate-700 hover:text-[#005B96] hover:bg-slate-100 rounded transition-colors cursor-pointer"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#005B96] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart */}
          <button
            onClick={() => navigate('/cart')}
            aria-label="Shopping Cart"
            className="relative p-2 text-slate-700 hover:text-[#005B96] hover:bg-slate-100 rounded transition-colors cursor-pointer"
          >
            <ShoppingCart className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#F5A623] text-[#17212B] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>

          {/* Account Menu */}
          <div className="relative">
            <button
              onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
              className="flex items-center gap-1.5 p-2 text-slate-700 hover:text-[#005B96] hover:bg-slate-100 rounded transition-colors cursor-pointer text-xs font-medium"
            >
              <User className="w-5 h-5" />
              <span className="hidden xl:inline">
                {user ? user.name.split(' ')[0] : 'Account'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden xl:inline" />
            </button>

            {accountDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded shadow-lg py-1.5 z-50 text-xs"
                onMouseLeave={() => setAccountDropdownOpen(false)}
              >
                {user ? (
                  <>
                    <div className="px-3.5 py-2 border-b border-slate-100">
                      <p className="font-semibold text-slate-800 truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        navigate('/account');
                        setAccountDropdownOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-slate-700"
                    >
                      My Account & Orders
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => {
                          navigate('/admin');
                          setAccountDropdownOpen(false);
                        }}
                        className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-[#005B96] font-semibold"
                      >
                        Admin Dashboard
                      </button>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setAccountDropdownOpen(false);
                        navigate('/');
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-red-50 text-red-600 border-t border-slate-100"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        navigate('/login');
                        setAccountDropdownOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-slate-800 font-medium"
                    >
                      Customer Login
                    </button>
                    <button
                      onClick={() => {
                        navigate('/register');
                        setAccountDropdownOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-slate-600"
                    >
                      Create Account
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Primary CTA: REQUEST A QUOTE */}
          <button
            onClick={() => navigate('/request-quote')}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 bg-[#F5A623] hover:bg-[#e09419] text-[#17212B] text-xs font-bold uppercase tracking-wider rounded transition-colors shadow-sm cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>REQUEST A QUOTE</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Desktop Navigation Links */}
      <nav className="hidden lg:block bg-[#005B96] text-white">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between overflow-x-auto scrollbar-none">
          <div className="flex items-center">
            {navLinks.map((link) => {
              const isActive = path === link.href;
              return (
                <button
                  key={link.href}
                  onClick={() => navigate(link.href)}
                  className={`px-3 py-2.5 text-xs font-semibold tracking-wide transition-colors whitespace-nowrap cursor-pointer uppercase ${
                    isActive
                      ? 'bg-[#004370] text-[#F5A623] border-b-2 border-[#F5A623]'
                      : 'text-white hover:bg-[#004370]/60 hover:text-slate-100'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2 pl-4 text-xs font-mono-spec text-cyan-200">
            <span>Direct Delivery: Multan & Surroundings</span>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search PVC products & fittings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-[#F4F8FA] border border-slate-300 rounded px-3 py-2 text-xs"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-[#005B96] text-white text-xs font-semibold rounded"
            >
              Search
            </button>
          </form>

          {/* Links */}
          <div className="grid grid-cols-2 gap-1 pt-2 border-t border-slate-100">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => {
                  navigate(link.href);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 rounded text-xs font-medium ${
                  path === link.href
                    ? 'bg-[#005B96] text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                navigate('/request-quote');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 bg-[#F5A623] text-[#17212B] text-xs font-bold uppercase rounded text-center"
            >
              REQUEST A QUOTE
            </button>
            <a
              href="tel:+92614540198"
              className="w-full py-2 bg-[#005B96] text-white text-xs font-semibold rounded text-center flex items-center justify-center gap-2"
            >
              <Phone className="w-3.5 h-3.5" /> Call Shop: +92-61-4540198
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
