'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    title: 'Marketing Director',
    company: 'TechFlow Inc.',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    content: 'Nexus completely transformed our marketing operations. We went from managing 15 different tools to one unified platform. The AI content generation alone saved us 20 hours per week.',
    featured: true,
  },
  {
    id: 2,
    name: 'Michael Chen',
    title: 'CEO',
    company: 'StartupXYZ',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    content: 'The CRM and automation features are incredible. Our lead conversion rate increased by 340% in just 3 months. The white-label option was perfect for our rebrand.',
    featured: false,
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    title: 'Creative Director',
    company: 'BrandStudio',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    content: 'The design studio and video editor are professional-grade. We\'ve created hundreds of assets without hiring external designers. The AI assistance is spot-on.',
    featured: true,
  },
  {
    id: 4,
    name: 'David Kim',
    title: 'E-commerce Manager',
    company: 'ShopSmart',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    content: 'Product research and UGC ad generation changed everything for us. We went from $50k/month ad spend with mediocre results to $150k with 3x ROAS.',
    featured: false,
  },
  {
    id: 5,
    name: 'Lisa Thompson',
    title: 'Agency Owner',
    company: 'DigitalBoost',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    content: 'Managing multiple clients just got infinitely easier. The white-label features and client reporting dashboards are exactly what we needed.',
    featured: false,
  },
  {
    id: 6,
    name: 'James Wilson',
    title: 'Operations Manager',
    company: 'ScaleCorp',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    content: 'The automation workflows and chatbot builder saved us thousands in development costs. Everything integrates seamlessly with our existing stack.',
    featured: true,
  },
];

export default function TestimonialsSection() {
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
            Loved by marketing teams worldwide
          </h2>
          <p className="text-xl text-nexus-text-secondary max-w-2xl mx-auto">
            See what our customers say about transforming their business with Nexus.
          </p>
        </motion.div>

        {/* Featured Testimonial */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="max-w-4xl mx-auto bg-nexus-bg-secondary rounded-2xl p-8 md:p-12 relative">
            <Quote className="absolute top-6 left-6 w-12 h-12 text-nexus-accent opacity-20" />

            <div className="text-center">
              <div className="flex justify-center mb-6">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className="w-6 h-6 fill-nexus-amber text-nexus-amber" />
                ))}
              </div>

              <blockquote className="text-2xl md:text-3xl font-medium text-nexus-text-primary mb-8 leading-relaxed">
                "Nexus replaced our entire marketing stack. We went from 12 tools to 1. The AI content
                generation alone saved us 20 hours per week, and our lead conversion rate increased by 340%."
              </blockquote>

              <div className="flex items-center justify-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face"
                  alt="Sarah Johnson"
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="text-left">
                  <div className="font-semibold text-nexus-text-primary">Sarah Johnson</div>
                  <div className="text-nexus-text-secondary">Marketing Director, TechFlow Inc.</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.filter(t => !t.featured).map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white border border-nexus-border rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: testimonial.rating }, (_, i) => (
                  <Star key={i} className="w-4 h-4 fill-nexus-amber text-nexus-amber" />
                ))}
              </div>

              <blockquote className="text-nexus-text-primary mb-6 leading-relaxed">
                "{testimonial.content}"
              </blockquote>

              <div className="flex items-center gap-3">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-nexus-text-primary text-sm">
                    {testimonial.name}
                  </div>
                  <div className="text-nexus-text-secondary text-xs">
                    {testimonial.title}, {testimonial.company}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-6 px-8 py-4 bg-nexus-bg-secondary rounded-full">
            <div className="text-nexus-text-primary font-semibold">Trusted by</div>
            <div className="flex items-center gap-4 opacity-60">
              <div className="w-8 h-8 bg-nexus-blue rounded"></div>
              <div className="w-8 h-8 bg-nexus-green rounded"></div>
              <div className="w-8 h-8 bg-nexus-violet rounded"></div>
              <div className="w-8 h-8 bg-nexus-red rounded"></div>
              <div className="w-8 h-8 bg-nexus-amber rounded"></div>
            </div>
            <div className="text-nexus-text-secondary">and 10,000+ more companies</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}