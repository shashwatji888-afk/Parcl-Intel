'use client';
import { useEffect } from 'react';

/**
 * AnimationEnhancer — injected into DashboardLayout
 * Applies consistent entrance animations to ANY content
 * regardless of CSS class names from different Stitch pages.
 */
export default function AnimationEnhancer() {
  useEffect(() => {
    // 1. Fix any remaining nav links that still point to '#'
    const navLinks = document.querySelectorAll('.parcl-sidebar a, nav a');
    const routeMap = {
      'Overview':   '/overview',
      'Segments':   '/segments',
      'Investors':  '/investors',
      'Geography':  '/geography',
      'Insights':   '/insights',
      'Profiler':   '/profiler',
      'Pipeline':   '/pipeline',
      'Reports':    '/reports',
    };
    navLinks.forEach(link => {
      if (link.href?.endsWith('#') || link.getAttribute('href') === '#') {
        const label = link.querySelector('.parcl-nav-label')?.textContent?.trim()
          || link.querySelector('span:last-child')?.textContent?.trim()
          || link.textContent?.trim();
        if (routeMap[label]) link.href = routeMap[label];
      }
    });

    // 2. KPI / stat cards — staggered fade-up entrance
    const cardSelectors = [
      'div.glass-panel',
      'div.glass-card',
      'div.parcl-card',
      'div.parcl-kpi-card',
    ].join(', ');

    const cards = document.querySelectorAll(cardSelectors);
    cards.forEach((card, i) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(14px) scale(0.98)';
      card.style.transition = 'none';
      requestAnimationFrame(() => {
        setTimeout(() => {
          card.style.transition = 'opacity 0.4s cubic-bezier(0.4,0,0.2,1), transform 0.4s cubic-bezier(0.4,0,0.2,1)';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0) scale(1)';
        }, 60 + i * 55);
      });
    });

    // 3. Table rows — slide-in from left
    const rows = document.querySelectorAll('tbody tr');
    rows.forEach((row, i) => {
      row.style.opacity = '0';
      row.style.transform = 'translateX(-10px)';
      row.style.transition = 'none';
      setTimeout(() => {
        row.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        row.style.opacity = '1';
        row.style.transform = 'translateX(0)';
      }, 200 + i * 50);
    });

    // 4. Progress bars — animate width from 0
    const progressBars = document.querySelectorAll('[class*="progress"], [class*="w-["], [style*="width:"]');
    progressBars.forEach(bar => {
      const originalWidth = bar.style.width || String(bar.className?.baseVal ?? bar.className ?? '').match(/w-\[(\d+%)\]/)?.[1];
      if (!originalWidth) return;
      bar.style.transition = 'width 0.8s cubic-bezier(0.4,0,0.2,1)';
      const target = originalWidth;
      bar.style.width = '0';
      setTimeout(() => { bar.style.width = target; }, 300);
    });

    // 5. Animate SVG chart paths with stroke-dasharray trick
    const svgPaths = document.querySelectorAll('svg path[stroke]:not([fill="none"] path)');
    svgPaths.forEach(path => {
      try {
        const len = path.getTotalLength?.() || 200;
        path.style.strokeDasharray = len;
        path.style.strokeDashoffset = len;
        path.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)';
        setTimeout(() => { path.style.strokeDashoffset = '0'; }, 400);
      } catch (e) { /* skip if path has no length */ }
    });

    // 6. Number counter animation for KPI values
    const kpiValues = document.querySelectorAll(
      '.parcl-kpi-value, [class*="text-3xl"][class*="font-bold"], [class*="text-4xl"][class*="font-bold"]'
    );
    kpiValues.forEach((el, i) => {
      const raw = el.textContent?.replace(/[^0-9.]/g, '');
      const num = parseFloat(raw);
      if (!raw || isNaN(num) || num < 1) return;

      const suffix = el.textContent?.replace(/[\d,.]/g, '').trim();
      const prefix = el.textContent?.match(/^[^0-9]*/)?.[0] || '';
      const decimals = raw.includes('.') ? (raw.split('.')[1]?.length || 0) : 0;

      let start = 0;
      const duration = 1000;
      const delay = 200 + i * 80;
      const startTime = performance.now() + delay;

      const tick = (now) => {
        if (now < startTime) { requestAnimationFrame(tick); return; }
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        const current = (num * eased).toFixed(decimals);
        el.textContent = prefix + parseFloat(current).toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });

    // 7. Hover glow on KPI cards
    const kpiCards = document.querySelectorAll('.glass-panel, .glass-card, .parcl-kpi-card');
    kpiCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.boxShadow = '0 8px 32px rgba(0,0,0,0.5), 0 0 24px rgba(37,99,235,0.12)';
        card.style.borderColor = 'rgba(37,99,235,0.25)';
      });
      card.addEventListener('mouseleave', () => {
        card.style.boxShadow = '';
        card.style.borderColor = '';
      });
    });

    // 8. Cluster color glows on badges
    const c1Els = document.querySelectorAll('[class*="c1"], [class*="blue-500"], [style*="#2563EB"]');
    const c2Els = document.querySelectorAll('[class*="c2"], [class*="emerald"], [style*="#10B981"]');
    const c3Els = document.querySelectorAll('[class*="c3"], [class*="amber"], [style*="#F59E0B"]');
    const c4Els = document.querySelectorAll('[class*="c4"], [class*="violet"], [style*="#8B5CF6"]');
    const applyGlow = (els, color) => {
      els.forEach(el => {
        if (el.tagName === 'DIV' && el.textContent.length < 4) {
          el.style.boxShadow = `0 0 8px ${color}80`;
        }
      });
    };
    applyGlow(c1Els, '#2563EB');
    applyGlow(c2Els, '#10B981');
    applyGlow(c3Els, '#F59E0B');
    applyGlow(c4Els, '#8B5CF6');

  }, []);

  return null; // No rendered output — pure side-effect component
}
