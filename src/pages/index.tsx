/* eslint-disable */

// pages/index.tsx
import { useEffect, useState } from 'react';
import { MacOSWindowButtons } from '@/components/macOSWindowButtons';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ChatMessage } from '@/components/ChatMessage';
import { ChatInput } from '@/components/ChatInput';
import { VoiceControls } from '@/components/VoiceControls';
import type { NextPage } from 'next';

const Home: NextPage = () => {
  // State declarations
  const [messages, setMessages] = useState<{ type: string; content: string }[]>([]);
  const [input, setInput] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recognitionInstance, setRecognitionInstance] = useState<any>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [speechUtterance, setSpeechUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isCopied, setIsCopied] = useState(false);

  // Initialize theme and voices
  useEffect(() => {
    // Theme initialization
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'light') {
        setIsDarkMode(false);
        document.documentElement.classList.remove('dark');
      } else {
        setIsDarkMode(true);
        document.documentElement.classList.add('dark');
      }
    }

    // Voice initialization
    const initVoices = () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
        if (availableVoices.length > 0) {
          setSelectedVoice(availableVoices[0].name);
        }
      }
    };

    initVoices();
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = initVoices;
    }

    // Cleanup
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    if (typeof window !== "undefined") {
      document.documentElement.classList.toggle('dark', newTheme);
      localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    }
  };

  const handleSendMessage = async (message: string, fromVoice = false) => {
    if (!message.trim()) return;

    setMessages(prev => [...prev, {
      type: "user",
      content: fromVoice ? `You (Voice): ${message}` : message
    }]);

    setLoading(true);
    setInput("");

    try {
      const response = await fetch("/api/chat", {  // Updated to use Next.js API route
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      const botMessage = data.message || "Sorry, I couldn't understand that.";

      setMessages(prev => [...prev, { type: "bot", content: botMessage }]);

      if (fromVoice && typeof window !== "undefined") {
        const plainTextMessage = botMessage.replace(/<\/?[^>]+(>|$)/g, "");

        if (speechUtterance) {
          window.speechSynthesis.cancel();
        }

        const speech = new SpeechSynthesisUtterance(plainTextMessage);
        const voice = voices.find(v => v.name === selectedVoice);
        if (voice) {
          speech.voice = voice;
        }
        setSpeechUtterance(speech);
        window.speechSynthesis.speak(speech);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [...prev, {
        type: "bot",
        content: "Sorry, something went wrong."
      }]);
    }

    setLoading(false);
  };

  const handleRecordVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Your browser does not support speech recognition.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      handleSendMessage(transcript, true);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
    };

    recognition.start();
    setRecognitionInstance(recognition); // Store instance
  };

  const stopRecording = () => {
    // Stop speech synthesis (if any speech is ongoing)
    if (speechUtterance) {
      window.speechSynthesis.cancel();
      setSpeechUtterance(null);
    }

    // Stop speech recognition (if it's ongoing)
    if (recognitionInstance) {
      recognitionInstance.stop();
      setIsRecording(false);
      setRecognitionInstance(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage(input); // Send the message on Enter key press
      setCurrentIndex(null); // Reset navigation index after sending
    } else if (e.key === "ArrowUp") {
      // Navigate to previous user message
      const userMessages = messages.filter((msg) => msg.type === "user");
      if (userMessages.length === 0) return;

      setCurrentIndex((prevIndex) => {
        const newIndex = prevIndex === null ? userMessages.length - 1 : Math.max(prevIndex - 1, 0);
        setInput(userMessages[newIndex].content); // Set input field with the selected message
        return newIndex;
      });
    } else if (e.key === "ArrowDown") {
      // Navigate to the next user message
      const userMessages = messages.filter((msg) => msg.type === "user");
      if (userMessages.length === 0) return;

      setCurrentIndex((prevIndex) => {
        const newIndex =
          prevIndex === null ? 0 : Math.min(prevIndex + 1, userMessages.length - 1);
        setInput(userMessages[newIndex]?.content || ""); // Clear input if beyond last message
        return newIndex;
      });
    }
  };


  const handleCopy = (text: string) => {
  navigator.clipboard.writeText(text);
  setIsCopied(true);
  setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
};

  return (
  <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} flex flex-col items-center justify-center px-4 py-8`}>
      <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      <div className="gradient-border w-full sm:w-[800px] p-6 sm:p-8 md:p-2 border border-gray-200 dark:border-gray-600 rounded-lg">
        <div className={`inner-container ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}> 
          <h1 className={`text-2xl font-extrabold mb-4 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}> 
            <MacOSWindowButtons /> VS-GPT
          </h1>

          <div className={`h-96 overflow-auto p-4 border rounded-lg mb-4 ${isDarkMode ? 'bg-gray-700 border-gray-300' : 'bg-gray-100 border-gray-300'}`}> 
            {messages.length === 0 ? (
              <p className={`text-center ${isDarkMode ? 'text-white' : 'text-gray-700'}`}> 
                Start the conversation!
              </p>
            ) : (
              messages.map((message, index) => (
                <ChatMessage
                  key={index}
                  message={message}
                  isDarkMode={isDarkMode}
                  isCopied={isCopied}
                  onCopy={(text) => {
                    navigator.clipboard.writeText(text);
                    setIsCopied(true);
                    setTimeout(() => setIsCopied(false), 2000);
                  }}
                />
              ))
            )}
          </div>

          <ChatInput
            input={input}
            loading={loading}
            onInputChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onSend={() => handleSendMessage(input)}
          />

          <VoiceControls
            voices={voices}
            selectedVoice={selectedVoice}
            isRecording={isRecording}
            onVoiceSelect={(e) => setSelectedVoice(e.target.value)}
            onRecord={handleRecordVoice}
            onStopRecording={stopRecording}
            onClearChat={() => setMessages([])}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
