import React, { useEffect, useState } from 'react';

interface EmotionDetectorProps {
  onEmotionDetected: (emotion: string) => void;
}

// Correct usage of environment variables for Vite and Hume
const apiKey = import.meta.env.VITE_HUME_API_KEY || 'fallback-api-key';
const configId = import.meta.env.VITE_HUME_CONFIG_ID || 'fallback-config-id';

const EmotionDetector: React.FC<EmotionDetectorProps> = ({ onEmotionDetected }) => {
  const [detectedEmotion, setDetectedEmotion] = useState<string>('neutral');

  const analyzeEmotion = async (text: string) => {
    try {
      const response = await fetch(
        `https://api.hume.ai/v2/emotions?configId=${configId}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`, // Standard API key authorization
            'X-Hume-Api-Key': apiKey, // Additional header (if required by Hume API)
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text }), // Payload containing the message
        }
      );

      const data = await response.json();
      console.log('Hume API Response:', data);

      const emotion = data?.emotions[0]?.name || 'neutral';
      setDetectedEmotion(emotion);
      onEmotionDetected(emotion);
    } catch (error) {
      console.error('Error detecting emotion:', error);
      setDetectedEmotion('error'); // Handle errors gracefully
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      analyzeEmotion('This is a test message'); // Example input for testing
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, []);

  return (
    <div className="mt-4 p-4 bg-yellow-100 rounded-lg flex items-center justify-center">
      <span className="mr-2 text-yellow-500">🙂</span>
      <span className="text-yellow-700">
        Avatar's Current Emotion: {detectedEmotion}
      </span>
    </div>
  );
};

export default EmotionDetector;
