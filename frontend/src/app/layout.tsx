import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs'
import "./globals.css";
import { SidebarProvider } from '@/context/SidebarContext';

export const metadata: Metadata = {
  title: "Lumina Edge",
  description: "Personal life tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <head>
          <link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
          <style>{`
            .material-symbols-outlined {
              font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            }
            ::-webkit-scrollbar { width: 4px; }
            ::-webkit-scrollbar-track { background: #0e0e0f; }
            ::-webkit-scrollbar-thumb { background: #94a3b8; }
          `}</style>
        </head>
        <body className="bg-background text-on-background font-body-md selection:bg-primary-container selection:text-on-primary-container">
          <SidebarProvider>
            {children}
          </SidebarProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
