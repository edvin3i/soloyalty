'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export default function CustomerLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/customer/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        toast.success('Logged in successfully')
        // Store token or user data in localStorage or context
        localStorage.setItem('customerToken', data.token)
        window.location.href = '/'
      } else {
        const error = await response.json()
        toast.error(error.message || 'Login failed')
      }
    } catch (error) {
      toast.error('An error occurred during login')
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-800 flex items-center justify-center">
      <div className="bg-white/5 backdrop-blur-sm p-8 rounded-lg border border-white/20 w-full max-w-md">
        <h1 className="text-3xl font-bold text-white text-center mb-8">Customer Login</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="bg-white/10 text-white"
              required
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="bg-white/10 text-white"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-white text-purple-900 hover:bg-white/90"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>

          <div className="text-center text-white/80">
            <p className="mt-4">
              Don't have an account?{' '}
              <a href="/register" className="text-white hover:text-white/90">
                Register here
              </a>
            </p>
            <p className="mt-2">
              Go back to{' '}
              <a href="/" className="text-white hover:text-white/90">
                Home
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
