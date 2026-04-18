import Link from 'next/link'
import { ArrowLeft, Users, Target, Award, Heart } from 'lucide-react'
import Card from '@/components/Card'
import Button from '@/components/Button'

export default function About() {
  const values = [
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      title: "Customer-First Approach",
      description: "Every feature we build is designed to solve real business problems and deliver measurable results."
    },
    {
      icon: <Target className="w-8 h-8 text-green-600" />,
      title: "Innovation Driven",
      description: "We leverage cutting-edge AI technology to automate marketing workflows and maximize efficiency."
    },
    {
      icon: <Award className="w-8 h-8 text-purple-600" />,
      title: "Quality Excellence",
      description: "We maintain the highest standards in our code, security, and customer support."
    },
    {
      icon: <Heart className="w-8 h-8 text-red-600" />,
      title: "Global Impact",
      description: "We believe in empowering businesses worldwide to grow and succeed in the digital age."
    }
  ]

  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Co-Founder",
      bio: "Former marketing director at Fortune 500 companies, passionate about democratizing AI for small businesses.",
      image: "/team/sarah.jpg"
    },
    {
      name: "Michael Chen",
      role: "CTO & Co-Founder",
      bio: "AI researcher with 10+ years experience building machine learning systems for enterprise clients.",
      image: "/team/michael.jpg"
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Product",
      bio: "Product leader focused on creating intuitive experiences that drive business growth.",
      image: "/team/emily.jpg"
    },
    {
      name: "David Kim",
      role: "Head of Engineering",
      bio: "Full-stack engineer specializing in scalable systems and AI-powered applications.",
      image: "/team/david.jpg"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            Empowering Businesses with
            <span className="text-blue-600 block">AI-Driven Growth</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We're on a mission to democratize AI-powered marketing automation,
            helping businesses of all sizes compete and win in the digital marketplace.
          </p>
        </div>

        {/* Our Story */}
        <Card className="p-8 mb-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">The Problem</h3>
                <p className="text-gray-600 leading-relaxed">
                  Small and medium-sized businesses struggle to compete with large corporations
                  that have unlimited marketing budgets. Manual marketing processes are time-consuming,
                  expensive, and often ineffective. Most businesses lack the resources to implement
                  sophisticated marketing automation.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Solution</h3>
                <p className="text-gray-600 leading-relaxed">
                  We built ClipGenius to level the playing field. Our AI-powered platform automates
                  the entire marketing funnel — from lead generation to customer conversion.
                  Now any business can access enterprise-level marketing tools at an affordable price.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Our Values */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-16 text-white">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Making a Difference</h2>
            <p className="text-xl opacity-90">Real impact for real businesses</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-blue-100">Businesses Empowered</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">$50M+</div>
              <div className="text-blue-100">Revenue Generated</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-blue-100">Customer Satisfaction</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">AI Automation</div>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The passionate individuals behind ClipGenius
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="p-6 text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-blue-600 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {member.bio}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Mission */}
        <Card className="p-8 bg-gradient-to-r from-blue-50 to-purple-50 border-0">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              To democratize AI-powered marketing automation, enabling businesses of all sizes
              to compete effectively in the digital marketplace. We believe that access to
              sophisticated marketing tools should not be limited to large corporations with
              unlimited budgets.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg">
                  Join Our Mission
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}