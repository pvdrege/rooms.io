import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rooms - Professional Networking Platform',
  description: 'Connect investors, freelancers, and mentors',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            line-height: 1.6;
          }
          
          @media (max-width: 768px) {
            h1 {
              font-size: 2.5rem !important;
            }
            
            div[style*="grid-template-columns"] {
              grid-template-columns: 1fr !important;
            }
            
            div[style*="display: flex"] {
              flex-direction: column !important;
              align-items: center !important;
            }
            
            nav div[style*="display: flex"] {
              flex-direction: row !important;
            }
          }
        `}</style>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
} 