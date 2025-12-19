import Link from "next/link"
import { ArrowLeft, FileDown, FlaskConical } from "lucide-react"
import { AdminAuth } from "@/components/admin-auth"

export default function AdminPage() {
  return (
    <AdminAuth>
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

            <h1 className="text-4xl font-bold text-white text-center mb-8">Admin Panel</h1>

            <div className="grid gap-4 md:grid-cols-2">
              <Link
                href="/admin/export"
                className="flex flex-col items-center gap-4 p-6 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors duration-200 border border-gray-600 hover:border-gray-500"
              >
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                  <FileDown className="w-8 h-8 text-white" />
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-bold text-white mb-1">Export Data</h2>
                  <p className="text-gray-400 text-sm">Download experiment results</p>
                </div>
              </Link>

              <Link
                href="/admin/create-experiment"
                className="flex flex-col items-center gap-4 p-6 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors duration-200 border border-gray-600 hover:border-gray-500"
              >
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                  <FlaskConical className="w-8 h-8 text-white" />
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-bold text-white mb-1">Create Experiment</h2>
                  <p className="text-gray-400 text-sm">Set up a new experiment</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AdminAuth>
  )
}

