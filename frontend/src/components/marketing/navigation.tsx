'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown, Zap, Users, Target, BarChart3 } from 'lucide-react';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled
        ? 'bg-nexus-bg/90 backdrop-blur-md border-b border-nexus-border/50 shadow-lg'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-nexus-accent rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-nexus-accent font-serif">
                NEXUS
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {/* Products Mega Menu */}
              <div className="relative group">
                <button className="flex items-center text-nexus-text-primary hover:text-nexus-accent px-3 py-2 text-sm font-medium transition-colors">
                  Products <ChevronDown className="ml-1 w-4 h-4" />
                </button>

                <div className="absolute left-0 mt-2 w-screen max-w-4xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="bg-nexus-surface border border-nexus-border rounded-xl shadow-xl p-6">
                    <div className="grid grid-cols-4 gap-6">
                      <div>
                        <h3 className="text-sm font-semibold text-nexus-text-primary mb-3">CRM & Sales</h3>
                        <ul className="space-y-2">
                          <li><a href="#" className="text-sm text-nexus-text-secondary hover:text-nexus-accent">Contacts</a></li>
                          <li><a href="#" className="text-sm text-nexus-text-secondary hover:text-nexus-accent">Pipelines</a></li>
                          <li><a href="#" className="text-sm text-nexus-text-secondary hover:text-nexus-accent">Inbox</a></li>
                          <li><a href="#" className="text-sm text-nexus-text-secondary hover:text-nexus-accent">Prospecting</a></li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-nexus-text-primary mb-3">Marketing</h3>
                        <ul className="space-y-2">
                          <li><a href="#" className="text-sm text-nexus-text-secondary hover:text-nexus-accent">Content</a></li>
                          <li><a href="#" className="text-sm text-nexus-text-secondary hover:text-nexus-accent">SEO</a></li>
                          <li><a href="#" className="text-sm text-nexus-text-secondary hover:text-nexus-accent">Social</a></li>
                          <li><a href="#" className="text-sm text-nexus-text-secondary hover:text-nexus-accent">Email</a></li>
                          <li><a href="#" className="text-sm text-nexus-text-secondary hover:text-nexus-accent">Ads</a></li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-nexus-text-primary mb-3">Creative</h3>
                        <ul className="space-y-2">
                          <li><a href="#" className="text-sm text-nexus-text-secondary hover:text-nexus-accent">Design Studio</a></li>
                          <li><a href="#" className="text-sm text-nexus-text-secondary hover:text-nexus-accent">Image</a></li>
                          <li><a href="#" className="text-sm text-nexus-text-secondary hover:text-nexus-accent">Video</a></li>
                          <li><a href="#" className="text-sm text-nexus-text-secondary hover:text-nexus-accent">Music</a></li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-nexus-text-primary mb-3">Commerce</h3>
                        <ul className="space-y-2">
                          <li><a href="#" className="text-sm text-nexus-text-secondary hover:text-nexus-accent">Store</a></li>
                          <li><a href="#" className="text-sm text-nexus-text-secondary hover:text-nexus-accent">Product Research</a></li>
                          <li><a href="#" className="text-sm text-nexus-text-secondary hover:text-nexus-accent">Payments</a></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Solutions Dropdown */}
              <div className="relative group">
                <button className="flex items-center text-nexus-text-primary hover:text-nexus-accent px-3 py-2 text-sm font-medium transition-colors">
                  Solutions <ChevronDown className="ml-1 w-4 h-4" />
                </button>

                <div className="absolute left-0 mt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="bg-nexus-surface border border-nexus-border rounded-lg shadow-lg py-2">
                    <a href="#" className="flex items-center px-4 py-3 text-sm text-nexus-text-secondary hover:bg-nexus-bg-secondary hover:text-nexus-text-primary">
                      <Users className="mr-3 w-4 h-4" />
                      For Agencies
                    </a>
                    <a href="#" className="flex items-center px-4 py-3 text-sm text-nexus-text-secondary hover:bg-nexus-bg-secondary hover:text-nexus-text-primary">
                      <Target className="mr-3 w-4 h-4" />
                      For E-commerce
                    </a>
                    <a href="#" className="flex items-center px-4 py-3 text-sm text-nexus-text-secondary hover:bg-nexus-bg-secondary hover:text-nexus-text-primary">
                      <BarChart3 className="mr-3 w-4 h-4" />
                      For Creators
                    </a>
                    <a href="#" className="flex items-center px-4 py-3 text-sm text-nexus-text-secondary hover:bg-nexus-bg-secondary hover:text-nexus-text-primary">
                      <Zap className="mr-3 w-4 h-4" />
                      For SaaS Companies
                    </a>
                  </div>
                </div>
              </div>

              <Link href="/marketing/pricing" className="text-nexus-text-primary hover:text-nexus-accent px-3 py-2 text-sm font-medium transition-colors">
                Pricing
              </Link>

              <Link href="#" className="text-nexus-text-primary hover:text-nexus-accent px-3 py-2 text-sm font-medium transition-colors">
                Resources
              </Link>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/marketing/login" className="text-nexus-text-primary hover:text-nexus-accent px-3 py-2 text-sm font-medium transition-colors">
              Login
            </Link>
            <Link href="/marketing/register" className="btn btn-primary">
              Start Free Trial
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-nexus-text-primary hover:text-nexus-accent p-2"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-nexus-surface border-t border-nexus-border">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a href="#" className="block px-3 py-2 text-base font-medium text-nexus-text-primary hover:bg-nexus-bg-secondary rounded-md">
              Products
            </a>
            <a href="#" className="block px-3 py-2 text-base font-medium text-nexus-text-primary hover:bg-nexus-bg-secondary rounded-md">
              Solutions
            </a>
            <a href="/marketing/pricing" className="block px-3 py-2 text-base font-medium text-nexus-text-primary hover:bg-nexus-bg-secondary rounded-md">
              Pricing
            </a>
            <a href="#" className="block px-3 py-2 text-base font-medium text-nexus-text-primary hover:bg-nexus-bg-secondary rounded-md">
              Resources
            </a>
            <div className="pt-4 pb-3 border-t border-nexus-border">
              <a href="/marketing/login" className="block px-3 py-2 text-base font-medium text-nexus-text-primary hover:bg-nexus-bg-secondary rounded-md">
                Login
              </a>
              <a href="/marketing/register" className="block px-3 py-2 mt-2 btn btn-primary text-center">
                Start Free Trial
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}