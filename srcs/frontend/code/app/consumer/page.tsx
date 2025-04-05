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
  interface ReactNode { }
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

const charities = [
  { id: "red-cross", name: "Red Cross", description: "Humanitarian aid and emergency response" },
  { id: "wwf", name: "WWF", description: "Wildlife conservation and environmental protection" },
  { id: "unicef", name: "UNICEF", description: "Children's rights and welfare" },
  { id: "oxfam", name: "Oxfam", description: "Poverty alleviation and social justice" },
  { id: "msf", name: "Médecins Sans Frontières", description: "Medical assistance in crisis zones" }
]

const donationRequests = [
  { id: 1, business: "Air France", amount: 1000 },
  { id: 2, business: "Starbucks", amount: 500 },
  { id: 3, business: "Lidl", amount: 2000 },
  { id: 4, business: "Pathe Cinema", amount: 1500 },
  { id: 5, business: "Zara", amount: 2500 },
]

export default function ConsumerPage() {
  const [totalPoints, setTotalPoints] = useState(7950)
  const [claimingCode, setClaimingCode] = useState(false)
  const [promoCode, setPromoCode] = useState("")
  const [selectedBusiness, setSelectedBusiness] = useState("")
  const [donating, setDonating] = useState(false)
  const [selectedCharity, setSelectedCharity] = useState("")
  const [swapping, setSwapping] = useState(false)
  const [fromCoin, setFromCoin] = useState("")
  const [toCoin, setToCoin] = useState("")
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")
  const [donationAmount, setDonationAmount] = useState("")
  const [requestingPoints, setRequestingPoints] = useState(false);
  const [requestAmount, setRequestAmount] = useState("");
  const [selectedDonationRequest, setSelectedDonationRequest] = useState(null);
  const [showProfile, setShowProfile] = useState(false)
  const [profileDetails, setProfileDetails] = useState({
    name: "John Doe", // Replace with actual customer name from API
    description: "Loyal customer since 2024", // Replace with actual description from API
    email: "john.doe@example.com" // Replace with actual email from API
  })

  const conversionRate = 0.7

  useEffect(() => {
    if (fromAmount) {
      const amount = parseFloat(fromAmount)
      if (!isNaN(amount)) {
        setToAmount((amount * conversionRate).toFixed(2))
      }
    } else {
      setToAmount("")
    }
  }, [fromAmount])

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

  const handleDonate = async () => {
    try {
      if (!selectedDonationRequest || !donationAmount) {
        toast.error("Please select a donation request and enter an amount");
        return;
      }

      const response = await fetch('/api/points/donate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestId: selectedDonationRequest.id,
          amount: parseFloat(donationAmount),
        }),
      });

      if (response.ok) {
        toast.success(`Successfully donated ${donationAmount} points`);
        setDonating(false);
        setSelectedDonationRequest(null);
        setDonationAmount("");
      } else {
        toast.error("Failed to donate points");
      }
    } catch (error) {
      toast.error("Error donating points");
      console.error(error);
    }
  };

  const handleRequestPoints = async () => {
    try {
      if (!selectedBusiness || !requestAmount) {
        toast.error("Please select a business and enter an amount");
        return;
      }

      const response = await fetch('/api/points/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          business: selectedBusiness,
          amount: parseFloat(requestAmount),
        }),
      });

      if (response.ok) {
        toast.success(`Successfully requested ${requestAmount} points from ${selectedBusiness}`);
        setRequestingPoints(false);
        setSelectedBusiness("");
        setRequestAmount("");
      } else {
        toast.error("Failed to request points");
      }
    } catch (error) {
      toast.error("Error requesting points");
      console.error(error);
    }
  };

  const handleSwapCoins = () => {
    const fromAmountValue = parseFloat(fromAmount)
    const toAmountValue = parseFloat(toAmount)

    if (isNaN(fromAmountValue) || fromAmountValue <= 0) {
      toast.error(
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <span>Please enter a valid amount</span>
        </div>
      );
      return;
    }

    if (!fromCoin || !toCoin) {
      toast.error(
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <span>Please select both coins</span>
        </div>
      );
      return;
    }

    // Here you would typically make an API call to perform the swap
    toast.success(
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-green-500" />
        <span>Swapped {fromAmountValue} {fromCoin} to {toAmountValue} {toCoin}</span>
      </div>
    );
    setSwapping(false);
    setFromCoin("");
    setToCoin("");
    setFromAmount("");
    setToAmount("");
  }

  const handleSwap = () => {
    setSwapping(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('customerToken')
    window.location.href = '/login-customer'
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-800">
      <Header />

      {/* Profile Button */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          className="bg-white/10 text-white hover:bg-white/20"
          onClick={() => setShowProfile(!showProfile)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-user mr-2 h-4 w-4"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          Profile
        </Button>

        {showProfile && (
          <div className="fixed inset-0 bg-black/50 z-[9999]" onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowProfile(false)
            }
          }}>
            <div className="fixed top-4 right-4 z-[10000]">
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/20 w-80">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-user h-6 w-6"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{profileDetails.name}</h3>
                    <p className="text-sm text-white/80">{profileDetails.description}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileDetails.email}
                      readOnly
                      className="bg-white/10 text-white"
                    />
                  </div>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="w-full bg-white/10 text-white hover:bg-white/20"
                  >
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Header */}
      <div className="container mx-auto px-4 py-8">
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
          <div className="hidden md:flex gap-2">
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
              onClick={handleSwap}
            >
              <Exchange className="mr-2 h-4 w-4" />
              Swap Coins
            </Button>
            <Button
              variant="outline"
              className="bg-white text-purple-900 hover:bg-white/90"
              onClick={() => setRequestingPoints(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Ask for Soloyls
            </Button>
            <Button
              variant="outline"
              className="bg-white text-purple-900 hover:bg-white/90"
              onClick={() => setDonating(true)}
            >
              <Gift className="mr-2 h-4 w-4" />
              Donate directly
            </Button>
          </div>
        </div>

        {/* Promo Code Modal */}
        {claimingCode && (
          <div className="fixed inset-0 bg-black/50 z-[9999]" onClick={() => setClaimingCode(false)}>
            <div className="fixed inset-0 flex items-center justify-center p-4 z-[10000]">
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
                      <SelectTrigger className="bg-white/10 text-white relative z-[10001]">
                        <SelectValue placeholder="Select business" />
                      </SelectTrigger>
                      <SelectContent className="bg-white/100 text-white absolute z-[10002]">
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
          </div>
        )}

        {/* Donation Modal */}
        {donating && (
          <div className="fixed inset-0 bg-black/50 z-[9999]" onClick={() => setDonating(false)}>
            <div className="fixed inset-0 flex items-center justify-center p-4 z-[10000]">
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/20">
                <h2 className="text-xl font-bold text-white mb-4">Donate to Charity</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white/80" htmlFor="charity">
                      Select Charity
                    </label>
                    <Select
                      value={selectedCharity}
                      onValueChange={setSelectedCharity}
                    >
                      <SelectTrigger className="bg-white/10 text-white relative z-[10001]">
                        <SelectValue placeholder="Select a charity" />
                      </SelectTrigger>
                      <SelectContent className="bg-white/100 text-white absolute z-[10002]">
                        {charities.map((charity) => (
                          <SelectItem key={charity.id} value={charity.id}>
                            {charity.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white/80" htmlFor="donationAmount">
                      Enter Donation Amount
                    </label>
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
                        setSelectedCharity("")
                      }}
                      className="bg-white/10 text-white hover:bg-white/20"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleDonate}
                      className="bg-white text-purple-900 hover:bg-white/90"
                      disabled={!selectedCharity}
                    >
                      Donate
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Coin Swap Modal */}
        {swapping && (
          <div className="fixed inset-0 bg-black/50 z-[9999]" onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSwapping(false)
              setFromCoin("")
              setToCoin("")
              setFromAmount("")
              setToAmount("")
            }
          }}>
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/20 z-[10000]">
                <h2 className="text-xl font-bold text-white mb-4">Swap Coins</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white/80" htmlFor="fromCoin">
                      From Coin
                    </label>
                    <Select
                      value={fromCoin}
                      onValueChange={setFromCoin}
                    >
                      <SelectTrigger className="bg-white/10 text-white relative z-[10001]">
                        <SelectValue placeholder="Select coin to swap from" />
                      </SelectTrigger>
                      <SelectContent className="bg-white/100 text-white absolute z-[10002]">
                        {businesses.map((business) => (
                          <SelectItem key={business.name} value={business.name}>
                            {business.name} Coin
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white/80" htmlFor="fromAmount">
                      Amount
                    </label>
                    <Input
                      id="fromAmount"
                      type="number"
                      value={fromAmount}
                      onChange={(e) => setFromAmount(e.target.value)}
                      className="bg-white/10 text-white"
                      placeholder="Enter amount"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white/80" htmlFor="toCoin">
                      To Coin
                    </label>
                    <Select
                      value={toCoin}
                      onValueChange={setToCoin}
                    >
                      <SelectTrigger className="bg-white/10 text-white relative z-[10001]">
                        <SelectValue placeholder="Select coin to swap to" />
                      </SelectTrigger>
                      <SelectContent className="bg-white/100 text-white absolute z-[10002]">
                        {businesses.map((business) => (
                          <SelectItem key={business.name} value={business.name}>
                            {business.name} Coin
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white/80" htmlFor="toAmount">
                      Amount
                    </label>
                    <Input
                      id="toAmount"
                      type="number"
                      value={toAmount}
                      readOnly
                      className="bg-white/10 text-white cursor-not-allowed"
                      placeholder="Calculated amount"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSwapping(false)
                        setFromCoin("")
                        setToCoin("")
                        setFromAmount("")
                        setToAmount("")
                      }}
                      className="bg-white/10 text-white hover:bg-white/20"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSwapCoins}
                      className="bg-white text-purple-900 hover:bg-white/90"
                      disabled={!fromCoin || !toCoin || !fromAmount || !toAmount}
                    >
                      Swap
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Request Points Modal */}
        {requestingPoints && (
          <div className="fixed inset-0 bg-black/50 z-[9999]" onClick={(e) => {
            if (e.target === e.currentTarget) {
              setRequestingPoints(false);
              setSelectedBusiness("");
              setRequestAmount("");
            }
          }}>
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/20 z-[10000]">
                <h2 className="text-xl font-bold text-white mb-4">Request Points</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white/80" htmlFor="business">
                      Business
                    </label>
                    <Select
                      value={selectedBusiness}
                      onValueChange={setSelectedBusiness}
                    >
                      <SelectTrigger className="bg-white/10 text-white relative z-[10001]">
                        <SelectValue placeholder="Select business" />
                      </SelectTrigger>
                      <SelectContent className="bg-white/100 text-white absolute z-[10002]">
                        {businesses.map((business) => (
                          <SelectItem key={business.name} value={business.name}>
                            {business.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white/80" htmlFor="amount">
                      Amount
                    </label>
                    <Input
                      id="amount"
                      type="number"
                      value={requestAmount}
                      onChange={(e) => setRequestAmount(e.target.value)}
                      className="bg-white/10 text-white"
                      placeholder="Enter amount"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setRequestingPoints(false);
                        setSelectedBusiness("");
                        setRequestAmount("");
                      }}
                      className="bg-white/10 text-white hover:bg-white/20"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleRequestPoints}
                      className="bg-white text-purple-900 hover:bg-white/90"
                      disabled={!selectedBusiness || !requestAmount}
                    >
                      Request
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Donate Modal */}
        {donating && (
          <div className="fixed inset-0 bg-black/50 z-[9999]" onClick={(e) => {
            if (e.target === e.currentTarget) {
              setDonating(false);
              setSelectedDonationRequest(null);
              setDonationAmount("");
            }
          }}>
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/20 z-[10000]">
                <h2 className="text-xl font-bold text-white mb-4">Donate Points</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white/80" htmlFor="donationRequest">
                      Select Donation Request
                    </label>
                    <Select
                      value={selectedDonationRequest?.id || ""}
                      onValueChange={(value) => {
                        const request = donationRequests.find(r => r.id === value);
                        setSelectedDonationRequest(request);
                      }}
                      className="z-[10003]"
                      style={{ zIndex: 10003 }}
                    >
                      <SelectTrigger className="bg-white/10 text-white relative z-[10001]">
                        <SelectValue placeholder="Select donation request" />
                      </SelectTrigger>
                      <SelectContent className="bg-white/100 text-white absolute z-[10002] w-80" style={{ zIndex: 10002 }}>
                        {donationRequests.map((request) => (
                          <SelectItem key={request.id} value={request.id}>
                            {request.business} - {request.amount} points requested
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white/80" htmlFor="donationAmount">
                      Donation Amount
                    </label>
                    <Input
                      id="donationAmount"
                      type="number"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      className="bg-white/10 text-white"
                      placeholder="Enter amount"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setDonating(false);
                        setSelectedDonationRequest(null);
                        setDonationAmount("");
                      }}
                      className="bg-white/10 text-white hover:bg-white/20"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleDonate}
                      className="bg-white text-purple-900 hover:bg-white/90"
                      disabled={!selectedDonationRequest || !donationAmount}
                    >
                      Donate
                    </Button>
                  </div>
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
