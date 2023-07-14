import { ref } from 'vue'
import { defineStore } from 'pinia'
const PORT = 8080

//track amount of times button was clicked
const count = ref(0)

//define remote increment function
function remoteIncrement(socket, amount){
  socket.send(JSON.stringify({count: amount}))
}

//connect asynchronously to avoid blank ui if server isn't running
async function setupNetworking() {
  //setup networking
  const socket = new WebSocket('ws://localhost:'+PORT)

  socket.addEventListener('message', (messageEvent) => {
    const data = JSON.parse(messageEvent.data)
    
    //increment local reference by value
    count.value = data.count
  })
  
  socket.addEventListener('open', (connectEvent) => {
    //inform server of click count before connect
    remoteIncrement(socket, count.value)
  })

  return socket
}

//allow accessing async task
const socket = await setupNetworking()

function increment(){
  //if client isn't connected: Increment value locally, synchronise later
  if(socket == null) {
    count.value++
    return
  }

  //tell server to increment count by one
  remoteIncrement(socket, 1)
}

export const counterStore = defineStore('counter', () => {
  //expose count value and increment functions
  return { count, increment }
})
