'use client'

import Link from "next/link"
import { Menu } from "lucide-react"
import { useState } from "react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="ml-4 mr-4 hidden md:flex">
          <a className="mr-6 flex items-center space-x-2" href="/">
            <span className="hidden font-bold sm:inline-block">
              Soloyalty
            </span>
          </a>
        </div>
        <button
          className="flex items-center space-x-2 md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            <button
              className="w-full rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
              onClick={() => {
                setIsMenuOpen(false)
                // Add your action here
              }}
            >
              Claim Points
            </button>
            <button
              className="w-full rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
              onClick={() => {
                setIsMenuOpen(false)
                // Add your action here
              }}
            >
              Donate to Charity
            </button>
            <button
              className="w-full rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
              onClick={() => {
                setIsMenuOpen(false)
                // Add your action here
              }}
            >
              Swap Coins
            </button>
            <button
              className="w-full rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
              onClick={() => {
                setIsMenuOpen(false)
                // Add your action here
              }}
            >
              Ask for Soloyls
            </button>
            <button
              className="w-full rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
              onClick={() => {
                setIsMenuOpen(false)
                // Add your action here
              }}
            >
              Donate directly
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
