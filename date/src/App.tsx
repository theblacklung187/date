import React, { useState } from 'react';
import Avatar from './components/Avatar';
import ChatInterface from './components/ChatInterface';
import EmotionDetector from './components/EmotionDetector';
import Feedback from './components/Feedback';
import { MessageCircle } from 'lucide-react';

const App: React.FC = () => {
  const [currentEmotion, setCurrentEmotion] = useState<string>('neutral');
  const [chatHistory, setChatHistory] = useState<Array<{ user: string; message: string }>>([]);
  const [isFeedbackMode, setIsFeedbackMode] = useState<boolean>(false);

  // Handles when the user sends a message through the chat interface
  const handleUserMessage = (message: string) => {
    setChatHistory((prev) => [...prev, { user: 'User', message }]);

    // Simulate an avatar response after a slight delay
    setTimeout(() => {
      const avatarMessage = generateAvatarResponse(message, currentEmotion);
      setChatHistory((prev) => [...prev, { user: 'Avatar', message: avatarMessage }]);
    }, 1000);
  };

  // Generates a dynamic avatar response based on the user's message and detected emotion
  const generateAvatarResponse = (userMessage: string, emotion: string) => {
    const responses = {
      happy: "I'm feeling great! What about you?",
      sad: "I'm here for you. Let's talk about it.",
      excited: "That sounds amazing!",
      nervous: "Don't worry, you're doing great.",
      neutral: "That's interesting! Tell me more.",
    };
    return responses[emotion] || "Hmm, interesting. Tell me more!";
  };

  // Handles emotion detection from the EmotionDetector component
  const handleEmotionDetected = (emotion: string) => {
    setCurrentEmotion(emotion);
    console.log(`Detected Emotion: ${emotion}`);
  };

  // Ends the date and switches to feedback mode
  const endDate = () => {
    setIsFeedbackMode(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-purple-800 mb-8">Dating Avatar App</h1>
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 p-4">
            <Avatar emotion={currentEmotion} />
            <EmotionDetector onEmotionDetected={handleEmotionDetected} />
          </div>
          <div className="w-full md:w-1/2 p-4">
            {!isFeedbackMode ? (
              <>
                <ChatInterface chatHistory={chatHistory} onSendMessage={handleUserMessage} />
                <button
                  onClick={endDate}
                  className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center w-full"
                >
                  <MessageCircle className="mr-2" />
                  End Date & Get Feedback
                </button>
              </>
            ) : (
              <Feedback chatHistory={chatHistory} emotion={currentEmotion} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
