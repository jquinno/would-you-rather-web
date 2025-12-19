/**
 * Firestore data fetching utilities
 */

import { collection, getDocs, query, where, DocumentData } from 'firebase/firestore'
import { db } from './firebase'
import { Experiment, ExperimentDocument, Item } from './types'

/**
 * Fetch all experiments from Firestore
 */
export async function getExperiments(): Promise<ExperimentDocument[]> {
  try {
    const experimentsRef = collection(db, 'experiments')
    const querySnapshot = await getDocs(experimentsRef)
    
    const experiments: ExperimentDocument[] = []
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Experiment
      experiments.push({
        id: doc.id,
        ...data,
      })
    })
    
    return experiments
  } catch (error) {
    console.error('Error fetching experiments:', error)
    throw error
  }
}

/**
 * Fetch the active experiment from Firestore
 */
export async function getActiveExperiment(): Promise<ExperimentDocument | null> {
  try {
    const experimentsRef = collection(db, 'experiments')
    const q = query(experimentsRef, where('isActive', '==', true))
    const querySnapshot = await getDocs(q)
    
    if (querySnapshot.empty) {
      console.warn('No active experiment found')
      return null
    }
    
    // Get the first active experiment
    const doc = querySnapshot.docs[0]
    const data = doc.data() as Experiment
    
    return {
      id: doc.id,
      ...data,
    }
  } catch (error) {
    console.error('Error fetching active experiment:', error)
    throw error
  }
}

/**
 * Fetch items from the active experiment
 */
export async function getActiveExperimentItems(): Promise<Item[]> {
  try {
    const experiment = await getActiveExperiment()
    
    if (!experiment) {
      console.warn('No active experiment found, returning empty items array')
      return []
    }
    
    return experiment.items || []
  } catch (error) {
    console.error('Error fetching active experiment items:', error)
    throw error
  }
}

