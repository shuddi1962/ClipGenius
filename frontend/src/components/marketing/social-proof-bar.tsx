'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export default function SocialProofBar() {
  return (
    <section className="py-16 bg-nexus-bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <blockquote className="text-xl text-nexus-text-primary font-medium mb-4">
              "Nexus replaced our entire marketing stack. We went from 12 tools to 1."
            </blockquote>
            <cite className="text-nexus-text-secondary">
              — Sarah K., Marketing Director @ TechCorp
            </cite>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            {/* G2 Rating */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className="w-5 h-5 fill-nexus-amber text-nexus-amber" />
                ))}
              </div>
              <span className="text-nexus-text-primary font-semibold">4.9/5 on G2</span>
            </div>

            {/* Capterra Rating */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className="w-5 h-5 fill-nexus-amber text-nexus-amber" />
                ))}
              </div>
              <span className="text-nexus-text-primary font-semibold">4.8/5 on Capterra</span>
            </div>

            {/* Reviews Count */}
            <div className="text-nexus-text-primary font-semibold">
              1,200+ Reviews
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}