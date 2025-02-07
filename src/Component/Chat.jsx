import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

function Chat() {
  const [id, setId] = useState('');
  const [sendermessage, setSenderMessage] = useState('');
  const [receivedmessage, setReceivedMessage] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3000'); // Ensure full URL with protocol
    setSocket(newSocket);

    return () => {
      newSocket.disconnect(); // Cleanup: Disconnect when component unmounts
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('receive', (data) => {
      console.log(data);
      setReceivedMessage(data);
    });

    socket.on('disconnect', () => {
      console.log('disconnected');
      socket.off('receive');
    });

    return () => {
      socket.off('receive');
    };
  }, [socket]);

  return (
    <>
      <div className='bg-blue-500'>chat</div>

      <form
        className={id === '' ? 'flex' : 'hidden'}
        onSubmit={(e) => {
          e.preventDefault();
          setId(e.target[0].value);
          if (socket) socket.emit('join', e.target[0].value); // Join only after setting ID
        }}
      >
        <input className='border-2 border-zinc-700' type='text' placeholder='enter id' />
        <button className='bg-black text-zinc-200'>submit</button>
      </form>

      <form
        className={id === '' ? 'hidden' : 'block'}
        onSubmit={(e) => {
          e.preventDefault();
          let data = {
            id : e.target[0].value,
            message: e.target[1].value,
          };
          setSenderMessage(data);
          if (socket) socket.emit('sendmessage', data); // Send message only if socket is initialized
        }}
      >
        <input type='text' placeholder='enter sender id' />
        <input type='text' placeholder='enter message' />
        <button>submit</button>
      </form>

      <div>{receivedmessage !== '' ? <p>{receivedmessage}</p> : <p>no message</p>}</div>
    </>
  );
}

export default Chat;
