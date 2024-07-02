<template>
  <div>
    <h1>WebSocket 클라이언트</h1>
    <div>npm run socketNoProto 실행 상태여야 함</div>
    <input
      v-model="name"
      placeholder="사용자 이름" />
    <input
      v-model="message"
      @keyup.enter="sendMessage"
      placeholder="메시지 입력" />
    <button @click="sendMessage">메시지 보내기</button>
    <div>서버 응답: {{ response }}</div>
    <div>
      <h3>메시지 리스트</h3>
      <ul>
        <li
          v-for="(msg, index) in messageList"
          :key="index">
          {{ msg.name + ' : ' + msg.text }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const name = ref('')
const message = ref('')
const response = ref('')
const messageList = ref([])
let ws

const connectWebSocket = () => {
  ws = new WebSocket('ws://localhost:8081')

  ws.onopen = () => {
    console.log('서버에 연결되었습니다.')
  }

  ws.onmessage = event => {
    console.log('서버로부터 메시지를 수신했습니다:', event.data)
    response.value = event.data
    messageList.value.push(JSON.parse(event.data))
  }

  ws.onclose = () => {
    console.log('서버와의 연결이 종료되었습니다.')
  }

  ws.onerror = error => {
    console.error('WebSocket 오류:', error)
  }
}

const sendMessage = () => {
  if (!name.value.trim() || !message.value.trim()) return // 빈 메시지 전송 방지

  if (ws && ws.readyState === WebSocket.OPEN) {
    const data = JSON.stringify({ name: name.value, text: message.value })
    ws.send(data)
  }
  // 메시지 전송 후 입력 필드 초기화
  name.value = null
  message.value = null
}

onMounted(() => {
  connectWebSocket()
})

onUnmounted(() => {
  if (ws) {
    ws.close()
  }
})
</script>

<style scoped>
input {
  margin-right: 10px;
}
</style>
