'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, UserCircle, LogOut, Receipt } from 'lucide-react';
import { cn } from '@/lib/utils';
import { signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

export function DesktopNavbar() {
  const t = useTranslations();
  const pathname = usePathname();
  const { data: session } = useSession();

  const navItems = [
    { href: '/', icon: Home, label: t('navigation.home') },
    { href: '/expenses', icon: Receipt, label: t('navigation.expenses') },
  ];

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <nav className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 md:bg-background md:border-r md:border-border">
      <div className="flex flex-col flex-1 p-4">
        {/* Logo/Brand */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gradient-primary">{t('navigation.brand')}</h1>
        </div>

        {/* Navigation Items */}
        <div className="flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  isActive
                    ? 'bg-magenta/20 text-magenta font-medium'
                    : 'text-text-secondary hover:bg-surface hover:text-text-primary'
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* User Section */}
        {session?.user && (
          <div className="mt-auto pt-4 border-t border-border">
            <Link
              href="/profile"
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mb-2',
                pathname === '/profile'
                  ? 'bg-magenta/20 text-magenta font-medium'
                  : 'text-text-secondary hover:bg-surface hover:text-text-primary'
              )}
            >
              <UserCircle className="w-5 h-5" />
              <span>{t('navigation.profile')}</span>
            </Link>
            <Button
              onClick={handleSignOut}
              variant="ghost"
              className="w-full justify-start gap-3 px-4 py-3 text-text-secondary hover:bg-surface hover:text-text-primary"
            >
              <LogOut className="w-5 h-5" />
              <span>{t('navigation.signOut')}</span>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
