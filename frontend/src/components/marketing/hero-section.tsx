'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, ArrowRight } from 'lucide-react';

// Three.js particles background component
function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }> = [];

    // Create particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    function animate() {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(26, 26, 46, ${particle.opacity})`;
        ctx.fill();

        // Draw connections
        particles.slice(index + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `rgba(26, 26, 46, ${(120 - distance) / 120 * 0.1})`;
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}
    />
  );
}

// Animated counter component
function AnimatedCounter({ value, suffix = '', duration = 2000 }: { value: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      setCount(Math.floor(progress * value));

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
  }, [value, duration]);

  return (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="text-2xl font-bold text-nexus-green"
    >
      {count.toLocaleString()}{suffix}
    </motion.span>
  );
}

// Floating stats cards
function FloatingStats() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="absolute top-20 left-10 bg-nexus-surface/90 backdrop-blur-sm border border-nexus-border rounded-lg p-4 shadow-lg"
      >
        <div className="text-nexus-green font-semibold">↑ 247% Revenue Growth</div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="absolute top-40 right-10 bg-nexus-surface/90 backdrop-blur-sm border border-nexus-border rounded-lg p-4 shadow-lg"
      >
        <div className="text-nexus-blue font-semibold">12,847 Leads Generated</div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="absolute bottom-40 left-20 bg-nexus-surface/90 backdrop-blur-sm border border-nexus-border rounded-lg p-4 shadow-lg"
      >
        <div className="text-nexus-violet font-semibold">AI Content Published: 94</div>
      </motion.div>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Particles Background */}
      <ParticlesBackground />

      {/* Floating Stats */}
      <FloatingStats />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center px-4 py-2 rounded-full bg-nexus-surface/90 backdrop-blur-sm border border-nexus-border text-sm font-medium text-nexus-text-primary mb-8"
        >
          <span className="w-2 h-2 bg-nexus-green rounded-full mr-2 animate-pulse"></span>
          Rated #1 All-in-One Business Platform
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
          style={{ fontFamily: 'Fraunces, serif' }}
        >
          The Operating System
          <br />
          <span className="text-nexus-blue-light">for Modern Business</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl text-nexus-text-tertiary max-w-2xl mx-auto mb-8 leading-relaxed"
        >
          Replace 55+ tools with one platform. CRM, marketing, creative studio,
          advertising, automation — all connected.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
        >
          <Link
            href="/marketing/register"
            className="btn btn-primary text-lg px-8 py-4 h-auto flex items-center gap-2"
          >
            Start Free 14-Day Trial
            <ArrowRight className="w-5 h-5" />
          </Link>

          <button className="flex items-center gap-2 text-white hover:text-nexus-blue-light transition-colors text-lg font-medium">
            <Play className="w-5 h-5" />
            Watch Demo
          </button>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="border-t border-white/10 pt-8"
        >
          <p className="text-nexus-text-tertiary text-sm mb-6">
            Trusted by 12,000+ businesses worldwide
          </p>

          {/* Logo strip placeholder */}
          <div className="flex justify-center items-center gap-8 opacity-60">
            <div className="w-16 h-8 bg-white/20 rounded"></div>
            <div className="w-16 h-8 bg-white/20 rounded"></div>
            <div className="w-16 h-8 bg-white/20 rounded"></div>
            <div className="w-16 h-8 bg-white/20 rounded"></div>
            <div className="w-16 h-8 bg-white/20 rounded"></div>
            <div className="w-16 h-8 bg-white/20 rounded"></div>
          </div>
        </motion.div>
      </div>

      {/* Dashboard Preview */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-4"
        style={{
          perspective: '1200px',
        }}
      >
        <div
          className="w-full bg-nexus-surface border border-nexus-border rounded-xl shadow-2xl overflow-hidden"
          style={{
            transform: 'rotateX(8deg) rotateY(-5deg)',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Mock Dashboard Header */}
          <div className="bg-nexus-bg-secondary px-6 py-4 border-b border-nexus-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-nexus-accent rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">N</span>
                </div>
                <span className="font-semibold text-nexus-text-primary">Nexus Dashboard</span>
              </div>
              <div className="flex gap-2">
                <div className="w-6 h-6 bg-nexus-green rounded-full"></div>
                <div className="w-6 h-6 bg-nexus-blue rounded-full"></div>
                <div className="w-6 h-6 bg-nexus-violet rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Mock Dashboard Content */}
          <div className="p-6">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-nexus-bg-tertiary rounded-lg p-4">
                <div className="text-nexus-green font-semibold">$45,231</div>
                <div className="text-xs text-nexus-text-secondary">Revenue</div>
              </div>
              <div className="bg-nexus-bg-tertiary rounded-lg p-4">
                <div className="text-nexus-blue font-semibold">2,345</div>
                <div className="text-xs text-nexus-text-secondary">Leads</div>
              </div>
              <div className="bg-nexus-bg-tertiary rounded-lg p-4">
                <div className="text-nexus-violet font-semibold">89%</div>
                <div className="text-xs text-nexus-text-secondary">Conversion</div>
              </div>
            </div>

            {/* Mock Chart */}
            <div className="bg-nexus-bg-tertiary rounded-lg p-4 h-32 flex items-end justify-between">
              {Array.from({ length: 12 }, (_, i) => (
                <div
                  key={i}
                  className="bg-nexus-blue rounded-sm flex-1 mx-1"
                  style={{ height: `${20 + Math.random() * 60}%` }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}