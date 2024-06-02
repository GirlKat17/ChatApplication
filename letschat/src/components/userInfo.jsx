import React from 'react';

function ProfilePic({ url }) {
  return (
    <div className="w-12 h-12 rounded-full overflow-hidden">
      <img className="w-full h-full object-cover" src={url} alt="Profile Picture" />
    </div>
  );
}

function UsersCard({ profilepic, name, latestMessage, time, type }) {
  return (
    <div className="flex items-center p-4 border-b border-gray-200 relative hover:cursor-pointer">
      {/* Profile Picture */}
      <div className="flex-shrink-0 mr-4 relative">
        <ProfilePic url={profilepic} />
      </div>
      
      {/* Information */}
      <div className="flex-1">
        <div className="flex items-center justify-between">
          {/* Name */}
          <h2 className="text-lg font-semibold">{name}</h2>
          {/* Time (optional) */}
          {type === "chat" && time && (
            <p className="text-sm text-gray-500">{formatTime(time)}</p>
          )}
        </div>
        {/* Latest Message (optional) */}
        {type === "chat" && latestMessage && (
          <p className="text-gray-500 truncate">{latestMessage}</p>
        )}
      </div>
    </div>
  );
}

export default UsersCard;
