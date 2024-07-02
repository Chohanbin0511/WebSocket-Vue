<template>
  <div>
    <h1>WebSocket 클라이언트</h1>
    <div>ws://10.1.3.43:8080/twin/websocket 실행 상태여야 함</div>
    <button @click="closeSocket">DT 소켓 통신 종료</button>
    <button @click="sendMessage">DT 소켓 통신 하기</button>
    <h3>서버 응답</h3>
    <div>{{ response }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const response = ref('')
let ws

// const sample = ref({
//   azimuth: 1815,
//   colorType: 'green',
//   eventType: 0,
//   id: -9849,
//   lane: 3,
//   lat: 388624294,
//   lon: 1489758511,
//   speed: 104,
//   vehicleType: false,
//   virtual: 0,
//   x: 0,
//   y: 38420
// })
const connectWebSocket = () => {
  //TODO: 대희프로님
  ws = new WebSocket('ws://10.1.3.43:8080/twin/websocket')

  ws.onopen = () => {
    console.log('서버에 연결되었습니다.', ws)
  }

  ws.onmessage = event => {
    console.log('서버로부터 메시지를 수신했습니다:', event.data)
    response.value = event.data
  }

  ws.onclose = () => {
    console.log('서버와의 연결이 종료되었습니다.')
  }

  ws.onerror = error => {
    console.error('WebSocket 오류:', error)
  }
}

const closeSocket = () => {
  if (ws) {
    ws.close()
  }
}
const sendMessage = () => {
  //상행 예시
  if (ws && ws.readyState === WebSocket.OPEN) {
    const params = {
      startPosition: 17633,
      endPosition: 59301,
      zoomLevel: 'vehicle',
      tunnel: 'suwon',
      bound: 'up'
    }
    ws.send(JSON.stringify(params))
  }
}

onMounted(() => {
  connectWebSocket()
})

onUnmounted(() => {
  closeSocket()
})
</script>

<style scoped>
input {
  margin-right: 10px;
}
</style>
