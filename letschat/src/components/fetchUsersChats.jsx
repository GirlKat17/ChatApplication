// 'use client'
// import { useEffect, useState, useCallback } from "react";
// import { firestore, app } from './firebaseConfig';
// import { collection, onSnapshot, query, addDoc, serverTimestamp, where, getDocs } from 'firebase/firestore';
// import { getAuth, signOut } from 'firebase/auth';
// import UsersCard from './userInfo';
// import { useRouter } from "next/navigation";
// import { toast } from 'react-hot-toast';
// import { HiUsers } from "react-icons/hi";
// import { HiChatBubbleLeftRight } from "react-icons/hi2";



// function Users({ userData, setSelectedChatroom }) {
//   const [activeTab, setActiveTab] = useState('chatrooms');
//   const [loading, setLoading] = useState({ users: false, chatrooms: false });
//   const [loading2, setLoading2] = useState(false);
//   const [users, setUsers] = useState([]);
//   const [userChatrooms, setUserChatrooms] = useState([]);
//   const router = useRouter();
//   const auth = getAuth(app);

//   const handleTabClick = (tab) => {
//     setActiveTab(tab);
//   };

//   // Fetch all users
//   useEffect(() => {
//     setLoading2(prev => ({ ...prev, users: true }));
//     const tasksQuery = query(collection(firestore, 'users'));

//     const unsubscribe = onSnapshot(tasksQuery, (snapshot) => {
//       const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//       setUsers(users);
//       setLoading2(prev => ({ ...prev, users: false }));
//     });

//     return () => unsubscribe();
//   }, []);

//   // Fetch user's chatrooms
//   useEffect(() => {
//     // Ensure userData is defined
//     setLoading(prev => ({ ...prev, chatrooms: true }));
//     if (!userData?.id) return;
//     const chatroomsQuery = query(collection(firestore, 'chatrooms'), where('users', 'array-contains', userData.id));

//     const unsubscribeChatrooms = onSnapshot(chatroomsQuery, (snapshot) => {
//       const chatroomsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      
//       setLoading(prev => ({ ...prev, chatrooms: false }));
//       setUserChatrooms(chatroomsData);
//     });

//     return () => unsubscribeChatrooms();
//   }, [userData]);

//   // Create a chatroom
//   const createChat = async (user) => {

//     const existingChatroomsQuery = query(collection(firestore,'chatrooms'), where('users', '==', [userData.id, user.id]));

//     try {
//       const existingChatroomsSnapshot = await getDocs(existingChatroomsQuery);

//       if (existingChatroomsSnapshot.docs.length > 0) {
//         toast.error('Chatroom already exists for these users.');
//         return;
//       }

//       const usersData = {
//         [userData.id]: userData,
//         [user.id]: user,
//       };

//       const chatroomData = {
//         users: [userData.id, user.id],
//         usersData,
//         timestamp: serverTimestamp(),
//         lastMessage: null,
//       };

//       const chatroomRef = await addDoc(collection(firestore, 'chatrooms'), chatroomData);
//       console.log('Chatroom created with ID:', chatroomRef.id);
//       setActiveTab("chatrooms");
//     } catch (error) {
//       console.error('Error creating or checking chatroom:', error);
//     }
//   };

//   // Open chatroom
//   const openChat = async  (chatroom) => {
   
//     const data = {
//       id: chatroom.id,
//       myData: userData,
//       otherData: chatroom.usersData[chatroom.users.find((id) => id !== userData.id)],
//     };
//     setSelectedChatroom(data);
//   };

//   const logoutClick = () => {
//     signOut(auth)
//       .then(() => {
//         router.push('/auth');
//       })
//       .catch((error) => {
//         console.error('Error logging out:', error);
//       });
//   };

//   return (
//     <div className='shadow-lg h-screen overflow-auto mt-4 mb-20'>
//       <div className="flex flex-col lg:flex-row justify-between p-4 space-y-4 lg:space-y-0">
//         <button
//           className={`btn btn-outline ${activeTab === 'users' ? 'btn-primary' : ''}`}
//           onClick={() => handleTabClick('users')}
//         >
//          <HiUsers />
//         </button>
//         <button
//           className={`btn btn-outline ${activeTab === 'chatrooms' ? 'btn-primary' : ''}`}
//           onClick={() => handleTabClick('chatrooms')}
//         >
//          <HiChatBubbleLeftRight />
//         </button>
//         <button
//           className={`btn btn-outline`}
//           onClick={logoutClick}
//         >
//           Logout
//         </button>
//       </div>

