'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  FileText,
  Image,
  LogOut,
  Menu,
  Moon,
  Sun,
  Info,
  LifeBuoy,
  ShieldCheck,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { useTheme } from './theme-provider';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Content', href: '/admin/content', icon: FileText },
  { name: 'About Us', href: '/admin/about', icon: Info },
  { name: 'Help & Support', href: '/admin/support', icon: LifeBuoy },
  { name: 'Privacy policy', href: '/admin/privacy', icon: ShieldCheck },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
  // { name: 'Banners', href: '/admin/banners', icon: Image },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-200 ease-in-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-2 p-6 border-b border-sidebar-border">
            <img
              src="/Moody Me Logo.png"
              alt="Moody Me Logo"
              className="w-10 h-10 object-contain rounded-lg"
            />
            <div>
              <h1 className="text-lg font-bold text-sidebar-foreground">MoodyMe</h1>
              <p className="text-xs text-sidebar-foreground/60">Admin Dashboard</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={toggleTheme}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="h-5 w-5 mr-3" />
                  Light Mode
                </>
              ) : (
                <>
                  <Moon className="h-5 w-5 mr-3" />
                  Dark Mode
                </>
              )}
            </Button>
            <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive">
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
