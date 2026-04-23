'use client';

import { motion } from 'framer-motion';
import { FileText, Zap, BarChart3, Hash } from 'lucide-react';

export default function FeatureHighlights() {
  const features = [
    {
      id: 'crm',
      title: 'CRM & Inbox',
      description: 'Unified customer management and communication platform',
      icon: FileText,
      size: 'large',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop&crop=center',
    },
    {
      id: 'content',
      title: 'Content Writer',
      description: 'AI-powered content creation with SEO optimization',
      icon: FileText,
      size: 'medium',
      animation: 'typing',
    },
    {
      id: 'ads',
      title: 'Ad Manager',
      description: 'Cross-platform advertising management and analytics',
      icon: BarChart3,
      size: 'medium',
      chart: true,
    },
    {
      id: 'tools',
      title: '55+ Tools Replaced',
      description: 'Everything your business needs in one platform',
      icon: Hash,
      size: 'small',
      stat: '55+',
    },
    {
      id: 'models',
      title: '300+ AI Models',
      description: 'Access to the latest AI models and technologies',
      icon: Zap,
      size: 'small',
      stat: '300+',
    },
    {
      id: 'studio',
      title: 'Design Studio',
      description: 'Professional design tools with AI assistance',
      icon: FileText,
      size: 'large',
      image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop&crop=center',
    },
  ];

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'large':
        return 'col-span-1 md:col-span-2 row-span-2';
      case 'medium':
        return 'col-span-1 row-span-1';
      case 'small':
        return 'col-span-1 row-span-1';
      default:
        return 'col-span-1 row-span-1';
    }
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-nexus-text-primary mb-4">
            Everything your business needs
          </h2>
          <p className="text-xl text-nexus-text-secondary max-w-2xl mx-auto">
            From CRM to creative studio, advertising to automation — all in one platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`group relative overflow-hidden rounded-2xl border border-nexus-border bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${getSizeClasses(feature.size)}`}
              >
                {/* Background Image */}
                {feature.image && (
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-5 group-hover:opacity-10 transition-opacity duration-300"
                    style={{ backgroundImage: `url(${feature.image})` }}
                  />
                )}

                {/* Content */}
                <div className="relative p-6 h-full flex flex-col">
                  {feature.stat ? (
                    <div className="text-4xl font-bold text-nexus-accent mb-2">
                      {feature.stat}
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-nexus-bg-secondary rounded-lg flex items-center justify-center mb-4 group-hover:bg-nexus-blue-light transition-colors duration-300">
                      <Icon className="w-6 h-6 text-nexus-accent group-hover:text-nexus-blue" />
                    </div>
                  )}

                  <h3 className="text-xl font-semibold text-nexus-text-primary mb-2">
                    {feature.title}
                  </h3>

                  <p className="text-nexus-text-secondary flex-1">
                    {feature.description}
                  </p>

                  {/* Special animations */}
                  {feature.animation === 'typing' && (
                    <div className="mt-4 flex items-center gap-1">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-nexus-blue rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-nexus-blue rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-nexus-blue rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                      <span className="text-sm text-nexus-text-tertiary ml-2">Writing...</span>
                    </div>
                  )}

                  {feature.chart && (
                    <div className="mt-4 flex items-end justify-between h-16 gap-1">
                      {Array.from({ length: 8 }, (_, i) => (
                        <div
                          key={i}
                          className="bg-nexus-blue rounded-sm flex-1"
                          style={{
                            height: `${20 + Math.random() * 60}%`,
                            animation: `pulse 2s ease-in-out infinite ${i * 0.1}s`,
                          }}
                        ></div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}