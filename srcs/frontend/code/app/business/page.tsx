'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

const programs = [
  {
    id: 1,
    name: "Coffee Rewards",
    conditions: "Get 1 point for every $5 spent",
    rate: 1,
    status: "active"
  },
  {
    id: 2,
    name: "Birthday Bonus",
    conditions: "Get 100 points on your birthday",
    rate: 100,
    status: "inactive"
  }
]

const companyName = "Café Delight" // Replace with actual company name from API
const tokenBalance = 1250 // Replace with actual token balance from API

export default function BusinessPage() {
  const [showCreateProgram, setShowCreateProgram] = useState(false)
  const [showEditProgram, setShowEditProgram] = useState(false)
  const [selectedProgram, setSelectedProgram] = useState(null)
  const [programName, setProgramName] = useState("")
  const [programConditions, setProgramConditions] = useState("")
  const [programRate, setProgramRate] = useState("")
  const [showProfile, setShowProfile] = useState(false)
  const [profileDetails, setProfileDetails] = useState({
    name: "Café Delight", // Replace with actual business name from API
    description: "A cozy coffee shop in the heart of the city. We serve the finest coffee and pastries.", // Replace with actual description from API
    email: "info@cafedelight.com" // Replace with actual email from API
  })

  const handleCreateProgram = async () => {
    try {
      if (!programName || !programConditions || !programRate) {
        toast.error("Please fill in all fields")
        return
      }

      const response = await fetch('/api/programs/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: programName,
          conditions: programConditions,
          rate: parseFloat(programRate)
        }),
      })

      if (response.ok) {
        toast.success("Program created successfully")
        setShowCreateProgram(false)
        setProgramName("")
        setProgramConditions("")
        setProgramRate("")
      } else {
        toast.error("Failed to create program")
      }
    } catch (error) {
      toast.error("Error creating program")
      console.error(error)
    }
  }

  const handleEditProgram = async () => {
    try {
      if (!programName || !programConditions || !programRate) {
        toast.error("Please fill in all fields")
        return
      }

      const response = await fetch(`/api/programs/${selectedProgram.id}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: programName,
          conditions: programConditions,
          rate: parseFloat(programRate)
        }),
      })

      if (response.ok) {
        toast.success("Program updated successfully")
        setShowEditProgram(false)
        setProgramName("")
        setProgramConditions("")
        setProgramRate("")
      } else {
        toast.error("Failed to update program")
      }
    } catch (error) {
      toast.error("Error updating program")
      console.error(error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('businessToken')
    window.location.href = '/login-business'
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-800">
      {/* Profile Button */}
      <div className="fixed top-4 right-4 z-[10001]">
        <Button
          variant="outline"
          className="bg-white/10 text-white hover:bg-white/20"
          onClick={() => setShowProfile(!showProfile)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-user mr-2 h-4 w-4"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          Profile
        </Button>

        {showProfile && (
          <div className="fixed inset-0 bg-black/50 z-[10000]" onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowProfile(false)
            }
          }}>
            <div className="fixed top-4 right-4 z-[10001]">
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/20 w-80">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-building-2 h-6 w-6"><path d="M14 2v6a2 2 0 0 0 2 2h2m-2-6H6a2 2 0 0 0-2 2v6m4-6v6a2 2 0 0 0 2 2h2M6 8h12"></path><path d="M12 12h.01"></path></svg>
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

      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-gradient-to-b from-purple-900 to-purple-800/90 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Business Programs</h1>
          <div className="flex items-center gap-4">
            <span className="text-xl font-semibold text-white">{companyName}</span>
            <span className="text-xl font-medium text-white/80">
              Balance: {tokenBalance} SoLoyal Coins
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Programs List */}
        <div className="space-y-4 mb-8">
          {programs.map((program) => (
            <div key={program.id} className="bg-white/5 backdrop-blur-sm p-4 rounded-lg border border-white/20">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">{program.name}</h3>
                  <p className="text-sm text-white/80">{program.conditions}</p>
                  <p className="text-sm text-white/80">Rate: {program.rate} points</p>
                </div>
                <div className="flex flex-col md:flex-row gap-2">
                  <Button
                    variant="outline"
                    className="bg-white/10 text-white hover:bg-white/20 w-full md:w-auto"
                    onClick={() => {
                      setSelectedProgram(program)
                      setProgramName(program.name)
                      setProgramConditions(program.conditions)
                      setProgramRate(program.rate.toString())
                      setShowEditProgram(true)
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    className={`bg-white/10 text-white hover:bg-white/20 w-full md:w-auto ${program.status === 'active' ? 'bg-green-500/20' : 'bg-red-500/20'}`}
                    onClick={() => {
                      // Implement status toggle logic here
                    }}
                  >
                    {program.status === 'active' ? 'Active' : 'Inactive'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Create Program Button */}
        <div className="flex justify-center">
          <Button
            onClick={() => setShowCreateProgram(true)}
            className="bg-white text-purple-900 hover:bg-white/90 w-full md:w-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-plus mr-2 h-4 w-4"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
            Create New Program
          </Button>
        </div>

        {/* Create Program Modal */}
        {showCreateProgram && (
          <div className="fixed inset-0 bg-black/50 z-[9999]" onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowCreateProgram(false)
              setProgramName("")
              setProgramConditions("")
              setProgramRate("")
            }
          }}>
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/20 z-[10000] w-full md:w-[600px] max-w-[90vw]">
                <h2 className="text-xl font-bold text-white mb-4">Create New Program</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="programName">Program Name</Label>
                    <Input
                      id="programName"
                      value={programName}
                      onChange={(e) => setProgramName(e.target.value)}
                      className="bg-white/10 text-white"
                      placeholder="Enter program name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="programConditions">Program Conditions</Label>
                    <Textarea
                      id="programConditions"
                      value={programConditions}
                      onChange={(e) => setProgramConditions(e.target.value)}
                      className="bg-white/10 text-white"
                      placeholder="Enter program conditions"
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label htmlFor="programRate">Points Rate</Label>
                    <Input
                      id="programRate"
                      type="number"
                      value={programRate}
                      onChange={(e) => setProgramRate(e.target.value)}
                      className="bg-white/10 text-white"
                      placeholder="Enter points rate"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowCreateProgram(false)
                        setProgramName("")
                        setProgramConditions("")
                        setProgramRate("")
                      }}
                      className="bg-white/10 text-white hover:bg-white/20 w-full md:w-auto"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateProgram}
                      className="bg-white text-purple-900 hover:bg-white/90 w-full md:w-auto"
                      disabled={!programName || !programConditions || !programRate}
                    >
                      Create
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Program Modal */}
        {showEditProgram && (
          <div className="fixed inset-0 bg-black/50 z-[9999]" onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowEditProgram(false)
              setProgramName("")
              setProgramConditions("")
              setProgramRate("")
            }
          }}>
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/20 z-[10000] w-full md:w-[600px] max-w-[90vw]">
                <h2 className="text-xl font-bold text-white mb-4">Edit Program</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="programName">Program Name</Label>
                    <Input
                      id="programName"
                      value={programName}
                      onChange={(e) => setProgramName(e.target.value)}
                      className="bg-white/10 text-white"
                      placeholder="Enter program name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="programConditions">Program Conditions</Label>
                    <Textarea
                      id="programConditions"
                      value={programConditions}
                      onChange={(e) => setProgramConditions(e.target.value)}
                      className="bg-white/10 text-white"
                      placeholder="Enter program conditions"
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label htmlFor="programRate">Points Rate</Label>
                    <Input
                      id="programRate"
                      type="number"
                      value={programRate}
                      onChange={(e) => setProgramRate(e.target.value)}
                      className="bg-white/10 text-white"
                      placeholder="Enter points rate"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowEditProgram(false)
                        setProgramName("")
                        setProgramConditions("")
                        setProgramRate("")
                      }}
                      className="bg-white/10 text-white hover:bg-white/20 w-full md:w-auto"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleEditProgram}
                      className="bg-white text-purple-900 hover:bg-white/90 w-full md:w-auto"
                      disabled={!programName || !programConditions || !programRate}
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
