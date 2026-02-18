import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Animated,
    Dimensions,
    StyleSheet,
    Image,
    BackHandler
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../theme/ThemeProvider';
import { CalendarScreen } from '../screens/CalendarScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { createStackNavigator } from '@react-navigation/stack';
import { EventDetailScreen } from '../screens/EventDetailScreen';
import { NoteDetailScreen } from '../screens/NoteDetailScreen';
import { ReminderDetailScreen } from '../screens/ReminderDetailScreen';
import { TodoDetailScreen } from '../screens/TodoDetailScreen';

import { ImportCalendarScreen } from '../screens/ImportCalendarScreen';

const Stack = createStackNavigator();

const PlaceholderScreen = ({ name }: { name: string }) => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Screen: {name}</Text>
    </View>
);

export const AppNavigator: React.FC = () => {
    const { user, loading } = useAuth();
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();

    if (loading) return null;

    if (!user) {
        return <PlaceholderScreen name="Login" />;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="ImportCalendar"
                screenOptions={{
                    headerShown: false,
                    cardStyle: { backgroundColor: theme.colors.background },
                    presentation: 'card',
                }}
            >
                <Stack.Screen name="ImportCalendar" component={ImportCalendarScreen} />
                <Stack.Screen name="Main" component={MainStack} />
                <Stack.Screen name="EventDetail" component={EventDetailScreen} />
                <Stack.Screen name="NoteDetail" component={NoteDetailScreen} />
                <Stack.Screen name="ReminderDetail" component={ReminderDetailScreen} />
                <Stack.Screen name="TodoDetail" component={TodoDetailScreen} />
                <Stack.Screen name="Settings" component={SettingsScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

const MainStack = ({ navigation }: any) => {
    const { user } = useAuth();
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();

    return (
        <View style={{ flex: 1 }}>
            {/* Header */}
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
                        <Text style={[theme.typography.h3, { color: theme.colors.onSurface, fontWeight: '700' }]}>
                            Hey {user?.displayName?.split(' ')[0] || 'Sunil'} 👋
                        </Text>
                        <Text style={[theme.typography.caption, { color: theme.colors.onSurfaceVariant }]}>
                            You're going to rock today
                        </Text>
                    </View>

                    <TouchableOpacity
                        onPress={() => navigation.navigate('Settings')}
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
                            source={{ uri: user?.photoURL || 'https://i.pravatar.cc/150' }}
                            style={{ width: '100%', height: '100%' }}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <CalendarScreen />
        </View>
    );
};

