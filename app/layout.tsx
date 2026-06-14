import type {Metadata} from 'next';
import './globals.css'; // Global styles
import { CurrencyProvider } from './currency-context';
import { AuthProvider } from './auth-context';

export const metadata: Metadata = {
  title: 'Vision Books System',
  description: 'Books System by Black Pharaohs Code',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <AuthProvider>
          <CurrencyProvider>
            {children}
          </CurrencyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
