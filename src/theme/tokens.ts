/**
 * Productive+ v4.0 Design System Tokens
 * Pitch-black foundation, 8pt grid system, and hierarchy-first typography
 */

export const tokens = {
  // ===== DARK THEME COLORS (v4.0) =====
  dark: {
    // Base layer - The Void
    bg: '#000000',

    // Surface Container Hierarchy
    surfaceContainerLowest: '#0d0d0d',  // Subtle elevation
    surfaceContainerLow: '#141414',     // Standard card
    surfaceContainer: '#1A1A1A',         // Raised card (v4.0 Spec)
    surfaceContainerHigh: '#262626',     // Interactive surface
    surfaceContainerHighest: '#333333',  // Highlight surface

    // Text colors
    onSurface: '#FFFFFF',        // Pure White for max contrast
    onSurfaceVariant: '#d1d1d6', // Zinc-300 (Lighter for dark mode legibility)
    onSurfaceDisabled: '#8e8e93', // Zinc-500 (Clearly visible even if disabled)

    // Semantic accents (v4.5 Kinetic Neon)
    progress: '#22c55e',        // Neon Green
    learning: '#60a5fa',        // Neon Blue (Lighter for vibrancy)
    focus: '#fb923c',           // Neon Orange
    memory: '#c084fc',          // Neon Purple
    
    // Core accents
    positivity: '#22c55e',      // Success / Primary CTA
    info: '#3b82f6',            // Guidance
    warning: '#f59e0b',         // Caution
    error: '#ef4444',           // Critical

    border: '#262626',
    glass: 'rgba(255, 255, 255, 0.05)',
  },

  // ===== LIGHT THEME COLORS (v4.0) =====
  light: {
    bg: '#ffffff',
    surfaceContainerLowest: '#fafafa',
    surfaceContainerLow: '#f4f4f5',
    surfaceContainer: '#e4e4e7',
    surfaceContainerHigh: '#d4d4d8',
    surfaceContainerHighest: '#a1a1aa',

    onSurface: '#000000',        // Pure Black
    onSurfaceVariant: '#3f3f46', // Zinc-700 (High contrast for light mode)
    onSurfaceDisabled: '#a1a1aa', // Zinc-400

    // Semantic accents (v4.5 High Contrast)
    progress: '#15803d',        // Forest Green
    learning: '#1d4ed8',        // Royal Blue
    focus: '#c2410c',           // Burnt Orange
    memory: '#7e22ce',          // Deep Purple

    positivity: '#16a34a',
    info: '#2563eb',
    warning: '#d97706',
    error: '#dc2626',

    border: '#e4e4e7',
    glass: 'rgba(0, 0, 0, 0.03)',
  },

  // ===== TYPOGRAPHY SCALE (v4.0 Spec) =====
  typography: {
    h1: {
      fontFamily: 'Syne_700Bold',
      fontSize: 32,
      lineHeight: 40,
      letterSpacing: -0.02,
    },
    h2: {
      fontFamily: 'Syne_700Bold',
      fontSize: 24,
      lineHeight: 32,
      letterSpacing: -0.01,
    },
    h3: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontSize: 20,
      lineHeight: 28,
      letterSpacing: 0,
    },
    bodyLg: {
      fontFamily: 'PlusJakartaSans_400Regular',
      fontSize: 18,
      lineHeight: 26,
    },
    body: {
      fontFamily: 'PlusJakartaSans_400Regular',
      fontSize: 16,
      lineHeight: 24,
    },
    caption: {
      fontFamily: 'PlusJakartaSans_500Medium',
      fontSize: 14,
      lineHeight: 20,
    },
    label: {
      fontFamily: 'PlusJakartaSans_600SemiBold',
      fontSize: 12,
      lineHeight: 16,
      letterSpacing: 0.05,
    },
    mono: {
      fontFamily: 'JetBrainsMono_500Medium',
      fontSize: 13,
      lineHeight: 18,
    },
  },

  // ===== GRID & SPACING (v4.0 Spec) =====
  spacing: {
    grid: 8,
    padding: 24,        // Spec: 16-24px
    sectionGap: 32,     // Spec: 24-32px
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  // ===== SHAPE & ELEVATION =====
  radius: {
    full: 999,
    xl: 28,
    lg: 24,
    md: 16,
    sm: 8,
  },

  elevation: {
    glass: {
      blur: 20,
      opacity: 0.1,
    },
  },
};
