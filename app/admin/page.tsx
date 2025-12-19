import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-700">
          <div className="mb-6">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
          </div>
          
          <h1 className="text-4xl font-bold text-white text-center mb-4">Admin</h1>
          
          <div className="text-center text-gray-400">
            <p>Admin page content coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  )
}

