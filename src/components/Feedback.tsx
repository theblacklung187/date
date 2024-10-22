import React from 'react';
import { ThumbsUp, ThumbsDown, Meh } from 'lucide-react';

interface FeedbackProps {
  chatHistory: Array<{ user: string; message: string }>;
  emotion: string;
}

const Feedback: React.FC<FeedbackProps> = ({ chatHistory, emotion }) => {
  const getFeedbackMessage = () => {
    const messageCount = chatHistory.filter(chat => chat.user === 'User').length;
    if (messageCount < 5) {
      return "You seemed a bit shy. Try to open up more in your next conversation!";
    } else if (messageCount > 10) {
      return "Great job! You were very engaging in the conversation.";
    } else {
      return "You maintained a good balance in the conversation. Keep it up!";
    }
  };

  const getEmotionFeedback = () => {
    switch (emotion) {
      case 'happy':
        return "You seemed happy during the conversation. That's great!";
      case 'nervous':
        return "You appeared a bit nervous. Remember, it's okay to take your time and breathe.";
      case 'sad':
        return "You seemed a bit down. Is everything okay? Remember, it's just a practice session.";
      default:
        return "Your emotions were balanced throughout the conversation.";
    }
  };

  return (
    <div className="bg-gray-100 p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-purple-800">Date Feedback</h2>
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Conversation Flow</h3>
        <p>{getFeedbackMessage()}</p>
      </div>
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Emotional State</h3>
        <p>{getEmotionFeedback()}</p>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">Overall Rating</h3>
        <div className="flex justify-between items-center">
          <button className="flex items-center justify-center bg-green-500 text-white p-2 rounded-full hover:bg-green-600">
            <ThumbsUp size={24} />
          </button>
          <button className="flex items-center justify-center bg-yellow-500 text-white p-2 rounded-full hover:bg-yellow-600">
            <Meh size={24} />
          </button>
          <button className="flex items-center justify-center bg-red-500 text-white p-2 rounded-full hover:bg-red-600">
            <ThumbsDown size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Feedback;