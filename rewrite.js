const fs = require('fs');
const path = require('path');

const pages = [
  { name: 'overview', title: 'Overview', subtitle: 'Real-time buyer intelligence · Last pipeline run: 2 hours ago' },
  { name: 'segments', title: 'Buyer Segmentation', subtitle: 'K-Means clustering analysis across 4 buyer profiles' },
  { name: 'investors', title: 'Investor Behavior', subtitle: 'Investment patterns and financing behavior across buyer clusters' },
  { name: 'geography', title: 'Geographic Analysis', subtitle: 'Regional investment distribution and buyer cluster mapping' },
  { name: 'insights', title: 'Segment Insights', subtitle: 'Descriptive statistics and deep analytics per buyer cluster' },
  { name: 'profiler', title: 'Buyer Profiler', subtitle: 'Predict buyer segment from profile attributes' },
  { name: 'pipeline', title: 'ML Pipeline', subtitle: 'Upload data and run the buyer segmentation model' },
  { name: 'reports', title: 'Reports & Export', subtitle: 'Download segmentation results and generate intelligence reports' }
];

const dir = 'd:/code/shashwat/app';

pages.forEach(page => {
  const filePath = path.join(dir, page.name, 'page.js');
  if (!fs.existsSync(filePath)) {
    console.log("Missing", filePath);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Extract main content using <main> tags
  const mainRegex = /<main[^>]*>([\s\S]*?)<\/main>/i;
  let match = content.match(mainRegex);
  
  if (!match) {
      console.log("Failed to match <main> in", page.name);
      return;
  }
  
  let extractedHtml = match[1];
  
  // Strip header, nav, footer
  extractedHtml = extractedHtml.replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '');
  extractedHtml = extractedHtml.replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '');
  extractedHtml = extractedHtml.replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '');
  
  // Some pages have the scrollable content inside a flex-1 div, let's strip that specific div wrapper if it matches
  // Actually, we can just replace its classes to avoid double padding/scrollbars if it exists
  extractedHtml = extractedHtml.replace(/class="([^"]*flex-1 overflow-y-auto pt-24[^"]*)"/g, 'class=""');
  extractedHtml = extractedHtml.replace(/class="([^"]*flex-1 overflow-y-auto[^"]*)"/g, 'class=""');

  // Also extract <style> blocks if any
  let styleRegex = /<style>([\s\S]*?)<\/style>/gi;
  let styleMatch;
  let styles = '';
  while ((styleMatch = styleRegex.exec(content)) !== null) {
      styles += `<style>\n${styleMatch[1]}\n</style>\n`;
  }
  
  // Also extract <script> blocks that are not tailwind config or cdn
  let scriptRegex = /<script(?![^>]*src="https:\/\/cdn\.tailwindcss\.com)[^>]*>([\s\S]*?)<\/script>/gi;
  let scriptMatch;
  let jsContent = '';
  while ((scriptMatch = scriptRegex.exec(content)) !== null) {
      let scriptInner = scriptMatch[1];
      if (!scriptInner.includes('tailwind.config =')) {
          jsContent += scriptInner + '\n';
      }
  }
  
  // Add classes
  extractedHtml = extractedHtml.replace(/class="([^"]*glass-panel p-5[^"]*)"/g, 'class="$1 parcl-animate-card"');
  extractedHtml = extractedHtml.replace(/class="([^"]*glass-card rounded-xl p-5[^"]*)"/g, 'class="$1 parcl-animate-card"');
  extractedHtml = extractedHtml.replace(/class="([^"]*glass-panel p-6[^"]*)"/g, 'class="$1 parcl-animate-card"');
  extractedHtml = extractedHtml.replace(/class="([^"]*glass-card rounded-xl p-6[^"]*)"/g, 'class="$1 parcl-animate-card"');
  extractedHtml = extractedHtml.replace(/class="([^"]*glass-panel p-4[^"]*)"/g, 'class="$1 parcl-animate-card"');
  extractedHtml = extractedHtml.replace(/class="([^"]*glass-card p-5[^"]*)"/g, 'class="$1 parcl-animate-card"');
  extractedHtml = extractedHtml.replace(/class="([^"]*glass-panel rounded-xl p-6[^"]*)"/g, 'class="$1 parcl-animate-card"');
  
  // Dashboard Header specifically
  extractedHtml = extractedHtml.replace(/<!-- Dashboard Header -->\s*<div class="([^"]*)"/g, '<!-- Dashboard Header -->\n<div class="$1 parcl-page-header"');
  
  // Create new page content
  const newContent = `'use client';
import { useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';

export default function ${page.name.charAt(0).toUpperCase() + page.name.slice(1)}Page() {
  useEffect(() => {
${jsContent.split('\n').map(l => '    ' + l).join('\n')}
  }, []);

  return (
    <DashboardLayout
      title="${page.title}"
      subtitle="${page.subtitle}"
    >
      ${styles ? `<div dangerouslySetInnerHTML={{ __html: \`${styles.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\` }} />` : ''}
      <div dangerouslySetInnerHTML={{ __html: \`${extractedHtml.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\` }} />
    </DashboardLayout>
  );
}
`;

  fs.writeFileSync(filePath, newContent);
  console.log("Rewrote", page.name);
});
console.log("Done");