//       <div>
//         {activeTab === 'chatrooms' && (
//           <>
//             <h1 className='px-4 text-base font-semibold'>Chatrooms</h1>
//             {loading && (
//               <div className="flex justify-center items-center h-full">
//                 <span className="loading loading-spinner text-primary"></span>
//               </div>
//             )}
//             {userChatrooms.map((chatroom) => (
//               <div key={chatroom.id} onClick={() => {openChat(chatroom)}}>
//                 <UsersCard
//                   name={chatroom.usersData[chatroom.users.find((id) => id !== userData?.id)].name}
//                   avatarUrl={chatroom.usersData[chatroom.users.find((id) => id !== userData?.id)].avatarUrl}
//                   latestMessage={chatroom.lastMessage}
//                   type={"chat"}
//                 />
//               </div>
//             ))}
//           </>
//         )}

//         {activeTab === 'users' && (
//           <>
//             <h1 className='mt-4 px-4 text-base font-semibold'>Users</h1>
//             {loading2 && (
//               <div className="flex justify-center items-center h-full">
//                 <span className="loading loading-spinner text-primary"></span>
//               </div>
//             )}
//             {users.map((user) => (
//                       <div key={user.id} onClick={() => createChat(user)}>
//              { user.id !== userData?.id && 
        
//                   <UsersCard
//                     name={user.name}
//                     avatarUrl={user.avatarUrl}
//                     latestMessage={""}
//                     type={"user"}
//                   />
//              }
//               </div>
//               )
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Users;

'use client'
import { useEffect, useState } from "react";
import { firestore, app } from './firebaseConfig';
import { collection, onSnapshot, query, addDoc, serverTimestamp, where, getDocs } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';
import UsersCard from './userInfo';
import { useRouter } from "next/navigation";
import { toast } from 'react-hot-toast';
import { HiUsers } from "react-icons/hi";
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import { HiUserGroup } from "react-icons/hi";
import CreateGroupChat from './groupChat';
import y from '../images/groupava.jpg'

