import { NextRequest, NextResponse } from 'next/server'

interface SocialPostRequest {
  platform: 'facebook' | 'instagram' | 'linkedin' | 'twitter'
  content: string
  mediaUrls?: string[]
  scheduledAt?: string
  accountId: string
}

export async function POST(request: NextRequest) {
  try {
    const body: SocialPostRequest = await request.json()
    const { platform, content, mediaUrls, scheduledAt, accountId } = body

    if (!platform || !content || !accountId) {
      return NextResponse.json(
        { error: 'Missing required fields: platform, content, accountId' },
        { status: 400 }
      )
    }

    // Get current user and workspace
    const { data: userData, error: userError } = await (await import('@/lib/insforge')).default.auth.getUser()
    if (userError || !userData.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: workspace } = await (await import('@/lib/insforge')).default
      .from('workspaces')
      .select('id')
      .eq('user_id', userData.user.id)
      .single()

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 })
    }

    // Get connected account
    const { data: account, error: accountError } = await (await import('@/lib/insforge')).default
      .from('connected_accounts')
      .select('*')
      .eq('id', accountId)
      .eq('workspace_id', workspace.id)
      .single()

    if (accountError || !account) {
      return NextResponse.json({ error: 'Connected account not found' }, { status: 404 })
    }

    // Post to social media platform
    const result = await postToPlatform(platform, content, mediaUrls, account)

    // Save post record
    const { data: postRecord, error: postError } = await (await import('@/lib/insforge')).default
      .from('scheduled_posts')
      .insert({
        workspace_id: workspace.id,
        platform,
        content,
        media_urls: mediaUrls || [],
        scheduled_at: scheduledAt || new Date().toISOString(),
        status: 'published',
        published_at: new Date().toISOString(),
        platform_post_id: result.postId,
        account_id: accountId
      })
      .select()
      .single()

    if (postError) {
      console.error('Error saving post record:', postError)
      // Don't fail the request if saving fails, but log it
    }

    return NextResponse.json({
      success: true,
      postId: result.postId,
      url: result.url,
      recordId: postRecord?.id
    })

  } catch (error) {
    console.error('Social media posting error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Posting failed' },
      { status: 500 }
    )
  }
}

async function postToPlatform(platform: string, content: string, mediaUrls: string[] = [], account: any) {
  // This would integrate with actual social media APIs
  // For now, simulate posting with mock responses

  switch (platform) {
    case 'facebook':
      return await postToFacebook(content, mediaUrls, account)

    case 'instagram':
      return await postToInstagram(content, mediaUrls, account)

    case 'linkedin':
      return await postToLinkedIn(content, mediaUrls, account)

    case 'twitter':
      return await postToTwitter(content, mediaUrls, account)

    default:
      throw new Error(`Unsupported platform: ${platform}`)
  }
}

async function postToFacebook(content: string, mediaUrls: string[], account: any) {
  // Mock Facebook posting
  // In production, this would use Facebook Graph API
  console.log('Posting to Facebook:', { content, mediaUrls, account })

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  return {
    postId: `fb_${Date.now()}`,
    url: `https://facebook.com/${account.account_id}/posts/${Date.now()}`
  }
}

async function postToInstagram(content: string, mediaUrls: string[], account: any) {
  // Mock Instagram posting
  // In production, this would use Instagram Basic Display API or Graph API
  console.log('Posting to Instagram:', { content, mediaUrls, account })

  await new Promise(resolve => setTimeout(resolve, 1200))

  return {
    postId: `ig_${Date.now()}`,
    url: `https://instagram.com/p/${Date.now()}`
  }
}

async function postToLinkedIn(content: string, mediaUrls: string[], account: any) {
  // Mock LinkedIn posting
  // In production, this would use LinkedIn Marketing API
  console.log('Posting to LinkedIn:', { content, mediaUrls, account })

  await new Promise(resolve => setTimeout(resolve, 800))

  return {
    postId: `li_${Date.now()}`,
    url: `https://linkedin.com/feed/update/${Date.now()}`
  }
}

async function postToTwitter(content: string, mediaUrls: string[], account: any) {
  // Mock Twitter posting
  // In production, this would use Twitter API v2
  console.log('Posting to Twitter:', { content, mediaUrls, account })

  await new Promise(resolve => setTimeout(resolve, 600))

  return {
    postId: `tw_${Date.now()}`,
    url: `https://twitter.com/${account.account_name}/status/${Date.now()}`
  }
}