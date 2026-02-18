import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { materialLightTheme, materialDarkTheme } from './materialTheme';
import { glassLightTheme, glassDarkTheme } from './glassTheme';
import { Theme } from './types';
import { STORAGE_KEY_THEME, STORAGE_KEY_COLOR_MODE } from '../config/constants';
import { useAuth } from '../contexts/AuthContext';

type ThemeType = 'material' | 'glass';
type ColorMode = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    themeType: ThemeType;
    colorMode: ColorMode;
    setThemeType: (type: ThemeType) => void;
    setColorMode: (mode: ColorMode) => void;
    toggleColorMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const { user } = useAuth();
    const [themeType, setThemeTypeState] = useState<ThemeType>('material');
    const [colorMode, setColorModeState] = useState<ColorMode>('light');
    const [theme, setTheme] = useState<Theme>(materialLightTheme);

    // Load theme preferences from storage
    useEffect(() => {
        const loadThemePreferences = async () => {
            try {
                const savedThemeType = await AsyncStorage.getItem(STORAGE_KEY_THEME);
                const savedColorMode = await AsyncStorage.getItem(STORAGE_KEY_COLOR_MODE);

                if (savedThemeType) {
                    setThemeTypeState(savedThemeType as ThemeType);
                }
                if (savedColorMode) {
                    setColorModeState(savedColorMode as ColorMode);
                }
            } catch (error) {
                console.error('Failed to load theme preferences:', error);
            }
        };

        loadThemePreferences();
    }, []);

    // Update theme when themeType, colorMode, or user.primaryColor changes
    useEffect(() => {
        const getBaseTheme = (): Theme => {
            if (themeType === 'material') {
                return colorMode === 'light' ? materialLightTheme : materialDarkTheme;
            } else {
                return colorMode === 'light' ? glassLightTheme : glassDarkTheme;
            }
        };

        const baseTheme = getBaseTheme();

        // Apply user's primary color if available
        if (user?.primaryColor) {
            const updatedTheme = {
                ...baseTheme,
                colors: {
                    ...baseTheme.colors,
                    primary: user.primaryColor,
                    // If glass theme, we might want to update primaryContainer too
                    primaryContainer: themeType === 'glass'
                        ? `${user.primaryColor}1A` // 10% alpha for glass effect
                        : baseTheme.colors.primaryContainer
                }
            };
            setTheme(updatedTheme);
        } else {
            setTheme(baseTheme);
        }
    }, [themeType, colorMode, user?.primaryColor]);

    const setThemeType = async (type: ThemeType) => {
        setThemeTypeState(type);
        try {
            await AsyncStorage.setItem(STORAGE_KEY_THEME, type);
        } catch (error) {
            console.error('Failed to save theme type:', error);
        }
    };

    const setColorMode = async (mode: ColorMode) => {
        setColorModeState(mode);
        try {
            await AsyncStorage.setItem(STORAGE_KEY_COLOR_MODE, mode);
        } catch (error) {
            console.error('Failed to save color mode:', error);
        }
    };

    const toggleColorMode = () => {
        setColorMode(colorMode === 'light' ? 'dark' : 'light');
    };

    return (
        <ThemeContext.Provider
            value={{
                theme,
                themeType,
                colorMode,
                setThemeType,
                setColorMode,
                toggleColorMode,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};
