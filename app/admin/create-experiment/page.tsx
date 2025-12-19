import Link from "next/link"
import { ArrowLeft, FlaskConical } from "lucide-react"
import { AdminAuth } from "@/components/admin-auth"

export default function CreateExperimentPage() {
  return (
    <AdminAuth>
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

            <h1 className="text-4xl font-bold text-white text-center mb-4">Create Experiment</h1>

            <div className="text-center text-gray-400">
              <p className="text-lg">Coming Soon</p>
              <p className="text-sm mt-2">Experiment creation functionality will be available here</p>
            </div>
          </div>
        </div>
      </div>
    </AdminAuth>
  )
}

