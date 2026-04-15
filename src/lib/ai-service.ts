import { Settings } from './hooks'

export interface AIGenerateOptions {
  prompt: string
  systemPrompt?: string
  temperature?: number
  maxTokens?: number
}

export interface SearchResult {
  title: string
  url: string
  content: string
}

export class AIService {
  private settings: Settings

  constructor(settings: Settings) {
    this.settings = settings
  }

  async generate(options: AIGenerateOptions): Promise<string> {
    const { prompt, systemPrompt, temperature = 0.7, maxTokens = 1024 } = options

    if (this.settings.aiProvider === 'openrouter') {
      return this.generateOpenRouter(prompt, systemPrompt, temperature, maxTokens)
    } else {
      return this.generateKIE(prompt, systemPrompt, temperature, maxTokens)
    }
  }

  private async generateOpenRouter(
    prompt: string,
    systemPrompt?: string,
    temperature?: number,
    maxTokens?: number
  ): Promise<string> {
    if (!this.settings.openrouterKey) {
      throw new Error('OpenRouter API key not configured. Please add it in Settings.')
    }

    const messages = []
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt })
    }
    messages.push({ role: 'user', content: prompt })

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.settings.openrouterKey}`,
        'HTTP-Referer': 'https://roshanalinfotech.com',
        'X-Title': 'Roshanal Marketing Platform'
      },
      body: JSON.stringify({
        model: this.settings.selectedModel,
        messages,
        temperature,
        max_tokens: maxTokens
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Failed to generate content')
    }

    const data = await response.json()
    return data.choices[0].message.content
  }

  private async generateKIE(
    prompt: string,
    systemPrompt?: string,
    temperature?: number,
    maxTokens?: number
  ): Promise<string> {
    if (!this.settings.kieKey) {
      throw new Error('KIE API key not configured. Please add it in Settings.')
    }

    const messages = []
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt })
    }
    messages.push({ role: 'user', content: prompt })

    const response = await fetch('https://api.kie.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.settings.kieKey}`
      },
      body: JSON.stringify({
        model: this.settings.kieModel,
        messages,
        temperature,
        max_tokens: maxTokens
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Failed to generate content')
    }

    const data = await response.json()
    return data.choices[0].message.content
  }

  async search(query: string): Promise<SearchResult[]> {
    if (!this.settings.searchKey) {
      throw new Error('Search API key not configured. Please add it in Settings.')
    }

    if (this.settings.searchProvider === 'tavily') {
      return this.searchTavily(query)
    } else {
      return this.searchSerper(query)
    }
  }

  private async searchTavily(query: string): Promise<SearchResult[]> {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        api_key: this.settings.searchKey,
        query,
        search_depth: 'basic',
        max_results: 5
      })
    })

    if (!response.ok) {
      throw new Error('Failed to perform search')
    }

    const data = await response.json()
    return data.results.map((result: any) => ({
      title: result.title,
      url: result.url,
      content: result.content
    }))
  }

  private async searchSerper(query: string): Promise<SearchResult[]> {
    const response = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'X-API-KEY': this.settings.searchKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ q: query })
    })

    if (!response.ok) {
      throw new Error('Failed to perform search')
    }

    const data = await response.json()
    return data.organic?.slice(0, 5).map((result: any) => ({
      title: result.title,
      url: result.link,
      content: result.snippet
    })) || []
  }

  getSystemPrompt(): string {
    return `You are an expert marketing copywriter for ${this.settings.companyName}, a ${this.settings.niche} company based in ${this.settings.location}.

Brand Tone: ${this.settings.tone}
Target Audience: ${this.settings.targetAudience}
Products/Services: ${this.settings.products}

Create high-quality, engaging marketing content that is specific to Roshanal Infotech's business.
Focus on solving customer problems and highlighting unique value propositions.
Include relevant hashtags when appropriate for social media.
Always maintain professionalism and trustworthiness.`
  }
}
