import {
  query,
  collection,
  getDocs,
  addDoc,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../../lib/firebase'

/**
 * It queries the initiatives collection, orders the results by the property and
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
 * It queries the proposals collection, orders the results by the createAt field in
 * descending order, and returns the results as an array of objects
 * @returns An array of objects.
 */
export const getProposalsCollection = async () => {
  const q = query(collection(db, 'proposals'), orderBy('createAt', 'desc'))
  const querySnapshot = await getDocs(q)
  const data = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))

  return { q: q, data: data }
}

/**
 * It deletes an initiative and all of its proposals
 * @param initiative - the initiative object that you want to delete
 * @param proposals - an array of all proposals in the database
 */
export const deleteInitiative = async (id, proposals) => {
  console.log('deleteInitiative', id, proposals)
  await deleteDoc(doc(db, 'initiatives', id))
  proposals.forEach(async (proposal) => {
    if (proposal.initiativeId === id) {
      await deleteDoc(doc(db, 'proposals', proposal.id))
    }
  })
}

/**
 * It deletes a proposal from the database
 * @param proposal - The proposal object that you want to delete.
 */
export const deleteProposal = async (proposal) => {
  await deleteDoc(doc(db, 'proposals', proposal.id))
}

/**
 * It updates the proposal document with the user's vote
 * @param proposal - The proposal object that we're updating
 * @param rating - 'up' or 'down'
 * @param userId - The user's ID
 */
export const updateRating = async (proposal, rating, userId) => {
  const proposalRef = doc(db, 'proposals', proposal.id)
  const data = {
    ...proposal,
  }

  if (rating === 'up') {
    await updateDoc(proposalRef, {
      positiveVotes: [...proposal.positiveVotes, userId],
    })
  } else {
    await updateDoc(proposalRef, {
      negativeVotes: [...proposal.negativeVotes, userId],
    })
  }
}

/**
 * It creates a new initiative in the database
 * @returns The response from the database.
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
 * It creates a new proposal in the database
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
  const res = await addDoc(collection(db, 'proposals'), {
    createAt,
    updateAt,
    initiativeId,
    negativeVotes,
    positiveVotes,
    description,
    uid,
    userName,
  })
  return res
}
