import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';

interface VoiceInteractionProps {
  onEmotionDetected: (emotion: string) => void;
}

const VoiceInteraction: React.FC<VoiceInteractionProps> = ({ onEmotionDetected }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number>();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      streamRef.current = stream;
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;

      mediaRecorderRef.current = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        await sendAudioToHume(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      updateAudioLevel();

    } catch (err) {
      setError('Error accessing microphone: ' + String(err));
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    }
  };

  const updateAudioLevel = () => {
    if (analyserRef.current && isRecording) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      setAudioLevel(average);
      animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
    }
  };

  const sendAudioToHume = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);

      const response = await fetch('/api/emotion', { // Use the backend proxy
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Hume API response:', data);

      if (data.emotions?.[0]) {
        onEmotionDetected(data.emotions[0].name);
      }
    } catch (err) {
      console.error('Error in sendAudioToHume:', err);
      setError('Error analyzing voice: ' + String(err));
    }
  };

  useEffect(() => {
    return () => {
      if (isRecording) {
        stopRecording();
      }
    };
  }, []);

  return (
    <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
      <div className="flex flex-col items-center space-y-4">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`p-6 rounded-full transition-colors ${
            isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-purple-500 hover:bg-purple-600'
          } text-white shadow-lg`}
        >
          {isRecording ? <MicOff size={32} /> : <Mic size={32} />}
        </button>

        {isRecording && (
          <div className="w-full max-w-xs">
            <div className="flex items-center space-x-2">
              <Volume2 size={16} className="text-purple-500" />
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-500 transition-all duration-75"
                  style={{ width: `${(audioLevel / 255) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        <div className="text-sm text-gray-600">
          {isRecording ? 'Recording... Click to stop' : 'Click to start recording'}
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceInteraction;
