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

      const response = await fetch('https://api.hume.ai/v2/sentiment', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_HUME_API_KEY}`,
          'Content-Type': 'application/json',
          'X-Hume-Config-Id': import.meta.env.VITE_HUME_CONFIG_ID
        },
        body: JSON.stringify({
          text,
          // Adding raw emotions to get more detailed analysis
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
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Parse the emotional response from Hume AI
      let dominantEmotion = 'neutral';
      
      if (data.language && data.language.predictions && data.language.predictions.length > 0) {
        const emotions = data.language.predictions[0].emotions;
        // Find the emotion with highest score
        const topEmotion = emotions.reduce((prev: any, current: any) => {
          return (prev.score > current.score) ? prev : current;
        });
        
        dominantEmotion = topEmotion.name.toLowerCase();
      }

      setDetectedEmotion(dominantEmotion);
      onEmotionDetected(dominantEmotion);

    } catch (error) {
      console.error('Error analyzing emotion:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while analyzing emotions');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Sample periodic analysis (you might want to trigger this differently based on your needs)
  useEffect(() => {
    const interval = setInterval(() => {
      // You can modify this to analyze based on the latest chat message instead
      analyzeEmotion('How are you feeling today?');
    }, 10000); // Every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-4 p-4 rounded-lg bg-white shadow-md">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-purple-800">Emotion Analysis</h3>
        {isAnalyzing && (
          <div className="animate-pulse text-purple-600">
            Analyzing...
          </div>
        )}
      </div>
      
      <div className="mt-2">
        <div className="flex items-center space-x-2">
          <span className="text-gray-700">Current Emotion:</span>
          <span className="font-medium text-purple-600 capitalize">
            {detectedEmotion}
          </span>
        </div>
        
        {error && (
          <div className="mt-2 text-red-500 flex items-center space-x-1">
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
    </div>
  );
};

export default EmotionDetector;