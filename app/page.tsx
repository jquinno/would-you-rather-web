import { WouldYouRather } from "@/components/would-you-rather"
import { getActiveExperiment } from "@/lib/firestore"
import { Item } from "@/lib/types"

export default async function Home() {
  try {
    // Fetch the active experiment from Firestore
    const experiment = await getActiveExperiment()

    // Only render if we have a valid experiment
    if (!experiment || !experiment.items || experiment.items.length === 0) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">No Active Experiment</h1>
            <p className="text-gray-400">Please check back later or contact an administrator.</p>
          </div>
        </div>
      )
    }

    return <WouldYouRather cards={experiment.items} experimentId={experiment.id} />
  } catch (error) {
    console.error('Error fetching active experiment:', error)
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Error Loading Experiment</h1>
          <p className="text-gray-400">Unable to load the experiment. Please try again later.</p>
        </div>
      </div>
    )
  }
}
