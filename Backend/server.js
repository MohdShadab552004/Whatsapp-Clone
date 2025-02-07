import express from 'express';
import http from 'http';
import  {Server} from 'socket.io';
import cors from 'cors'

const app = express();
app.use(cors({
    origin: 'http://localhost:5173'
}))
const port = 3000;

const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin: 'http://localhost:5173',
        methods: ['GET','POST']
    }
});


const user = {};
const pendingMessages = {};


app.get('/', (req, res) => {
  res.send('Hello World!');
});   

io.on('connection', (socket) => {
    console.log('a user connected',socket.id);

    socket.on('join',(data) => {
        console.log(data);
        user[data] = socket.id;
        
        if (pendingMessages[data] && pendingMessages[data].length > 0) {
            console.log(`Sending ${pendingMessages[data].length} pending messages to ${data}`);
            
            // Send all pending messages
            pendingMessages[data].forEach((msg) => {
                io.to(user[data]).emit('receive', msg.message);
            });

            // ✅ Clear messages after sending
            delete pendingMessages[data];
        }

        
    })
    socket.on('sendmessage',(data) => {
        const userId = user[data.id];
        if(userId){
            io.to(user[data.id]).emit("receive",data.message);
            console.log("successfull");
            
        }else{
            if (!pendingMessages[data.id]) {
                pendingMessages[data.id] = [];
            }
            pendingMessages[data.id].push(data);
            console.log(("bhai add kiya"));
            
        }
    })


    socket.on('disconnect',() => {
        console.log(`User disconnected: ${socket.id}`);

        // Find userID associated with this socket ID
        let disconnectedUser = null;
        for (let userID in user) {
            if (user[userID] === socket.id) {
                disconnectedUser = userID;
                break;
            }
        }

        // If user was found, remove from active users list
        if (disconnectedUser) {
            delete user[disconnectedUser];
            console.log(`User ${disconnectedUser} removed from active users`);
        }
    });
});


server.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});