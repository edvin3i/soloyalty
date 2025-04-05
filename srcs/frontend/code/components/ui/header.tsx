'use client'

import Link from "next/link"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-b from-purple-900/80 via-purple-800/80 to-blue-900/80 backdrop-blur-sm border-b border-white/10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
              Soloyalty
            </span>
          </Link>
        </div>
      </div>
    </header>
  )
}
