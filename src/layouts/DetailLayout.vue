<template>
  <div style="margin: 20px">
    <button
      class="btn"
      @click="goBack">
      X
    </button>
    <h2>{{ currentRouteName }}</h2>
    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'

const router = useRouter()
const route = useRoute()

const currentRouteName = computed(() => {
  return route.name
})

const goBack = () => {
  router.go(-1) // 이전 페이지로 이동
}
</script>

<style>
.btn {
  margin: 10px;
}
</style>
