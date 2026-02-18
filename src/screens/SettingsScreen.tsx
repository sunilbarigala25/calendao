import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Image } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface SettingsScreenProps {
    onBack: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
    const { theme, themeType, colorMode, setThemeType, toggleColorMode } = useTheme();
    const { user, logout, updateCategoryColors, updatePrimaryColor } = useAuth();
    const insets = useSafeAreaInsets();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const primaryColors = [
        '#6750A4', // Material Purple
        '#007AFF', // iOS Blue
        '#34C759', // Success Green
        '#FF2D55', // Accent Red
        '#FF9500', // Warning Orange
        '#5856D6', // Deep Purple
        '#AF52DE', // Lavender
    ];

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingTop: insets.top,
                    paddingBottom: insets.bottom + 150
                }}
            >
                <View style={styles.content}>
                    {/* Profile Section */}
                    <Card style={styles.section}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                            <Image
                                source={{ uri: user?.photoURL || 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=150' }}
                                style={{ width: 80, height: 80, borderRadius: 40, marginRight: 16 }}
                            />
                            <View>
                                <Text style={[theme.typography.h2, { color: theme.colors.onSurface, fontSize: 24 }]}>
                                    {user?.displayName || 'Sunil Barigala'}
                                </Text>
                                <Text style={[theme.typography.caption, { color: theme.colors.onSurfaceVariant, fontSize: 14 }]}>
                                    {user?.email || 'sunil@chronoglass.com'}
                                </Text>
                            </View>
                        </View>
                        <Button title="Edit Profile" onPress={() => { }} variant="outline" />
                    </Card>

                    {/* App Customization */}
                    <Card style={styles.section}>
                        <Text style={[theme.typography.h3, { color: theme.colors.onSurface, marginBottom: 16 }]}>
                            App Theme
                        </Text>

                        <Text style={[theme.typography.bodySmall, { color: theme.colors.onSurfaceVariant, marginBottom: 12 }]}>
                            PRIMARY COLOR
                        </Text>
                        <View style={[styles.colorPicker, { marginBottom: 24 }]}>
                            {primaryColors.map((color) => (
                                <TouchableOpacity
                                    key={color}
                                    style={[
                                        styles.bigColorCircle,
                                        { backgroundColor: color },
                                        user?.primaryColor === color && { borderWidth: 3, borderColor: theme.colors.onSurface }
                                    ]}
                                    onPress={() => updatePrimaryColor(color)}
                                />
                            ))}
                        </View>

                        <View style={styles.settingRow}>
                            <View>
                                <Text style={[theme.typography.body, { color: theme.colors.onSurface }]}>Apple Glass UX</Text>
                                <Text style={[theme.typography.caption, { color: theme.colors.onSurfaceVariant }]}>Translucent & Blur effects</Text>
                            </View>
                            <Switch
                                value={themeType === 'glass'}
                                onValueChange={(val) => setThemeType(val ? 'glass' : 'material')}
                                trackColor={{ "false": theme.colors.surfaceVariant, "true": theme.colors.primary }}
                                thumbColor={themeType === 'glass' ? theme.colors.onPrimary : theme.colors.onSurface}
                            />
                        </View>

                        <View style={[styles.settingRow, { marginTop: 12 }]}>
                            <Text style={[theme.typography.body, { color: theme.colors.onSurface }]}>Dark Mode</Text>
                            <Switch
                                value={colorMode === 'dark'}
                                onValueChange={toggleColorMode}
                                trackColor={{ "false": theme.colors.surfaceVariant, "true": theme.colors.primary }}
                                thumbColor={colorMode === 'dark' ? theme.colors.onPrimary : theme.colors.onSurface}
                            />
                        </View>
                    </Card>

                    {/* Icon Colors */}
                    <Card style={styles.section}>
                        <Text style={[theme.typography.h3, { color: theme.colors.onSurface, marginBottom: theme.spacing.md }]}>
                            Icon Categories
                        </Text>
                        {['event', 'note', 'todo', 'reminder'].map((category) => (
                            <View key={category} style={styles.colorRow}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                                    <Ionicons
                                        name={category === 'event' ? 'star' : category === 'todo' ? 'checkbox' : category === 'reminder' ? 'notifications' : 'document-text'}
                                        size={20}
                                        color={user?.categoryColors[category as keyof typeof user.categoryColors] || theme.colors.primary}
                                    />
                                    <Text style={[theme.typography.body, { color: theme.colors.onSurface, textTransform: 'capitalize' }]}>
                                        {category}
                                    </Text>
                                </View>
                                <View style={styles.colorPicker}>
                                    {['#B3E5FC', '#F3E5F5', '#C8E6C9', '#FFF9C4', '#FFCDD2', '#D1C4E9'].map((c) => (
                                        <TouchableOpacity
                                            key={c}
                                            style={[
                                                styles.colorCircle,
                                                { backgroundColor: c },
                                                user?.categoryColors[category as keyof typeof user.categoryColors] === c && { borderWidth: 2, borderColor: theme.colors.primary }
                                            ]}
                                            onPress={() => {
                                                const newColors = { ...user!.categoryColors, [category]: c };
                                                updateCategoryColors(newColors);
                                            }}
                                        />
                                    ))}
                                </View>
                            </View>
                        ))}
                    </Card>

                    {/* About */}
                    <Card style={styles.section}>
                        <Text style={[theme.typography.h3, { color: theme.colors.onSurface, marginBottom: theme.spacing.md }]}>
                            About
                        </Text>
                        <Text style={[theme.typography.body, { color: theme.colors.onSurfaceVariant, marginBottom: theme.spacing.sm }]}>
                            Ahora v1.2.0
                        </Text>
                        <Text style={[theme.typography.bodySmall, { color: theme.colors.onSurfaceVariant }]}>
                            Designed for one-handed ergonomics and visual clarity. Open Source.
                        </Text>
                    </Card>

                    <Button title="Logout" onPress={handleLogout} variant="outline" style={styles.logoutButton} />
                </View>
            </ScrollView>

            {/* Floating Back Button at Bottom Right */}
            <View style={[styles.floatingControls, { bottom: insets.bottom + 20 }]}>
                <TouchableOpacity
                    style={[styles.floatingButton, { backgroundColor: theme.colors.surface, ...theme.shadows.medium }]}
                    onPress={onBack}
                >
                    <Ionicons name="arrow-back" size={24} color={theme.colors.onSurface} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 16,
    },
    section: {
        marginBottom: 16,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    logoutButton: {
        marginTop: 16,
    },
    colorRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#00000005',
    },
    colorPicker: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    colorCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
    },
    bigColorCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
    },
    floatingControls: {
        position: 'absolute',
        right: 24,
        alignItems: 'center',
    },
    floatingButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
