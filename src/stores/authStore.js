import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth'
import { getFirestore, doc, setDoc } from 'firebase/firestore'
import { app } from '../../firebase/index'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isLoading = ref(true)
  const error = ref(null)
  const auth = getAuth(app)
  const db = getFirestore(app)
  const isInitialized = ref(false)

  const init = () => {
    isLoading.value = true
    onAuthStateChanged(auth, async (firebaseUser) => {
      user.value = firebaseUser
      isLoading.value = false
    })
  }

  const login = async (email, password) => {
    try {
      error.value = null
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      return userCredential.user
    } catch (err) {
      handleError(err)
      throw err
    }
  }

  const register = async (userData) => {
    try {
      error.value = null
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password,
      )

      await updateProfile(userCredential.user, {
        displayName: `${userData.firstName} ${userData.lastName}`,
      })

      const userDoc = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        createdAt: new Date(),
      }

      await setDoc(doc(db, 'users', userCredential.user.uid), userDoc)
      await setDoc(doc(db, 'carts', userCredential.user.uid), { items: [] })

      return userCredential.user
    } catch (err) {
      handleError(err)
      throw err
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      user.value = null
    } catch (err) {
      handleError(err)
      throw err
    }
  }

  const handleError = (error) => {
    const errorMap = {
      'auth/email-already-in-use': 'Этот email уже зарегистрирован',
      'auth/invalid-email': 'Неверный формат email',
      'auth/weak-password': 'Пароль должен содержать минимум 6 символов',
      'auth/operation-not-allowed': 'Метод аутентификации отключен',
      'auth/network-request-failed': 'Проблемы с подключением к интернету',
    }
    error.value = errorMap[error.code] || `Ошибка: ${error.message} (${error.code})`
    console.error('Firebase Error:', error)
  }

  return { user, isLoading, error, init, login, register, logout }
})
