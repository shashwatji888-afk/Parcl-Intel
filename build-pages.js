const fs = require('fs');
const path = require('path');

const downloadsDir = 'd:/code/shashwat/stitch_downloads';
const appDir = 'd:/code/shashwat/app';

const pages = [
  { htmlFile: 'landing.html', route: 'page.js', name: 'LandingPage' },
  { htmlFile: 'overview.html', route: 'overview/page.js', name: 'OverviewPage' },
  { htmlFile: 'segmentation.html', route: 'segments/page.js', name: 'SegmentsPage' },
  { htmlFile: 'investors.html', route: 'investors/page.js', name: 'InvestorsPage' },
  { htmlFile: 'geography.html', route: 'geography/page.js', name: 'GeographyPage' },
  { htmlFile: 'insights.html', route: 'insights/page.js', name: 'InsightsPage' },
  { htmlFile: 'profiler.html', route: 'profiler/page.js', name: 'ProfilerPage' },
  { htmlFile: 'pipeline.html', route: 'pipeline/page.js', name: 'PipelinePage' },
  { htmlFile: 'reports.html', route: 'reports/page.js', name: 'ReportsPage' },
];

function generatePageCode(htmlContent, name) {
  const escapedHtml = htmlContent.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
  return `'use client';
import { useEffect } from 'react';

export default function ${name}() {
  useEffect(() => {
    // Fix navigation: intercept clicks on nav links
    const navLinks = document.querySelectorAll('a');
    navLinks.forEach(link => {
      const text = link.textContent?.trim();
      
      const routeMap = {
        'Overview': '/overview',
        'Segments': '/segments',
        'Investors': '/investors',
        'Geography': '/geography',
        'Insights': '/insights',
        'Segment Insights': '/insights',
        'Profiler': '/profiler',
        'Pipeline': '/pipeline',
        'Reports': '/reports',
        'Launch Dashboard': '/overview',
        'View Research': '/reports'
      };
      
      // Attempt to find matching text directly or in last span
      let match = routeMap[text];
      if (!match) {
        const lastSpan = link.querySelector('span:last-child');
        if (lastSpan) {
            match = routeMap[lastSpan.textContent?.trim()];
        }
      }
      
      if (match) {
        link.href = match;
      }
    });
  }, []);

  return (
    <div dangerouslySetInnerHTML={{ __html: \`${escapedHtml}\` }} />
  );
}`;
}

pages.forEach(page => {
  const htmlPath = path.join(downloadsDir, page.htmlFile);
  if (!fs.existsSync(htmlPath)) {
    console.error('File not found:', htmlPath);
    return;
  }
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');
  
  const outPath = path.join(appDir, page.route);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  
  fs.writeFileSync(outPath, generatePageCode(htmlContent, page.name));
  console.log('Created', outPath);
});
