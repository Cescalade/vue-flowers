import { ref } from 'vue'
import { getDocs, collection, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase/index'

let cachedProducts = null

export function useProducts() {
  const products = ref([])

  const getProducts = async () => {
    if (cachedProducts) {
      products.value = cachedProducts
      return
    }
    const querySnapshot = await getDocs(collection(db, 'products'))
    let fbProducts = []
    querySnapshot.forEach((doc) => {
      const product = {
        id: doc.id,
        imgUrl: doc.data().imgUrl,
        title: doc.data().title,
        price: doc.data().price,
        description: doc.data().description,
      }
      fbProducts.push(product)
    })
    products.value = fbProducts
    cachedProducts = fbProducts
  }

  return {
    products,
    getProducts,
  }
}
