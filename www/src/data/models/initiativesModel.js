import {
  query,
  collection,
  getDocs,
  addDoc,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
} from 'firebase/firestore'
import { db } from '../../lib/firebase'
import * as short from 'short-uuid'

/**
 * A function that it creates a new initiative in the firestore database
 * @returns The response from the firestore database.
 */
 export const createInitiative = async ({
  createAt,
  title,
  uid,
  userName,
  rating,
}) => {
  const res = await addDoc(collection(db, 'initiatives'), {
    createAt,
    title,
    uid,
    userName,
    rating,
  })
  return res
}

/**
 * A function that it creates a new proposal in the firestore database
 * @returns The id of the newly created document.
 */
 export const createProposal = async ({
  createAt,
  updateAt,
  initiativeId,
  negativeVotes,
  positiveVotes,
  description,
  uid,
  userName,
}) => {
  const initiativeRef = doc(db, 'initiatives', initiativeId)
  const newProposal = {
    id: short.generate(),
    createAt,
    updateAt,
    negativeVotes,
    positiveVotes,
    description,
    uid,
    userName,
  }

  const res = await updateDoc(initiativeRef, {
    proposals: arrayUnion(newProposal),
  })
  return res
}

/**
 * A function that it queries the initiatives collection, orders the results by the property and
 * order passed in, and returns the data
 * @param property - the property to order by
 * @param order - 'asc' or 'desc'
 * @returns An array of objects.
 */
export const getInitiativesCollection = async (property, order) => {
  const q = query(collection(db, 'initiatives'), orderBy(property, order))
  const querySnapshot = await getDocs(q)
  const data = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
  return { q: q, data: data }
}

/**
 * A function that it takes a proposal, a rating, a userId and an initiativeId and updates the
 * initiative with the new rating
 * @param currentProposal - The proposal that the user is rating
 * @param rating - 'up' or 'down'
 * @param userId - The user's ID
 * @param initiativeId - the id of the initiative
 */
 export const updateRating = async (currentProposal, rating, userId, initiativeId) => {
  const initiativeRef = doc(db, 'initiatives', initiativeId)
  const docSnap = await getDoc(initiativeRef)
  const proposals = docSnap.data().proposals.map((proposal) => {
    if (currentProposal.id === proposal.id && rating === 'up') {
      return {
        ...proposal,
        positiveVotes: [...proposal.positiveVotes, userId],
      }
    } else if (currentProposal.id === proposal.id && rating === 'down') {
      return {
        ...proposal,
        negativeVotes: [...proposal.negativeVotes, userId],
      }
    }
    return proposal
  })

  await updateDoc(initiativeRef, {
    proposals: proposals,
  })
}

/**
 * A function that it deletes an initiative and all of its proposals
 * @param initiative - the initiative object that you want to delete
 * @param proposals - an array of all proposals in the firestore database
 */
export const deleteInitiative = async (id, proposals) => {
  await deleteDoc(doc(db, 'initiatives', id))
  proposals.forEach(async (proposal) => {
    if (proposal.initiativeId === id) {
      await deleteDoc(doc(db, 'proposals', proposal.id))
    }
  })
}


/**
 * A function that it deletes a proposal from an initiative
 * @param proposalToDelete - The proposal object that you want to delete.
 * @param initiativeId - The id of the initiative that the proposal belongs to
 */
export const deleteProposal = async (proposalToDelete, initiativeId) => {
  const initiativeRef = doc(db, 'initiatives', initiativeId)
  const docSnap = await getDoc(initiativeRef)
  const proposals = docSnap.data().proposals.filter((proposal) => proposal.id !== proposalToDelete.id)

  await updateDoc(initiativeRef, { proposals: proposals })
}
