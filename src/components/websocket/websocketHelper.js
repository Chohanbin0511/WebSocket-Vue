// vue2에선 vue2에 맞게 해당 vue Import 수정
import { ref } from 'vue'
import protobuf from 'protobufjs'
let root = null

/**
 * 처음 호출될 때만 Protocol Buffers 파일(OpCode03VO.proto)을
 * 로드하여 protobuf 라이브러리로 파싱
 * @returns
 */
async function _loadProtobuf() {
  if (!root) {
    root = await protobuf.load('src/components/websocket/OpCode03VO.proto')
  }
  return root
}

/**
 * Protocol Buffers에서 지정된 typeName에 해당하는 메시지 유형을 가져옴
 * root 객체가 로드되지 않은 상태에서 호출되면 오류를 발생
 * @param {*} typeName
 * @returns
 */
function _getMessageType(typeName) {
  if (!root) {
    console.log('Protobuf root 로드 되지 않음')
    return
  }
  return root.lookupType(typeName)
}

/**
 * 주어진 메시지 타입(type)과 파라미터(params)를 사용하여 메시지를 인코딩
 * 먼저 params가 유효한지 확인하고, 유효하지 않으면 오류를 throw
 * 유효한 경우에는 메시지를 생성하고 인코딩하여 바이너리 버퍼(messageBuffer)를 반환
 * @param {*} type
 * @param {*} params
 * @returns
 */
function _encodeMessage(type, params) {
  const errMsg = type.verify(params)
  if (errMsg) throw Error(errMsg)
  const messageBuffer = type.encode(type.create(params)).finish()
  return messageBuffer
}

/**
 * 주어진 메시지 타입(type)과 바이너리 버퍼(buffer)를 사용하여 메시지를 디코딩
 * 디코딩된 메시지 객체를 반환
 * @param {*} type
 * @param {*} buffer
 * @returns
 */
function _decodeMessage(type, buffer) {
  const decodedMessage = type.decode(buffer)
  return decodedMessage
}

/**
 * Vue 컴포넌트에서 사용할 수 있는 WebSocket 관련 함수들을 제공하는 커스텀 훅
 * 각 함수는 WebSocket의 상태 변화를 콜백으로 처리함
 * 연결 성공, 메시지 수신, 연결 종료, 오류 발생 등의 상황을 적절히 처리할 수 있도록 구현
 * 이 훅을 Vue 컴포넌트에서 import하여 사용하면, WebSocket 통신을 쉽게 관리 가능
 * @returns
 */
export function useWebSocket() {
  // WebSocket으로부터 수신한 메시지를 반응형으로 관리하는 Vue ref 객체
  const response = ref(null)
  const status = ref(null)
  let ws = null

  // 주어진 URL에 WebSocket 연결을 시도하고, 받을 메시지의 타입 이름을 설정
  const connectWebSocket = async (url, typeName) => {
    await _loadProtobuf()

    ws = new WebSocket(url)

    ws.onopen = () => {
      status.value = 'open'
      console.log('서버에 연결되었습니다.')
    }

    ws.onmessage = async event => {
      console.log('서버로부터 메시지를 수신했습니다:', event.data)
      const reader = new FileReader()
      reader.onload = async () => {
        const buffer = new Uint8Array(reader.result)
        const type = _getMessageType(typeName)
        const decodedMessage = _decodeMessage(type, buffer)
        response.value = decodedMessage
      }
      reader.readAsArrayBuffer(event.data)
    }

    ws.onclose = () => {
      status.value = 'close'
      console.log('서버와의 연결이 종료되었습니다.')
    }

    ws.onerror = error => {
      status.value = 'error'
      console.error('WebSocket 오류:', error)
    }
  }

  // 연결된 WebSocket을 통해 메시지를 보냄
  // 메시지는 지정된 타입(typeName)으로 인코딩된 후 전송
  const sendMessage = async (typeName, params) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      const type = _getMessageType(typeName)
      const messageBuffer = _encodeMessage(type, params)
      ws.send(messageBuffer)
    }
  }

  // WebSocket 연결을 닫습니다.
  const closeWebSocket = () => {
    if (ws) {
      ws.close()
    }
  }

  // 현재 WebSocket 연결을 닫고 다시 연결
  // 주어진 URL과 메시지 타입 이름을 사용하여 새로운 연결을 설정
  const reConnectWebSocket = (url, typeName) => {
    closeWebSocket()
    connectWebSocket(url, typeName)
  }

  return {
    response,
    status,
    connectWebSocket,
    sendMessage,
    closeWebSocket,
    reConnectWebSocket
  }
}