function Users({ userData, setSelectedChatroom }) {
  const [activeTab, setActiveTab] = useState('chatrooms');
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [users, setUsers] = useState([]);
  const [userChatrooms, setUserChatrooms] = useState([]);
  const [groupChats, setGroupChats] = useState([]);
  const router = useRouter();
  const auth = getAuth(app);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // Get all users
  useEffect(() => {
    setLoading2(true);
    const tasksQuery = query(collection(firestore, 'users'));
    const unsubscribe = onSnapshot(tasksQuery, (snapshot) => {
      const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(users);
      setLoading2(false);
    });
    return () => unsubscribe();
  }, []);

  // Get chatrooms
  useEffect(() => {
    setLoading(true);
    if (!userData?.id) return;
    const chatroomsQuery = query(collection(firestore, 'chatrooms'), where('users', 'array-contains', userData.id));
    const unsubscribeChatrooms = onSnapshot(chatroomsQuery, (snapshot) => {
      const chatrooms = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setLoading(false);
      setUserChatrooms(chatrooms);
    });

    // Cleanup function for chatrooms
    return () => unsubscribeChatrooms();
  }, [userData]);

  // Get group chats
  useEffect(() => {
    if (!userData?.id) return;
    const groupChatsQuery = query(collection(firestore, 'groupChats'), where('users', 'array-contains', userData.id));
    const unsubscribeGroupChats = onSnapshot(groupChatsQuery, (snapshot) => {
      const groupChats = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setGroupChats(groupChats);
    });

    // Cleanup function for group chats
    return () => unsubscribeGroupChats();
  }, [userData]);

  // Create a chatroom
  const createChat = async (user) => {
    // Check if a chatroom already exists for these users
    const existingChatroomsQuery = query(collection(firestore, 'chatrooms'), where('users', '==', [userData.id, user.id]));

    try {
      const existingChatroomsSnapshot = await getDocs(existingChatroomsQuery);

      if (existingChatroomsSnapshot.docs.length > 0) {
        // Chatroom already exists, handle it accordingly (e.g., show a message)
        console.log('Chatroom already exists for these users.');
        toast.error('Chatroom already exists for these users.');
        return;
      }

      // Chatroom doesn't exist, proceed to create a new one
      const usersData = {
        [userData.id]: userData,
        [user.id]: user,
      };

      const chatroomData = {
        users: [userData.id, user.id],
        usersData,
        timestamp: serverTimestamp(),
        lastMessage: null,
      };

      const chatroomRef = await addDoc(collection(firestore, 'chatrooms'), chatroomData);
      console.log('Chatroom created with ID:', chatroomRef.id);
      setActiveTab("chatrooms");
    } catch (error) {
      console.error('Error creating or checking chatroom:', error);
    }
  };

 

// Open chatroom
const openChat = async (chatroom) => {
  let otherData;

  if (chatroom.users.length > 6) {
    // It's a group chat
    otherData = chatroom.usersData;
  } else {
    // It's a one-on-one chat
    const otherUserId = chatroom.users.find((id) => id !== userData.id);

    if (otherUserId && chatroom.usersData && chatroom.usersData[otherUserId]) {
      otherData = chatroom.usersData[otherUserId];
    } else {
      // Handle the case where otherUserId is not found or usersData is missing
      console.error("User data not found or otherUserId is invalid.");
      otherData = {}; // or handle appropriately
    }
  }

    const data = {
      id: chatroom.id,
      myData: userData,
      otherData,
    };

    setSelectedChatroom(data);
  };

  const logoutClick = () => {
    signOut(auth)
      .then(() => {
        router.push('/login');
      })
      .catch((error) => {
        console.error('Error logging out:', error);
      });
  };

  return (
    <div className='shadow-lg h-screen overflow-auto mt-4 mb-20'>
      <div className="flex flex-col lg:flex-row justify-between p-4 space-y-4 lg:space-y-0">
        <button
          className={`btn btn-outline ${activeTab === 'users' ? 'btn-primary' : ''}`}
          onClick={() => handleTabClick('users')}
        >
          <HiUsers />
        </button>
        <button
          className={`btn btn-outline ${activeTab === 'groupchat' ? 'btn-primary' : ''}`}
          onClick={() => handleTabClick('groupchat')}
        >
          <HiUserGroup />
        </button>
        <button
          className={`btn btn-outline ${activeTab === 'chatrooms' ? 'btn-primary' : ''}`}
          onClick={() => handleTabClick('chatrooms')}
        >
          <HiChatBubbleLeftRight />
        </button>
        <button
          className={`btn btn-outline`}
          onClick={logoutClick}
        >
          Logout
        </button>
      </div>

      <div>
        {activeTab === 'chatrooms' && (
          <>
            <h1 className='px-4 text-base font-semibold'>Chatrooms</h1>
            {
              loading && (
                <div className="flex justify-center items-center h-full">
                  <span className="loading loading-spinner text-primary"></span>
                </div>
              )
            }
            {
              userChatrooms.map((chatroom) => (
                <div key={chatroom.id} onClick={() => { openChat(chatroom) }}>
                  <UsersCard
                    name={chatroom.usersData[chatroom.users.find((id) => id !== userData?.id)].name}
                    avatarUrl={chatroom.usersData[chatroom.users.find((id) => id !== userData?.id)].avatarUrl}
                    latestMessage={chatroom.lastMessage}
                    type={"chat"}
                  />
                </div>
              ))
            }
          </>
        )}

        {activeTab === 'users' && (
          <>
            <h1 className='mt-4 px-4 text-base font-semibold'>Users</h1>
            {
              loading2 && (
                <div className="flex justify-center items-center h-full">
                  <span className="loading loading-spinner text-primary"></span>
                </div>
              )
            }
            {
              users.map((user) => (
                
                <div key={user.id} onClick={() => { createChat(user),console.log(user) }}>
                  {user.id !== userData?.id &&
                    <UsersCard
                      name={user.name}
                      avatarUrl={user.avatarUrl}
                      latestMessage={""}
                      type={"user"}
                    />
                  }
                </div>
              ))
            }
          </>
        )}

        {activeTab === 'groupchat' && (
          <>
            <h1 className='mt-4 px-4 text-base font-semibold'>Group Chats</h1>
            <CreateGroupChat userData={userData} onGroupChatCreated={() => setActiveTab('groupchat')} />
            {
              groupChats.map((groupChat) => (
                <div key={groupChat.id} onClick={() => { openChat(groupChat) }} style={{ display:' flex'}}>
                  <UsersCard
                    name={groupChat.name} 
                    avatarUrl={groupChat.img} // Replace with actual group avatar if available
                    latestMessage={groupChat.lastMessage}
                    time={''}
                    type={"group"}
                  />
               <p><b>{groupChat.name}</b></p>

                </div>
              ))
            }
          </>
        )}
      </div>
    </div>
  );
}

export default Users;
