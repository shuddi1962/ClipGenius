#!/usr/bin/env node

/**
 * Content Analysis MCP Agent
 * Analyzes content for SEO, readability, and engagement metrics
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import { getEncoding } from 'js-tigress';

class ContentAnalysisAgent {
  constructor() {
    this.apiKey = process.env.INSFORGE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MzE4MTd9.Sn-hRuWbI_2yY2PUGCd2lBU7Pis_Dv3YVNn8oZ7bzWs';
    this.baseURL = process.env.INSFORGE_URL || 'https://wk49fyqm.us-east.insforge.app';
  }

  async analyzeContent(content, options = {}) {
    try {
      const analysis = {
        wordCount: this.getWordCount(content),
        readingTime: this.getReadingTime(content),
        readabilityScore: this.getReadabilityScore(content),
        seoMetrics: await this.getSEOMetrics(content, options),
        engagementScore: this.getEngagementScore(content),
        sentimentAnalysis: this.getSentimentAnalysis(content),
        keywordDensity: this.getKeywordDensity(content),
        contentStructure: this.analyzeContentStructure(content),
      };

      return analysis;
    } catch (error) {
      console.error('Content analysis error:', error);
      throw error;
    }
  }

  getWordCount(text) {
    return text.trim().split(/\s+/).length;
  }

  getReadingTime(text, wordsPerMinute = 200) {
    const words = this.getWordCount(text);
    return Math.ceil(words / wordsPerMinute);
  }

  getReadabilityScore(text) {
    // Simplified Flesch Reading Ease Score
    const sentences = text.split(/[.!?]+/).length;
    const words = this.getWordCount(text);
    const syllables = this.countSyllables(text);

    if (sentences === 0 || words === 0) return 0;

    const score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
    return Math.max(0, Math.min(100, score));
  }

  countSyllables(text) {
    const words = text.toLowerCase().split(/\s+/);
    let syllables = 0;

    words.forEach(word => {
      syllables += word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
                        .replace(/^y/, '')
                        .match(/[aeiouy]{1,2}/g)?.length || 1;
    });

    return syllables;
  }

  async getSEOMetrics(content, options) {
    const title = options.title || '';
    const metaDescription = options.metaDescription || '';

    return {
      titleLength: title.length,
      titleScore: title.length >= 30 && title.length <= 60 ? 'good' : 'needs_work',
      metaDescriptionLength: metaDescription.length,
      metaDescriptionScore: metaDescription.length >= 120 && metaDescription.length <= 160 ? 'good' : 'needs_work',
      headings: this.analyzeHeadings(content),
      images: this.countImages(content),
      links: this.countLinks(content),
      keywordOptimization: this.analyzeKeywordOptimization(content, options.keywords || []),
    };
  }

  analyzeHeadings(content) {
    const h1Matches = content.match(/<h1[^>]*>.*?<\/h1>/gi) || [];
    const h2Matches = content.match(/<h2[^>]*>.*?<\/h2>/gi) || [];
    const h3Matches = content.match(/<h3[^>]*>.*?<\/h3>/gi) || [];

    return {
      h1: h1Matches.length,
      h2: h2Matches.length,
      h3: h3Matches.length,
      h1Score: h1Matches.length === 1 ? 'good' : 'needs_work',
      structure: h1Matches.length > 0 && h2Matches.length > 0 ? 'good' : 'needs_work',
    };
  }

  countImages(content) {
    const imgMatches = content.match(/<img[^>]+>/gi) || [];
    return {
      count: imgMatches.length,
      hasAltTags: imgMatches.filter(img => img.includes('alt=')).length,
      score: imgMatches.length > 0 ? 'good' : 'needs_work',
    };
  }

  countLinks(content) {
    const linkMatches = content.match(/<a[^>]+href=[^>]+>.*?<\/a>/gi) || [];
    const internalLinks = linkMatches.filter(link => !link.includes('http')).length;
    const externalLinks = linkMatches.filter(link => link.includes('http')).length;

    return {
      total: linkMatches.length,
      internal: internalLinks,
      external: externalLinks,
      score: linkMatches.length > 0 ? 'good' : 'needs_work',
    };
  }

  analyzeKeywordOptimization(content, keywords) {
    if (!keywords || keywords.length === 0) {
      return { score: 'no_keywords_provided' };
    }

    const contentLower = content.toLowerCase();
    const primaryKeyword = keywords[0]?.toLowerCase();

    if (!primaryKeyword) return { score: 'no_primary_keyword' };

    const occurrences = (contentLower.match(new RegExp(primaryKeyword, 'g')) || []).length;
    const density = (occurrences / this.getWordCount(content)) * 100;

    let score = 'good';
    if (density < 0.5) score = 'too_low';
    else if (density > 3) score = 'too_high';

    return {
      primaryKeyword,
      occurrences,
      density: density.toFixed(2) + '%',
      score,
      suggestions: density < 0.5 ? ['Add more instances of your primary keyword'] :
                   density > 3 ? ['Reduce keyword density to avoid over-optimization'] : [],
    };
  }

  getEngagementScore(content) {
    let score = 0;
    const wordCount = this.getWordCount(content);

    // Length score
    if (wordCount > 300) score += 20;
    else if (wordCount > 150) score += 10;

    // Question marks (engagement)
    const questions = (content.match(/\?/g) || []).length;
    score += Math.min(questions * 5, 20);

    // Exclamation marks (enthusiasm)
    const exclamations = (content.match(/!/g) || []).length;
    score += Math.min(exclamations * 3, 15);

    // Lists and bullets
    const lists = (content.match(/[-*•]\s/g) || []).length;
    score += Math.min(lists * 2, 15);

    // Readability bonus
    const readability = this.getReadabilityScore(content);
    if (readability > 60) score += 15;
    else if (readability > 40) score += 10;

    return Math.min(100, score);
  }

  getSentimentAnalysis(content) {
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'best', 'perfect', 'happy'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'worst', 'horrible', 'disappointed', 'poor', 'fail'];

    const contentLower = content.toLowerCase();
    const positiveCount = positiveWords.reduce((count, word) =>
      count + (contentLower.match(new RegExp(`\\b${word}\\b`, 'g')) || []).length, 0);
    const negativeCount = negativeWords.reduce((count, word) =>
      count + (contentLower.match(new RegExp(`\\b${word}\\b`, 'g')) || []).length, 0);

    let sentiment = 'neutral';
    if (positiveCount > negativeCount + 2) sentiment = 'positive';
    else if (negativeCount > positiveCount + 2) sentiment = 'negative';

    return {
      sentiment,
      positiveWords: positiveCount,
      negativeWords: negativeCount,
      confidence: Math.abs(positiveCount - negativeCount) / Math.max(positiveCount + negativeCount, 1),
    };
  }

  getKeywordDensity(content) {
    const words = content.toLowerCase().match(/\b\w+\b/g) || [];
    const wordCount = words.length;
    const wordFreq = {};

    words.forEach(word => {
      if (word.length > 3) { // Skip short words
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    });

    const keywords = Object.entries(wordFreq)
      .filter(([word, count]) => count > 1) // Only words that appear more than once
      .sort(([,a], [,b]) => b - a)
      .slice(0, 20)
      .map(([word, count]) => ({
        word,
        count,
        density: ((count / wordCount) * 100).toFixed(2) + '%',
      }));

    return keywords;
  }

  analyzeContentStructure(content) {
    const $ = cheerio.load(content);
    const headings = $('h1, h2, h3, h4, h5, h6').length;
    const paragraphs = $('p').length;
    const lists = $('ul, ol').length;
    const images = $('img').length;
    const links = $('a').length;

    return {
      headings,
      paragraphs,
      lists,
      images,
      links,
      structureScore: (headings > 0 && paragraphs > 0) ? 'good' : 'needs_work',
    };
  }

  async analyzeURL(url) {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; NexusBot/1.0)',
        },
        timeout: 10000,
      });

      const $ = cheerio.load(response.data);

      const title = $('title').text().trim();
      const metaDescription = $('meta[name="description"]').attr('content') || '';
      const h1 = $('h1').first().text().trim();
      const content = $('body').text();

      return this.analyzeContent(content, {
        title,
        metaDescription,
        url,
        h1,
      });
    } catch (error) {
      throw new Error(`Failed to analyze URL: ${error.message}`);
    }
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const agent = new ContentAnalysisAgent();

  if (args.length === 0) {
    console.log('Content Analysis MCP Agent');
    console.log('Usage:');
    console.log('  node content-analysis-agent.js <content>');
    console.log('  node content-analysis-agent.js --url <url>');
    return;
  }

  try {
    let result;

    if (args[0] === '--url' && args[1]) {
      console.log('🔍 Analyzing URL:', args[1]);
      result = await agent.analyzeURL(args[1]);
    } else {
      const content = args.join(' ');
      console.log('📝 Analyzing content...');
      result = await agent.analyzeContent(content);
    }

    console.log('\n📊 Analysis Results:');
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

export default ContentAnalysisAgent;

// Run CLI if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}