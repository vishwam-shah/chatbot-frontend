import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';  // GitHub Flavored Markdown
import rehypeRaw from 'rehype-raw';  // To allow raw HTML rendering
import { FaCopy, FaSun, FaMoon, FaCheck } from 'react-icons/fa';

const MacOSWindowButtons = () => {
  return (
    <div className="flex space-x-2 p-2">
      <span className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition"></span>
      <span className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition"></span>
      <span className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition"></span>
    </div>
  );
};

const Home = () => {
  const [messages, setMessages] = useState<{ type: string; content: string }[]>([]);
  const [input, setInput] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number | null>(null); // Track navigation index
  const [loading, setLoading] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recognitionInstance, setRecognitionInstance] = useState<any>(null); // Store recognition instance
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [speechUtterance, setSpeechUtterance] = useState<SpeechSynthesisUtterance | null>(null); // Store current speech utterance
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isCopied, setIsCopied] = useState(false); // For copy confirmation

  useEffect(() => {
    const populateVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0) {
        setSelectedVoice(availableVoices[0].name);
      }
    };

    populateVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = populateVoices;
    }

    // Set theme from localStorage
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'light') {
        setIsDarkMode(false);
        document.body.classList.remove('dark');
      } else {
        setIsDarkMode(true);
        document.body.classList.add('dark');
      }
    }
  }, []);

  const toggleTheme = () => {
  const newTheme = !isDarkMode;
  setIsDarkMode(newTheme);
  document.body.classList.toggle('dark', newTheme);  // Toggle dark class on body

  // Save the preference to localStorage
  localStorage.setItem('theme', newTheme ? 'dark' : 'light');
};



  const handleSendMessage = async (message: string, fromVoice = false) => {
  if (!message.trim()) return;

  setMessages((prev) => [
    ...prev,
    { type: "user", content: fromVoice ? `You (Voice): ${message}` : message },
  ]);

  setLoading(true);
  setInput(""); // Clear input field

  try {
    const response = await fetch("http://localhost:5000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();
    const botMessage = data.message || "Sorry, I couldn't understand that.";

    if (data.action === "open_youtube") {
        // Open YouTube in a new tab
        window.open("https://www.youtube.com", "_blank");
    } else {
        // Handle other responses
        console.log(data.message);
    }

    setMessages((prev) => [...prev, { type: "bot", content: botMessage }]);

    // Strip out HTML or markdown content (just keep the plain text)
    const plainTextMessage =
      typeof botMessage === "string"
        ? botMessage.replace(/<\/?[^>]+(>|$)/g, "")
        : "";

    // Speak bot's response if the message came from voice input
    setTimeout(() => {
      if (speechUtterance) {
        window.speechSynthesis.cancel(); // Stop current speech
      }

      if (fromVoice) {
        const speech = new SpeechSynthesisUtterance(plainTextMessage);
        const voice = voices.find((v) => v.name === selectedVoice);
        if (voice) {
          speech.voice = voice;
        }
        setSpeechUtterance(speech); // Store the current speech utterance
        window.speechSynthesis.speak(speech); // Start speaking the message
      }
    }, 1000); // Delay speech by 1000ms (1 second)
  } catch (error) {
    console.error("Error sending message:", error);
    setMessages((prev) => [
      ...prev,
      { type: "bot", content: "Sorry, something went wrong." },
    ]);
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
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'} flex flex-col items-center justify-center px-4 py-8`}>
      {/* Dark Mode Toggle Button */}
      <button
  className="absolute top-4 right-4 p-2 rounded-full shadow-md"
  onClick={toggleTheme}
  title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
>
  {isDarkMode ? <FaSun className="text-yellow-500" /> : <FaMoon className="text-blue-500" />}
</button>

      <div className="gradient-border w-full sm:w-[800px] p-6 sm:p-8 md:p-2 border border-gray-600 rounded-lg">
        <div className={`inner-container ${isDarkMode ? 'bg-gray-800' : 'bg-orange-800'}`}>
          <h1 className="text-2xl font-extrabold mb-4 text-white text-center text-white"><MacOSWindowButtons /> VS-GPT</h1>
          <div className={`h-96  overflow-auto p-4 border border-gray-300 rounded-lg mb-4 ${isDarkMode ? 'bg-gray-700' : 'bg-amber-600'}`}>
            {messages.length === 0 ? (
              <p className={`text-center  ${isDarkMode ? 'text-white' : 'text-black'}`}>Start the conversation!</p>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                 className={`mb-2 flex ${
      message.type === 'bot'
        ? `${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'} p-3 rounded-lg items-center`
        : 'justify-end'
    }`}
                >
                  {message.type === 'bot' ? (
                    <div className="flex-1">
                      <ReactMarkdown
                        className={`${isDarkMode? 'text-white' : 'text-black'}`}
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
  onClick={() => handleCopy(message.content)}
  title="Copy to clipboard"
>
  {isCopied ? <FaCheck /> : <FaCopy />}
</button>
                  )}
                </div>
              ))
            )}
          </div>
          <div className="flex items-center mb-4 w-full text-black">
            <input
              type="text"
              className="flex-1 p-2 border border-gray-300 rounded-l-lg"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown} // Handle Enter key press
              placeholder="Type your message..."
            />
            <button
              className="p-2 bg-blue-500 text-white rounded-r-lg"
              onClick={() => handleSendMessage(input)}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send'}
            </button>
          </div>
          <div className="flex flex-col items-center">
            <select
              className="p-2 mb-4 bg-gray-200 rounded-lg text-sm sm:text-base w-full sm:w-auto dark:text-black"
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
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
                onClick={handleRecordVoice}
                disabled={isRecording}
              >
                {isRecording ? 'Recording...' : 'Record Voice'}
              </button>
              <button
                className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-700"
                onClick={stopRecording}
              >
                Stop Recording
              </button>
              <button
                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-700"
                onClick={() => setMessages([])}
              >
                Clear Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;