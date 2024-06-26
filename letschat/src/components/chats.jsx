// import React, { useEffect, useState, useRef } from 'react';
// import MessageCard from './msgDetails'; 
// import MessageInput from './MsgInput'; 
// import { addDoc, collection, doc, serverTimestamp, onSnapshot, query, where, orderBy, updateDoc } from 'firebase/firestore';
// import { firestore } from './firebaseConfig';

// const Chat = ({ user, selectedChatroom }) => {
//   const me = selectedChatroom?.myData;
//   const other = selectedChatroom?.otherData;
//   const chatRoomId = selectedChatroom?.id;

//   const [message, setMessage] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [image, setImage] = useState(null);
//   const messagesContainerRef = useRef(null);

//   useEffect(() => {
//     // Scroll to the bottom when messages change
//     if (messagesContainerRef.current) {
//       messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
//     }
//   }, [messages]);

//   // Get messages
//   useEffect(() => {
//     if (!chatRoomId) {
//       console.error("Chat ID is not defined");
//       return;
//     }

//     const q = query(collection(firestore, 'messages'), where("chatRoomId", "==", chatRoomId), orderBy('time', 'asc'));
//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const msgs = snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setMessages(msgs);
//     }, (error) => {
//       console.error("Error fetching messages:", error);
//     });

//     return () => {
//       unsubscribe();
//     };
//   }, [chatRoomId]);

//   // Send message
//   const sendMessage = async () => {
//     const messagesCollection = collection(firestore, 'messages');
//     if (!me || !chatRoomId) {
//       console.error("User or chat room is not defined");
//       return;
//     }

//     if (message.trim() === '' && !image) {
//       return;
//     }

//     try {
//       const newMessage = {
//         chatRoomId: chatRoomId,
//         sender: me.id,
//         content: message,
//         time: serverTimestamp(),
//         image: image || null,
//       };

//       await addDoc(collection(firestore, 'messages'), newMessage);
//       setMessage('');
//       setImage(null);

//       const chatroomRef = doc(firestore, 'chatrooms', chatRoomId);
//       await updateDoc(chatroomRef, { lastMessage: message ? message : "Image" });

//       if (messagesContainerRef.current) {
//         messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
//       }
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   };

//   return (
//     <div className='flex flex-col h-screen'>
//       {/* Messages container with overflow and scroll */}
//       <div ref={messagesContainerRef} className='flex-1 overflow-y-auto p-10'>
//         {messages.map((msg) => (
//           <MessageCard key={msg.id} message={msg} me={me} other={other} />
//         ))}
//       </div>

//       {/* Input box at the bottom */}
//       <MessageInput sendMessage={sendMessage} message={message} setMessage={setMessage} image={image} setImage={setImage} />
//     </div>
//   );
// };

// export default Chat;


import React,{useState,useEffect,useRef} from 'react';
import MessageCard from './msgDetails';
import MessageInput from './MsgInput';
import { addDoc, collection,doc, serverTimestamp,onSnapshot,query,where,orderBy,updateDoc } from 'firebase/firestore';
import { firestore } from './firebaseConfig';

function ChatRoom({ user ,selectedChatroom}) {
  const me = selectedChatroom?.myData
  const other = selectedChatroom?.otherData
  const chatRoomId = selectedChatroom?.id

  const [message, setMessage] = useState([]);
  const [messages, setMessages] = useState([]);
  const messagesContainerRef = useRef(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    // Scroll to the bottom when messages change
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

//get messages 
useEffect(() => {
  if(!chatRoomId) return;
  const unsubscribe = onSnapshot(
    query(collection(firestore, 'messages'),where("chatRoomId","==",chatRoomId),orderBy('time', 'asc')),
    (snapshot) => {
      const messages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      //console.log(messages);
      setMessages(messages);
    }
  );

  return unsubscribe;
}, [chatRoomId]);

//put messages in db
 const sendMessage = async () => {
    const messagesCollection = collection(firestore, 'messages');
    // Check if the message is not empty
  if (message == '' && image == '') {
    return;
  }

  try {
    // Add a new message to the Firestore collection
    const newMessage = {
      chatRoomId:chatRoomId,
      sender: me.id,
      content: message,
      time: serverTimestamp(),
      image: image,
    };

    await addDoc(messagesCollection, newMessage);
    setMessage('');
    setImage('');
    //send to chatroom by chatroom id and update last message
    const chatroomRef = doc(firestore, 'chatrooms', chatRoomId);
    await updateDoc(chatroomRef, { lastMessage: message ? message : "Image" });

    // Clear the input field after sending the message
    
  } catch (error) {
    console.error('Error sending message:', error.message);
  }

  // Scroll to the bottom after sending a message
  if (messagesContainerRef.current) {
    messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
  }
    
}


  return (
    <div className='flex flex-col h-screen'>
      {/* Messages container with overflow and scroll */}
      <div ref={messagesContainerRef} className='flex-1 overflow-y-auto p-10'>
        {messages?.map((message) => (
          <MessageCard key={message.id} message={message} me={me} other={other}/>
        ))}
      </div>

      {/* Input box at the bottom */}
      <MessageInput sendMessage={sendMessage} message={message} setMessage={setMessage} image={image} setImage={setImage}/>
    </div>
  );
}

export default ChatRoom;