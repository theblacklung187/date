import React from 'react';
import { User } from 'lucide-react';

interface AvatarProps {
  emotion: string;
}

const Avatar: React.FC<AvatarProps> = ({ emotion }) => {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 p-4 rounded-lg">
      <div className="w-48 h-48 bg-purple-200 rounded-full flex items-center justify-center mb-4">
        <User size={100} className="text-purple-600" />
      </div>
      <p className="text-lg font-semibold">Avatar's Current Emotion: {emotion}</p>
    </div>
  );
};

export default Avatar;