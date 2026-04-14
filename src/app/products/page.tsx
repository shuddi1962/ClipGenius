'use client'

import { useState } from 'react'
import Card from '@/components/Card'
import Button from '@/components/Button'
import { ExternalLink, PenTool, Video, MessageCircle } from 'lucide-react'

interface Product {
  id: string
  name: string
  category: string
  description: string
  features: string[]
  image: string
  whatsappLink: string
}

export default function Products() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const products: Product[] = [
    // Marine Division
    {
      id: 'fiberglass-boats',
      name: 'Fiberglass Boats',
      category: 'Marine Equipment',
      description: 'Premium quality fiberglass boats designed for passenger and work transport in marine environments.',
      features: ['Durable construction', 'Fuel efficient', 'Safety certified', 'Multiple sizes available'],
      image: '🚤',
      whatsappLink: 'https://wa.me/2348109522432?text=Hi,%20I%20am%20interested%20in%20your%20Fiberglass%20Boats'
    },
    {
      id: 'outboard-engines',
      name: 'Outboard Engines',
      category: 'Marine Equipment',
      description: 'Suzuki and Yamaha outboard engines for reliable marine propulsion and performance.',
      features: ['Suzuki & Yamaha brands', 'Various horsepower', 'Reliable performance', 'Easy maintenance'],
      image: '⚙️',
      whatsappLink: 'https://wa.me/2348109522432?text=Hi,%20I%20am%20interested%20in%20your%20Outboard%20Engines'
    },
    {
      id: 'marine-accessories',
      name: 'Marine Accessories',
      category: 'Marine Equipment',
      description: 'Complete range of marine accessories including navigation lights, anchors, and fishing gear.',
      features: ['Navigation lights', 'Anchors & chains', 'Fishing equipment', 'Safety accessories'],
      image: '🛟',
      whatsappLink: 'https://wa.me/2348109522432?text=Hi,%20I%20am%20interested%20in%20your%20Marine%20Accessories'
    },
    {
      id: 'life-jackets',
      name: 'Life Jackets',
      category: 'Safety Equipment',
      description: 'Coast Guard approved life jackets and marine safety equipment for water safety.',
      features: ['Coast Guard approved', 'Reflective strips', 'Multiple sizes', 'Buoyant foam'],
      image: '🛟',
      whatsappLink: 'https://wa.me/2348109522432?text=Hi,%20I%20am%20interested%20in%20your%20Life%20Jackets'
    },

    // ICT/Security Division
    {
      id: 'cctv-systems',
      name: 'CCTV Systems',
      category: 'Security Solutions',
      description: 'Hikvision CCTV cameras and surveillance systems for comprehensive security coverage.',
      features: ['4K Ultra HD', 'Night vision', 'Mobile app access', 'Motion detection'],
      image: '📹',
      whatsappLink: 'https://wa.me/2348109522432?text=Hi,%20I%20am%20interested%20in%20your%20CCTV%20Systems'
    },
    {
      id: 'smart-door-locks',
      name: 'Smart Door Locks',
      category: 'Security Solutions',
      description: 'Biometric and keypad smart door locks for modern access control and security.',
      features: ['Biometric access', 'Keypad entry', 'Remote unlocking', 'Anti-tamper technology'],
      image: '🔐',
      whatsappLink: 'https://wa.me/2348109522432?text=Hi,%20I%20am%20interested%20in%20your%20Smart%20Door%20Locks'
    },
    {
      id: 'car-trackers',
      name: 'Car Trackers',
      category: 'Security Solutions',
      description: 'GPS car tracking devices for vehicle security and fleet management.',
      features: ['Real-time tracking', 'Geo-fencing', 'Mobile alerts', 'Fuel monitoring'],
      image: '🚗',
      whatsappLink: 'https://wa.me/2348109522432?text=Hi,%20I%20am%20interested%20in%20your%20Car%20Trackers'
    },
    {
      id: 'solar-installation',
      name: 'Solar Installation',
      category: 'Power Solutions',
      description: 'Complete solar power systems installation for homes and businesses in Nigeria.',
      features: ['System assessment', 'Panel installation', 'Inverter setup', 'Maintenance included'],
      image: '☀️',
      whatsappLink: 'https://wa.me/2348109522432?text=Hi,%20I%20am%20interested%20in%20your%20Solar%20Installation%20services'
    }
  ]

  const marineProducts = products.filter(p => p.category === 'Marine Equipment' || p.category === 'Safety Equipment')
  const securityProducts = products.filter(p => p.category === 'Security Solutions' || p.category === 'Power Solutions')

  const generateProductContent = (product: Product) => {
    // This would integrate with the content generator
    console.log('Generating content for:', product.name)
  }

  const generateProductVideo = (product: Product) => {
    // This would integrate with the video studio
    console.log('Generating video for:', product.name)
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-roshanal-navy mb-2">Our Products</h1>
        <p className="text-gray-600">Explore our comprehensive range of marine, security, and power solutions</p>
      </div>

      {/* Marine Division */}
      <div className="mb-8">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
            <span className="text-2xl">🚤</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-roshanal-navy">Marine Division</h2>
            <p className="text-gray-600">Boat solutions, engines, and marine safety equipment</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {marineProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                  {product.image}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {product.category}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-3">{product.description}</p>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Key Features:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-roshanal-blue rounded-full mr-2"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => generateProductContent(product)}>
                      <PenTool className="w-4 h-4 mr-1" />
                      Generate Post
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => generateProductVideo(product)}>
                      <Video className="w-4 h-4 mr-1" />
                      Create Video
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <a href={product.whatsappLink} target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        WhatsApp
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* ICT/Security Division */}
      <div className="mb-8">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
            <span className="text-2xl">📹</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-roshanal-navy">ICT/Security Division</h2>
            <p className="text-gray-600">Security systems, smart technology, and power solutions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {securityProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center text-2xl">
                  {product.image}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                      {product.category}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-3">{product.description}</p>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Key Features:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-roshanal-blue rounded-full mr-2"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => generateProductContent(product)}>
                      <PenTool className="w-4 h-4 mr-1" />
                      Generate Post
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => generateProductVideo(product)}>
                      <Video className="w-4 h-4 mr-1" />
                      Create Video
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <a href={product.whatsappLink} target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        WhatsApp
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <Card className="bg-gradient-to-r from-roshanal-navy to-roshanal-blue text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="mb-6 opacity-90">
            Contact our team for expert consultation on any of our products and services
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-roshanal-navy hover:bg-gray-100" asChild>
              <a href="https://wa.me/2348109522432" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp Us
              </a>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-roshanal-navy" asChild>
              <a href="tel:+2348109522432">
                📞 Call Now
              </a>
            </Button>
          </div>
          <div className="mt-4 text-sm opacity-75">
            📍 Port Harcourt, Rivers State, Nigeria<br/>
            🕒 Mon - Sat: 8AM - 6PM
          </div>
        </div>
      </Card>

      {/* Product Modal (for future use) */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">{selectedProduct.image}</div>
              <h3 className="text-xl font-semibold">{selectedProduct.name}</h3>
              <p className="text-gray-600">{selectedProduct.category}</p>
            </div>
            <p className="text-gray-700 mb-4">{selectedProduct.description}</p>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={() => generateProductContent(selectedProduct)}>
                Generate Content
              </Button>
              <Button variant="outline" onClick={() => setSelectedProduct(null)}>
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}