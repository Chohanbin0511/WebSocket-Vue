<template>
  <div font-mono>Frames: {{ count }}</div>
  <div font-mono>Delta: {{ deltaMs.toFixed(0) }}ms</div>
  <div font-mono>FPS Limit: {{ fpsLimit }}</div>
  <button @click="pause">pause</button>
  <button @click="resume">resume</button>
</template>

<script setup>
import { ref } from 'vue'
import { useRafFn } from '@vueuse/core'

const fpsLimit = 60
const count = ref(0)
const deltaMs = ref(0)
const isImmediate = ref(false)

const { pause, resume } = useRafFn(
  ({ delta }) => {
    deltaMs.value = delta
    count.value += 1
  },
  { immediate: isImmediate.value, fpsLimit }
)
</script>

<style lang="scss" scoped></style>
