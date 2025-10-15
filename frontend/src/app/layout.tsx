import { I18nProvider } from '@/components/providers/I18nProvider';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { GUIProvider } from '@/contexts/GUIContext';
import { APP_DESCRIPTION, APP_NAME } from '@/lib/constants';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Check if we're in an embedded context (VSCode extension)
  const isEmbedded = typeof window !== 'undefined' && window.location.search.includes('embedded=true');

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="font-sans antialiased"
        suppressHydrationWarning
      >
        <ThemeProvider>
          <AuthProvider>
            <GUIProvider>
              <I18nProvider>
                {children}
                {!isEmbedded && <Toaster />}
              </I18nProvider>
            </GUIProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
