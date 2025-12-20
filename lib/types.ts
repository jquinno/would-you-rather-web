/**
 * TypeScript types for Firestore data structures
 */

export interface Item {
  id: string
  index: number
  name: string
  imageUrl: string
}

export interface Experiment {
  name: string
  createdAt: string
  isActive: boolean
  items: Item[]
}

export interface ExperimentDocument extends Experiment {
  id: string
}

/**
 * TypeScript types for Cloud Functions
 */

export interface SubmitVoteRequest {
  experimentId: string
  winnerId: string
  loserId: string
  userId?: string
  sessionId?: string
  source?: string
  userName?: string
}

export interface SubmitVoteResponse {
  success: boolean
  message?: string
  voteId?: string
}

export interface CreateExperimentRequest {
  name: string
  items: Array<{
    name: string
    imageUrl: string
  }>
}

export interface CreateExperimentResponse {
  success: boolean
  message?: string
  experimentId?: string
  pairStatsInitialized?: number
}

export interface ExportExperimentRequest {
  experimentId?: string
}

export interface ExportExperimentResponse {
  success: boolean
  message?: string
}

