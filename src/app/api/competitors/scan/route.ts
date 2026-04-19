import { NextRequest, NextResponse } from 'next/server'

interface ScanRequest {
  competitorId: string
}

export async function POST(request: NextRequest) {
  try {
    const body: ScanRequest = await request.json()
    const { competitorId } = body

    // Get current user and workspace
    const { data: userData, error: userError } = await (await import('@/lib/insforge')).insforge.auth.getUser()
    if (userError || !userData.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: workspace } = await (await import('@/lib/insforge')).insforge
      .from('workspaces')
      .select('id')
      .eq('user_id', userData.user.id)
      .single()

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 })
    }

    // Get competitor
    const { data: competitor, error: competitorError } = await (await import('@/lib/insforge')).insforge
      .from('competitors')
      .select('*')
      .eq('id', competitorId)
      .eq('workspace_id', workspace.id)
      .single()

    if (competitorError || !competitor) {
      return NextResponse.json({ error: 'Competitor not found' }, { status: 404 })
    }

    // Perform competitor analysis
    const analysis = await analyzeCompetitor(competitor)

    // Update competitor with analysis
    const { error: updateError } = await (await import('@/lib/insforge')).insforge
      .from('competitors')
      .update({
        last_scanned: new Date().toISOString(),
        analysis_json: analysis
      })
      .eq('id', competitorId)

    if (updateError) {
      console.error('Error updating competitor analysis:', updateError)
    }

    return NextResponse.json({
      success: true,
      analysis
    })

  } catch (error) {
    console.error('Competitor scan error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Scan failed' },
      { status: 500 }
    )
  }
}

async function analyzeCompetitor(competitor: any) {
  const analysis = {
    posting_frequency: 0,
    top_hashtags: [] as string[],
    content_themes: [] as string[],
    social_followers: {},
    website_keywords: [] as string[],
    competitor_insights: [] as string[],
    last_updated: new Date().toISOString()
  }

  try {
    // Analyze website if provided
    if (competitor.website) {
      const websiteAnalysis = await analyzeWebsite(competitor.website)
      analysis.website_keywords = websiteAnalysis.keywords
      analysis.content_themes = websiteAnalysis.themes
    }

    // Analyze social media
    if (competitor.social_handles) {
      const socialAnalysis = await analyzeSocialMedia(competitor.social_handles)
      analysis.posting_frequency = socialAnalysis.posting_frequency
      analysis.top_hashtags = socialAnalysis.top_hashtags
      analysis.social_followers = socialAnalysis.followers
    }

    // Generate insights
    analysis.competitor_insights = generateInsights(analysis)

  } catch (error) {
    console.error('Error during competitor analysis:', error)
    // Return partial analysis if some parts fail
  }

  return analysis
}

async function analyzeWebsite(url: string) {
  // Mock website analysis - in production, this would scrape the website
  const mockKeywords = ['marketing', 'automation', 'leads', 'growth', 'sales']
  const mockThemes = ['Lead Generation', 'Marketing Automation', 'Sales Funnels', 'Customer Success']

  return {
    keywords: mockKeywords,
    themes: mockThemes
  }
}

async function analyzeSocialMedia(socialHandles: any) {
  // Mock social media analysis - in production, this would use APIs
  const mockAnalysis = {
    posting_frequency: 12, // posts per week
    top_hashtags: ['#marketing', '#sales', '#growth', '#automation', '#leads'],
    followers: {
      instagram: 15420,
      linkedin: 8920,
      twitter: 12340,
      facebook: 18750
    }
  }

  return mockAnalysis
}

function generateInsights(analysis: any) {
  const insights = []

  if (analysis.posting_frequency > 10) {
    insights.push('High posting frequency - consider increasing your content output')
  }

  if (analysis.top_hashtags.length > 0) {
    insights.push(`Trending hashtags: ${analysis.top_hashtags.slice(0, 3).join(', ')}`)
  }

  if (analysis.website_keywords.length > 0) {
    insights.push(`Focus keywords: ${analysis.website_keywords.slice(0, 3).join(', ')}`)
  }

  insights.push('Competitor analysis completed - review insights to optimize your strategy')

  return insights
}