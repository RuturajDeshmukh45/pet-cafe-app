import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import RoleSwitcher from '@/components/RoleSwitcher';

export const metadata: Metadata = {
  title: 'Pet Café - Management and Customer Experience',
  description: 'Book cozy time slots with adorable pets, browse our delicious menu, place orders, and manage bookings at the ultimate Pet Café.',
  keywords: 'pet cafe, cat cafe, dog cafe, play with pets, book table, order food, animal cafe',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col font-sans">
        <Navbar />
        <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="border-t border-border mt-auto py-6 glass-panel text-center text-xs text-muted-foreground">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p>© {new Date().getFullYear()} Pet Café Management System. Made for a premium customer and staff experience.</p>
            <p className="mt-1 text-[10px] text-muted-foreground/60">Academic Project - Demonstration purposes only</p>
          </div>
        </footer>
        <RoleSwitcher />
      </body>
    </html>
  );
}
