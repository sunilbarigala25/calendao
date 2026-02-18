import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const ImportCalendarScreen: React.FC<any> = ({ navigation }) => {
    const { theme, themeType } = useTheme();
    const insets = useSafeAreaInsets();

    const handleImport = (platform: 'google' | 'outlook') => {
        // Mock import logic
        console.log(`Importing from ${platform}`);
        navigation.replace('Main');
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + 60, paddingBottom: insets.bottom + 40 }]}>
                {/* Visual Header */}
                <View style={styles.headerIconBox}>
                    <View style={[styles.glowCircle, { backgroundColor: theme.colors.primary + '22' }]} />
                    <Ionicons name="cloud-download-outline" size={80} color={theme.colors.primary} />
                </View>

                <View style={styles.textSection}>
                    <Text style={[theme.typography.h1, { color: theme.colors.onSurface, textAlign: 'center' }]}>
                        Bring your life together
                    </Text>
                    <Text style={[theme.typography.body, { color: theme.colors.onSurfaceVariant, textAlign: 'center', marginTop: 12, lineHeight: 24 }]}>
                        Sync your existing calendars to unlock the full potential of your personal timeline.
                    </Text>
                </View>

                {/* Import Options */}
                <View style={styles.optionsSection}>
                    <TouchableOpacity
                        style={[styles.importCard, { backgroundColor: theme.colors.surface, ...theme.shadows.medium }]}
                        onPress={() => handleImport('google')}
                    >
                        <View style={[styles.platformIcon, { backgroundColor: '#FFF' }]}>
                            <Ionicons name="logo-google" size={24} color="#4285F4" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[theme.typography.body, { color: theme.colors.onSurface, fontWeight: '700' }]}>
                                Google Calendar
                            </Text>
                            <Text style={[theme.typography.caption, { color: theme.colors.onSurfaceVariant }]}>
                                Sync work and personal events
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={theme.colors.onSurfaceVariant} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.importCard, { backgroundColor: theme.colors.surface, ...theme.shadows.medium, marginTop: 16 }]}
                        onPress={() => handleImport('outlook')}
                    >
                        <View style={[styles.platformIcon, { backgroundColor: '#0078D4' }]}>
                            <Ionicons name="logo-windows" size={24} color="#FFF" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[theme.typography.body, { color: theme.colors.onSurface, fontWeight: '700' }]}>
                                Microsoft Outlook
                            </Text>
                            <Text style={[theme.typography.caption, { color: theme.colors.onSurfaceVariant }]}>
                                Integration for Office 365
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={theme.colors.onSurfaceVariant} />
                    </TouchableOpacity>
                </View>

                {/* Footer Actions */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.primaryButton, { backgroundColor: theme.colors.primary }]}
                        onPress={() => navigation.replace('Main')}
                    >
                        <Text style={styles.primaryButtonText}>Finish Setup</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.skipButton}
                        onPress={() => navigation.replace('Main')}
                    >
                        <Text style={[theme.typography.body, { color: theme.colors.onSurfaceVariant, fontWeight: '600' }]}>
                            Skip for Now
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: {
        paddingHorizontal: 24,
        alignItems: 'center',
    },
    headerIconBox: {
        width: 160,
        height: 160,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40,
    },
    glowCircle: {
        position: 'absolute',
        width: 140,
        height: 140,
        borderRadius: 70,
    },
    textSection: {
        marginBottom: 48,
    },
    optionsSection: {
        width: '100%',
        marginBottom: 40,
    },
    importCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 24,
        gap: 16,
    },
    platformIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    footer: {
        width: '100%',
        gap: 16,
    },
    primaryButton: {
        width: '100%',
        paddingVertical: 18,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
    },
    primaryButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
    skipButton: {
        width: '100%',
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
    }
});
