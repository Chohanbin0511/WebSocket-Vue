import { WebSocketServer } from 'ws' // 구조 분해 할당으로 WebSocketServer 가져오기
import protobuf from 'protobufjs'

// Protobuf 파일 로드
const root = protobuf.loadSync('src/server/message.proto')
const ChatMessage = root.lookupType('ChatMessage')

// WebSocket 서버 생성
const wss = new WebSocketServer({ port: 8080 })

wss.on('connection', ws => {
  console.log('클라이언트가 연결되었습니다.')

  ws.on('message', message => {
    console.log('수신된 메시지:', message)

    try {
      // 메시지 디코딩
      const decodedMessage = ChatMessage.decode(new Uint8Array(message))
      console.log(`수신된 메시지: ${JSON.stringify(decodedMessage)}`)

      // 응답 메시지 생성 및 인코딩
      const responseMessage = ChatMessage.create({
        message: 'protobufjs WebSocket 서버로부터의 응답',
        name: `${decodedMessage.name}`,
        text: `${decodedMessage.text}`
      })
      const responseBuffer = ChatMessage.encode(responseMessage).finish()

      // 클라이언트에 응답 전송
      ws.send(responseBuffer)
    } catch (error) {
      console.error('메시지 디코딩 실패:', error)
    }
  })

  ws.on('close', () => {
    console.log('클라이언트와의 연결이 종료되었습니다.')
  })
})

console.log('WebSocket 서버가 8080 포트에서 실행 중입니다.')
