import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { FaCopy, FaCheck } from 'react-icons/fa';

interface ChatMessageProps {
  message: { type: string; content: string };
  isDarkMode: boolean;
  isCopied: boolean;
  onCopy: (text: string) => void;
}

export const ChatMessage = ({ message, isDarkMode, isCopied, onCopy }: ChatMessageProps) => {
  return (
    <div className={`mb-2 flex ${
      message.type === 'bot'
        ? `${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'} p-3 rounded-lg items-center`
        : 'justify-end'
    }`}>
      {message.type === 'bot' ? (
        <div className="flex-1">
          <ReactMarkdown
            className={`${isDarkMode ? 'text-white' : 'text-black'}`}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
          >
            {message.content}
          </ReactMarkdown>
        </div>
      ) : (
        <p className="text-white">{message.content}</p>
      )}
      {message.type === 'bot' && (
        <button
          className={`ml-2 ${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-black'}`}
          onClick={() => onCopy(message.content)}
          title="Copy to clipboard"
        >
          {isCopied ? <FaCheck /> : <FaCopy />}
        </button>
      )}
    </div>
  );
};