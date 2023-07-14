import { WebSocketServer } from 'ws'
const PORT = 8080

//instantiate server
const server = new WebSocketServer({port: PORT})

//start tracking button click count
var clickCount = 0

//handle incoming connections
server.on('connection', (socket) => {
    console.log('Client connected. count=' + clickCount)

    //inform client of current click count
    socket.send(JSON.stringify({count: clickCount}))

    //increment clickCount on demand and inform clients
    socket.on('message', (data) => {
        //parse data
        const remoteCount = JSON.parse(data).count
        
        //No global update necessary: Client didn't click before connect
        //Also, handle invalid data
        if(remoteCount == 0 || remoteCount == NaN || remoteCount == undefined) return;

        //increment the tracker
        clickCount += remoteCount

        console.log('Client incremented value. Count=' + clickCount)

        //notify all connected sessions of updated clickCount
        server.clients.forEach(client => {
            client.send(JSON.stringify({count: clickCount}))
        });
    })

    //log client disconnects
    socket.on('close', (code, message) => {
        console.log('Client disconnected')
    })
})

console.log('Listening on localhost:'+PORT)