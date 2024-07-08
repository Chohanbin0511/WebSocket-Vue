<template>
  <div style="margin: 20px">
    <h1>webSocketList</h1>
    <ul>
      <li
        v-for="item in webSocketList"
        :key="item.name">
        <button @click="handleClick(item.routerName)">{{ item.name }}</button>
      </li>
    </ul>
    <h1>frameTestList</h1>
    <ul>
      <li
        v-for="item in frameTestList"
        :key="item.name">
        <button @click="handleClick(item.routerName)">{{ item.name }}</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const webSocketList = ref([
  { name: 'webSocketProtoDT', routerName: 'webSocketProtoDT' },
  { name: 'webSocketNoProtoDT', routerName: 'webSocketNoProtoDT' },
  { name: 'webSocketNoProto', routerName: 'webSocketNoProto' },
  { name: 'webSocketProto', routerName: 'webSocketProto' },
  { name: 'webSocketProtoVueUse', routerName: 'webSocketProtoVueUse' }
])

const frameTestList = ref([{ name: 'frameTest', routerName: 'frameTest' }])

const router = useRouter()

const handleClick = routerName => {
  console.log(`${routerName} 클릭됨`)
  router.push({ name: routerName })
}
</script>

<style scoped>
button {
  margin: 5px;
}
</style>
