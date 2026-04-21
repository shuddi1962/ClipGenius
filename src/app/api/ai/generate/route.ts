import { NextRequest, NextResponse } from 'next/server'
import { AIService } from '@/lib/ai-service'
import { getSettings } from '@/lib/hooks'

export async function POST(request: NextRequest) {
  try {
    const {
      type,
      topic,
      platform,
      tone,
      targetAudience,
      keywords,
      prompt
    } = await request.json()

    if (!prompt && !topic) {
      return NextResponse.json(
        { error: 'Missing required fields: either prompt or topic' },
        { status: 400 }
      )
    }

    // Get user settings for AI service
    const settings = await getSettings()

    const aiService = new AIService(settings)

    // Create system prompt based on content type
    let systemPrompt = aiService.getSystemPrompt()

    // Add content-specific instructions
    const contentInstructions = getContentInstructions(type, platform, tone, targetAudience, keywords)
    systemPrompt += '\n\n' + contentInstructions

    // Create user prompt
    const userPrompt = prompt || generateUserPrompt(type, topic, platform, tone)

    // Generate content
    const generatedContent = await aiService.generate({
      prompt: userPrompt,
      systemPrompt,
      temperature: 0.7,
      maxTokens: 1024
    })

    // Process the response based on type
    const processedContent = processGeneratedContent(generatedContent, type)

    return NextResponse.json({
      content: processedContent.content,
      title: processedContent.title,
      hashtags: processedContent.hashtags
    })
  } catch (error) {
    console.error('Error generating AI content:', error)
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    )
  }
}

function getContentInstructions(type: string, platform: string, tone: string, targetAudience: string, keywords: string): string {
  let instructions = `Generate ${type} content with a ${tone} tone.`

  if (targetAudience) {
    instructions += ` Target audience: ${targetAudience}.`
  }

  if (keywords) {
    instructions += ` Include these keywords: ${keywords}.`
  }

  switch (type) {
    case 'post':
      instructions += ` Create engaging social media post content for ${platform || 'social media'}. Include relevant emojis and hashtags. Keep it concise and engaging.`
      break
    case 'email':
      instructions += ` Create professional email content with subject line, greeting, body, and call-to-action.`
      break
    case 'ad':
      instructions += ` Create compelling advertisement copy that's persuasive and action-oriented.`
      break
    case 'bio':
      instructions += ` Create a professional profile/bio description that's concise and impactful.`
      break
    default:
      instructions += ` Create high-quality, engaging content.`
  }

  return instructions
}

function generateUserPrompt(type: string, topic: string, platform: string, tone: string): string {
  switch (type) {
    case 'post':
      return `Create a ${tone} social media post about: ${topic}. Make it engaging for ${platform || 'social media'}.`
    case 'email':
      return `Write a ${tone} email about: ${topic}. Include subject line and professional content.`
    case 'ad':
      return `Create compelling ad copy for: ${topic}. Make it persuasive and action-oriented.`
    case 'bio':
      return `Write a professional bio/profile description for someone in: ${topic}.`
    default:
      return `Generate content about: ${topic}`
  }
}

function processGeneratedContent(content: string, type: string): { content: string, title?: string, hashtags?: string[] } {
  if (type === 'email') {
    // Try to extract subject line
    const subjectMatch = content.match(/^Subject:\s*(.+)$/m)
    const title = subjectMatch ? subjectMatch[1] : undefined

    return {
      content: content.replace(/^Subject:\s*.+\n/, ''), // Remove subject line from content
      title
    }
  }

  if (type === 'post') {
    // Extract hashtags
    const hashtagRegex = /#[\w]+/g
    const hashtags = content.match(hashtagRegex) || []
    const contentWithoutHashtags = content.replace(hashtagRegex, '').trim()

    return {
      content: contentWithoutHashtags,
      hashtags: hashtags.slice(0, 10) // Limit to 10 hashtags
    }
  }

  return { content }
}