<template>
  <div>
    <h1>WebSocket VueUse Hook</h1>
    <div>npm run socket 실행 상태여야 함</div>
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
import { ref, onMounted } from 'vue'
import { useWebSocket } from '@vueuse/core'
import protobuf from 'protobufjs'

const name = ref('')
const message = ref('')
const response = ref('')
const messageList = ref([])
let ChatMessage

// Protobuf 파일 로드
const loadProtobuf = async () => {
  const root = await protobuf.load('src/server/message.proto')
  ChatMessage = root.lookupType('ChatMessage')
}

onMounted(() => {
  loadProtobuf()
})

// WebSocket 설정
const { send } = useWebSocket('ws://localhost:8080', {
  onConnected() {
    console.log('서버에 연결되었습니다.')
  },
  onDisconnected() {
    console.log('서버와의 연결이 종료되었습니다.')
  },
  onError(error) {
    console.error('WebSocket 오류:', error)
  },
  onMessage(ws, event) {
    console.log('서버로부터 메시지를 수신했습니다:', event.data)
    const reader = new FileReader()
    reader.onload = () => {
      const buffer = new Uint8Array(reader.result)
      const decodedMessage = ChatMessage.decode(buffer)
      response.value = `${decodedMessage.name}: ${decodedMessage.text}`
      messageList.value.push({
        name: decodedMessage.name,
        text: decodedMessage.text
      })
    }
    reader.readAsArrayBuffer(event.data)
  }
})

const sendMessage = () => {
  if (!name.value.trim() || !message.value.trim()) return // 빈 메시지 전송 방지
  if (ChatMessage) {
    const payload = { name: name.value, text: message.value }
    const errMsg = ChatMessage.verify(payload)
    if (errMsg) throw Error(errMsg)

    const messageBuffer = ChatMessage.encode(
      ChatMessage.create(payload)
    ).finish()
    send(messageBuffer)
  }

  // 메시지 전송 후 입력 필드 초기화
  name.value = null
  message.value = null
}
</script>

<style scoped>
input {
  margin-right: 10px;
}
</style>
