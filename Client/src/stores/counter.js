import { ref } from 'vue'
import { defineStore } from 'pinia'
const PORT = 8080

//track amount of times button was clicked
const count = ref(0)

//setup networking
const socket = new WebSocket('ws://localhost:' + PORT)

socket.addEventListener('message', (messageEvent) => {
  //parse received dict
  const data = JSON.parse(messageEvent.data)

  //update local value to remote one
  count.value = data.count
})

//inform server that value needs to be incremented
function increment() {
  socket.send(JSON.stringify({ count: 1 }))
}

export const counterStore = defineStore('counter', () => {
  //expose count value and increment functions
  return { count, increment }
})
