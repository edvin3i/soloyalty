'use client'

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Star, Gift, ShoppingBag, Plus, Minus, CheckCircle2, AlertCircle, Heart, Exchange } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Header } from "@/components/ui/header"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

declare module 'next/link' {
  import { ReactNode } from 'react';
  interface LinkProps {
    children: ReactNode;
    href: string;
    className?: string;
  }
  export default function Link(props: LinkProps): JSX.Element;
}

declare module 'lucide-react' {
  import { ReactNode } from 'react';
  interface IconProps {
    size?: number;
    className?: string;
  }
  export const Plus: React.FC<IconProps>;
  export const Heart: React.FC<IconProps>;
  export const Exchange: React.FC<IconProps>;
}

declare module 'react' {
  interface ReactNode {}
}

const businesses = [
  {
    name: "Air France",
    points: 1250,
    category: "Travel",
    offers: [
      { name: "20% off on Business Class", points: 500, type: "promo" },
      { name: "Free checked baggage", points: 250, type: "points" },
    ],
    logo: "air-france"
  },
  {
    name: "Starbucks",
    points: 850,
    category: "Food & Beverage",
    offers: [
      { name: "Free Grande Drink", points: 150, type: "points" },
      { name: "50% off on Breakfast", points: 100, type: "promo" },
    ],
    logo: "starbucks"
  },
  {
    name: "Lidl",
    points: 1500,
    category: "Grocery",
    offers: [
      { name: "10% off on groceries", points: 200, type: "promo" },
      { name: "Free delivery", points: 150, type: "points" },
    ],
    logo: "lidl"
  },
  {
    name: "Pathe Cinema",
    points: 750,
    category: "Entertainment",
    offers: [
      { name: "Free movie ticket", points: 250, type: "points" },
      { name: "Popcorn & drink combo", points: 100, type: "points" },
    ],
    logo: "pathe"
  },
  {
    name: "Zara",
    points: 1100,
    category: "Fashion",
    offers: [
      { name: "20% off on clothing", points: 300, type: "promo" },
      { name: "Free styling consultation", points: 150, type: "points" },
    ],
    logo: "zara"
  }
]

const spendingOptions = [
  {
    title: "Travel Rewards",
    description: "Upgrade your flights, get free baggage, or enjoy premium lounge access",
    icon: <Star className="h-6 w-6 text-yellow-400" />
  },
  {
    title: "Dining Experience",
    description: "Free drinks, discounts on meals, or exclusive dining privileges",
    icon: <Gift className="h-6 w-6 text-green-400" />
  },
  {
    title: "Shopping Benefits",
    description: "Discounts on purchases, free delivery, or styling consultations",
    icon: <ShoppingBag className="h-6 w-6 text-purple-400" />
  },
  {
    title: "Entertainment Access",
    description: "Free movie tickets, discounts on events, or premium experiences",
    icon: <Plus className="h-6 w-6 text-blue-400" />
  }
]

