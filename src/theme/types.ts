// Theme type definitions
export interface Theme {
    name: 'material' | 'glass';
    colors: Colors;
    spacing: Spacing;
    typography: Typography;
    shadows: Shadows;
    borderRadius: BorderRadius;
}

export interface Colors {
    // Primary colors
    primary: string;
    primaryContainer: string;
    onPrimary: string;
    onPrimaryContainer: string;

    // Secondary colors
    secondary: string;
    secondaryContainer: string;
    onSecondary: string;
    onSecondaryContainer: string;

    // Background colors
    background: string;
    surface: string;
    surfaceVariant: string;
    onBackground: string;
    onSurface: string;
    onSurfaceVariant: string;

    // Accent colors
    accent: string;
    error: string;
    success: string;
    warning: string;

    // UI elements
    border: string;
    divider: string;
    overlay: string;

    // Calendar specific
    today: string;
    selected: string;
    eventDot: string;
}

export interface Spacing {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
}

export interface Typography {
    h1: TextStyle;
    h2: TextStyle;
    h3: TextStyle;
    h4: TextStyle;
    body: TextStyle;
    bodySmall: TextStyle;
    caption: TextStyle;
    button: TextStyle;
}

export interface TextStyle {
    fontSize: number;
    fontWeight: '300' | '400' | '500' | '600' | '700';
    lineHeight?: number;
    letterSpacing?: number;
}

export interface Shadows {
    small: ShadowStyle;
    medium: ShadowStyle;
    large: ShadowStyle;
}

export interface ShadowStyle {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number; // Android
}

export interface BorderRadius {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    round: number;
}
