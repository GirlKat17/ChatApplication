import React from 'react';
import Users from '@/components/fetchUsersChats';
import Chat from '@/components/chats';

const ChatDisplay = ({ user, selectedChatroom, handleSelectChatroom }) => {
  return (
    <div className="flex h-screen">
      <div className="flex-shrink-0 w-3/12">
        <Users userData={user} setSelectedChatroom={handleSelectChatroom} />
      </div>
      <div className="flex-grow w-9/12">
        {selectedChatroom ? (
          <Chat user={user} selectedChatroom={selectedChatroom} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-2xl text-gray-400">Select a chatroom</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatDisplay;
