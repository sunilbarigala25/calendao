import { Theme } from './types';

// Apple Glass Light Theme (Glassmorphism)
export const glassLightTheme: Theme = {
    name: 'glass',
    colors: {
        primary: '#007AFF',
        primaryContainer: 'rgba(0, 122, 255, 0.1)',
        onPrimary: '#FFFFFF',
        onPrimaryContainer: '#003D7A',

        secondary: '#5856D6',
        secondaryContainer: 'rgba(88, 86, 214, 0.1)',
        onSecondary: '#FFFFFF',
        onSecondaryContainer: '#2C2B6B',

        background: '#F2F2F7',
        surface: 'rgba(255, 255, 255, 0.7)', // Frosted glass effect
        surfaceVariant: 'rgba(255, 255, 255, 0.5)',
        onBackground: '#000000',
        onSurface: '#000000',
        onSurfaceVariant: '#3C3C43',

        accent: '#FF2D55',
        error: '#FF3B30',
        success: '#34C759',
        warning: '#FF9500',

        border: 'rgba(0, 0, 0, 0.1)',
        divider: 'rgba(60, 60, 67, 0.18)',
        overlay: 'rgba(0, 0, 0, 0.4)',

        today: '#007AFF',
        selected: 'rgba(0, 122, 255, 0.15)',
        eventDot: '#FF2D55',
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48,
    },
    typography: {
        h1: { fontSize: 34, fontWeight: '700', lineHeight: 41 },
        h2: { fontSize: 28, fontWeight: '700', lineHeight: 34 },
        h3: { fontSize: 22, fontWeight: '600', lineHeight: 28 },
        h4: { fontSize: 20, fontWeight: '600', lineHeight: 25 },
        body: { fontSize: 17, fontWeight: '400', lineHeight: 22 },
        bodySmall: { fontSize: 15, fontWeight: '400', lineHeight: 20 },
        caption: { fontSize: 13, fontWeight: '400', lineHeight: 18 },
        button: { fontSize: 17, fontWeight: '600', letterSpacing: -0.4 },
    },
    shadows: {
        small: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 3.0,
            elevation: 2,
        },
        medium: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8.0,
            elevation: 4,
        },
        large: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.2,
            shadowRadius: 16.0,
            elevation: 10,
        },
    },
    borderRadius: {
        sm: 8,
        md: 12,
        lg: 16,
        xl: 20,
        round: 999,
    },
};

// Apple Glass Dark Theme (Glassmorphism)
export const glassDarkTheme: Theme = {
    name: 'glass',
    colors: {
        primary: '#0A84FF',
        primaryContainer: 'rgba(10, 132, 255, 0.15)',
        onPrimary: '#FFFFFF',
        onPrimaryContainer: '#004C99',

        secondary: '#5E5CE6',
        secondaryContainer: 'rgba(94, 92, 230, 0.15)',
        onSecondary: '#FFFFFF',
        onSecondaryContainer: '#2F2E73',

        background: '#000000',
        surface: 'rgba(28, 28, 30, 0.7)', // Frosted glass effect
        surfaceVariant: 'rgba(44, 44, 46, 0.7)',
        onBackground: '#FFFFFF',
        onSurface: '#FFFFFF',
        onSurfaceVariant: '#EBEBF5',

        accent: '#FF375F',
        error: '#FF453A',
        success: '#32D74B',
        warning: '#FF9F0A',

        border: 'rgba(255, 255, 255, 0.15)',
        divider: 'rgba(235, 235, 245, 0.18)',
        overlay: 'rgba(0, 0, 0, 0.6)',

        today: '#0A84FF',
        selected: 'rgba(10, 132, 255, 0.2)',
        eventDot: '#FF375F',
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48,
    },
    typography: {
        h1: { fontSize: 34, fontWeight: '700', lineHeight: 41 },
        h2: { fontSize: 28, fontWeight: '700', lineHeight: 34 },
        h3: { fontSize: 22, fontWeight: '600', lineHeight: 28 },
        h4: { fontSize: 20, fontWeight: '600', lineHeight: 25 },
        body: { fontSize: 17, fontWeight: '400', lineHeight: 22 },
        bodySmall: { fontSize: 15, fontWeight: '400', lineHeight: 20 },
        caption: { fontSize: 13, fontWeight: '400', lineHeight: 18 },
        button: { fontSize: 17, fontWeight: '600', letterSpacing: -0.4 },
    },
    shadows: {
        small: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.3,
            shadowRadius: 3.0,
            elevation: 2,
        },
        medium: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 8.0,
            elevation: 4,
        },
        large: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.5,
            shadowRadius: 16.0,
            elevation: 10,
        },
    },
    borderRadius: {
        sm: 8,
        md: 12,
        lg: 16,
        xl: 20,
        round: 999,
    },
};
