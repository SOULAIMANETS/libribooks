#!/usr/bin/env tsx
/**
 * SEO & AI-Search Audit Script for Libribooks
 * Run with: npx tsx scripts/seo-audit.ts
 */

import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://www.libribooks.com';

interface AuditResult {
  page: string;
  checks: Record<string, { pass: boolean; message: string }>;
  score: number;
}

const results: AuditResult[] = [];

async function fetchPage(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.text();
}

function checkMeta(html: string): Record<string, { pass: boolean; message: string }> {
  const checks: Record<string, { pass: boolean; message: string }> = {};

  const titleMatch = html.match(/<title>(.*?)<\/title>/);
  checks.title = {
    pass: !!titleMatch && titleMatch[1].length > 10,
    message: titleMatch ? `Found: "${titleMatch[1]}"` : 'Missing <title> tag',
  };

  const descMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"/i);
  checks.description = {
    pass: !!descMatch && descMatch[1].length > 50,
    message: descMatch ? `Found (${descMatch[1].length} chars)` : 'Missing or too short meta description',
  };

  const canonicalMatch = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"/i);
  checks.canonical = {
    pass: !!canonicalMatch,
    message: canonicalMatch ? `Found: ${canonicalMatch[1]}` : 'Missing canonical link',
  };

  const aiSummaryMatch = html.match(/<meta[^>]*name="ai-summary"[^>]*content="([^"]*)"/i);
  checks['ai-summary'] = {
    pass: !!aiSummaryMatch,
    message: aiSummaryMatch ? 'Found AI summary meta tag' : 'Missing ai-summary meta tag',
  };

  const ogTitleMatch = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]*)"/i);
  checks['og:title'] = {
    pass: !!ogTitleMatch,
    message: ogTitleMatch ? 'Found OpenGraph title' : 'Missing OpenGraph title',
  };

  const twitterMatch = html.match(/<meta[^>]*name="twitter:card"[^>]*content="([^"]*)"/i);
  checks['twitter:card'] = {
    pass: !!twitterMatch,
    message: twitterMatch ? 'Found Twitter card' : 'Missing Twitter card',
  };

  const jsonLdCount = (html.match(/<script[^>]*type="application\/ld\+json"[^>]*>/gi) || []).length;
  checks['json-ld'] = {
    pass: jsonLdCount > 0,
    message: `${jsonLdCount} JSON-LD block(s) found`,
  };

  const speakableMatch = html.match(/SpeakableSpecification/gi);
  checks.speakable = {
    pass: !!speakableMatch,
    message: speakableMatch ? 'Found speakable selectors' : 'Missing speakable specification',
  };

  return checks;
}

async function audit() {
  const pages = [
    { path: '/', name: 'Homepage' },
    { path: '/about', name: 'About' },
    { path: '/contact', name: 'Contact' },
    { path: '/faq', name: 'FAQ' },
    { path: '/terms', name: 'Terms' },
    { path: '/privacy-policy', name: 'Privacy Policy' },
    { path: '/cookie-policy', name: 'Cookie Policy' },
    { path: '/how-we-choose', name: 'How We Choose' },
    { path: '/skills', name: 'Skills Index' },
  ];

  console.log('🔍 Libribooks SEO & AI-Search Audit\n');
  console.log('='.repeat(60));

  for (const { path: pagePath, name } of pages) {
    const url = `${BASE_URL}${pagePath}`;
    let html: string;

    try {
      html = await fetchPage(url);
    } catch (err) {
      results.push({
        page: name,
        checks: { error: { pass: false, message: `Failed to fetch: ${err}` } },
        score: 0,
      });
      continue;
    }

    const checks = checkMeta(html);
    const passed = Object.values(checks).filter(c => c.pass).length;
    const total = Object.keys(checks).length;
    const score = Math.round((passed / total) * 100);

    results.push({ page: name, checks, score });

    console.log(`\n📄 ${name} (${pagePath})`);
    console.log(`   Score: ${passed}/${total} checks passed`);
    for (const [checkName, result] of Object.entries(checks)) {
      const icon = result.pass ? '✅' : '❌';
      console.log(`   ${icon} ${checkName}: ${result.message}`);
    }
  }

  console.log('\n🤖 Robots.txt Check');
  try {
    const robots = await fetchPage(`${BASE_URL}/robots.txt`);
    console.log(`   ${robots.includes('Sitemap:') ? '✅' : '❌'} Sitemap reference`);
    console.log(`   ${robots.includes('Disallow:') ? '✅' : '❌'} Disallow rules`);
  } catch (err) {
    console.log(`   ❌ Failed: ${err}`);
  }

  console.log('\n🗺️  Sitemap.xml Check');
  try {
    const sitemap = await fetchPage(`${BASE_URL}/sitemap.xml`);
    const urlCount = (sitemap.match(/<url>/gi) || []).length;
    console.log(`   ✅ ${urlCount} URL(s) found`);
  } catch (err) {
    console.log(`   ❌ Failed: ${err}`);
  }

  console.log('\n🧠 llms.txt Check (AI Crawlers)');
  try {
    const llms = await fetchPage(`${BASE_URL}/llms.txt`);
    console.log(`   ${llms.includes('## Books') ? '✅' : '❌'} Books section`);
    console.log(`   ${llms.includes('## Articles') ? '✅' : '❌'} Articles section`);
  } catch (err) {
    console.log(`   ❌ Failed: ${err}`);
  }

  console.log('\n' + '='.repeat(60));
  const avgScore = results.reduce((sum, r) => sum + r.score, 0) / results.length;
  console.log(`\n📊 Average SEO Score: ${avgScore.toFixed(1)}%`);
  console.log(`📈 Pages audited: ${results.length}`);

  const lowScorePages = results.filter(r => r.score < 80);
  if (lowScorePages.length > 0) {
    console.log('\n⚠️  Pages needing attention (score < 80%):');
    for (const page of lowScorePages) {
      console.log(`   - ${page.page}: ${page.score.toFixed(1)}%`);
    }
  } else {
    console.log('\n🎉 All pages scored 80% or higher!');
  }
}

audit().catch(console.error);