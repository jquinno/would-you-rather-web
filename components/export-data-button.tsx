"use client"

import { useState } from "react"
import { FileDown, Loader2 } from "lucide-react"
import { exportExperiment } from "@/lib/cloudFunctions"
import { useToast } from "@/hooks/use-toast"

export function ExportDataButton() {
  const [isExporting, setIsExporting] = useState(false)
  const { toast } = useToast()

  const handleExport = async () => {
    setIsExporting(true)

    try {
      // Call the Firebase backend function without any parameters
      const response = await exportExperiment({})

      if (response.success) {
        // Show success toast
        toast({
          title: "Export Successful",
          description: "Experiment data exported successfully.",
          variant: "default",
        })
      } else {
        // Show error toast with the message from the backend
        toast({
          title: "Export Failed",
          description: response.message || "Failed to export experiment data. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      // Show error toast for unexpected errors
      console.error("Error exporting data:", error)
      toast({
        title: "Export Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
    >
      {isExporting ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Exporting...</span>
        </>
      ) : (
        <>
          <FileDown className="w-5 h-5" />
          <span>Export Data</span>
        </>
      )}
    </button>
  )
}

