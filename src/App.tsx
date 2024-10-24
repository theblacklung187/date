import React, { useState } from 'react';
import Avatar from './components/Avatar';
import ChatInterface from './components/ChatInterface';
import EmotionDetector from './components/EmotionDetector';
import VoiceInteraction from './components/VoiceInteraction';
import Feedback from './components/Feedback';
import { MessageCircle } from 'lucide-react';

interface ChatMessage {
  user: string;
  message: string;
}

const App: React.FC = () => {
  const [currentEmotion, setCurrentEmotion] = useState<string>('neutral');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isFeedbackMode, setIsFeedbackMode] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);

  const handleEmotionDetected = (emotion: string) => {
    setCurrentEmotion(emotion);
    
    const avatarResponses: Record<string, string> = {
      happy: "I'm feeling cheerful too! Let's keep this positive energy going!",
      sad: "I sense some sadness. Would you like to talk about what's on your mind?",
      angry: "I can tell you're frustrated. Let's take a moment to discuss what's bothering you.",
      neutral: "I'm listening and here to chat. What's on your mind?"
    };

    const response = avatarResponses[emotion] || `I'm sensing ${emotion}. Tell me more about how you're feeling.`;
    
    setChatHistory(prev => [...prev, { user: 'Avatar', message: response }]);
  };

  const handleUserMessage = (message: string) => {
    setChatHistory(prev => [...prev, { user: 'User', message }]);
  };

  const toggleVoiceMode = () => {
    setIsVoiceMode(!isVoiceMode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-purple-800 mb-8">Dating Avatar App</h1>
      
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 p-4">
            <Avatar emotion={currentEmotion} />
            <EmotionDetector onEmotionDetected={handleEmotionDetected} />
            <VoiceInteraction onEmotionDetected={handleEmotionDetected} />
            
            <button
              onClick={toggleVoiceMode}
              className="mt-4 bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded w-full"
            >
              {isVoiceMode ? 'Switch to Text Mode' : 'Switch to Voice Mode'}
            </button>
          </div>

          <div className="w-full md:w-1/2 p-4">
            {!isFeedbackMode ? (
              <div className="space-y-4">
                <ChatInterface 
                  chatHistory={chatHistory} 
                  onSendMessage={handleUserMessage}
                  disabled={isVoiceMode}
                />
                <button
                  onClick={() => setIsFeedbackMode(true)}
                  className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center w-full"
                >
                  <MessageCircle className="mr-2" />
                  End Date & Get Feedback
                </button>
              </div>
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
