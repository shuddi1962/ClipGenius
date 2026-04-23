#!/usr/bin/env node

/**
 * SEO Analysis MCP Agent
 * Comprehensive SEO analysis for websites and content
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import { getEncoding } from 'js-tigress';

class SEOAnalysisAgent {
  constructor() {
    this.apiKey = process.env.INSFORGE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MzE4MTd9.Sn-hRuWbI_2yY2PUGCd2lBU7Pis_Dv3YVNn8oZ7bzWs';
    this.baseURL = process.env.INSFORGE_URL || 'https://wk49fyqm.us-east.insforge.app';
  }

  async analyzeSEO(url, options = {}) {
    try {
      console.log(`🔍 Analyzing SEO for: ${url}`);

      // Fetch page content
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; NexusSEO/1.0)',
        },
        timeout: 15000,
      });

      const $ = cheerio.load(response.data);
      const analysis = {
        url,
        timestamp: new Date().toISOString(),
        technicalSEO: await this.analyzeTechnicalSEO($, response),
        onPageSEO: this.analyzeOnPageSEO($, url),
        contentSEO: this.analyzeContentSEO($),
        performance: this.analyzePerformance(response),
        recommendations: [],
        score: 0,
      };

      // Generate recommendations
      analysis.recommendations = this.generateRecommendations(analysis);

      // Calculate overall score
      analysis.score = this.calculateOverallScore(analysis);

      return analysis;
    } catch (error) {
      throw new Error(`SEO analysis failed: ${error.message}`);
    }
  }

  async analyzeTechnicalSEO($, response) {
    const technical = {
      statusCode: response.status,
      loadTime: response.duration || 0,
      contentType: response.headers['content-type'] || '',
      encoding: this.detectEncoding(response.data),
      https: response.request.protocol === 'https:',
      mobileFriendly: this.checkMobileFriendly($),
      structuredData: this.analyzeStructuredData($),
      canonical: this.checkCanonical($),
      robots: this.checkRobots($),
      sitemap: await this.checkSitemap($, response.request.host),
    };

    return technical;
  }

  analyzeOnPageSEO($, url) {
    const title = $('title').text().trim();
    const metaDescription = $('meta[name="description"]').attr('content') || '';
    const h1Tags = $('h1').map((i, el) => $(el).text().trim()).get();
    const h2Tags = $('h2').map((i, el) => $(el).text().trim()).get();

    return {
      title: {
        content: title,
        length: title.length,
        score: title.length >= 30 && title.length <= 60 ? 'good' : 'needs_work',
      },
      metaDescription: {
        content: metaDescription,
        length: metaDescription.length,
        score: metaDescription.length >= 120 && metaDescription.length <= 160 ? 'good' : 'needs_work',
      },
      headings: {
        h1: h1Tags,
        h1Count: h1Tags.length,
        h1Score: h1Tags.length === 1 ? 'good' : 'needs_work',
        h2: h2Tags.slice(0, 5), // First 5 H2s
        h2Count: h2Tags.length,
      },
      urlStructure: this.analyzeURLStructure(url),
      internalLinks: this.countInternalLinks($, url),
      externalLinks: this.countExternalLinks($, url),
    };
  }

  analyzeContentSEO($) {
    const bodyText = $('body').text();
    const wordCount = bodyText.trim().split(/\s+/).length;
    const images = $('img').length;
    const imagesWithAlt = $('img[alt]').length;

    return {
      wordCount,
      contentScore: wordCount > 300 ? 'good' : wordCount > 150 ? 'adequate' : 'needs_work',
      images: {
        total: images,
        withAlt: imagesWithAlt,
        altScore: images > 0 && imagesWithAlt === images ? 'good' : 'needs_work',
      },
      keywordAnalysis: this.analyzeKeywordUsage(bodyText),
      readability: this.calculateReadability(bodyText),
    };
  }

  analyzePerformance(response) {
    const contentLength = response.data ? response.data.length : 0;
    const loadTime = response.duration || 0;

    return {
      pageSize: contentLength,
      loadTime,
      sizeScore: contentLength < 500000 ? 'good' : contentLength < 1000000 ? 'adequate' : 'needs_work',
      speedScore: loadTime < 1000 ? 'good' : loadTime < 3000 ? 'adequate' : 'needs_work',
    };
  }

  detectEncoding(data) {
    try {
      // Simple encoding detection
      const sample = data.substring(0, 1000);
      if (sample.includes('charset=utf-8') || sample.includes('charset=UTF-8')) {
        return 'UTF-8';
      }
      return 'Unknown';
    } catch {
      return 'Unknown';
    }
  }

  checkMobileFriendly($) {
    const viewport = $('meta[name="viewport"]').attr('content') || '';
    return viewport.includes('width=device-width');
  }

  analyzeStructuredData($) {
    const jsonLd = $('script[type="application/ld+json"]');
    const microdata = $('[itemtype]');
    const rdfa = $('[typeof]');

    return {
      jsonLd: jsonLd.length,
      microdata: microdata.length,
      rdfa: rdfa.length,
      total: jsonLd.length + microdata.length + rdfa.length,
      score: jsonLd.length > 0 ? 'good' : 'missing',
    };
  }

  checkCanonical($) {
    const canonical = $('link[rel="canonical"]').attr('href');
    return {
      exists: !!canonical,
      url: canonical || null,
      score: canonical ? 'good' : 'missing',
    };
  }

  checkRobots($) {
    const robots = $('meta[name="robots"]').attr('content') || '';
    return {
      exists: !!robots,
      content: robots,
      noindex: robots.includes('noindex'),
      nofollow: robots.includes('nofollow'),
      score: robots ? 'good' : 'missing',
    };
  }

  async checkSitemap($, domain) {
    try {
      const sitemapUrls = [
        `https://${domain}/sitemap.xml`,
        `https://${domain}/sitemap.xml.gz`,
        `https://${domain}/sitemap/`,
      ];

      for (const url of sitemapUrls) {
        try {
          const response = await axios.head(url, { timeout: 5000 });
          if (response.status === 200) {
            return { exists: true, url, score: 'good' };
          }
        } catch {
          continue;
        }
      }

      return { exists: false, url: null, score: 'missing' };
    } catch {
      return { exists: false, url: null, score: 'missing' };
    }
  }

  analyzeURLStructure(url) {
    const urlObj = new URL(url);
    const pathSegments = urlObj.pathname.split('/').filter(segment => segment);

    return {
      length: url.length,
      segments: pathSegments.length,
      hasKeywords: pathSegments.some(segment => segment.length > 3),
      clean: !url.includes('?') && !url.includes('#'),
      score: url.length < 100 && pathSegments.length < 4 ? 'good' : 'adequate',
    };
  }

  countInternalLinks($, baseUrl) {
    const links = $('a[href]').map((i, el) => $(el).attr('href')).get();
    const baseDomain = new URL(baseUrl).hostname;

    const internal = links.filter(href => {
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return false;
      }
      try {
        const url = new URL(href, baseUrl);
        return url.hostname === baseDomain;
      } catch {
        return !href.startsWith('http');
      }
    });

    return {
      count: internal.length,
      score: internal.length > 0 ? 'good' : 'needs_work',
    };
  }

  countExternalLinks($, baseUrl) {
    const links = $('a[href]').map((i, el) => $(el).attr('href')).get();
    const baseDomain = new URL(baseUrl).hostname;

    const external = links.filter(href => {
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return false;
      }
      try {
        const url = new URL(href, baseUrl);
        return url.hostname !== baseDomain;
      } catch {
        return href.startsWith('http');
      }
    });

    return {
      count: external.length,
      score: external.length > 0 ? 'good' : 'adequate',
    };
  }

  analyzeKeywordUsage(text) {
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const wordCount = words.length;
    const stopWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'an', 'a'];

    const filteredWords = words.filter(word => word.length > 3 && !stopWords.includes(word));
    const wordFreq = {};

    filteredWords.forEach(word => {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });

    const topKeywords = Object.entries(wordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word, count]) => ({
        word,
        count,
        density: ((count / wordCount) * 100).toFixed(2) + '%',
      }));

    return {
      totalWords: wordCount,
      uniqueWords: Object.keys(wordFreq).length,
      topKeywords,
    };
  }

  calculateReadability(text) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
    const words = text.trim().split(/\s+/).length;
    const syllables = this.countSyllables(text);

    if (sentences === 0 || words === 0) return { score: 0, level: 'unknown' };

    // Flesch Reading Ease
    const score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);

    let level = 'very difficult';
    if (score >= 90) level = 'very easy';
    else if (score >= 80) level = 'easy';
    else if (score >= 70) level = 'fairly easy';
    else if (score >= 60) level = 'standard';
    else if (score >= 50) level = 'fairly difficult';
    else if (score >= 30) level = 'difficult';

    return {
      score: Math.max(0, Math.min(100, score)),
      level,
      sentences,
      words,
      syllables,
    };
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

  generateRecommendations(analysis) {
    const recommendations = [];

    // Technical SEO
    if (!analysis.technicalSEO.https) {
      recommendations.push({
        type: 'critical',
        category: 'technical',
        title: 'Enable HTTPS',
        description: 'Your site should use HTTPS for security and SEO benefits.',
      });
    }

    if (!analysis.technicalSEO.canonical.exists) {
      recommendations.push({
        type: 'high',
        category: 'technical',
        title: 'Add Canonical URL',
        description: 'Add a canonical URL tag to prevent duplicate content issues.',
      });
    }

    if (analysis.technicalSEO.structuredData.total === 0) {
      recommendations.push({
        type: 'medium',
        category: 'technical',
        title: 'Add Structured Data',
        description: 'Implement JSON-LD structured data for better search visibility.',
      });
    }

    // On-page SEO
    if (analysis.onPageSEO.title.score !== 'good') {
      recommendations.push({
        type: 'high',
        category: 'onpage',
        title: 'Optimize Title Tag',
        description: `Title should be 30-60 characters. Current: ${analysis.onPageSEO.title.length} characters.`,
      });
    }

    if (analysis.onPageSEO.metaDescription.score !== 'good') {
      recommendations.push({
        type: 'high',
        category: 'onpage',
        title: 'Optimize Meta Description',
        description: `Meta description should be 120-160 characters. Current: ${analysis.onPageSEO.metaDescription.length} characters.`,
      });
    }

    if (analysis.onPageSEO.headings.h1Score !== 'good') {
      recommendations.push({
        type: 'high',
        category: 'onpage',
        title: 'Fix H1 Tags',
        description: `Pages should have exactly one H1 tag. Found: ${analysis.onPageSEO.headings.h1Count}.`,
      });
    }

    // Content SEO
    if (analysis.contentSEO.contentScore === 'needs_work') {
      recommendations.push({
        type: 'medium',
        category: 'content',
        title: 'Increase Content Length',
        description: `Add more content. Current: ${analysis.contentSEO.wordCount} words. Aim for 300+ words.`,
      });
    }

    if (analysis.contentSEO.images.altScore === 'needs_work') {
      recommendations.push({
        type: 'medium',
        category: 'content',
        title: 'Add Alt Tags to Images',
        description: 'All images should have descriptive alt text for accessibility and SEO.',
      });
    }

    // Performance
    if (analysis.performance.speedScore === 'needs_work') {
      recommendations.push({
        type: 'medium',
        category: 'performance',
        title: 'Improve Page Speed',
        description: `Page load time: ${analysis.performance.loadTime}ms. Aim for under 3000ms.`,
      });
    }

    return recommendations.slice(0, 10); // Top 10 recommendations
  }

  calculateOverallScore(analysis) {
    let score = 0;
    let maxScore = 0;

    // Technical SEO (30 points)
    maxScore += 30;
    if (analysis.technicalSEO.https) score += 10;
    if (analysis.technicalSEO.canonical.exists) score += 5;
    if (analysis.technicalSEO.structuredData.total > 0) score += 5;
    if (analysis.technicalSEO.mobileFriendly) score += 5;
    if (analysis.technicalSEO.statusCode === 200) score += 5;

    // On-page SEO (30 points)
    maxScore += 30;
    if (analysis.onPageSEO.title.score === 'good') score += 8;
    if (analysis.onPageSEO.metaDescription.score === 'good') score += 7;
    if (analysis.onPageSEO.headings.h1Score === 'good') score += 6;
    if (analysis.onPageSEO.headings.h2Count > 0) score += 5;
    if (analysis.onPageSEO.urlStructure.score === 'good') score += 4;

    // Content SEO (25 points)
    maxScore += 25;
    if (analysis.contentSEO.contentScore === 'good') score += 10;
    if (analysis.contentSEO.images.altScore === 'good') score += 5;
    if (analysis.contentSEO.readability.score > 50) score += 10;

    // Performance (15 points)
    maxScore += 15;
    if (analysis.performance.speedScore === 'good') score += 8;
    if (analysis.performance.sizeScore === 'good') score += 7;

    return Math.round((score / maxScore) * 100);
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const agent = new SEOAnalysisAgent();

  if (args.length === 0) {
    console.log('SEO Analysis MCP Agent');
    console.log('Usage:');
    console.log('  node seo-analysis-agent.js <url>');
    console.log('  node seo-analysis-agent.js --help');
    return;
  }

  if (args[0] === '--help') {
    console.log('SEO Analysis MCP Agent');
    console.log('');
    console.log('Analyzes websites for SEO performance and provides recommendations.');
    console.log('');
    console.log('Usage:');
    console.log('  node seo-analysis-agent.js <url> [options]');
    console.log('');
    console.log('Options:');
    console.log('  --json        Output in JSON format');
    console.log('  --verbose     Show detailed analysis');
    console.log('');
    console.log('Example:');
    console.log('  node seo-analysis-agent.js https://example.com');
    return;
  }

  try {
    const url = args[0];
    const options = {
      json: args.includes('--json'),
      verbose: args.includes('--verbose'),
    };

    const result = await agent.analyzeSEO(url);

    if (options.json) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log(`\n🔍 SEO Analysis for: ${url}`);
      console.log(`📊 Overall Score: ${result.score}/100`);

      console.log('\n📈 Quick Stats:');
      console.log(`   Status Code: ${result.technicalSEO.statusCode}`);
      console.log(`   Title: ${result.onPageSEO.title.content.substring(0, 50)}...`);
      console.log(`   Word Count: ${result.contentSEO.wordCount}`);
      console.log(`   Load Time: ${result.performance.loadTime}ms`);

      if (result.recommendations.length > 0) {
        console.log('\n💡 Top Recommendations:');
        result.recommendations.slice(0, 5).forEach((rec, i) => {
          console.log(`   ${i + 1}. ${rec.title}`);
        });
      }

      if (options.verbose) {
        console.log('\n📋 Detailed Analysis:');
        console.log(JSON.stringify(result, null, 2));
      }
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

export default SEOAnalysisAgent;

// Run CLI if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}