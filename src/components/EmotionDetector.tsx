import React, { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';

interface EmotionDetectorProps {
  onEmotionDetected: (emotion: string) => void;
}

const EmotionDetector: React.FC<EmotionDetectorProps> = ({ onEmotionDetected }) => {
  const [detectedEmotion, setDetectedEmotion] = useState<string>('neutral');
  const [error, setError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeEmotion = async (text: string) => {
    try {
      setIsAnalyzing(true);
      setError(null);

      const response = await fetch('/api/emotion', { // Use the backend proxy
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          models: {
            prosody: {
              granularity: "utterance",
              identifySpeaker: true
            },
            language: {
              granularity: "sentence",
              toxicity: true
            }
          }
        }),
      });

      console.log('API Response Status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response Data:', data);

      // Parse the emotional response from Hume AI
      let dominantEmotion = 'neutral';
      
      if (data.language?.predictions?.[0]?.emotions) {
        const emotions = data.language.predictions[0].emotions;
        // Find the emotion with highest score
        const topEmotion = emotions.reduce((prev: any, current: any) => {
          return (prev.score > current.score) ? prev : current;
        });
        
        dominantEmotion = topEmotion.name.toLowerCase();
        setDetectedEmotion(dominantEmotion); // Update local state
        onEmotionDetected(dominantEmotion);
      }
    } catch (error: any) { // Explicitly typing error as 'any'
      setError(error.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Modified to analyze less frequently and handle cleanup properly
  useEffect(() => {
    let isSubscribed = true;
    const interval = setInterval(() => {
      if (isSubscribed) {
        analyzeEmotion('How are you feeling today?');
      }
    }, 15000); // Changed to 15 seconds to reduce API calls

    // Initial analysis
    analyzeEmotion('Hello! How are you today?');

    return () => {
      isSubscribed = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="mt-4 p-4 rounded-lg bg-white shadow-md">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-purple-800">Emotion Analysis</h3>
        {isAnalyzing && (
          <div className="animate-pulse text-purple-600 flex items-center">
            <div className="w-2 h-2 bg-purple-600 rounded-full mr-1 animate-bounce"></div>
            <span>Analyzing...</span>
          </div>
        )}
      </div>
      
      <div className="mt-2">
        <div className="flex items-center space-x-2">
          <span className="text-gray-700">Current Emotion:</span>
          <span className={`font-medium text-purple-600 capitalize ${
            isAnalyzing ? 'opacity-50' : 'opacity-100'
          } transition-opacity duration-200`}>
            {detectedEmotion}
          </span>
        </div>
        
        {error && (
          <div className="mt-2 text-red-500 flex items-center space-x-1 bg-red-50 p-2 rounded">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Emotion Indicator */}
      <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-purple-600 transition-all duration-500"
          style={{ 
            width: isAnalyzing ? '100%' : '0%',
            transition: 'width 0.5s ease-in-out'
          }}
        />
      </div>

      {/* Debug Info (remove in production) */}
      {error && (
        <div className="mt-2 text-xs text-gray-500">
          <details>
            <summary>Debug Info</summary>
            <pre className="mt-1 bg-gray-100 p-2 rounded">
              {JSON.stringify({ error, apiKey: import.meta.env.VITE_HUME_API_KEY ? 'Set' : 'Not Set' }, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
};

export default EmotionDetector;
