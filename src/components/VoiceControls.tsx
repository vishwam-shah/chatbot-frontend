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
        className="p-2 mb-4 bg-gray-200 rounded-lg text-sm sm:text-base w-full sm:w-auto dark:text-black"
        value={selectedVoice}
        onChange={onVoiceSelect}
      >
        {voices.map((voice) => (
          <option key={voice.name} value={voice.name}>
            {voice.name} ({voice.lang})
          </option>
        ))}
      </select>
      <div className="flex space-x-4">
        <button
          className={`p-2 rounded-lg ${isRecording ? 'bg-red-500' : 'bg-green-500'} text-white hover:bg-green-700`}
          onClick={onRecord}
          disabled={isRecording}
        >
          {isRecording ? 'Recording...' : 'Record Voice'}
        </button>
        <button
          className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-700"
          onClick={onStopRecording}
        >
          Stop Recording
        </button>
        <button
          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-700"
          onClick={onClearChat}
        >
          Clear Chat
        </button>
      </div>
    </div>
  );
};