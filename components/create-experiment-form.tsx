"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, FlaskConical, Plus, X } from "lucide-react"
import { createExperiment } from "@/lib/cloudFunctions"

interface ItemInput {
  name: string
  imageUrl: string
}

export function CreateExperimentForm() {
  const router = useRouter()
  const [experimentName, setExperimentName] = useState("")
  const [items, setItems] = useState<ItemInput[]>([
    { name: "", imageUrl: "" },
    { name: "", imageUrl: "" },
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState<{
    experimentId: string
    pairStatsInitialized?: number
  } | null>(null)

  const addItem = () => {
    setItems([...items, { name: "", imageUrl: "" }])
  }

  const removeItem = (index: number) => {
    if (items.length > 2) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  const updateItem = (index: number, field: "name" | "imageUrl", value: string) => {
    const newItems = [...items]
    newItems[index][field] = value
    setItems(newItems)
  }

  const validateForm = (): string | null => {
    if (!experimentName.trim()) {
      return "Experiment name is required"
    }

    if (items.length < 2) {
      return "At least 2 items are required"
    }

    for (let i = 0; i < items.length; i++) {
      if (!items[i].name.trim()) {
        return `Item ${i + 1} name is required`
      }
      if (!items[i].imageUrl.trim()) {
        return `Item ${i + 1} image URL is required`
      }
      // Basic URL validation
      try {
        new URL(items[i].imageUrl)
      } catch {
        return `Item ${i + 1} image URL is not a valid URL`
      }
    }

    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(null)

    // Validate form
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setIsSubmitting(true)

    try {
      const response = await createExperiment({
        name: experimentName.trim(),
        items: items.map(item => ({
          name: item.name.trim(),
          imageUrl: item.imageUrl.trim(),
        })),
      })

      if (response.success && response.experimentId) {
        setSuccess({
          experimentId: response.experimentId,
          pairStatsInitialized: response.pairStatsInitialized,
        })
        // Optionally redirect after a delay
        setTimeout(() => {
          router.push("/admin")
        }, 3000)
      } else {
        setError(response.message || "Failed to create experiment")
      }
    } catch (err) {
      setError("An error occurred while creating the experiment")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show success message
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-700">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
                <FlaskConical className="w-10 h-10 text-white" />
              </div>
            </div>

            <h1 className="text-4xl font-bold text-white text-center mb-4">Experiment Created!</h1>

            <div className="bg-green-500/20 border border-green-500 rounded-lg p-4 mb-6">
              <p className="text-green-200 text-center mb-2">
                <strong>Experiment ID:</strong> {success.experimentId}
              </p>
              {success.pairStatsInitialized !== undefined && (
                <p className="text-green-200 text-center">
                  <strong>Pair Stats Initialized:</strong> {success.pairStatsInitialized}
                </p>
              )}
            </div>

            <p className="text-gray-400 text-center mb-6">
              Redirecting to admin panel...
            </p>

            <Link
              href="/admin"
              className="block w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-colors duration-200 text-center"
            >
              Back to Admin
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Show form
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-700">
          <div className="mb-6">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </Link>
          </div>

          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
              <FlaskConical className="w-10 h-10 text-white" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-white text-center mb-8">Create Experiment</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Experiment Name */}
            <div>
              <label htmlFor="experimentName" className="block text-sm font-medium text-gray-300 mb-2">
                Experiment Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="experimentName"
                value={experimentName}
                onChange={(e) => setExperimentName(e.target.value)}
                placeholder="Enter experiment name"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={isSubmitting}
              />
            </div>

            {/* Items */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-300">
                  Items <span className="text-red-400">*</span> <span className="text-gray-500">(min 2)</span>
                </label>
                <button
                  type="button"
                  onClick={addItem}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors duration-200"
                >
                  <Plus className="w-4 h-4" />
                  Add Item
                </button>
              </div>

              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-white font-medium">Item {index + 1}</h3>
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        disabled={items.length <= 2 || isSubmitting}
                        className="inline-flex items-center justify-center w-8 h-8 bg-red-500 hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200"
                        title={items.length <= 2 ? "Minimum 2 items required" : "Remove item"}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label htmlFor={`item-name-${index}`} className="block text-xs font-medium text-gray-400 mb-1">
                          Item Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          id={`item-name-${index}`}
                          value={item.name}
                          onChange={(e) => updateItem(index, "name", e.target.value)}
                          placeholder="Enter item name"
                          className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                          disabled={isSubmitting}
                        />
                      </div>

                      <div>
                        <label htmlFor={`item-url-${index}`} className="block text-xs font-medium text-gray-400 mb-1">
                          Image URL <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          id={`item-url-${index}`}
                          value={item.imageUrl}
                          onChange={(e) => updateItem(index, "imageUrl", e.target.value)}
                          placeholder="https://example.com/image.jpg"
                          className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500 rounded-lg">
                <p className="text-red-200 text-sm text-center">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors duration-200"
            >
              {isSubmitting ? "Creating Experiment..." : "Create Experiment"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

