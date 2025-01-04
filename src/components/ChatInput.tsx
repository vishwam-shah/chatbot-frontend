interface ChatInputProps {
  input: string;
  loading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onSend: () => void;
}

export const ChatInput = ({ input, loading, onInputChange, onKeyDown, onSend }: ChatInputProps) => {
  return (
    <div className="flex items-center mb-4 w-full text-black">
      <input
        type="text"
        className="flex-1 p-2 border border-gray-300 rounded-l-lg"
        value={input}
        onChange={onInputChange}
        onKeyDown={onKeyDown}
        placeholder="Type your message..."
      />
      <button
        className="p-2 bg-blue-500 text-white rounded-r-lg"
        onClick={onSend}
        disabled={loading}
      >
        {loading ? 'Sending...' : 'Send'}
      </button>
    </div>
  );
};