import { query, collection, getDocs, addDoc, orderBy, deleteDoc, doc } from 'firebase/firestore'
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
  return { q: q ,data: data }
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

  return { q: q ,data: data }
}

/**
 * It deletes an initiative and all of its proposals
 * @param initiative - the initiative object that you want to delete
 * @param proposals - an array of all proposals in the database
 */
export const deleteInitiative = async (id, proposals) => {
  console.log('deleteInitiative', id, proposals)
  await deleteDoc(doc(db, 'initiatives', id));
  proposals.forEach(async (proposal) => {
    if (proposal.initiativeId === id) {
    await deleteDoc(doc(db, 'proposals', proposal.id))
    }
  })
}

export const deleteProposal = async (proposal) => {
  await deleteDoc(doc(db, 'proposals', proposal.id))
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
