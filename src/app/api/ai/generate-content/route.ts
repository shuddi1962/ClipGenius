import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const {
      businessName,
      businessType,
      industry,
      products,
      targetAudience,
      brandVoice,
      keyMessage,
      platform,
      contentType,
      duration,
      goals
    } = await request.json()

    if (!businessName || !industry || !products) {
      return NextResponse.json(
        { error: 'Missing required fields: businessName, industry, products' },
        { status: 400 }
      )
    }

    // Generate comprehensive content calendar
    const contentCalendar = generateContentCalendar({
      businessName,
      businessType,
      industry,
      products,
      targetAudience,
      brandVoice,
      keyMessage,
      platform,
      contentType,
      duration: parseInt(duration),
      goals
    })

    return NextResponse.json({
      calendar: contentCalendar,
      summary: {
        totalPosts: contentCalendar.length,
        educationalPosts: contentCalendar.filter(day => day.theme.toLowerCase().includes('safety') || day.theme.toLowerCase().includes('education') || day.theme.toLowerCase().includes('tips')).length,
        promotionalPosts: contentCalendar.filter(day => day.theme.toLowerCase().includes('special') || day.theme.toLowerCase().includes('product') || day.theme.toLowerCase().includes('showcase')).length,
        interactivePosts: contentCalendar.filter(day => day.contentType.toLowerCase().includes('poll') || day.contentType.toLowerCase().includes('question') || day.contentType.toLowerCase().includes('story')).length
      }
    })
  } catch (error) {
    console.error('Error generating content:', error)
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    )
  }
}

function generateContentCalendar(data: any) {
  const { businessName, businessType, industry, products, targetAudience, brandVoice, keyMessage, platform, contentType, duration } = data

  // Industry-specific content themes
  const themes: Record<string, string[]> = {
    marine: [
      'Marine Safety Essentials',
      'Boat Equipment Showcase',
      'Safety Tips for Boaters',
      'Customer Success Stories',
      'Special Offers & Deals',
      'Behind the Scenes',
      'Marine Industry News'
    ],
    safety: [
      'Safety Equipment Guide',
      'Life-Saving Products',
      'Workplace Safety',
      'Emergency Preparedness',
      'Safety Certifications',
      'Customer Testimonials',
      'Safety Promotions'
    ],
    technology: [
      'Latest Tech Solutions',
      'Smart Security Systems',
      'Tech Product Showcase',
      'Innovation Updates',
      'Customer Success Stories',
      'Tech Tips & Tricks',
      'Special Tech Offers'
    ],
    energy: [
      'Solar Power Solutions',
      'Clean Energy Benefits',
      'Power Backup Systems',
      'Energy Efficiency Tips',
      'Solar Installation Stories',
      'Green Energy Promotions',
      'Power System Maintenance'
    ]
  }

  const industryThemes = themes[industry as keyof typeof themes] || themes.marine
  const calendar = []

  for (let day = 1; day <= duration; day++) {
    const themeIndex = (day - 1) % industryThemes.length
    const theme = industryThemes[themeIndex]

    let dayContent = {
      day,
      theme,
      platform: platform === 'all' ? 'Instagram' : platform.charAt(0).toUpperCase() + platform.slice(1),
      contentType: getContentType(contentType, day),
      postingTime: getPostingTime(platform, day),
      caption: generateCaption(theme, businessName, products, keyMessage, brandVoice),
      hashtags: generateHashtags(theme, industry),
      cta: generateCTA(theme, businessName),
      visualSuggestions: getVisualSuggestions(theme, industry)
    }

    // Add voiceover for video content
    if (contentType === 'video' || (contentType === 'mixed' && day % 2 === 0)) {
      dayContent.voiceover = generateVoiceover(theme, businessName, products, targetAudience)
    }

    calendar.push(dayContent)
  }

  return calendar
}

function getContentType(contentType: string, day: number) {
  if (contentType === 'carousel') return 'Image Carousel (8-10 slides)'
  if (contentType === 'video') return 'Short Video (30-45 seconds)'
  if (contentType === 'mixed') {
    return day % 3 === 0 ? 'Stories Series' : day % 2 === 0 ? 'Short Video (30 seconds)' : 'Image Carousel (6 slides)'
  }
  return 'Image Carousel (8 slides)'
}

function getPostingTime(platform: string, day: number) {
  const times = {
    instagram: ['7:00 AM', '12:00 PM', '6:00 PM', '8:00 PM'],
    facebook: ['9:00 AM', '1:00 PM', '7:00 PM'],
    tiktok: ['6:00 PM', '8:00 PM', '10:00 PM'],
    all: ['7:00 AM', '12:00 PM', '6:00 PM', '8:00 PM']
  }
  const platformTimes = times[platform] || times.all
  return platformTimes[day % platformTimes.length]
}

