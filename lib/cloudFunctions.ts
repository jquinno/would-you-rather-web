/**
 * Firebase Cloud Functions utilities
 */

import { httpsCallable, HttpsCallableResult } from 'firebase/functions'
import { functions } from './firebase'
import { SubmitVoteRequest, SubmitVoteResponse, CreateExperimentRequest, CreateExperimentResponse, ExportExperimentRequest, ExportExperimentResponse } from './types'

/**
 * Submit a vote for an experiment
 * 
 * @param request - The vote submission request containing experimentId, winnerId, loserId, and optional userId/sessionId
 * @returns Promise with the vote submission response
 */
export async function submitVote(
  request: SubmitVoteRequest
): Promise<SubmitVoteResponse> {
  try {
    // Get the callable function reference
    const submitVoteFunction = httpsCallable<SubmitVoteRequest, SubmitVoteResponse>(
      functions,
      'submitVote'
    )

    // Call the function
    const result: HttpsCallableResult<SubmitVoteResponse> = await submitVoteFunction(request)

    return result.data
  } catch (error) {
    console.error('Error submitting vote:', error)
    
    // Return error response
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to submit vote',
    }
  }
}

/**
 * Create a new experiment
 *
 * @param request - The experiment creation request containing name and items
 * @returns Promise with the experiment creation response
 */
export async function createExperiment(
  request: CreateExperimentRequest
): Promise<CreateExperimentResponse> {
  try {
    // Get the callable function reference
    const createExperimentFunction = httpsCallable<CreateExperimentRequest, CreateExperimentResponse>(
      functions,
      'createExperiment'
    )

    // Call the function
    console.log('Sending request to createExperiment:', request)
    const result: HttpsCallableResult<CreateExperimentResponse> = await createExperimentFunction(request)
    console.log('Received response from createExperiment:', result.data)

    return result.data
  } catch (error) {
    console.error('Error creating experiment:', error)

    // Return error response
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create experiment',
    }
  }
}

/**
 * Export experiment data
 *
 * @param request - The export request containing optional experimentId
 * @returns Promise with the export response
 */
export async function exportExperiment(
  request: ExportExperimentRequest = {}
): Promise<ExportExperimentResponse> {
  try {
    // Get the callable function reference
    const exportExperimentFunction = httpsCallable<ExportExperimentRequest, ExportExperimentResponse>(
      functions,
      'exportExperiment'
    )

    // Call the function
    console.log('Sending request to exportExperiment:', request)
    const result: HttpsCallableResult<ExportExperimentResponse> = await exportExperimentFunction(request)
    console.log('Received response from exportExperiment:', result.data)

    return result.data
  } catch (error) {
    console.error('Error exporting experiment:', error)

    // Return error response
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to export experiment',
    }
  }
}