export default function ConsumerPage() {
  const [totalPoints, setTotalPoints] = useState(7950)
  const [claimingCode, setClaimingCode] = useState(false)
  const [promoCode, setPromoCode] = useState("")
  const [selectedBusiness, setSelectedBusiness] = useState("")
  const [donating, setDonating] = useState(false)
  const [swapping, setSwapping] = useState(false)
  const [donationAmount, setDonationAmount] = useState("")
  const [fromCoin, setFromCoin] = useState("")
  const [toCoin, setToCoin] = useState("")

  const handleClaimPoints = (points: number, offerName: string) => {
    setTotalPoints(totalPoints + points)
    toast.success(
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-green-500" />
        <span>Claimed {points} SLC for {offerName}</span>
      </div>
    )
  }

  const handleRedeemPoints = (points: number, offerName: string) => {
    if (totalPoints >= points) {
      setTotalPoints(totalPoints - points)
      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <span>Redeemed {points} SLC for {offerName}</span>
        </div>
      )
    } else {
      toast.error(
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <span>Insufficient points. You need {points - totalPoints} more SLC</span>
        </div>
      )
    }
  }

  const handleClaimPromoCode = () => {
    if (!selectedBusiness) {
      toast.error(
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <span>Please select a business</span>
        </div>
      )
      return
    }

    if (promoCode === "SOLLOYAL2023") {
      setTotalPoints(totalPoints + 500)
      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <span>Claimed 500 SLC from promo code</span>
        </div>
      )
      setClaimingCode(false)
      setPromoCode("")
      setSelectedBusiness("")
    } else {
      toast.error(
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <span>Invalid promo code</span>
        </div>
      )
    }
  }

  const handleDonate = () => {
    const amount = parseInt(donationAmount)
    if (isNaN(amount) || amount <= 0) {
      toast.error(
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <span>Please enter a valid donation amount</span>
        </div>
      )
      return
    }

    if (amount > totalPoints) {
      toast.error(
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <span>Insufficient points. You need {amount - totalPoints} more SLC</span>
        </div>
      )
      return
    }

    setTotalPoints(totalPoints - amount)
    toast.success(
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-green-500" />
        <span>Donated {amount} SLC to charity</span>
      </div>
    )
    setDonating(false)
    setDonationAmount("")
  }

  const handleSwapCoins = () => {
    if (fromCoin === toCoin) {
      toast.error(
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <span>Please select different coins to swap</span>
        </div>
      )
      return
    }

    toast.success(
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-green-500" />
        <span>Swapped coins successfully</span>
      </div>
    )
    setSwapping(false)
    setFromCoin("")
    setToCoin("")
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-blue-900">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Soloyalty Wallet</h1>
            <div className="flex items-center gap-2">
              <span className="text-lg text-white/80">Total Points:</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white">{totalPoints}</span>
                <span className="text-lg text-white/80">SLC</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="bg-white text-purple-900 hover:bg-white/90"
              onClick={() => setClaimingCode(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Claim Points
            </Button>
            <Button
              variant="outline"
              className="bg-white text-purple-900 hover:bg-white/90"
              onClick={() => setDonating(true)}
            >
              <Heart className="mr-2 h-4 w-4" />
              Donate to Charity
            </Button>
            <Button
              variant="outline"
              className="bg-white text-purple-900 hover:bg-white/90"
              onClick={() => setSwapping(true)}
            >
              <Exchange className="mr-2 h-4 w-4" />
              Swap Coins
            </Button>
          </div>
        </div>

        {/* Promo Code Modal */}
        {claimingCode && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">Claim Promo Code</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="business" className="text-white/80">
                    Select Business
                  </Label>
                  <Select
                    value={selectedBusiness}
                    onValueChange={setSelectedBusiness}
                  >
                    <SelectTrigger className="bg-white/10 text-white">
                      <SelectValue placeholder="Select business" />
                    </SelectTrigger>
                    <SelectContent>
                      {businesses.map((business) => (
                        <SelectItem key={business.name} value={business.name}>
                          {business.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="promoCode" className="text-white/80">
                    Enter Promo Code
                  </Label>
                  <Input
                    id="promoCode"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="bg-white/10 text-white"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setClaimingCode(false)
                      setPromoCode("")
                      setSelectedBusiness("")
                    }}
                    className="bg-white/10 text-white hover:bg-white/20"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleClaimPromoCode}
                    className="bg-white text-purple-900 hover:bg-white/90"
                  >
                    Claim
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Donation Modal */}
        {donating && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">Donate to Charity</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="donationAmount" className="text-white/80">
                    Enter Donation Amount
                  </Label>
                  <Input
                    id="donationAmount"
                    type="number"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    className="bg-white/10 text-white"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setDonating(false)
                      setDonationAmount("")
                    }}
                    className="bg-white/10 text-white hover:bg-white/20"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDonate}
                    className="bg-white text-purple-900 hover:bg-white/90"
                  >
                    Donate
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Coin Swap Modal */}
        {swapping && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">Swap Coins</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fromCoin" className="text-white/80">
                    From Coin
                  </Label>
                  <Select
                    value={fromCoin}
                    onValueChange={setFromCoin}
                  >
                    <SelectTrigger className="bg-white/10 text-white">
                      <SelectValue placeholder="Select coin to swap from" />
                    </SelectTrigger>
                    <SelectContent>
                      {businesses.map((business) => (
                        <SelectItem key={business.name} value={business.name}>
                          {business.name} Coin
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="toCoin" className="text-white/80">
                    To Coin
                  </Label>
                  <Select
                    value={toCoin}
                    onValueChange={setToCoin}
                  >
                    <SelectTrigger className="bg-white/10 text-white">
                      <SelectValue placeholder="Select coin to swap to" />
                    </SelectTrigger>
                    <SelectContent>
                      {businesses.map((business) => (
                        <SelectItem key={business.name} value={business.name}>
                          {business.name} Coin
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSwapping(false)
                      setFromCoin("")
                      setToCoin("")
                    }}
                    className="bg-white/10 text-white hover:bg-white/20"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSwapCoins}
                    className="bg-white text-purple-900 hover:bg-white/90"
                  >
                    Swap
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Business Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {businesses.map((business) => (
            <Card key={business.name} className="bg-white/5 backdrop-blur-sm border border-white/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-sm font-medium text-white">
                    {business.name}
                  </CardTitle>
                  <CardDescription className="text-xs text-white/80">
                    {business.points} SLC
                  </CardDescription>
                </div>
                <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-white/80 text-xl">{business.logo[0]}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {business.offers.map((offer) => (
                    <div key={offer.name} className="flex items-center justify-between p-2 bg-white/10 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Gift className="h-4 w-4 text-white/80" />
                        <span className="text-sm text-white/80">{offer.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white text-purple-900 hover:bg-white/90"
                          onClick={() => handleRedeemPoints(offer.points, offer.name)}
                        >
                          {offer.points} SLC
                        </Button>
                        <span className="text-xs text-white/80">Redeem</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