function generateCaption(theme: string, businessName: string, products: string, keyMessage: string, brandVoice: string) {
  const templates = {
    'Marine Safety Essentials': `🌊 MARINE SAFETY STARTS HERE 🌊\n\nYour safety is our priority at ${businessName}! We provide top-quality ${products} to keep you safe on the water.\n\n${keyMessage}\n#MarineSafety #BoatSafety`,
    'Boat Equipment Showcase': `🚤 PREMIUM BOAT SOLUTIONS 🚤\n\nDiscover our range of ${products} designed for maximum performance and reliability.\n\nPerfect for all your marine needs!\n\n${keyMessage}`,
    'Safety Tips for Boaters': `🛟 MARINE SAFETY 101 🛟\n\nEssential safety tips for every boater:\n✅ Always wear your life jacket\n✅ Check weather conditions\n✅ Know your limits\n✅ Carry emergency equipment\n\nStay safe with ${businessName}!`,
    'Customer Success Stories': `🌟 CUSTOMER SUCCESS STORIES 🌟\n\nReal results from our valued customers who trust ${businessName} for their ${products} needs.\n\n"Thank you for keeping us safe!"\n\n${keyMessage}`,
    'Special Offers & Deals': `🔥 LIMITED TIME OFFERS 🔥\n\nDon't miss these amazing deals on our premium ${products}!\n\nSave big while staying safe and prepared.\n\n${keyMessage}`,
    'Behind the Scenes': `⚡ BEHIND THE SCENES ⚡\n\nTake a look at how we ensure quality in every ${products} we deliver.\n\nProfessional craftsmanship you can trust!\n\n${keyMessage}`,
    'Safety Equipment Guide': `🛟 YOUR SAFETY GUIDE 🛟\n\nComplete guide to essential safety equipment from ${businessName}.\n\n${products} designed to protect what matters most.\n\n${keyMessage}`
  }

  return templates[theme] || `${theme}\n\nDiscover our ${products} at ${businessName}.\n\n${keyMessage}`
}

function generateHashtags(theme: string, industry: string) {
  const baseHashtags = ['#SafetyFirst', '#QualityProducts', '#ProfessionalService']

  const industryHashtags = {
    marine: ['#MarineSafety', '#BoatLife', '#WaterSafety', '#MarineEquipment', '#Boating'],
    safety: ['#SafetyEquipment', '#LifeSafety', '#EmergencyPreparedness', '#WorkplaceSafety'],
    technology: ['#TechSolutions', '#SmartSecurity', '#LatestTechnology', '#Innovation'],
    energy: ['#SolarPower', '#CleanEnergy', '#RenewableEnergy', '#PowerSolutions']
  }

  const themeHashtags = {
    'Marine Safety Essentials': ['#LifeJacket', '#BoatSafety', '#WaterSafety'],
    'Boat Equipment Showcase': ['#BoatEquipment', '#MarineTech', '#Boating'],
    'Safety Tips': ['#SafetyTips', '#StaySafe', '#Preparedness'],
    'Customer Stories': ['#CustomerSuccess', '#HappyCustomers', '#Testimonials'],
    'Special Offers': ['#SpecialDeals', '#LimitedTime', '#SaveNow'],
    'Behind the Scenes': ['#BehindTheScenes', '#QualityAssurance', '#Manufacturing']
  }

  return [
    ...baseHashtags,
    ...(industryHashtags[industry] || []),
    ...(themeHashtags[theme] || [])
  ].slice(0, 8)
}

function generateCTA(theme: string, businessName: string) {
  const ctas = {
    'Marine Safety Essentials': 'DM "SAFETY" for your free marine safety checklist!',
    'Boat Equipment Showcase': 'DM "BOAT" to discuss your marine equipment needs!',
    'Safety Tips': 'DM "TIPS" for more safety advice!',
    'Customer Stories': 'Ready to join our satisfied customers? DM "QUOTE"!',
    'Special Offers': '⏰ Limited time offer! DM "DEAL" to claim yours!',
    'Behind the Scenes': 'DM "VISIT" to see our facilities in person!'
  }

  return ctas[theme] || `DM us today for more information about ${businessName}!`
}

function getVisualSuggestions(theme: string, industry: string) {
  const suggestions = {
    'Marine Safety Essentials': 'High-quality photos of life jackets, life buoys, and safety kits. Use bright, contrasting colors. Show products in action on boats.',
    'Boat Equipment Showcase': 'Professional product shots of boat engines, accessories. Include before/after installation photos.',
    'Safety Tips': 'Infographic-style images with safety tips, checklist graphics, real-life safety scenarios.',
    'Customer Stories': 'Customer photos (with permission), testimonial quotes overlaid on product images.',
    'Special Offers': 'Eye-catching promotional graphics with discount percentages, limited time banners.',
    'Behind the Scenes': 'Workshop photos, installation process shots, team photos, equipment assembly.'
  }

  return suggestions[theme] || 'Use high-quality product photos with clear, professional lighting. Include your brand colors and logo.'
}

function generateVoiceover(theme: string, businessName: string, products: string, targetAudience: string) {
  const scripts = {
    'Marine Safety Essentials': `Hey everyone! Safety first when you're on the water! At ${businessName}, we provide top-quality ${products} to keep you safe. Don't risk it - stay safe with equipment you can trust! Visit us or DM for details.`,
    'Boat Equipment Showcase': `Discover premium boat solutions at ${businessName}! Our ${products} are designed for maximum performance and reliability. Perfect for all your marine needs. Get yours today!`,
    'Safety Tips': `Marine safety 101 - essential tips for every boater from ${businessName}. Always wear your life jacket, check weather conditions, and carry emergency equipment. Stay safe out there!`,
    'Customer Success Stories': `Real stories from our satisfied customers at ${businessName}. They trust us for their ${products} needs. Ready to join them? Contact us today!`
  }

  return scripts[theme] || `Welcome to ${businessName}! We specialize in ${products} for ${targetAudience}. Quality and safety you can trust. Visit us today!`
}