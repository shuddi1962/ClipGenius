'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/Card'
import Button from '@/components/Button'
import { ArrowRight, Zap, TrendingUp, FileText, Settings } from 'lucide-react'
import { dbService } from '@/lib/database'
import { useRouter } from 'next/navigation'

export default function Welcome() {
  const [user, setUser] = useState<any>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const currentUser = await dbService.getCurrentUser()
      setUser(currentUser)
    }

    checkUser()
  }, [])

  const steps = [
    {
      title: "Welcome to Roshanal AI Marketing",
      content: "Your AI-powered marketing platform for marine equipment, security systems, and solar solutions.",
      icon: Zap,
      action: "Get Started"
    },
    {
      title: "AI-Powered Content Creation",
      content: "Generate professional social media posts, video scripts, and marketing content tailored to your business.",
      icon: FileText,
      action: "Explore Features"
    },
    {
      title: "Smart Trend Discovery",
      content: "Stay ahead of the competition with AI-driven trending topic analysis and market insights.",
      icon: TrendingUp,
      action: "Discover Trends"
    },
    {
      title: "Configure Your Settings",
      content: "Set up your AI providers, company profile, and preferences to get the most out of the platform.",
      icon: Settings,
      action: "Setup Account"
    }
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      router.push('/settings')
    }
  }

  const handleSkip = () => {
    router.push('/')
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-roshanal-navy via-roshanal-blue to-blue-600">
        <Card className="w-full max-w-md text-center">
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </Card>
      </div>
    )
  }

  const step = steps[currentStep]
  const StepIcon = step.icon

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-roshanal-navy via-roshanal-blue to-blue-600 p-4">
      <Card className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 flex-1 mx-1 rounded-full ${
                  index <= currentStep ? 'bg-roshanal-blue' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <div className="text-center text-sm text-gray-600">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-roshanal-blue rounded-full flex items-center justify-center mx-auto mb-6">
            <StepIcon className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-3xl font-bold text-roshanal-navy mb-4">
            {step.title}
          </h1>

          <p className="text-gray-600 text-lg leading-relaxed max-w-md mx-auto">
            {step.content}
          </p>
        </div>

        {/* Features Preview for Step 1 */}
        {currentStep === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <FileText className="w-8 h-8 text-roshanal-blue mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900 mb-1">Content Generator</h3>
              <p className="text-sm text-gray-600">AI-powered post creation</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900 mb-1">Trend Discovery</h3>
              <p className="text-sm text-gray-600">Market insights & trends</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Settings className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900 mb-1">Smart Planning</h3>
              <p className="text-sm text-gray-600">Content calendar & scheduling</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleSkip}
            variant="outline"
            className="flex-1 sm:flex-none"
          >
            Skip Tour
          </Button>
          <Button
            onClick={handleNext}
            className="flex-1 sm:flex-none bg-roshanal-navy hover:bg-roshanal-blue"
          >
            {step.action}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Welcome Message */}
        <div className="mt-8 p-4 bg-gradient-to-r from-roshanal-navy to-roshanal-blue text-white rounded-lg">
          <h3 className="font-semibold mb-2">👋 Welcome, {user.name || user.email}!</h3>
          <p className="text-sm opacity-90">
            You're now part of the Roshanal Infotech marketing team. Let's create amazing content together!
          </p>
        </div>
      </Card>
    </div>
  )
}