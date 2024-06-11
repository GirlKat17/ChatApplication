'use client'
import { useEffect, useState } from 'react';
import { collection, addDoc, serverTimestamp, query, onSnapshot } from 'firebase/firestore';
import { firestore } from './firebaseConfig';
import { toast } from 'react-hot-toast';

function CreateGroupChat({ userData, onGroupChatCreated }) {
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersQuery = query(collection(firestore, 'users'));
      const unsubscribe = onSnapshot(usersQuery, (snapshot) => {
        const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setUsers(users);
      });

      return () => unsubscribe();
    };

    fetchUsers();
  }, []);

  const handleUserSelection = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleCreateGroupChat = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const groupChatData = {
        name: groupName,
        description: groupDescription,
        admin: userData.id,
        users: [userData.id, ...selectedUsers],
        timestamp: serverTimestamp(),
        lastMessage: null,
        img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYHhGhXhFe3oVEUtgg6aNTIrXRTttjYYQFcg&usqp=CAU'
      };



      const groupChatRef = await addDoc(collection(firestore, 'groupChats'), groupChatData);
      toast.success('Group chat created successfully!');
      onGroupChatCreated();
      setGroupName('');
      setGroupDescription('');
      setSelectedUsers([]);
    } catch (error) {
      console.error('Error creating group chat:', error);
      toast.error('Failed to create group chat.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleCreateGroupChat} className="p-4 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Group Name</label>
        <input
          type="text"
          className="mt-1 p-2 border rounded w-full"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          className="mt-1 p-2 border rounded w-full"
          value={groupDescription}
          onChange={(e) => setGroupDescription(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Add Users</label>
        <div className="mt-1 p-2 border rounded w-full h-48 overflow-y-scroll">
          {users.map((user) => (
            <div key={user.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                value={user.id}
                checked={selectedUsers.includes(user.id)}
                onChange={() => handleUserSelection(user.id)}
              />
              <label>{user.name}</label>
            </div>
          ))}
        </div>
      </div>
      <button
        type="submit"
        className="btn btn-primary"
        disabled={loading}
      >
        {loading ? 'Creating...' : 'Create Group'}
      </button>
    </form>
  );
}

export default CreateGroupChat;
