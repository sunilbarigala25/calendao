import { Theme } from './types';

// Material Design 3 Light Theme
export const materialLightTheme: Theme = {
    name: 'material',
    colors: {
        primary: '#6750A4',
        primaryContainer: '#EADDFF',
        onPrimary: '#FFFFFF',
        onPrimaryContainer: '#21005D',

        secondary: '#625B71',
        secondaryContainer: '#E8DEF8',
        onSecondary: '#FFFFFF',
        onSecondaryContainer: '#1D192B',

        background: '#FFFBFE',
        surface: '#FFFBFE',
        surfaceVariant: '#E7E0EC',
        onBackground: '#1C1B1F',
        onSurface: '#1C1B1F',
        onSurfaceVariant: '#49454F',

        accent: '#7F5AF0',
        error: '#B3261E',
        success: '#2E7D32',
        warning: '#F57C00',

        border: '#CAC4D0',
        divider: '#E7E0EC',
        overlay: 'rgba(0, 0, 0, 0.5)',

        today: '#6750A4',
        selected: '#EADDFF',
        eventDot: '#7F5AF0',
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
        h1: { fontSize: 32, fontWeight: '700', lineHeight: 40 },
        h2: { fontSize: 28, fontWeight: '600', lineHeight: 36 },
        h3: { fontSize: 24, fontWeight: '600', lineHeight: 32 },
        h4: { fontSize: 20, fontWeight: '500', lineHeight: 28 },
        body: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
        bodySmall: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
        caption: { fontSize: 12, fontWeight: '400', lineHeight: 16 },
        button: { fontSize: 14, fontWeight: '500', letterSpacing: 0.1 },
    },
    shadows: {
        small: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.18,
            shadowRadius: 1.0,
            elevation: 1,
        },
        medium: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.20,
            shadowRadius: 3.84,
            elevation: 3,
        },
        large: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 6.0,
            elevation: 8,
        },
    },
    borderRadius: {
        sm: 4,
        md: 8,
        lg: 12,
        xl: 16,
        round: 999,
    },
};

// Material Design 3 Dark Theme
export const materialDarkTheme: Theme = {
    name: 'material',
    colors: {
        primary: '#D0BCFF',
        primaryContainer: '#4F378B',
        onPrimary: '#371E73',
        onPrimaryContainer: '#EADDFF',

        secondary: '#CCC2DC',
        secondaryContainer: '#4A4458',
        onSecondary: '#332D41',
        onSecondaryContainer: '#E8DEF8',

        background: '#1C1B1F',
        surface: '#1C1B1F',
        surfaceVariant: '#49454F',
        onBackground: '#E6E1E5',
        onSurface: '#E6E1E5',
        onSurfaceVariant: '#CAC4D0',

        accent: '#BB86FC',
        error: '#F2B8B5',
        success: '#81C784',
        warning: '#FFB74D',

        border: '#938F99',
        divider: '#49454F',
        overlay: 'rgba(0, 0, 0, 0.7)',

        today: '#D0BCFF',
        selected: '#4F378B',
        eventDot: '#BB86FC',
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
        h1: { fontSize: 32, fontWeight: '700', lineHeight: 40 },
        h2: { fontSize: 28, fontWeight: '600', lineHeight: 36 },
        h3: { fontSize: 24, fontWeight: '600', lineHeight: 32 },
        h4: { fontSize: 20, fontWeight: '500', lineHeight: 28 },
        body: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
        bodySmall: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
        caption: { fontSize: 12, fontWeight: '400', lineHeight: 16 },
        button: { fontSize: 14, fontWeight: '500', letterSpacing: 0.1 },
    },
    shadows: {
        small: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,
            elevation: 1,
        },
        medium: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 3,
        },
        large: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.30,
            shadowRadius: 6.0,
            elevation: 8,
        },
    },
    borderRadius: {
        sm: 4,
        md: 8,
        lg: 12,
        xl: 16,
        round: 999,
    },
};
