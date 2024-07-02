<template>
  <div>
    <h1>WebSocket 클라이언트</h1>
    <div>ws://10.1.3.43:8080/twin/websocket 실행 상태여야 함</div>
    <button @click="closeWebSocket">DT 소켓 통신 종료</button>
    <br />
    <button @click="sendRequestMessage">DT Protobuf 소켓 통신 하기</button>
    <br />
    <button @click="fetchReconnect">DT Protobuf 소켓 재연결</button>
    <h3>서버 응답</h3>
    <div>상태 : {{ status }}</div>
    <div>{{ response }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useWebSocket } from './websocketHelper'
const {
  response,
  status,
  connectWebSocket,
  sendMessage,
  closeWebSocket,
  reConnectWebSocket
} = useWebSocket()

// requset param 임의 지정
const requestParams = ref({
  startPosition: 17633,
  endPosition: 17700,
  zoomLevel: 'vehicle',
  tunnel: 'suwon',
  bound: 'up'
})

const WS_URL = 'ws://10.1.3.43:8080/twin/websocket' // 동적으로 URL을 지정
const OP_CODE03 = 'OPCode03' //사용할 메시지 타입을 지정
const REQUEST = 'Request' // 사용할 메시지 타입을 지정

onMounted(() => {
  // 초기 연결 시 사용할 메시지 타입을 지정하여 웹소켓 설정
  connectWebSocket(WS_URL, OP_CODE03)
})

onUnmounted(() => {
  closeWebSocket()
})

const fetchReconnect = () => {
  //
  reConnectWebSocket(WS_URL, OP_CODE03)
}

const sendRequestMessage = () => {
  sendMessage(REQUEST, requestParams.value)
}

// OPCode03 메시지에 필요한 파라미터를 정의
// const opCode03Params = ref({})
// const sendOPCode03Message = () => {
//   sendMessage(OPCode03, opCode03Params.value)
// }
</script>

<style scoped>
input {
  margin-right: 10px;
}
button {
  margin: 5px;
  padding: 5px;
  border: 1px solid;
  border-radius: 5px;
}
</style>
