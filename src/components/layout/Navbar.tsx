'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Menu,
  X,
  Gamepad2,
  Heart,
  User,
  TrendingUp,
  Sparkles,
  LayoutGrid,
  Trophy,
  Home,
  Clock,
  Settings,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { searchGames } from '@/data/games';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/games', label: 'Games', icon: Gamepad2 },
  { href: '/trending', label: 'Trending', icon: TrendingUp },
  { href: '/new', label: 'New', icon: Sparkles },
  { href: '/categories', label: 'Categories', icon: LayoutGrid },
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
];

const userLinks = [
  { href: '/favorites', label: 'Favorites', icon: Heart },
  { href: '/recently-played', label: 'Recent', icon: Clock },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState<ReturnType<typeof searchGames>>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchValue(val);
    if (val.trim().length > 1) {
      setSearchResults(searchGames(val).slice(0, 6));
    } else {
      setSearchResults([]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setSearchResults([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMobileMenuOpen(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchValue.trim())}`);
      setSearchOpen(false);
      setSearchResults([]);
      setSearchValue('');
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 glass-navbar">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple">
                <Gamepad2 className="h-5 w-5 text-white" />
              </div>
              <span className="hidden sm:block text-xl font-bold gradient-text">
                ZyBytee
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'text-neon-blue'
                        : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                    }`}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute inset-0 rounded-lg bg-neon-blue/10 border border-neon-blue/20"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Search + Actions */}
            <div className="flex items-center gap-2">
              {/* Desktop Search */}
              <div ref={searchRef} className="relative hidden md:block">
                <form onSubmit={handleSearchSubmit}>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      ref={inputRef}
                      placeholder="Search games..."
                      value={searchValue}
                      onChange={handleSearchChange}
                      onFocus={() => setSearchOpen(true)}
                      className="w-64 pl-9 bg-white/5 border-white/10 focus:border-neon-blue/50 focus:ring-neon-blue/20"
                    />
                  </div>
                </form>

                {/* Search Dropdown */}
                <AnimatePresence>
                  {searchOpen && searchResults.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full mt-2 w-80 rounded-xl glass-strong shadow-2xl overflow-hidden"
                    >
                      {searchResults.map((game) => (
                        <Link
                          key={game.id}
                          href={`/games/${game.slug}`}
                          onClick={() => {
                            setSearchOpen(false);
                            setSearchValue('');
                          }}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors"
                        >
                          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 flex items-center justify-center shrink-0">
                            <Gamepad2 className="h-5 w-5 text-neon-blue" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{game.title}</p>
                            <p className="text-xs text-muted-foreground capitalize">{game.category}</p>
                          </div>
                        </Link>
                      ))}
                      <Link
                        href={`/search?q=${encodeURIComponent(searchValue)}`}
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchValue('');
                        }}
                        className="flex items-center justify-center gap-2 px-4 py-3 text-sm text-neon-blue hover:bg-white/5 border-t border-white/5"
                      >
                        <Search className="h-4 w-4" />
                        View all results
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User Links */}
              <div className="hidden md:flex items-center gap-1">
                {userLinks.slice(0, 2).map((link) => (
                  <Link key={link.href} href={link.href}>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                      <link.icon className="h-4 w-4" />
                    </Button>
                  </Link>
                ))}
                <Link href="/profile">
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                    <div className="h-7 w-7 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
                      <User className="h-3.5 w-3.5 text-white" />
                    </div>
                  </Button>
                </Link>
              </div>

              {/* Mobile menu toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-16 left-0 right-0 z-40 glass-strong border-b border-white/5 lg:hidden overflow-hidden"
          >
            <div className="p-4 space-y-2">
              {/* Mobile Search */}
              <form onSubmit={handleSearchSubmit} className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search games..."
                    value={searchValue}
                    onChange={handleSearchChange}
                    className="pl-9 bg-white/5 border-white/10"
                  />
                </div>
              </form>

              {[...navLinks, ...userLinks].map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-neon-blue/10 text-neon-blue'
                        : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                    }`}
                  >
                    <link.icon className="h-5 w-5" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
