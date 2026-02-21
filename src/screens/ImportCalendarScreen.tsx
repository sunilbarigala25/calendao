import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ONBOARDING_KEY = 'hasSeenOnboarding';

export const ImportCalendarScreen: React.FC<any> = ({ navigation, route }) => {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    // If opened from Settings, we go back instead of replacing
    const fromSettings = route?.params?.fromSettings === true;

    const markOnboardingDone = async () => {
        await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    };

    const handleSkip = async () => {
        await markOnboardingDone();
        if (fromSettings) {
            navigation.goBack();
        } else {
            navigation.replace('Main');
        }
    };

    const handleImport = async (platform: 'google' | 'outlook' | 'apple') => {
        // Placeholder — future: trigger OAuth flow
        console.log(`Importing from ${platform}`);
        await markOnboardingDone();
        if (fromSettings) {
            navigation.goBack();
        } else {
            navigation.replace('Main');
        }
    };

    const importOptions = [
        {
            key: 'google',
            label: 'Google Calendar',
            subtitle: 'Sync work and personal events',
            iconName: 'logo-google',
            iconColor: '#4285F4',
            bgColor: '#E8F0FE',
        },
        {
            key: 'outlook',
            label: 'Microsoft Outlook',
            subtitle: 'Office 365 & Exchange',
            iconName: 'logo-windows',
            iconColor: '#FFF',
            bgColor: '#0078D4',
        },
        ...(Platform.OS === 'ios' ? [{
            key: 'apple',
            label: 'Apple Calendar',
            subtitle: 'iCloud & local calendars',
            iconName: 'logo-apple',
            iconColor: '#FFF',
            bgColor: '#1C1B1F',
        }] : []),
    ] as const;

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView
                contentContainerStyle={[styles.content, { paddingTop: insets.top + 48, paddingBottom: insets.bottom + 32 }]}
                showsVerticalScrollIndicator={false}
            >
                {/* Icon */}
                <View style={styles.iconBox}>
                    <View style={[styles.glowCircle, { backgroundColor: theme.colors.primary + '18' }]} />
                    <Ionicons name="calendar" size={72} color={theme.colors.primary} />
                </View>

                {/* Text */}
                <Text style={[theme.typography.h1, { color: theme.colors.onSurface, textAlign: 'center', fontSize: 28, fontWeight: '800' }]}>
                    Import Your Calendars
                </Text>
                <Text style={[theme.typography.body, { color: theme.colors.onSurfaceVariant, textAlign: 'center', marginTop: 10, lineHeight: 24, paddingHorizontal: 16 }]}>
                    Connect your existing calendars to see everything in one place.
                </Text>

                {/* Import options */}
                <View style={styles.optionsSection}>
                    {importOptions.map((opt) => (
                        <TouchableOpacity
                            key={opt.key}
                            style={[styles.importCard, { backgroundColor: theme.colors.surface }, theme.shadows.medium]}
                            onPress={() => handleImport(opt.key as any)}
                            activeOpacity={0.8}
                        >
                            <View style={[styles.platformIcon, { backgroundColor: opt.bgColor }]}>
                                <Ionicons name={opt.iconName as any} size={22} color={opt.iconColor} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={[theme.typography.body, { color: theme.colors.onSurface, fontWeight: '700' }]}>
                                    {opt.label}
                                </Text>
                                <Text style={[theme.typography.caption, { color: theme.colors.onSurfaceVariant }]}>
                                    {opt.subtitle}
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color={theme.colors.onSurfaceVariant} />
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            {/* Fixed footer */}
            <View style={[styles.footer, { paddingBottom: insets.bottom + 20, backgroundColor: theme.colors.background }]}>
                <TouchableOpacity
                    style={[styles.primaryButton, { backgroundColor: theme.colors.primary }]}
                    onPress={() => handleImport('google')}
                    activeOpacity={0.85}
                >
                    <Ionicons name="cloud-download-outline" size={18} color="#FFF" />
                    <Text style={styles.primaryButtonText}>Import</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.skipButton} onPress={handleSkip} activeOpacity={0.7}>
                    <Text style={[theme.typography.body, { color: theme.colors.onSurfaceVariant, fontWeight: '600' }]}>
                        Skip for Now
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: {
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    iconBox: {
        width: 140,
        height: 140,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 28,
    },
    glowCircle: {
        position: 'absolute',
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    optionsSection: {
        width: '100%',
        marginTop: 36,
        gap: 12,
    },
    importCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 18,
        borderRadius: 20,
        gap: 14,
    },
    platformIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    footer: {
        paddingHorizontal: 20,
        paddingTop: 12,
        gap: 8,
    },
    primaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 16,
        borderRadius: 18,
    },
    primaryButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
    skipButton: {
        paddingVertical: 12,
        alignItems: 'center',
    },
});
