// import React, { useMemo } from 'react';
// import PropTypes from 'prop-types';
// import moment from 'moment';

// function MessageCard({ message, me, other }) {
//   const IndvMsg = message.sender === me.id;

//   const TimeDetails = ((timestamp) => {
//     const date = timestamp?.toDate();
//     return moment(date).fromNow();
//   }, [message?.time]);

//   return (
//     <div key={message.id} className={`flex mb-4 ${IndvMsg  ? 'justify-end' : 'justify-start'}`}>
//       <div className={`w-10 h-10 ${IndvMsg? 'ml-2 mr-2' : 'mr-2'}`}>
//         {!IndvMsg && (
//         <img
//           className='w-full h-full object-cover rounded-full'
//           src={me.avatarUrl}
//           alt='Avatar'
//         />
//         )}
//   { !IndvMsg && (
//         <img
//           className='w-full h-full object-cover rounded-full'
//           src={other.avatarUrl}
//           alt='Avatar'
//         />
//         )}

//       </div>
//       <div className={`text-white p-2 rounded-md ${IndvMsg ? 'bg-blue-500 self-end' : 'bg-[#19D39E] self-start'}`}>
//         {message.image && <img src={message.image} className='max-h-60 w-60 mb-4' alt='Message attachment' />}
//         <p>{message.content}</p>
//         <div className='text-xs text-gray-200'>{TimeDetails(message.time)}</div>
//       </div>
//     </div>
//   );
// }

// MessageCard.propTypes = {
//   message: PropTypes.shape({
//     id: PropTypes.string.isRequired,
//     sender: PropTypes.string.isRequired,
//     content: PropTypes.string,
//     image: PropTypes.string,
//     time: PropTypes.object,
//   }).isRequired,
//   me: PropTypes.shape({
//     id: PropTypes.string.isRequired,
//     avatarUrl: PropTypes.string.isRequired,
//   }).isRequired,
//   other: PropTypes.shape({
//     UserProfilepic: PropTypes.string.isRequired,
//   }).isRequired,
// };

// export default MessageCard;

import React from 'react';
import moment from 'moment';

function MessageCard({ message, me, other }) {
  const isMessageFromMe = message.sender === me.id;

  const formatTimeAgo = (timestamp) => {
    const date = timestamp?.toDate();
    const momentDate = moment(date);
    return momentDate.fromNow();
  };

  return (
    <div key={message.id} className={`flex mb-4 ${isMessageFromMe ? 'justify-end' : 'justify-start'}`}>
      {/* Avatar on the left or right based on the sender */}
      <div className={`w-10 h-10 ${isMessageFromMe ? 'ml-2 mr-2' : 'mr-2'}`}>
        {isMessageFromMe && (
          <img
            className='w-full h-full object-cover rounded-full'
            src={me.avatarUrl}
            alt='Avatar'
          />
        )}
        {!isMessageFromMe && (
          <img
            className='w-full h-full object-cover rounded-full'
            src={other.avatarUrl}
            alt='Avatar'
          />
        )}
      </div>

      {/* Message bubble on the right or left based on the sender */}
      <div className={` text-white p-2 rounded-md ${isMessageFromMe ? 'bg-blue-500 self-end' : 'bg-[#19D39E] self-start'}`}>
        {
          message.image && <img src={message.image} className='max-h-60 w-60 mb-4' />
        }
        <p>{message.content}</p>
        <div className='text-xs text-gray-200'>{formatTimeAgo(message.time)}</div>
      </div>
    </div>
  );
}

export default MessageCard;