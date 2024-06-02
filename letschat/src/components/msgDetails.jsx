import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

function MessageCard({ message, me, other }) {
  const IndvMsg = useMemo(() => message.sender === me.id, [message.sender, me.id]);

  const TimeDetails = useMemo(() => {
    const date = message?.time?.toDate();
    return moment(date).fromNow();
  }, [message?.time]);

  return (
    <div key={message.id} className={`flex mb-4 ${IndvMsg  ? 'justify-end' : 'justify-start'}`}>
      <div className={`w-10 h-10 ${IndvMsg? 'ml-2 mr-2' : 'mr-2'}`}>
        <img
          className=''
          src={IndvMsg? me.UserProfilepic : other.UserProfilepic}
          alt='Avatar'
        />
      </div>
      <div className={`text-white p-2 rounded-md ${IndvMsg ? 'bg-blue-500 self-end' : 'bg-[#19D39E] self-start'}`}>
        {message.image && <img src={message.image} className='' alt='Message attachment' />}
        <p>{message.content}</p>
        <div className=''>{TimeDetails}</div>
      </div>
    </div>
  );
}

MessageCard.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.string.isRequired,
    sender: PropTypes.string.isRequired,
    content: PropTypes.string,
    image: PropTypes.string,
    time: PropTypes.object,
  }).isRequired,
  me: PropTypes.shape({
    id: PropTypes.string.isRequired,
    avatarUrl: PropTypes.string.isRequired,
  }).isRequired,
  other: PropTypes.shape({
    UserProfilepic: PropTypes.string.isRequired,
  }).isRequired,
};

export default MessageCard;
