import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Soloyal',
  description: 'Solana blockchain based loyalty platform',
  generator: 'Soloyal.io',
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
