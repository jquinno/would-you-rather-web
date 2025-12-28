"use client"

import { useState, useEffect } from "react"
import { Item } from '@/lib/types'
import { submitVote } from '@/lib/cloudFunctions'
import { getOrCreateSessionId } from '@/lib/session'
import { getActiveExperiment } from '@/lib/firestore'

interface WouldYouRatherProps {
  cards?: Item[]
  experimentId?: string
}

type ItemPair = [Item, Item]

export function WouldYouRather({ cards: initialCards, experimentId: initialExperimentId }: WouldYouRatherProps) {
  const [userName, setUserName] = useState<string>("")
  const [hasStarted, setHasStarted] = useState<boolean>(false)
  const [inputValue, setInputValue] = useState<string>("")
  const [topCard, setTopCard] = useState<Item | null>(null)
  const [bottomCard, setBottomCard] = useState<Item | null>(null)
  const [animatingCard, setAnimatingCard] = useState<"top" | "bottom" | null>(null)
  const [lastSelectedCardId, setLastSelectedCardId] = useState<string | null>(null)
  const [bluePercentage, setBluePercentage] = useState<number>(0)

  // New state for pairwise comparison
  const [allPairs, setAllPairs] = useState<ItemPair[]>([])
  const [currentPairIndex, setCurrentPairIndex] = useState<number>(0)
  const [isGameComplete, setIsGameComplete] = useState<boolean>(false)

  // State for vote submission
  const [isSubmittingVote, setIsSubmittingVote] = useState<boolean>(false)
  const [voteError, setVoteError] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string>("")

  // State for experiment data
  const [cards, setCards] = useState<Item[]>(initialCards || [])
  const [experimentId, setExperimentId] = useState<string | undefined>(initialExperimentId)
  const [isFetchingExperiment, setIsFetchingExperiment] = useState<boolean>(false)
  const [experimentError, setExperimentError] = useState<string | null>(null)

  // Initialize session ID on mount
  useEffect(() => {
    setSessionId(getOrCreateSessionId())
  }, [])

  // Generate all unique pairs and shuffle them
  const generatePairs = (items: Item[]): ItemPair[] => {
    const pairs: ItemPair[] = []

    // Generate all unique pairs (i, j) where j > i
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        pairs.push([items[i], items[j]])
      }
    }

    // Shuffle the pairs using Fisher-Yates algorithm
    for (let i = pairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pairs[i], pairs[j]] = [pairs[j], pairs[i]]
    }

    return pairs
  }

  // Initialize pairs when cards are loaded
  useEffect(() => {
    if (cards.length >= 2) {
      const pairs = generatePairs(cards)
      setAllPairs(pairs)
      setCurrentPairIndex(0)
      setIsGameComplete(false)

      // Set initial pair
      if (pairs.length > 0) {
        setTopCard(pairs[0][0])
        setBottomCard(pairs[0][1])
        setBluePercentage(Math.floor(Math.random() * 101))
      }
    }
  }, [cards])

  const handleCardClick = async (cardPosition: "top" | "bottom") => {
    // Prevent multiple clicks while submitting
    if (isSubmittingVote) {
      return
    }

    setAnimatingCard(cardPosition)
    setVoteError(null)

    // Determine winner and loser
    let winnerId: string | null = null
    let loserId: string | null = null

    if (cardPosition === "top" && topCard && bottomCard) {
      winnerId = topCard.id
      loserId = bottomCard.id
      setLastSelectedCardId(topCard.id)
    } else if (cardPosition === "bottom" && bottomCard && topCard) {
      winnerId = bottomCard.id
      loserId = topCard.id
      setLastSelectedCardId(bottomCard.id)
    }

    // Submit vote to Cloud Function if experimentId is available
    if (experimentId && winnerId && loserId) {
      setIsSubmittingVote(true)

      try {
        const response = await submitVote({
          experimentId,
          winnerId,
          loserId,
          sessionId,
          source: 'web',
          userName,
        })

        if (!response.success) {
          console.error('Vote submission failed:', response.message)
          setVoteError(response.message || 'Failed to submit vote')
        }
      } catch (error) {
        console.error('Error submitting vote:', error)
        setVoteError('An error occurred while submitting your vote')
      } finally {
        setIsSubmittingVote(false)
      }
    }

    setTimeout(() => {
      // Move to the next pair
      const nextIndex = currentPairIndex + 1

      if (nextIndex >= allPairs.length) {
        // All pairs have been compared
        setIsGameComplete(true)
        setAnimatingCard(null)
        return
      }

      // Set the next pair
      setCurrentPairIndex(nextIndex)
      setTopCard(allPairs[nextIndex][0])
      setBottomCard(allPairs[nextIndex][1])
      setBluePercentage(Math.floor(Math.random() * 101))
      setAnimatingCard(null)
    }, 300)
  }

  const redPercentage = 100 - bluePercentage

  const handleStartGame = async (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      setUserName(inputValue.trim())

      // Fetch the latest experiment data before starting the game
      setIsFetchingExperiment(true)
      setExperimentError(null)

      try {
        const experiment = await getActiveExperiment()

        if (!experiment || !experiment.items || experiment.items.length === 0) {
          setExperimentError('No active experiment found. Please check back later.')
          setIsFetchingExperiment(false)
          return
        }

        // Set the experiment data
        setCards(experiment.items)
        setExperimentId(experiment.id)
        setHasStarted(true)
      } catch (error) {
        console.error('Error fetching active experiment:', error)
        setExperimentError('Unable to load the experiment. Please try again.')
      } finally {
        setIsFetchingExperiment(false)
      }
    }
  }

  // Show landing page if user hasn't started yet
  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-700">
            <h1 className="text-3xl font-bold text-white text-center mb-2">Would You Rather?</h1>
            <p className="text-gray-400 text-center mb-8">Enter your name to start playing</p>

            <form onSubmit={handleStartGame} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                  disabled={isFetchingExperiment}
                />
              </div>

              {/* Error message display */}
              {experimentError && (
                <div className="p-3 bg-red-500/20 border border-red-500 rounded-lg">
                  <p className="text-red-200 text-sm text-center">{experimentError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={!inputValue.trim() || isFetchingExperiment}
                className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors duration-200"
              >
                {isFetchingExperiment ? 'Loading...' : 'Start Game'}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // Show completion screen when all pairs have been compared
  if (isGameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-700">
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h1 className="text-3xl font-bold text-white mb-2">Game Complete!</h1>
              <p className="text-gray-400 mb-4">
                Thanks for playing, {userName}!
              </p>
              <p className="text-gray-300 mb-6">
                You've compared all {allPairs.length} unique pairs of items.
              </p>
              <button
                onClick={() => {
                  // Reset the game
                  setCurrentPairIndex(0)
                  setIsGameComplete(false)
                  if (allPairs.length > 0) {
                    setTopCard(allPairs[0][0])
                    setBottomCard(allPairs[0][1])
                    setBluePercentage(Math.floor(Math.random() * 101))
                  }
                }}
                className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-colors duration-200"
              >
                Play Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 flex items-center justify-center p-4 pt-20">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white text-center">Would You Rather?</h1>
          <p className="text-gray-400 text-center mt-2">Welcome, {userName}!</p>
          <p className="text-gray-500 text-center text-sm mt-1">
            Comparison {currentPairIndex + 1} of {allPairs.length}
          </p>

          {/* Error message display */}
          {voteError && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500 rounded-lg">
              <p className="text-red-200 text-sm text-center">{voteError}</p>
            </div>
          )}

          {/* Loading indicator */}
          {isSubmittingVote && (
            <div className="mt-4 p-3 bg-blue-500/20 border border-blue-500 rounded-lg">
              <p className="text-blue-200 text-sm text-center">Submitting your vote...</p>
            </div>
          )}
        </div>

        <div className="relative h-[600px]">
          <div className="absolute inset-0 flex flex-col items-center justify-start px-4 pt-4">
            <div className="w-full flex flex-col gap-0">
              <div
                onClick={() => !isSubmittingVote && handleCardClick("top")}
                className={`transition-all duration-300 ${
                  isSubmittingVote ? "cursor-not-allowed opacity-60" : "cursor-pointer"
                } ${
                  animatingCard === "top" ? "scale-95 opacity-50" : animatingCard === "bottom" ? "scale-100" : ""
                }`}
              >
                <div className="bg-blue-500 rounded-2xl p-2 shadow-2xl">
                  <div className="flex items-start justify-between mb-2 px-2">
                    <div className="flex-1">
                      {topCard && <p className="text-white font-semibold">{topCard.name}</p>}
                    </div>
                    <div>
                      {topCard && lastSelectedCardId === topCard.id && <div className="text-white text-2xl">✓</div>}
                    </div>
                  </div>
                  <div className="bg-white rounded-xl aspect-video overflow-hidden">
                    {topCard && (
                      <img
                        src={topCard.imageUrl || "/placeholder.svg"}
                        alt={topCard.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-center -my-8 relative z-10">
                <div className="bg-gray-700 rounded-full w-16 h-16 flex items-center justify-center border-4 border-gray-900">
                  <span className="text-white font-bold text-lg">OR</span>
                </div>
              </div>

              <div
                onClick={() => !isSubmittingVote && handleCardClick("bottom")}
                className={`transition-all duration-300 ${
                  isSubmittingVote ? "cursor-not-allowed opacity-60" : "cursor-pointer"
                } ${
                  animatingCard === "bottom" ? "scale-95 opacity-50" : animatingCard === "top" ? "scale-100" : ""
                }`}
              >
                <div className="bg-red-500 rounded-2xl p-2 shadow-2xl">
                  <div className="flex items-start justify-between mb-2 px-2">
                    <div className="flex-1">
                      {bottomCard && <p className="text-white font-semibold">{bottomCard.name}</p>}
                    </div>
                    <div>
                      {bottomCard && lastSelectedCardId === bottomCard.id && <div className="text-white text-2xl">✓</div>}
                    </div>
                  </div>
                  <div className="bg-white rounded-xl aspect-video overflow-hidden">
                    {bottomCard && (
                      <img
                        src={bottomCard.imageUrl || "/placeholder.svg"}
                        alt={bottomCard.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
