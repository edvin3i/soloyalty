import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/ui/header"

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="flex min-h-[calc(100vh-64px)] flex-col bg-gradient-to-b from-purple-900 via-purple-800 to-blue-900 p-4 relative">
        {/* Business button in upper left corner */}
        <div className="absolute top-4 left-4 z-10">
          <Link
            href="/business"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-base font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border h-16 px-8 rounded-lg border-white bg-primary text-white hover:bg-primary/90 hover:text-white"
          >
            I'm a business
          </Link>
        </div>

        {/* Main content */}
        <div className="container mx-auto flex flex-1 flex-col items-center justify-center px-4 md:px-6 gap-6">
          {/* Center heading */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              Welcome to Soloyalty
            </h1>
            <p className="mt-4 text-lg text-white/80">The loyalty program platform built on Solana</p>
          </div>

          {/* Centered consumer button */}
          <div className="w-full max-w-md">
            <Button size="lg" className="w-full bg-white text-purple-900 hover:bg-white/90 py-6 text-lg" asChild>
              <Link href="/consumer">I&apos;m a consumer</Link>
            </Button>
          </div>

          {/* Solana logo/badge */}
          <div className="mt-12 flex items-center justify-center">
            <div className="flex items-center rounded-full bg-white/10 px-4 py-2 text-sm text-white">
              <span>Powered by</span>
              <svg className="ml-2 h-5 w-5" viewBox="0 0 397 311" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7zm0-164.7c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7zm317.4-61.6H73.8c-3.4 0-6.7 1.3-9.2 3.8L1.9 78.1c-4.1 4.1-1.2 11.1 4.6 11.1h317.4c3.4 0 6.7-1.3 9.2-3.8l62.7-62.7c4.1-4.1 1.2-11.1-4.6-11.1z"
                  fill="#ffffff"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
