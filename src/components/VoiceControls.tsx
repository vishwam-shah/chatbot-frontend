interface VoiceControlsProps {
  voices: SpeechSynthesisVoice[];
  selectedVoice: string;
  isRecording: boolean;
  onVoiceSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onRecord: () => void;
  onStopRecording: () => void;
  onClearChat: () => void;
}

export const VoiceControls = ({
  voices,
  selectedVoice,
  isRecording,
  onVoiceSelect,
  onRecord,
  onStopRecording,
  onClearChat
}: VoiceControlsProps) => {
  return (
    <div className="flex flex-col items-center">
      <select
        className="p-2 mb-4 bg-gray-200 text-gray-900 rounded-lg text-sm sm:text-base w-full sm:w-auto dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={selectedVoice}
        onChange={onVoiceSelect}
        style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
      >
        {voices.map((voice) => (
          <option key={voice.name} value={voice.name} className="bg-white text-gray-900 dark:bg-gray-800 dark:text-white">
            {voice.name} ({voice.lang})
          </option>
        ))}
      </select>
      <div className="flex space-x-4">
        <button
          className={`p-2 rounded-lg ${isRecording ? 'bg-red-500' : 'bg-green-500'} text-white hover:bg-green-700 shadow-md`}
          onClick={onRecord}
          disabled={isRecording}
        >
          {isRecording ? 'Recording...' : 'Record Voice'}
        </button>
        <button
          className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-700 shadow-md"
          onClick={onStopRecording}
        >
          Stop Recording
        </button>
        <button
          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-700 shadow-md"
          onClick={onClearChat}
        >
          Clear Chat
        </button>
      </div>
    </div>
  );
};