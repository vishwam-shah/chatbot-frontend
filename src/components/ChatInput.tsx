interface ChatInputProps {
  input: string;
  loading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onSend: () => void;
}

export const ChatInput = ({ input, loading, onInputChange, onKeyDown, onSend }: ChatInputProps) => {
  return (
    <div className="flex items-center mb-4 w-full">
  <div className="flex w-full bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 px-2 py-1">
        <input
          type="text"
          className="flex-1 bg-transparent outline-none px-4 py-2 text-base rounded-xl border-none focus:ring-0 focus:border-none dark:text-white text-gray-900 placeholder-gray-400 dark:placeholder-gray-500"
          value={input}
          onChange={onInputChange}
          onKeyDown={onKeyDown}
          placeholder="Type your message..."
        />
        <button
          className="ml-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl shadow hover:from-blue-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onSend}
          disabled={loading}
        >
          {loading ? (
            <span className="animate-pulse">Sending...</span>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 inline-block mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            )}
        </button>
      </div>
    </div>
  );
};