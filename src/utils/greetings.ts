// A dictionary of greetings and responses
const greetingsResponses: Record<string, string> = {
  "hi": "Hello! How can I assist you today?",
  "hello": "Hi there! What can I do for you?",
  "how are you": "I'm just a bot, but I'm functioning perfectly! How can I help you?",
  "who is your owner": "I am owned and programmed by a developer who loves coding!",
  "good morning": "Good morning! Hope you have a wonderful day ahead.",
  "good afternoon": "Good afternoon! How can I assist you?",
  "good evening": "Good evening! What can I do for you?",
  "hey": "Hey! How's it going?",
  "what's up": "Not much, just here to assist you! What's up with you?",
  "howdy": "Howdy! How can I make your day better?",
  "greetings": "Greetings! How may I help you?",
  "yo": "Yo! What's happening?",
  "hey there": "Hey there! What brings you here?",
  "what's new": "Not much, but I'm always ready to help you!",
  "what's your name": "I'm your friendly chatbot assistant!",
  "thank you": "You're welcome! Let me know if there's anything else.",
  "bye": "Goodbye! Have a great day!",
  "see you later": "See you later! Take care.",
  "goodbye": "Goodbye! It was nice talking to you.",
  "who made you": "I was created by an awesome developer!",
  "do you have a name": "You can call me Chatbot!",
  "how old are you": "I was created recently, so I'm quite young!",
  "are you human": "Nope, I'm just a bot here to help you!",
  "what can you do": "I can chat with you, answer your questions, and much more!",
  "tell me a joke": "Why don't programmers like nature? It has too many bugs!",
  "how's it going": "All good on my end! How about you?",
  "where are you from": "I'm from the world of code and algorithms!",
  "can you help me": "Of course! What do you need help with?",
  "are you a robot": "Yes, I'm a chatbot programmed to assist you!"
};

// Function to get a response for a given user input
export const getGreetingResponse = (userInput: string): string => {
  const lowerInput = userInput.trim().toLowerCase(); // Ensure input is trimmed and lowercase
  return greetingsResponses[lowerInput] || "I'm not sure how to respond to that, but I'm here to help!";
};
