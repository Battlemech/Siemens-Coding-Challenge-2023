import { WebSocketServer } from 'ws'
const PORT = 8080
const TRACKING_COUNT = 5

//helper function to get timestamp of button increase
function getTime(){
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return date+' '+time;
}

//instantiate server
const server = new WebSocketServer({port: PORT})

//start tracking button click count
var clickCount = 0
//save times where buttons were clicked during runtime
const timestamps = []

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

        //save history of last transactions
        timestamps[clickCount % TRACKING_COUNT] = getTime()
        console.log('Client incremented value. Count=' + clickCount + ". Time: " + timestamps)

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