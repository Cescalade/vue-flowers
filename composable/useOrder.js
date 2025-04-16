import { orderBy, query, getDocs } from 'firebase/firestore'
import { productsRef } from '../firebase'

export async function useOrder(value) {
  const q = query(productsRef, orderBy(value))
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}
