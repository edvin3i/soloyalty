import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Soloyalty',
  description: 'Solana blockchain based loyalty platform',
  generator: 'Soloyalty.io',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
