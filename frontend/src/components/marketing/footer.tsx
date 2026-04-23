'use client';

import Link from 'next/link';
import { Zap, Twitter, Linkedin, Youtube, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = {
    products: [
      { name: 'CRM & Contacts', href: '#' },
      { name: 'Content Writer', href: '#' },
      { name: 'Ad Manager', href: '#' },
      { name: 'Design Studio', href: '#' },
      { name: 'SEO Engine', href: '#' },
      { name: 'Video Editor', href: '#' },
      { name: 'Voice AI', href: '#' },
      { name: 'Chatbots', href: '#' },
    ],
    company: [
      { name: 'About', href: '/about' },
      { name: 'Blog', href: '/blog' },
      { name: 'Careers', href: '#' },
      { name: 'Press Kit', href: '#' },
      { name: 'Partners', href: '#' },
      { name: 'Affiliate Program', href: '#' },
      { name: 'Status Page', href: '#' },
      { name: 'Changelog', href: '#' },
    ],
    support: [
      { name: 'Documentation', href: '/docs' },
      { name: 'API Reference', href: '/api-docs' },
      { name: 'Help Center', href: '/help' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Community', href: '/community' },
      { name: 'Video Tutorials', href: '/tutorials' },
      { name: 'Webinars', href: '/webinars' },
      { name: 'Live Training', href: '/training' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/legal/privacy' },
      { name: 'Terms of Service', href: '/legal/terms' },
      { name: 'Cookie Policy', href: '/legal/cookies' },
      { name: 'GDPR', href: '/legal/gdpr' },
      { name: 'Security', href: '/security' },
      { name: 'Compliance', href: '/compliance' },
      { name: 'Subprocessors', href: '/subprocessors' },
      { name: 'DPA', href: '/dpa' },
    ],
  };

  return (
    <footer className="bg-nexus-accent text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-nexus-accent" />
              </div>
              <span className="text-2xl font-bold font-serif">NEXUS</span>
            </div>

            <p className="text-nexus-text-tertiary mb-6 leading-relaxed">
              The operating system for modern business. CRM, marketing, creative studio,
              advertising, automation — all connected.
            </p>

            {/* Contact Info */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-sm text-nexus-text-tertiary">
                <Mail className="w-4 h-4" />
                hello@nexus.app
              </div>
              <div className="flex items-center gap-2 text-sm text-nexus-text-tertiary">
                <Phone className="w-4 h-4" />
                +1 (555) 123-4567
              </div>
              <div className="flex items-center gap-2 text-sm text-nexus-text-tertiary">
                <MapPin className="w-4 h-4" />
                San Francisco, CA
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              <a href="#" className="text-nexus-text-tertiary hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-nexus-text-tertiary hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-nexus-text-tertiary hover:text-white transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="#" className="text-nexus-text-tertiary hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Products</h3>
            <ul className="space-y-2">
              {footerSections.products.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-nexus-text-tertiary hover:text-white transition-colors text-sm"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerSections.company.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-nexus-text-tertiary hover:text-white transition-colors text-sm"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {footerSections.support.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-nexus-text-tertiary hover:text-white transition-colors text-sm"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerSections.legal.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-nexus-text-tertiary hover:text-white transition-colors text-sm"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-nexus-text-tertiary text-sm">
              © {currentYear} Nexus. All rights reserved.
            </div>

            <div className="flex items-center gap-6">
              <div className="text-nexus-text-tertiary text-sm">
                Made with ♥ for marketers worldwide
              </div>

              <div className="flex items-center gap-4 text-sm">
                <select className="bg-transparent text-nexus-text-tertiary border-none outline-none">
                  <option value="en">🌍 English</option>
                  <option value="es">🇪🇸 Español</option>
                  <option value="fr">🇫🇷 Français</option>
                  <option value="de">🇩🇪 Deutsch</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}