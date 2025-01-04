import React, { useState } from 'react';

const ChatBox = () => {
  const [message, setMessage] = useState('');
  const [inputHistory, setInputHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (message.trim()) {
        // Add the current message to the history
        setInputHistory((prev) => [message, ...prev]);
        setMessage(''); // Clear the input field
        setHistoryIndex(-1); // Reset the history index
      }
    } else if (e.key === 'ArrowUp') {
      // Navigate to the previous input in the history
      if (historyIndex < inputHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setMessage(inputHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      // Navigate to the next input in the history
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setMessage(inputHistory[newIndex]);
      } else if (historyIndex === 0) {
        // Clear the input field when reaching the end of the history
        setHistoryIndex(-1);
        setMessage('');
      }
    }
  };

  return (
    <div>
      <input
        type="text"
        value={message}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Type your message"
      />
    </div>
  );
};

export default ChatBox;
