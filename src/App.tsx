import React, { useState } from 'react';
import Avatar from './components/Avatar';
import ChatInterface from './components/ChatInterface';
import EmotionDetector from './components/EmotionDetector';
import Feedback from './components/Feedback';
import { MessageCircle } from 'lucide-react';

// Hume environment variables (ensure these have the VITE_ prefix)
const apiKey = import.meta.env.VITE_HUME_API_KEY || 'fallback-api-key';
const configId = import.meta.env.VITE_HUME_CONFIG_ID || 'fallback-config-id';

const App: React.FC = () => {
  const [currentEmotion, setCurrentEmotion] = useState<string>('neutral');
  const [chatHistory, setChatHistory] = useState<Array<{ user: string; message: string }>>([]);
  const [isFeedbackMode, setIsFeedbackMode] = useState<boolean>(false);

  // Function to fetch emotion from the Hume API based on user input
  const analyzeEmotionWithHume = async (text: string): Promise<string> => {
    try {
      const response = await fetch(
        `https://api.hume.ai/v2/emotions?configId=${configId}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text }),
        }
      );
      const data = await response.json();
      const detectedEmotion = data?.emotions[0]?.name || 'neutral';
      console.log(`Hume API detected emotion: ${detectedEmotion}`);
      return detectedEmotion;
    } catch (error) {
      console.error('Error detecting emotion:', error);
      return 'neutral';
    }
  };

  // Handles when the user sends a message
  const handleUserMessage = async (message: string) => {
    setChatHistory((prev) => [...prev, { user: 'User', message }]);

    // Call Hume API to analyze emotion from user input
    const detectedEmotion = await analyzeEmotionWithHume(message);
    setCurrentEmotion(detectedEmotion);

    // Avatar responds based on the detected emotion
    const avatarMessage = `It seems I'm feeling ${detectedEmotion}. What else do you have to say?`;
    setChatHistory((prev) => [...prev, { user: 'Avatar', message: avatarMessage }]);
  };

  const endDate = () => setIsFeedbackMode(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-purple-800 mb-8">Dating Avatar App</h1>
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 p-4">
            <Avatar emotion={currentEmotion} />
            <EmotionDetector onEmotionDetected={setCurrentEmotion} />
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
