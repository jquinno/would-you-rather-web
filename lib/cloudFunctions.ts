/**
 * Firebase Cloud Functions utilities
 */

import { httpsCallable, HttpsCallableResult } from 'firebase/functions'
import { functions } from './firebase'
import { SubmitVoteRequest, SubmitVoteResponse } from './types'

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

