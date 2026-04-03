/**
 * Design System Tokens
 * Complete color hierarchy, typography, and spacing system
 * Aligned with dark and light theme design systems
 */

export const tokens = {
  // ===== DARK THEME COLORS =====
  dark: {
    // Base layer - the void
    bg: '#0d0d0d',

    // Surface Container Hierarchy (dark theme)
    // Use for layering and depth in dark mode
    surfaceContainerLowest: '#0f0f0f', // Darkest surface level
    surfaceContainerLow: '#1a1a1a',     // Slightly raised
    surfaceContainer: '#242424',         // Standard container
    surfaceContainerHigh: '#2e2e2e',     // More prominent
    surfaceContainerHighest: '#383838',  // Highest layer

    // Text colors for dark theme
    onSurface: '#f2f1ee',       // Primary text (light)
    onSurfaceVariant: '#b3b0a9', // Secondary text (medium)
    onSurfaceDisabled: '#6b6964', // Disabled text (dim)

    // Kinetic Primary - Orange/Red (metabolic, active states)
    primary: '#a93102',         // Kinetic Orange base
    primaryDim: '#7d2410',      // Dimmed variant
    primaryBright: '#ff6b34',   // Bright variant
    onPrimary: '#ffffff',       // Text on primary

    // Kinetic Secondary - Blue (cognitive, monitoring)
    secondary: '#444bce',       // Neurological Blue base
    secondaryDim: '#2d3297',    // Dimmed variant
    secondaryBright: '#6b74ff', // Bright variant
    onSecondary: '#ffffff',     // Text on secondary

    // Kinetic Tertiary - Purple (hormonal, recovery)
    tertiary: '#9c6dd6',        // Synthetic Purple base
    tertiaryDim: '#6a4689',     // Dimmed variant
    tertiaryBright: '#d5a9ff',  // Bright variant
    onTertiary: '#ffffff',      // Text on tertiary

    // Semantic colors
    success: '#34D399',
    warning: '#FBBF24',
    error: '#EF4444',
    info: '#60A5FA',

    // Category colors (dark)
    categoryLearn: '#A78BFA',
    categoryFocus: '#60A5FA',
    categoryProductivity: '#34D399',
    categoryStudy: '#FBBF24',
  },

  // ===== LIGHT THEME COLORS =====
  light: {
    // Base layer - white foundation
    bg: '#f7f9fc',

    // Surface Container Hierarchy (light theme)
    // Use for layering and depth in light mode
    surfaceContainerLowest: '#ffffff',    // Lightest/brightest
    surfaceContainerLow: '#f2f1f0',       // Slightly dimmed
    surfaceContainer: '#ececeb',          // Standard container
    surfaceContainerHigh: '#e6e8eb',      // More prominent
    surfaceContainerHighest: '#ddd9d0',   // Darkest surface

    // Text colors for light theme
    onSurface: '#191c1e',        // Primary text (dark)
    onSurfaceVariant: '#49494a', // Secondary text (medium)
    onSurfaceDisabled: '#9a9a9c', // Disabled text (light)

    // Kinetic Primary - Orange/Red (metabolic, active states)
    primary: '#a93102',         // Kinetic Orange base
    primaryDim: '#d97956',      // Dimmed variant
    primaryBright: '#7d2410',   // Bright variant
    onPrimary: '#ffffff',       // Text on primary

    // Kinetic Secondary - Blue (cognitive, monitoring)
    secondary: '#444bce',       // Neurological Blue base
    secondaryDim: '#7d85f2',    // Dimmed variant
    secondaryBright: '#2d3297', // Bright variant
    onSecondary: '#ffffff',     // Text on secondary

    // Kinetic Tertiary - Purple (hormonal, recovery)
    tertiary: '#9c6dd6',        // Synthetic Purple base
    tertiaryDim: '#c5a0e3',     // Dimmed variant
    tertiaryBright: '#6a4689',  // Bright variant
    onTertiary: '#ffffff',      // Text on tertiary

    // Semantic colors
    success: '#059669',
    warning: '#B45309',
    error: '#DC2626',
    info: '#1D4ED8',

    // Category colors (light)
    categoryLearn: '#7C3AED',
    categoryFocus: '#1D4ED8',
    categoryProductivity: '#059669',
    categoryStudy: '#B45309',
  },

  // ===== TYPOGRAPHY SCALE =====
  typography: {
    // Display level - single-word markers, large data
    displayLg: {
      fontFamily: 'Manrope_700Bold',
      fontSize: 32,
      lineHeight: 40,
      letterSpacing: -0.02, // em units
    },
    // Headline level
    headlineMd: {
      fontFamily: 'Manrope_700Bold',
      fontSize: 24,
      lineHeight: 32,
      letterSpacing: 0,
    },
    // Title level
    titleLg: {
      fontFamily: 'Inter_500Medium',
      fontSize: 20,
      lineHeight: 28,
      letterSpacing: 0.01,
    },
    // Body text - primary content
    bodyMd: {
      fontFamily: 'Inter_400Regular',
      fontSize: 16,
      lineHeight: 24,
      letterSpacing: 0,
    },
    bodySm: {
      fontFamily: 'Inter_400Regular',
      fontSize: 14,
      lineHeight: 20,
      letterSpacing: 0,
    },
    // Label - technical metadata (all caps)
    labelSm: {
      fontFamily: 'Inter_700Bold',
      fontSize: 12,
      lineHeight: 16,
      letterSpacing: 0.05, // "Wide tracking" for caps
      textTransform: 'uppercase',
    },
    // Mono - code/technical
    monoMd: {
      fontFamily: 'JetBrainsMono_400Regular',
      fontSize: 14,
      lineHeight: 20,
      letterSpacing: 0,
    },
  },

  // ===== ELEVATION & SHADOWS =====
  elevation: {
    // Ambient shadow - for floating elements (60px blur, 6% opacity)
    ambient: {
      blur: 60,
      opacity: 0.06,
    },
    // Standard elevation
    level1: {
      blur: 8,
      offset: 2,
      opacity: 0.1,
    },
    level2: {
      blur: 16,
      offset: 4,
      opacity: 0.15,
    },
    level3: {
      blur: 24,
      offset: 8,
      opacity: 0.2,
    },
  },

  // ===== RADIUS (Corner Curvature) =====
  radius: {
    // Pill-shaped (buttons, chips)
    full: 999,
    // Large cards/containers
    xl: 24,
    // Standard cards/elements
    lg: 22,
    // Small UI elements
    md: 16,
    sm: 10,
    xs: 4,
  },

  // ===== SPACING SCALE =====
  spacing: {
    // Micro spacing
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    // Section gaps (per design system)
    sectionGap: 48,
    // Page/container padding
    page: 20,
  },

  // ===== FONTS =====
  font: {
    display: 'Manrope_700Bold',
    displayRegular: 'Manrope_400Regular',
    body: 'Inter_400Regular',
    bodyMedium: 'Inter_500Medium',
    bodyBold: 'Inter_700Bold',
    mono: 'JetBrainsMono_400Regular',
  },

  // ===== OPACITY SCALE =====
  opacity: {
    disabled: 0.38,
    hover: 0.08,
    focus: 0.12,
    pressed: 0.16,
    glassmorphism: 0.6, // For floating elements with blur
  },
};
