'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, UserCircle, Receipt } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

export function MobileNavbar() {
  const t = useTranslations();
  const pathname = usePathname();

  const navItems = [
    { href: '/expenses', icon: Receipt, label: t('navigation.expenses') },
    { href: '/', icon: Home, label: t('navigation.home') },
    { href: '/profile', icon: UserCircle, label: t('navigation.profile') },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] md:hidden">
      <div className="flex h-16 items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors',
                isActive
                  ? 'text-magenta'
                  : 'text-text-secondary hover:text-text-primary'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
