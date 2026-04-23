'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import {
  BarChart3,
  Users,
  FileText,
  Target,
  Settings,
  LogOut,
  Zap,
  TrendingUp,
  Mail,
  MessageSquare
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
  email_verified: boolean;
}

interface Organization {
  id: string;
  name: string;
  logo?: string;
  domain?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        router.push('/marketing/login');
        return;
      }

      try {
        const userData = await apiClient.getCurrentUser();
        setUser(userData.user);
        setOrganization(userData.organization);
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        router.push('/marketing/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await apiClient.logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if API call fails
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      router.push('/');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-nexus-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nexus-blue"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-nexus-bg">
      {/* Header */}
      <header className="bg-white border-b border-nexus-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-nexus-accent rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-nexus-accent font-serif">NEXUS</span>
              {organization && (
                <span className="text-nexus-text-secondary">• {organization.name}</span>
              )}
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-nexus-text-secondary">
                Welcome, {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-nexus-text-secondary hover:text-nexus-text-primary transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-nexus-text-primary mb-2">
            Welcome to your Dashboard
          </h1>
          <p className="text-nexus-text-secondary">
            Manage your business operations and access all Nexus features.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-nexus-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-nexus-blue/10 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-nexus-blue" />
              </div>
              <div>
                <p className="text-2xl font-bold text-nexus-text-primary">0</p>
                <p className="text-sm text-nexus-text-secondary">Contacts</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-nexus-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-nexus-green/10 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-nexus-green" />
              </div>
              <div>
                <p className="text-2xl font-bold text-nexus-text-primary">0</p>
                <p className="text-sm text-nexus-text-secondary">Campaigns</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-nexus-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-nexus-violet/10 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-nexus-violet" />
              </div>
              <div>
                <p className="text-2xl font-bold text-nexus-text-primary">0</p>
                <p className="text-sm text-nexus-text-secondary">Emails Sent</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-nexus-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-nexus-amber/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-nexus-amber" />
              </div>
              <div>
                <p className="text-2xl font-bold text-nexus-text-primary">0%</p>
                <p className="text-sm text-nexus-text-secondary">Growth</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/dashboard/contacts"
            className="bg-white rounded-xl p-6 border border-nexus-border hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-nexus-blue/10 rounded-lg flex items-center justify-center group-hover:bg-nexus-blue/20 transition-colors">
                <Users className="w-6 h-6 text-nexus-blue" />
              </div>
              <div>
                <h3 className="font-semibold text-nexus-text-primary">Contacts & CRM</h3>
                <p className="text-sm text-nexus-text-secondary">Manage your customer relationships</p>
              </div>
            </div>
          </Link>

          <Link
            href="/dashboard/content"
            className="bg-white rounded-xl p-6 border border-nexus-border hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-nexus-green/10 rounded-lg flex items-center justify-center group-hover:bg-nexus-green/20 transition-colors">
                <FileText className="w-6 h-6 text-nexus-green" />
              </div>
              <div>
                <h3 className="font-semibold text-nexus-text-primary">Content Writer</h3>
                <p className="text-sm text-nexus-text-secondary">Create engaging content with AI</p>
              </div>
            </div>
          </Link>

          <Link
            href="/dashboard/ads"
            className="bg-white rounded-xl p-6 border border-nexus-border hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-nexus-violet/10 rounded-lg flex items-center justify-center group-hover:bg-nexus-violet/20 transition-colors">
                <Target className="w-6 h-6 text-nexus-violet" />
              </div>
              <div>
                <h3 className="font-semibold text-nexus-text-primary">Ad Manager</h3>
                <p className="text-sm text-nexus-text-secondary">Run ads across all platforms</p>
              </div>
            </div>
          </Link>

          <Link
            href="/dashboard/email"
            className="bg-white rounded-xl p-6 border border-nexus-border hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-nexus-amber/10 rounded-lg flex items-center justify-center group-hover:bg-nexus-amber/20 transition-colors">
                <Mail className="w-6 h-6 text-nexus-amber" />
              </div>
              <div>
                <h3 className="font-semibold text-nexus-text-primary">Email Marketing</h3>
                <p className="text-sm text-nexus-text-secondary">Send personalized email campaigns</p>
              </div>
            </div>
          </Link>

          <Link
            href="/dashboard/chat"
            className="bg-white rounded-xl p-6 border border-nexus-border hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-nexus-red/10 rounded-lg flex items-center justify-center group-hover:bg-nexus-red/20 transition-colors">
                <MessageSquare className="w-6 h-6 text-nexus-red" />
              </div>
              <div>
                <h3 className="font-semibold text-nexus-text-primary">Chat & Support</h3>
                <p className="text-sm text-nexus-text-secondary">AI-powered customer conversations</p>
              </div>
            </div>
          </Link>

          <Link
            href="/dashboard/settings"
            className="bg-white rounded-xl p-6 border border-nexus-border hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-nexus-text-secondary/10 rounded-lg flex items-center justify-center group-hover:bg-nexus-text-secondary/20 transition-colors">
                <Settings className="w-6 h-6 text-nexus-text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold text-nexus-text-primary">Settings</h3>
                <p className="text-sm text-nexus-text-secondary">Configure your account and preferences</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Coming Soon Notice */}
        <div className="mt-12 bg-nexus-bg-secondary rounded-xl p-8 text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-nexus-text-primary mb-4">
              More Features Coming Soon
            </h3>
            <p className="text-nexus-text-secondary mb-6">
              We're actively building additional modules including Video Editor, Design Studio,
              Analytics Dashboard, and many more powerful features.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <span className="px-3 py-1 bg-nexus-blue/10 text-nexus-blue rounded-full text-sm">Video Editor</span>
              <span className="px-3 py-1 bg-nexus-green/10 text-nexus-green rounded-full text-sm">Design Studio</span>
              <span className="px-3 py-1 bg-nexus-violet/10 text-nexus-violet rounded-full text-sm">Analytics</span>
              <span className="px-3 py-1 bg-nexus-amber/10 text-nexus-amber rounded-full text-sm">Automation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}