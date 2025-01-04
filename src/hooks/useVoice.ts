// /hooks/useVoice.ts

import { useState, useEffect } from 'react';

const useVoice = () => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");

  useEffect(() => {
    const availableVoices = window.speechSynthesis.getVoices();
    setVoices(availableVoices);
    if (availableVoices.length > 0) {
      setSelectedVoice(availableVoices[0].name);
    }
  }, []);

  return { voices, selectedVoice, setSelectedVoice };
};

export default useVoice; // Ensure the default export
