import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

interface CardProps {
    children: ReactNode;
    style?: ViewStyle;
    elevated?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, style, elevated = true }) => {
    const { theme } = useTheme();

    return (
        <View
            style={[
                styles.card,
                {
                    backgroundColor: theme.colors.surface,
                    borderRadius: 24,
                    borderWidth: theme.name === 'glass' ? 1 : 0,
                    borderColor: theme.colors.outlineVariant,
                    ...theme.shadows.medium,
                },
                style,
            ]}
        >
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        padding: 16,
    },
});
