import type { Metadata, Viewport } from 'next'
import { Orbitron, Share_Tech_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const orbitron = Orbitron({ 
  subsets: ["latin"],
  variable: '--font-display',
  weight: ['400', '500', '600', '700', '800', '900']
});

const shareTechMono = Share_Tech_Mono({ 
  subsets: ["latin"],
  variable: '--font-mono',
  weight: '400'
});

export const metadata: Metadata = {
  title: 'BENDER | Bite My Shiny Metal Wallet',
  description: 'Think you can outsmart Bender? Connect your wallet and try to take his money. Spoiler: You cannot.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#1a1625',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${orbitron.variable} ${shareTechMono.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
