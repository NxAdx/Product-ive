import React, { ReactNode } from 'react';
import { Pressable, View, ViewStyle, AnimatableNumericValue, StyleProp } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { tokens } from '../theme/tokens';

type BentoVariant = 'default' | 'action' | 'data' | 'reward';

interface BentoCardProps {
  children: ReactNode;
  variant?: BentoVariant;
  onPress?: () => void;
  accent?: string;
  style?: StyleProp<ViewStyle>;
  padding?: AnimatableNumericValue;
  flex?: number;
  glow?: boolean;
}

/**
 * Productive+ v4.0 Bento Card
 * Foundation for the dashboard's modular layout.
 */
export const BentoCard: React.FC<BentoCardProps> = ({
  children,
  variant = 'default',
  onPress,
  accent,
  style,
  padding = tokens.spacing.padding,
  flex,
  glow,
}) => {
  const t = useTheme();

  const baseContainerStyle: ViewStyle = {
    backgroundColor: t.surfaceContainer,
    borderRadius: tokens.radius.lg,
    padding,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: t.border,
    flex,
    // v4.0 Enhanced Glow logic
    ...(glow ? {
      ...(t.isDark ? {
        shadowColor: (accent || t.positivity) as string,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 12,
        borderColor: accent || t.positivity,
        borderWidth: 1.5,
      } : {
        shadowColor: (accent || t.positivity) as string,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 6,
        borderColor: accent || t.positivity,
        borderWidth: 1,
      }),
    } : {}),
  };

  // Visual cues for variants
  const accentLine: ViewStyle = {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: accent || t.positivity,
  };

  const Content = (
    <View style={[baseContainerStyle, style]}>
      {variant === 'action' && accent && <View style={accentLine} />}
      {children}
    </View>
  );

  if (onPress) {
    return (
      <Pressable 
        onPress={onPress}
        style={({ pressed }) => [
          { opacity: pressed ? 0.8 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
          { flex }
        ]}
      >
        {Content}
      </Pressable>
    );
  }

  return Content;
};
