
import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { firestore } from './firebaseConfig';

const CreateGroupChat = ({ currentUser }) => {
  const [groupName, setGroupName] = useState('');
  const [members, setMembers] = useState([]);

  const handleCreateGroupChat = async () => {
    try {
      // Create a new chatroom document in Firestore
      const docRef = await addDoc(collection(firestore, 'chatrooms'), {
        name: groupName,
        members: [...members, currentUser.uid], // Include the creator in the list of members
        createdBy: currentUser.uid,
      });

      console.log("Group chat created with ID: ", docRef.id);
      // Optionally, you can navigate the user to the newly created group chat
    } catch (error) {
      console.error("Error creating group chat:", error);
    }
  };

  return (
    <div>
      <input type="text" value={groupName} onChange={(e) => setGroupName(e.target.value)} placeholder="Group Name" />
      <input type="text" value={members} onChange={(e) => setMembers(e.target.value.split(','))} placeholder="Member IDs (comma-separated)" />
      <button onClick={handleCreateGroupChat}>Create Group Chat</button>
    </div>
  );
};

export default CreateGroupChat;
