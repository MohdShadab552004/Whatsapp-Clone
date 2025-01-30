import React,{useEffect, useState} from 'react';
import { io } from 'socket.io-client';

function chat() {
  const [id,setid] = useState('');
  const [sendermessage,setsendermessage] = useState('');
  const [receivedmessage,setreceivedmessage] = useState('');
  const socket = io('localhost:3000');
  useEffect(() =>{
    socket.emit('join',id);
    
    socket.on('receive',(data) => {
      console.log(data);
      setreceivedmessage(data); 
    })

    socket.on('disconnect',() => {
      console.log('disconnected');
      socket.off('receive');
    })
  },[])
  return (
    <>
      <div className='bg-blue-500'>chat</div>
      
        <form className={(id === '') ? 'flex' : 'hidden'} onSubmit={(e) => {
          e.preventDefault()
          setid(e.target[0].value)
          console.log(id);
          
        }}>
          <input className='border-2 border-zinc-700' type='text'  placeholder='enter id'/>
          <button className='bg-black text-zinc-200'>submit</button>
      </form> 


      <form className={(id === '') ? 'hidden' : 'block'} onSubmit={async(e) => {
        e.preventDefault()
        let data = {
          id: id,
          message: e.target[1].value
        }
        setsendermessage(data);
        socket.emit("sendmessage",sendermessage);
      }}>
        <input type='text'  placeholder='enter sender id'/>
        <input type='text'  placeholder='enter message'/>
        <button>submit</button>
    
      </form>
    <div>
      {(receivedmessage !== '') ? <p>{receivedmessage}</p> : <p>no message</p>}
    </div>
    </>
  )
}

export default chat