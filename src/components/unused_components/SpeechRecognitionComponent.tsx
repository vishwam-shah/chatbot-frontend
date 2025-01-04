// components/SpeechRecognitionComponent.tsx

import React, { useState } from "react";

const SpeechRecognitionComponent = () => {
  const [transcript, setTranscript] = useState<string>("");

  const handleStartRecognition = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US"; // Set the language to English
    recognition.interimResults = true; // Get partial results while speaking
    recognition.maxAlternatives = 1; // Limit the alternatives to one

    recognition.onstart = () => {
      console.log("Voice recognition started...");
    };

    recognition.onresult = (event: any) => {
      const speechToText = event.results[0][0].transcript;
      setTranscript(speechToText); // Set the recognized speech as the transcript
      console.log("Speech recognized:", speechToText);

      // Send the recognized text to the backend API
      fetch("/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: speechToText }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Bot response:", data.message);
        })

        .catch((error) => {
          console.error("Error:", error);
        });
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
    };

    recognition.onend = () => {
      console.log("Voice recognition ended.");
    };

    recognition.start();
  };

  return (
    <div className="w-full justify-center items-center flex">
      <div className="w-full max-w-md p-4 bg-gray-700 shadow-lg rounded-xl border-2">
        <h1 className="text-2xl font-bold mb-4 text-white">VS-GPT</h1>
        <div className="h-96 overflow-auto p-4 border border-gray-300 rounded-lg mb-4">
          {/* Chat Messages */}
        </div>
        <div className="flex">
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-l-lg"
            value={transcript} // Display the transcript in the input field
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Type your message..."
          />

          {/* Voice Recognition Button */}
          <button
            className="p-2 bg-green-400 text-white"
            onClick={handleStartRecognition}
          >
            🎤
          </button>

          <button
            className="p-2 bg-blue-500 text-white rounded-r-lg"
            disabled={!transcript} // Disable if no text is available
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpeechRecognitionComponent;
