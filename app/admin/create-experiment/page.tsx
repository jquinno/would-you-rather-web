import { AdminAuth } from "@/components/admin-auth"
import { CreateExperimentForm } from "@/components/create-experiment-form"

export default function CreateExperimentPage() {
  return (
    <AdminAuth>
      <CreateExperimentForm />
    </AdminAuth>
  )
}

