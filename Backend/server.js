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
const pendingmessage = [];


app.get('/', (req, res) => {
  res.send('Hello World!');
});   

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('join',(data) => {
        console.log(data);
        user[data] = socket.id;
    })
    socket.on('sendmessage',(data) => {
        console.log(data);
        pendingmessage.push(data);
        // io.emit('receive',data);
    })

    pendingmessage.forEach((data) => {
        user[data[id]].emit('receive',data.message);
    })

    socket.on('disconnect',() => {
        console.log('user disconnected');
    })
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});