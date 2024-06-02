'use client'
import { useEffect, useState, useCallback } from "react";
import { db, app } from './firebaseConfig';
import { collection, onSnapshot, query, addDoc, serverTimestamp, where, getDocs } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';
import UsersCard from './userInfo';
import { useRouter } from "next/navigation";
import { toast } from 'react-hot-toast';

const COLLECTIONS = {
  USERS: 'users',
  CHATROOMS: 'chatrooms',
};

function Users({ userData, setSelectedChatroom }) {
  const [activeTab, setActiveTab] = useState('chatrooms');
  const [loading, setLoading] = useState({ users: false, chatrooms: false });
  const [users, setUsers] = useState([]);
  const [userChatrooms, setUserChatrooms] = useState([]);
  const router = useRouter();
  const auth = getAuth(app);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // Fetch all users
  useEffect(() => {
    setLoading(prev => ({ ...prev, users: true }));
    const tasksQuery = query(collection(db, COLLECTIONS.USERS));

    const unsubscribe = onSnapshot(tasksQuery, (snapshot) => {
      const usersData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(usersData);
      setLoading(prev => ({ ...prev, users: false }));
    });

    return () => unsubscribe();
  }, []);

  // Fetch user's chatrooms
  useEffect(() => {
    if (!userData?.id) return;
    setLoading(prev => ({ ...prev, chatrooms: true }));

    const chatroomsQuery = query(collection(db, COLLECTIONS.CHATROOMS), where('users', 'array-contains', userData.id));

    const unsubscribeChatrooms = onSnapshot(chatroomsQuery, (snapshot) => {
      const chatroomsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUserChatrooms(chatroomsData);
      setLoading(prev => ({ ...prev, chatrooms: false }));
    });

    return () => unsubscribeChatrooms();
  }, [userData]);

  // Create a chatroom
  const createChat = useCallback(async (user) => {
    const existingChatroomsQuery = query(collection(db, COLLECTIONS.CHATROOMS), where('users', '==', [userData.id, user.id]));

    try {
      const existingChatroomsSnapshot = await getDocs(existingChatroomsQuery);

      if (existingChatroomsSnapshot.docs.length > 0) {
        toast.error('Chatroom already exists for these users.');
        return;
      }

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

      const chatroomRef = await addDoc(collection(db, COLLECTIONS.CHATROOMS), chatroomData);
      setActiveTab("chatrooms");
    } catch (error) {
      console.error('Error creating or checking chatroom:', error);
    }
  }, [userData]);

  // Open chatroom
  const openChat = useCallback((chatroom) => {
    const data = {
      id: chatroom.id,
      myData: userData,
      otherData: chatroom.usersData[chatroom.users.find((id) => id !== userData.id)],
    };
    setSelectedChatroom(data);
  }, [userData, setSelectedChatroom]);

  const logoutClick = useCallback(() => {
    signOut(auth)
      .then(() => {
        router.push('/login');
      })
      .catch((error) => {
        console.error('Error logging out:', error);
      });
  }, [auth, router]);

  return (
    <div className='shadow-lg h-screen overflow-auto mt-4 mb-20'>
      <div className="flex flex-col lg:flex-row justify-between p-4 space-y-4 lg:space-y-0">
        <button
          className={`btn btn-outline ${activeTab === 'users' ? 'btn-primary' : ''}`}
          onClick={() => handleTabClick('users')}
        >
          Users
        </button>
        <button
          className={`btn btn-outline ${activeTab === 'chatrooms' ? 'btn-primary' : ''}`}
          onClick={() => handleTabClick('chatrooms')}
        >
          Chatrooms
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
            {loading.chatrooms && (
              <div className="flex justify-center items-center h-full">
                <span className="loading loading-spinner text-primary"></span>
              </div>
            )}
            {userChatrooms.map((chatroom) => (
              <div key={chatroom.id} onClick={() => openChat(chatroom)}>
                <UsersCard
                  name={chatroom.usersData[chatroom.users.find((id) => id !== userData?.id)].name}
                  UserProfilepic={chatroom.usersData[chatroom.users.find((id) => id !== userData?.id)].UserProfilepic}
                  latestMessage={chatroom.lastMessage}
                  type={"chat"}
                />
              </div>
            ))}
          </>
        )}

        {activeTab === 'users' && (
          <>
            <h1 className='mt-4 px-4 text-base font-semibold'>Users</h1>
            {loading.users && (
              <div className="flex justify-center items-center h-full">
                <span className="loading loading-spinner text-primary"></span>
              </div>
            )}
            {users.map((user) => (
              user.id !== userData?.id && (
                <div key={user.id} onClick={() => createChat(user)}>
                  <UsersCard
                    name={user.name}
                    UserProfilepic={user.UserProfilepic}
                    latestMessage={""}
                    type={"user"}
                  />
                </div>
              )
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default Users;
