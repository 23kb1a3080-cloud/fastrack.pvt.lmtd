'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ShoppingBag, Shield, Menu, X, ChevronDown, Sparkles, User, LogIn, LogOut } from 'lucide-react';
import { BRANCHES } from '@/lib/constants';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const checkUser = () => {
      const stored = localStorage.getItem('fastrack_user');
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    checkUser();
    window.addEventListener('authChange', checkUser);
    window.addEventListener('storage', checkUser);

    return () => {
      window.removeEventListener('authChange', checkUser);
      window.removeEventListener('storage', checkUser);
    };
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('fastrack_user');
    setUser(null);
    setUserDropdownOpen(false);
    window.dispatchEvent(new Event('authChange'));
  };

  return (
    <header className="sticky top-0 z-50 bg-[#ECE4DA]/95 backdrop-blur-md border-b border-[#D8CEBE] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-11 w-11 rounded-2xl bg-[#000000] p-1 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs overflow-hidden border border-[#D8CEBE]">
              <Image
                src="/images/logo.jpg"
                alt="fastrackprojects logo"
                width={36}
                height={36}
                className="object-contain rounded-xl"
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-[#000000]">
                  fastrack<span className="opacity-75">projects</span>
                </span>
                <span className="hidden sm:inline-flex text-[10px] font-bold text-[#000000] bg-[#E5DCCF] px-2 py-0.5 rounded-full border border-[#D8CEBE]">
                  STORE
                </span>
              </div>
              <p className="text-[11px] text-[#000000]/80 font-medium">
                Engineering Projects Marketplace
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm font-bold text-[#000000] hover:opacity-70 transition-opacity"
            >
              Home
            </Link>

            <Link
              href="/projects"
              className="text-sm font-bold text-[#000000] hover:opacity-70 transition-opacity"
            >
              All Projects
            </Link>

            {/* Department Dropdown */}
            <div className="relative group">
              <button className="text-sm font-bold text-[#000000] group-hover:opacity-70 transition-opacity flex items-center gap-1 py-2">
                Branches
                <ChevronDown className="h-4 w-4 text-[#000000]/70 group-hover:rotate-180 transition-transform duration-200" />
              </button>

              <div className="absolute top-full left-1/2 -translate-x-1/2 w-72 p-2 bg-[#FAF6F0] border border-[#D8CEBE] rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0 space-y-1">
                <div className="px-3 py-1.5 text-[10px] font-bold text-[#000000]/60 uppercase tracking-wider border-b border-[#D8CEBE]/60 mb-1">
                  Select Department
                </div>
                {BRANCHES.map((b) => (
                  <Link
                    key={b.id}
                    href={`/branches/${b.id}`}
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-[#000000] hover:bg-[#ECE4DA] transition-colors"
                  >
                    <span>{b.fullName}</span>
                    <span className="text-[10px] font-bold text-[#000000] bg-[#E5DCCF] px-1.5 py-0.5 rounded">
                      {b.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/custom-request"
              className="text-sm font-bold text-[#000000] hover:opacity-70 transition-opacity flex items-center gap-1"
            >
              <Sparkles className="h-4 w-4 text-[#000000]" />
              Custom Order
            </Link>
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#FAF6F0] hover:bg-[#E5DCCF] text-[#000000] text-xs font-bold transition-all border border-[#D8CEBE]"
            >
              <ShoppingBag className="h-4 w-4 text-[#000000]" />
              My Purchases
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#000000] text-[#FFFFFF] text-xs font-extrabold shadow-sm hover:bg-[#1a1a1a] transition-all"
                >
                  <div className="w-5 h-5 rounded-full bg-[#FFFFFF] text-[#000000] flex items-center justify-center text-[10px] font-black">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span>{user.name.split(' ')[0]}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-[#FFFFFF]" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 p-2 bg-[#FAF6F0] border border-[#D8CEBE] rounded-2xl shadow-xl z-50 space-y-1">
                    <div className="px-3 py-2 border-b border-[#D8CEBE]/80 mb-1">
                      <p className="text-xs font-black text-[#000000] truncate">{user.name}</p>
                      <p className="text-[10px] text-[#000000]/70 font-medium truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-[#000000] hover:bg-[#ECE4DA]"
                    >
                      <ShoppingBag className="h-4 w-4 text-[#000000]" />
                      <span>My Purchases</span>
                    </Link>
                    {user.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-[#000000] hover:bg-[#ECE4DA]"
                      >
                        <Shield className="h-4 w-4 text-[#000000]" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-[#000000] hover:bg-[#ECE4DA] text-left"
                    >
                      <LogOut className="h-4 w-4 text-[#000000]" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#FAF6F0] hover:bg-[#E5DCCF] text-[#000000] text-xs font-extrabold transition-all border border-[#D8CEBE]"
                >
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Link>
                <Link
                  href="/login?mode=signup"
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#000000] hover:bg-[#1a1a1a] text-[#FFFFFF] text-xs font-extrabold transition-all shadow-sm"
                >
                  <User className="h-4 w-4" />
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-[#000000]"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#ECE4DA] border-b border-[#D8CEBE] px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/projects"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-bold text-[#000000] bg-[#FAF6F0] rounded-xl border border-[#D8CEBE]"
          >
            All Projects Catalog
          </Link>
          <div className="pt-2">
            <p className="px-3 text-xs font-bold text-[#000000]/60 uppercase tracking-wider mb-1">
              Branches
            </p>
            <div className="grid grid-cols-2 gap-1.5 px-1">
              {BRANCHES.map((b) => (
                <Link
                  key={b.id}
                  href={`/branches/${b.id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-xs text-[#000000] hover:bg-[#FAF6F0] rounded-lg font-bold"
                >
                  {b.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="pt-2 flex flex-col gap-2">
            {user ? (
              <>
                <div className="px-3 py-2 bg-[#FAF6F0] rounded-xl border border-[#D8CEBE]">
                  <p className="text-xs font-extrabold text-[#000000]">{user.name}</p>
                  <p className="text-[10px] font-medium text-[#000000]/70">{user.email}</p>
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2.5 bg-[#FAF6F0] text-[#000000] rounded-full text-xs font-bold border border-[#D8CEBE]"
                >
                  My Purchases
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center px-4 py-2.5 bg-[#000000] text-[#FFFFFF] rounded-full text-xs font-bold"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2.5 bg-[#FAF6F0] text-[#000000] rounded-full text-xs font-bold border border-[#D8CEBE]"
                >
                  Sign In
                </Link>
                <Link
                  href="/login?mode=signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2.5 bg-[#000000] text-[#FFFFFF] rounded-full text-xs font-bold"
                >
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
