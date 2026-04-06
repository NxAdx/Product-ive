import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { tokens } from '../theme/tokens';

type TypographyVariant = keyof typeof tokens.typography;

interface ThemedTextProps extends TextProps {
  variant?: TypographyVariant;
  color?: string;
  align?: TextStyle['textAlign'];
}

/**
 * Productive+ v4.0 Master Typography Component
 * Enforces the Syne/Jakarta font hierarchy across the app.
 */
export const ThemedText: React.FC<ThemedTextProps> = ({
  variant = 'body',
  color,
  align,
  style,
  children,
  ...props
}) => {
  const t = useTheme();
  
  // Safely extract token and handle casting for textTransform
  const token = tokens.typography[variant] as any;
  
  const baseStyle: TextStyle = {
    fontFamily: token.fontFamily,
    fontSize: token.fontSize,
    lineHeight: token.lineHeight,
    letterSpacing: token.letterSpacing,
    textTransform: token.textTransform as TextStyle['textTransform'],
    color: color || t.text,
    textAlign: align,
  };

  return (
    <Text style={[baseStyle, style]} {...props}>
      {children}
    </Text>
  );
};
