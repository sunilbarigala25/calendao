import React, { useState } from 'react';
import { TextInput as RNTextInput, View, Text, StyleSheet, TextInputProps } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, style, ...props }) => {
    const { theme } = useTheme();
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={styles.container}>
            {label && (
                <Text
                    style={[
                        theme.typography.bodySmall,
                        {
                            color: error ? theme.colors.error : theme.colors.onSurfaceVariant,
                            marginBottom: theme.spacing.xs,
                        },
                    ]}
                >
                    {label}
                </Text>
            )}
            <RNTextInput
                style={[
                    styles.input,
                    theme.typography.body,
                    {
                        backgroundColor: theme.colors.surfaceVariant,
                        borderRadius: theme.borderRadius.md,
                        borderWidth: 1,
                        borderColor: error
                            ? theme.colors.error
                            : isFocused
                                ? theme.colors.primary
                                : theme.colors.border,
                        color: theme.colors.onSurface,
                        paddingHorizontal: theme.spacing.md,
                        paddingVertical: theme.spacing.sm,
                    },
                    style,
                ]}
                placeholderTextColor={theme.colors.onSurfaceVariant}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                {...props}
            />
            {error && (
                <Text
                    style={[
                        theme.typography.caption,
                        {
                            color: theme.colors.error,
                            marginTop: theme.spacing.xs,
                        },
                    ]}
                >
                    {error}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    input: {
        minHeight: 48,
    },
});
