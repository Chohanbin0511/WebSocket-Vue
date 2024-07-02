import { WebSocketServer } from 'ws'

// WebSocket 서버 생성
const wss = new WebSocketServer({ port: 8081 })

wss.on('connection', ws => {
  console.log('클라이언트가 연결되었습니다.')

  // 클라이언트로부터 메시지를 수신했을 때 처리
  ws.on('message', message => {
    console.log(`수신된 메시지: ${message}`)
    try {
      // JSON 파싱
      const data = JSON.parse(message)
      const { name, text } = data

      // 메시지와 함께 이름을 포함하여 다시 클라이언트로 전송
      const response = {
        message: 'JSON WebSocket 서버로부터의 응답',
        name,
        text
      }
      ws.send(JSON.stringify(response))
    } catch (error) {
      console.error('잘못된 JSON 형식의 메시지입니다:', error)
      ws.send(JSON.stringify({ error: '잘못된 JSON 형식입니다.' }))
    }
  })

  // 클라이언트와의 연결이 종료되었을 때 처리
  ws.on('close', () => {
    console.log('클라이언트와의 연결이 종료되었습니다.')
  })
})

console.log('WebSocket 서버가 8081 포트에서 실행 중입니다.')
