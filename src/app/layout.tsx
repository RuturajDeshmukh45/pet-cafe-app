import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import RoleSwitcher from '@/components/RoleSwitcher';
import { PawPrint, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Pet Café - Where Sweet Treats Meet Warm Paws',
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
      <body className="min-h-full flex flex-col font-sans bg-[#f6faff] text-[#0e2445] antialiased">
        <Navbar />
        <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        <footer className="border-t border-sky-150 mt-auto py-8 bg-white/70 backdrop-blur-md text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
            <div className="flex items-center justify-center gap-2 text-[#1e75ff] font-bold">
              <PawPrint className="w-4 h-4 fill-current" />
              <span>Pet Café</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600 font-medium">Good Food • Happy Pets</span>
            </div>
            <p>© {new Date().getFullYear()} Pet Café Management System. Crafted with love for pets and coffee enthusiasts.</p>
            <p className="text-[11px] text-slate-400">Academic Project - Demonstration purposes only</p>
          </div>
        </footer>
        <RoleSwitcher />
      </body>
    </html>
  );
}
