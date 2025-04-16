import { ref } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

const isAuthenticated = ref(false)
const currentUser = ref(null)

function useAuth() {
  const auth = getAuth()
  onAuthStateChanged(auth, (user) => {
    isAuthenticated.value = !!user
    currentUser.value = user
  })

  return { isAuthenticated, currentUser }
}

export default useAuth
