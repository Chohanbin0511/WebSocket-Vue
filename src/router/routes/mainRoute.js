import DetailLayout from '@/layouts/DetailLayout.vue'
const Main = () => import('@/views/Main.vue')

export default [
  {
    path: '/main',
    name: 'main',
    component: Main
  },
  {
    path: '/webSocket',
    component: DetailLayout,
    children: [
      {
        path: '/webSocketProtoDT',
        name: 'webSocketProtoDT',
        component: () => import('@/views/webSocket/WebSocketProtoDT.vue')
      },
      {
        path: '/webSocketNoProtoDT',
        name: 'webSocketNoProtoDT',
        component: () => import('@/views/webSocket/WebSocketNoProtoDT.vue')
      },
      {
        path: '/webSocketProto',
        name: 'webSocketProto',
        component: () => import('@/views/webSocket/WebSocketProto.vue')
      },
      {
        path: '/webSocketNoProto',
        name: 'webSocketNoProto',
        component: () => import('@/views/webSocket/WebSocketNoProto.vue')
      },
      {
        path: '/webSocketProtoVueUse',
        name: 'webSocketProtoVueUse',
        component: () => import('@/views/webSocket/WebSocketProtoVueUse.vue')
      }
    ]
  },
  {
    path: '/frame',
    component: DetailLayout,
    children: [
      {
        path: '/frameTest',
        name: 'frameTest',
        component: () => import('@/views/frame/FrameTest.vue')
      }
    ]
  }
]
