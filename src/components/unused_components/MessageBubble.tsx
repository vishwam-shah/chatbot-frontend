import React from 'react';

const MessageBubble = ({ message }) => {
  const isBot = message.type === 'bot';
  return (
    <div className={isBot ? 'bot-message' : 'user-message'}>
      <p>{message.content}</p>
    </div>
  );
};

export default MessageBubble;
