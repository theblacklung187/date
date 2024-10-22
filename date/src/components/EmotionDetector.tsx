import React, { useEffect, useState } from 'react';

interface EmotionDetectorProps {
  onEmotionDetected: (emotion: string) => void;
}

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
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text }),
        }
      );

      const data = await response.json();
      console.log('Hume API Response:', data);

      const emotion = data?.emotions[0]?.name || 'neutral';
      setDetectedEmotion(emotion);
      onEmotionDetected(emotion);
    } catch (error) {
      console.error('Error detecting emotion:', error);
      setDetectedEmotion('error');
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      analyzeEmotion('This is a test message'); // Replace with actual input
    }, 5000);

    return () => clearInterval(interval);
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
