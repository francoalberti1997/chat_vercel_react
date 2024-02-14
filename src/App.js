import React, { useState, useEffect } from 'react';

const ChatRoom = ({ roomName }) => {
  const [chatLog, setChatLog] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [chatSocket, setChatSocket] = useState(null);

  useEffect(() => {
    const socket = new WebSocket(
      `ws://localhost:8000/ws/chat/${roomName}/`
    );

    socket.onopen = () => {
      console.log('WebSocket connected');
    };

    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setChatLog((prevLog) => prevLog + `${data.usuario}: ${data.message}\n`);
    };

    socket.onerror = (e) => {
      console.error('WebSocket error: ', e);
    };

    socket.onclose = (e) => {
      console.error('WebSocket closed unexpectedly');
    };

    setChatSocket(socket);

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [roomName]);

  const sendMessage = () => {
    if (chatSocket.readyState === WebSocket.OPEN) {
      chatSocket.send(JSON.stringify({ message: messageInput }));
      setMessageInput('');
    } else {
      console.error('WebSocket is not open');
    }
  };

  return (
    <div>
      <textarea id="chat-log" cols="100" rows="20" value={chatLog} readOnly></textarea>
      <br />
      <input
        id="chat-message-input"
        type="text"
        size="100"
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
      />
      <br />
      <button id="chat-message-submit"
        value="Send"
        onClick={sendMessage}>
        ENVIAR
      </button>
    </div>
  );
};

export default ChatRoom;
