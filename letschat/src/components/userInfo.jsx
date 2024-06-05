import React from 'react';


function UsersCard({ avatarUrl, name, latestMessage, time, type }) {
  return (
    <div className="flex items-center p-4 border-b border-gray-200 relative hover:cursor-pointer">
      <div className="flex-shrink-0 mr-4 relative">
        <div className="w-12 h-12 rounded-full overflow-hidden">
          <img className="w-full h-full object-cover" src={avatarUrl} alt="Avatar" />
        </div>
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{name}</h2>
          {type === "chat" && time && (
            <p className="text-sm text-gray-500">{formatTime(time)}</p>
          )}
        </div>
        {type === "user" && (
          <div className="flex-1">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{latestMessage}</h2>
          </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UsersCard;