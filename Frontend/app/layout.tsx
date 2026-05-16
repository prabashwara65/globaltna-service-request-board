import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { AuthProvider } from '../context/AuthContext';
import './globals.css';

// Configure Poppins font
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Service Request Board | GlobalTNA',
  description: 'Post and browse service requests in your area',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className={poppins.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}