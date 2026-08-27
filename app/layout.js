import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import AgentationProvider from './components/AgentationProvider';

export const metadata = {
  title: 'Parcl Intel — Real Estate ML Intelligence',
  description: 'Machine Learning-Based Buyer Segmentation and Investment Profiling for Real Estate Market Intelligence',
  keywords: 'real estate, machine learning, buyer segmentation, investment profiling, analytics',
  authors: [{ name: 'Parcl Intel' }],
  openGraph: {
    title: 'Parcl Intel — Real Estate ML Intelligence',
    description: 'Discover hidden buyer segments, investment patterns, and market intelligence powered by AI clustering.',
    type: 'website',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0A0F1E',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Tailwind CDN - single load, configured once globally */}
        <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries" defer></script>
        <script
          id="tailwind-config"
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('load', function() {
                if (typeof tailwind !== 'undefined') {
                  tailwind.config = {
                    darkMode: "class",
                    theme: {
                      extend: {
                        colors: {
                          bg:         "#0A0F1E",
                          surface1:   "#0F172A",
                          surface2:   "#1E293B",
                          surface3:   "#243044",
                          primary:    "#2563EB",
                          secondary:  "#8B5CF6",
                          accent:     "#10B981",
                          warning:    "#F59E0B",
                          danger:     "#EF4444",
                          "text-primary":   "#F8FAFC",
                          "text-secondary": "#94A3B8",
                          "text-muted":     "#475569",
                          c1: "#2563EB",
                          c2: "#10B981",
                          c3: "#F59E0B",
                          c4: "#8B5CF6",
                        },
                        fontFamily: {
                          headline: ["Sora", "sans-serif"],
                          display:  ["Sora", "sans-serif"],
                          body:     ["IBM Plex Sans", "sans-serif"],
                          label:    ["Space Mono", "monospace"],
                        },
                        borderRadius: {
                          DEFAULT: "0.25rem",
                          lg: "0.5rem",
                          xl: "0.75rem",
                          full: "9999px",
                        },
                      },
                    },
                  };
                }
              });
            `,
          }}
        />
        {/* Google Fonts — loaded once globally */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=IBM+Plex+Sans:wght@400;500;600&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <style dangerouslySetInnerHTML={{ __html: `
          /* Ensure pages rendered via dangerouslySetInnerHTML inherit global font */
          .parcl-page-iframe body,
          .parcl-page-iframe html {
            font-family: 'IBM Plex Sans', sans-serif !important;
          }
          /* Prevent FOUC */
          html { background-color: #0A0F1E; }
        `}} />
      </head>
      <body className="dark" suppressHydrationWarning style={{ margin: 0, padding: 0, overflowX: 'hidden' }}>
        <AuthProvider>
          {children}
          <AgentationProvider />
        </AuthProvider>
      </body>
    </html>
  );
}
