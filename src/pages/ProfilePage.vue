<script setup>
import useAuth from '../../composable/useAuth'
import { ref, onMounted } from 'vue'
import { getFirestore, doc, getDoc } from 'firebase/firestore'

const { isAuthenticated, currentUser } = useAuth()
const profileData = ref(null)
const db = getFirestore()

onMounted(async () => {
  if (currentUser.value) {
    // Пользователь аутентифицирован, получаем его данные из Firestore
    const userDocRef = doc(db, 'users', currentUser.value.uid)
    const docSnap = await getDoc(userDocRef)

    if (docSnap.exists()) {
      profileData.value = docSnap.data()
    } else {
      console.log('No such document!')
      // Обработка случая, когда данные пользователя не найдены в Firestore
    }
  } else {
    // Пользователь не аутентифицирован, перенаправьте на страницу входа
    // (предполагается, что у вас есть такая логика)
    console.log('User is not authenticated')
    // router.push('/login');
  }
})
</script>

<template>
  <h1>Profile</h1>
  <div v-if="isAuthenticated && profileData">
    <p><strong>Email:</strong> {{ currentUser.email }}</p>
    <p v-if="currentUser.displayName">
      <strong>Display Name:</strong> {{ currentUser.displayName }}
    </p>
    <p v-if="profileData.phone"><strong>Phone:</strong> {{ profileData.phone }}</p>
  </div>
  <div v-else-if="!isAuthenticated">
    <p>You are not logged in.</p>
  </div>
  <div v-else>
    <p>Loading profile information...</p>
  </div>
</template>
