'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowLeft, Zap, Check } from 'lucide-react';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    orgName: '',
    agreeToTerms: false,
  });
  const [step, setStep] = useState(1);

  const passwordRequirements = [
    { text: 'At least 8 characters', met: formData.password.length >= 8 },
    { text: 'Contains a number', met: /\d/.test(formData.password) },
    { text: 'Contains an uppercase letter', met: /[A-Z]/.test(formData.password) },
    { text: 'Contains a lowercase letter', met: /[a-z]/.test(formData.password) },
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      // Validate step 1
      if (!formData.email || !formData.password || !formData.name) return;
      if (formData.password !== formData.confirmPassword) return;
      if (!passwordRequirements.every(req => req.met)) return;

      setStep(2);
      return;
    }

    // Step 2 - Final submission
    if (!formData.agreeToTerms) return;

    // TODO: Implement registration logic
    console.log('Register:', formData);
  };

  return (
    <div className="min-h-screen bg-nexus-bg flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <Link href="/" className="inline-flex items-center gap-2 text-nexus-accent hover:text-nexus-blue transition-colors mb-8">
            <ArrowLeft className="w-5 h-5" />
            Back to home
          </Link>

          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-10 h-10 bg-nexus-accent rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold font-serif text-nexus-accent">NEXUS</span>
          </div>

          <h1 className="text-3xl font-bold text-nexus-text-primary mb-2">
            Create your account
          </h1>
          <p className="text-nexus-text-secondary">
            Start your 14-day free trial today
          </p>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-center justify-center gap-2 mb-8"
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step >= 1 ? 'bg-nexus-blue text-white' : 'bg-nexus-bg-secondary text-nexus-text-tertiary'
          }`}>
            1
          </div>
          <div className={`flex-1 h-0.5 ${step >= 2 ? 'bg-nexus-blue' : 'bg-nexus-border'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step >= 2 ? 'bg-nexus-blue text-white' : 'bg-nexus-bg-secondary text-nexus-text-tertiary'
          }`}>
            2
          </div>
        </motion.div>

        {/* Registration Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl border border-nexus-border p-8 shadow-sm"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 ? (
              // Step 1: Account Details
              <>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-nexus-text-primary mb-2">
                    Full name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="input w-full"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-nexus-text-primary mb-2">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="input w-full"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-nexus-text-primary mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="input w-full pr-10"
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-nexus-text-tertiary hover:text-nexus-text-primary"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password Requirements */}
                  <div className="mt-2 space-y-1">
                    {passwordRequirements.map((req, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs">
                        <Check className={`w-3 h-3 ${req.met ? 'text-nexus-green' : 'text-nexus-text-tertiary'}`} />
                        <span className={req.met ? 'text-nexus-green' : 'text-nexus-text-tertiary'}>
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-nexus-text-primary mb-2">
                    Confirm password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="input w-full pr-10"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-nexus-text-tertiary hover:text-nexus-text-primary"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="mt-1 text-sm text-nexus-red">Passwords do not match</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={!formData.email || !formData.password || !formData.name ||
                           formData.password !== formData.confirmPassword ||
                           !passwordRequirements.every(req => req.met)}
                >
                  Continue
                </button>
              </>
            ) : (
              // Step 2: Organization & Terms
              <>
                <div>
                  <label htmlFor="orgName" className="block text-sm font-medium text-nexus-text-primary mb-2">
                    Organization name (optional)
                  </label>
                  <input
                    id="orgName"
                    type="text"
                    value={formData.orgName}
                    onChange={(e) => handleInputChange('orgName', e.target.value)}
                    className="input w-full"
                    placeholder="Your company or organization name"
                  />
                  <p className="mt-1 text-xs text-nexus-text-tertiary">
                    Leave blank to create a personal account
                  </p>
                </div>

                <div className="bg-nexus-bg-secondary rounded-lg p-4">
                  <h3 className="font-semibold text-nexus-text-primary mb-2">Free Trial Includes:</h3>
                  <ul className="text-sm text-nexus-text-secondary space-y-1">
                    <li>• Full access to all features</li>
                    <li>• Up to 1,000 contacts</li>
                    <li>• 100 AI content generations</li>
                    <li>• 14 days to explore</li>
                  </ul>
                </div>

                <div>
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={formData.agreeToTerms}
                      onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                      className="mt-1 rounded border-nexus-border text-nexus-blue focus:ring-nexus-blue"
                      required
                    />
                    <span className="text-sm text-nexus-text-primary">
                      I agree to the{' '}
                      <Link href="/legal/terms" className="text-nexus-blue hover:text-nexus-accent">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link href="/legal/privacy" className="text-nexus-blue hover:text-nexus-accent">
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="btn btn-secondary flex-1"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary flex-1"
                    disabled={!formData.agreeToTerms}
                  >
                    Create Account
                  </button>
                </div>
              </>
            )}
          </form>
        </motion.div>

        {/* Sign In Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <p className="text-nexus-text-secondary">
            Already have an account?{' '}
            <Link href="/marketing/login" className="text-nexus-blue hover:text-nexus-accent transition-colors font-medium">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}