import type {Metadata} from 'next';
import './globals.css'; // Global styles
import { CurrencyProvider } from './currency-context';

export const metadata: Metadata = {
  title: 'Vision Books System',
  description: 'Books System by Black Pharaohs Code',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <CurrencyProvider>
          {children}
        </CurrencyProvider>
      </body>
    </html>
  );
}
