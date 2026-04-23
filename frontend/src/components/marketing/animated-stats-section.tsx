'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// Animated counter hook
function useAnimatedCounter(endValue: number, duration: number = 2000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * endValue));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [endValue, duration]);

  return count;
}

export default function AnimatedStatsSection() {
  const stats = [
    { value: 55, suffix: '+', label: 'Tools Replaced', color: 'text-nexus-blue' },
    { value: 300, suffix: '+', label: 'AI Models', color: 'text-nexus-violet' },
    { value: 10000, suffix: '+', label: 'Leads Generated', color: 'text-nexus-green' },
    { value: 2.8, suffix: 'B+', label: 'Ad Spend Managed', color: 'text-nexus-amber' },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-nexus-bg to-nexus-bg-secondary relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-nexus-text-primary mb-4">
            Trusted by businesses worldwide
          </h2>
          <p className="text-xl text-nexus-text-secondary max-w-2xl mx-auto">
            Join thousands of companies that have transformed their operations with Nexus.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className={`text-5xl md:text-6xl font-bold ${stat.color} mb-2`}>
                <AnimatedCounter endValue={stat.value} />
                {stat.suffix}
              </div>
              <div className="text-nexus-text-secondary font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional stats with icons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-xl border border-nexus-border">
            <div className="text-3xl font-bold text-nexus-green mb-2">99.9%</div>
            <div className="text-nexus-text-secondary">Uptime SLA</div>
          </div>

          <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-xl border border-nexus-border">
            <div className="text-3xl font-bold text-nexus-blue mb-2">50ms</div>
            <div className="text-nexus-text-secondary">Average Response Time</div>
          </div>

          <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-xl border border-nexus-border">
            <div className="text-3xl font-bold text-nexus-violet mb-2">24/7</div>
            <div className="text-nexus-text-secondary">Customer Support</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}