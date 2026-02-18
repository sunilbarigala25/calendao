import React from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions, StyleSheet, Image, BackHandler } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../theme/ThemeProvider';
import { CalendarScreen } from '../screens/CalendarScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const PlaceholderScreen = ({ name }: { name: string }) => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Screen: {name}</Text>
    </View>
);

export const AppNavigator: React.FC = () => {
    const { user, loading } = useAuth();
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();

    const [currentScreen, setCurrentScreen] = React.useState<'Calendar' | 'Settings'>('Calendar');

    React.useEffect(() => {
        const backAction = () => {
            if (currentScreen === 'Settings') {
                setCurrentScreen('Calendar');
                return true;
            }
            return false;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );

        return () => backHandler.remove();
    }, [currentScreen]);

    if (loading) return null;

    if (!user) {
        return <PlaceholderScreen name="Login" />;
    }

    return (
        <NavigationContainer>
            <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
                {/* Main Content */}
                <View style={{ flex: 1 }}>
                    {/* Simplified Header - Hidden on Settings */}
                    {currentScreen !== 'Settings' && (
                        <View style={{
                            backgroundColor: theme.colors.surface,
                            borderBottomWidth: 1,
                            borderBottomColor: theme.colors.divider,
                            zIndex: 10
                        }}>
                            <View style={{
                                paddingTop: insets.top,
                                paddingBottom: 12,
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingHorizontal: 16,
                                justifyContent: 'space-between'
                            }}>
                                <View>
                                    <View>
                                        <Text style={[theme.typography.h3, { color: theme.colors.onSurface, fontWeight: '700' }]}>
                                            Hey {user.displayName?.split(' ')[0] || 'Sunil'} 👋
                                        </Text>
                                        <Text style={[theme.typography.caption, { color: theme.colors.onSurfaceVariant }]}>
                                            You're going to rock today
                                        </Text>
                                    </View>
                                </View>

                                <TouchableOpacity
                                    onPress={() => setCurrentScreen('Settings')}
                                    style={{
                                        width: 44,
                                        height: 44,
                                        borderRadius: 22,
                                        overflow: 'hidden',
                                        borderWidth: 2,
                                        borderColor: theme.colors.primaryContainer,
                                        ...theme.shadows.small
                                    }}
                                >
                                    <Image
                                        source={{ uri: user.photoURL || 'https://i.pravatar.cc/150' }}
                                        style={{ width: '100%', height: '100%' }}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    {/* Active Screen */}
                    <View style={{ flex: 1 }}>
                        {currentScreen === 'Calendar' ? (
                            <CalendarScreen />
                        ) : (
                            <SettingsScreen onBack={() => setCurrentScreen('Calendar')} />
                        )}
                    </View>
                </View>
            </View>
        </NavigationContainer>
    );
};

