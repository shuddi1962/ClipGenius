'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Users,
  Building2,
  Settings,
  Key,
  CreditCard,
  Puzzle,
  FileText,
  Shield,
  Activity,
} from 'lucide-react';

const navigation = [
  {
    name: 'Overview',
    href: '/admin',
    icon: BarChart3,
    items: [
      { name: 'Dashboard', href: '/admin' },
      { name: 'Activity Feed', href: '/admin/activity' },
    ],
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: Users,
    items: [
      { name: 'All Users', href: '/admin/users' },
      { name: 'Organizations', href: '/admin/organizations' },
      { name: 'Staff & Roles', href: '/admin/staff' },
    ],
  },
  {
    name: 'Configuration',
    href: '/admin/config',
    icon: Settings,
    items: [
      { name: 'API Keys Vault', href: '/admin/api-keys' },
      { name: 'Modules & Plans', href: '/admin/modules' },
      { name: 'Plugins', href: '/admin/plugins' },
    ],
  },
  {
    name: 'Revenue',
    href: '/admin/revenue',
    icon: CreditCard,
    items: [
      { name: 'Billing Overview', href: '/admin/billing' },
      { name: 'Transactions', href: '/admin/transactions' },
      { name: 'Subscriptions', href: '/admin/subscriptions' },
      { name: 'Promo Codes', href: '/admin/promos' },
    ],
  },
  {
    name: 'Platform',
    href: '/admin/platform',
    icon: Shield,
    items: [
      { name: 'White-Label Settings', href: '/admin/white-label' },
      { name: 'Email Templates', href: '/admin/email-templates' },
      { name: 'System Settings', href: '/admin/settings' },
      { name: 'Maintenance', href: '/admin/maintenance' },
    ],
  },
  {
    name: 'Monitoring',
    href: '/admin/monitoring',
    icon: Activity,
    items: [
      { name: 'System Health', href: '/admin/health' },
      { name: 'Error Logs', href: '/admin/errors' },
      { name: 'API Usage', href: '/admin/api-usage' },
      { name: 'Audit Log', href: '/admin/audit' },
    ],
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<string[]>(['Overview']);

  const toggleSection = (sectionName: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionName)
        ? prev.filter(name => name !== sectionName)
        : [...prev, sectionName]
    );
  };

  return (
    <div className="flex h-screen bg-nexus-bg">
      {/* Sidebar */}
      <div className="w-64 bg-nexus-surface border-r border-nexus-border">
        <div className="flex h-16 items-center px-6 border-b border-nexus-border">
          <h1 className="text-xl font-bold text-nexus-accent">NEXUS Admin</h1>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {navigation.map((section) => {
              const Icon = section.icon;
              const isExpanded = expandedSections.includes(section.name);

              return (
                <div key={section.name}>
                  <button
                    onClick={() => toggleSection(section.name)}
                    className="sidebar-section-header w-full text-left"
                  >
                    <Icon className="h-4 w-4" />
                    {section.name}
                  </button>

                  {isExpanded && (
                    <div className="ml-6 space-y-1">
                      {section.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`sidebar-item block ${
                            pathname === item.href ? 'active' : ''
                          }`}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-nexus-surface border-b border-nexus-border px-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-nexus-text-primary">
              {navigation
                .flatMap(section => section.items)
                .find(item => item.href === pathname)?.name || 'Dashboard'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-nexus-text-secondary">
              Logged in as Admin
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}