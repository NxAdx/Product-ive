import React from 'react';
import { BookOpen, Brain, Timer, Zap } from 'lucide-react-native';

import { CategoryIconKey } from '../data/categories';

interface CategoryIconProps {
  iconKey: CategoryIconKey;
  color: string;
  size?: number;
  strokeWidth?: number;
}

export function CategoryIcon({ iconKey, color, size = 20, strokeWidth = 2.2 }: CategoryIconProps) {
  switch (iconKey) {
    case 'brain':
      return <Brain size={size} color={color} strokeWidth={strokeWidth} />;
    case 'timer':
      return <Timer size={size} color={color} strokeWidth={strokeWidth} />;
    case 'zap':
      return <Zap size={size} color={color} strokeWidth={strokeWidth} />;
    case 'book-open':
      return <BookOpen size={size} color={color} strokeWidth={strokeWidth} />;
    default:
      return <Brain size={size} color={color} strokeWidth={strokeWidth} />;
  }
}
