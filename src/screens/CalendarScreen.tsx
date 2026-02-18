import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Animated,
    Dimensions,
    Platform
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeProvider';
import { formatDate, parseDate, isToday, getWeekDates } from '../utils/dateUtils';
import { FloatingActionButton } from '../components/fab/FloatingActionButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { addDays, subDays, addYears, subYears } from 'date-fns';
import { useSystemTime } from '../hooks/useSystemTime';
import { useAuth } from '../contexts/AuthContext';
import { useCalendar } from '../contexts/CalendarContext';

const { width } = Dimensions.get('window');

export const CalendarScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const { theme, colorMode, themeType } = useTheme();
    const { user } = useAuth();
    const { getItemsByDate } = useCalendar();
    const insets = useSafeAreaInsets();
    const systemTime = useSystemTime();

    const [selectedDate, setSelectedDate] = useState(systemTime.fullDate);
    const [viewMode, setViewMode] = useState<'today' | 'week' | 'month'>('today');

    const pastelColors = [
        '#E3F2FD', '#E8F5E9', '#FFF3E0', '#FCE4EC',
        '#F3E5F5', '#EFEBE9', '#F1F8E9', '#FFFDE7',
        '#E0F2F1', '#E8EAF6', '#F9FBE7', '#FFF8E1'
    ];

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const weekDates = getWeekDates(parseDate(selectedDate));
    const currentYear = parseDate(selectedDate).getFullYear();

    // Helper to calculate luminance and return a contrast color
    const getContrastColor = (hexColor: string) => {
        // Remove # if present
        const hex = hexColor.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        // Perceptive luminance formula
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

        return luminance > 0.6 ? '#1C1B1F' : '#FFFFFF'; // Dark text for light bg, white for dark
    };

    // Helper to get color based on item type
    const getItemColor = (item: any) => {
        const type = item.type;
        if (user?.categoryColors && user.categoryColors[type as keyof typeof user.categoryColors]) {
            return user.categoryColors[type as keyof typeof user.categoryColors];
        }
        // Fallback defaults
        const defaults: Record<string, string> = {
            event: '#EADDFF', // Material Primary Container
            todo: '#C8E6C9',
            note: '#F3E5F5',
            reminder: '#FFF3E0'
        };
        return defaults[type] || '#F5F5F5';
    };

    // Data for the selected day
    const dayItems = getItemsByDate(selectedDate);

    // Fallback mock data removed - now using dynamic empty states below
    const displayEvents = dayItems;

    // Mock data for week/month views (simplified)
    const mockEvents = [
        { id: '1', title: 'Product Review', time: '10:00 AM', type: 'event' },
        { id: '2', title: 'Buy Groceries', time: '02:00 PM', type: 'todo' },
        { id: '3', title: 'Evening Walk', time: '06:00 PM', type: 'reminder' },
    ];

    // Generate dates for Month View (mini-grids)
    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    // Helper to get prioritized icons for a date
    const getPrioritizedIcons = (dateStr: string) => {
        const items = getItemsByDate(dateStr);
        if (items.length === 0) return [];

        const counts: Record<string, number> = {};
        items.forEach(item => {
            counts[item.type] = (counts[item.type] || 0) + 1;
        });

        // Sort types by frequency
        return Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
    };

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const weekScrollRef = useRef<ScrollView>(null);

    useEffect(() => {
        fadeAnim.setValue(0);
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
        }).start();

        // Center week view scroll when date changes
        if (viewMode === 'week' && weekScrollRef.current) {
            const dateIndex = weekDates.findIndex(d => formatDate(d) === selectedDate);
            if (dateIndex !== -1) {
                // Approximate width of a day column is 112 (100 width + 12 margin)
                const scrollX = (dateIndex * 112) + 50 - (width / 2) + 56; // 56 is lead padding half
                weekScrollRef.current.scrollTo({ x: Math.max(0, scrollX), animated: true });
            }
        }
    }, [viewMode, selectedDate]);

    const goToPrev = () => {
        const d = parseDate(selectedDate);
        if (viewMode === 'today') setSelectedDate(formatDate(subDays(d, 1)));
        else if (viewMode === 'week') setSelectedDate(formatDate(subDays(d, 7)));
        else if (viewMode === 'month') setSelectedDate(formatDate(subYears(d, 1)));
    };

    const goToNext = () => {
        const d = parseDate(selectedDate);
        if (viewMode === 'today') setSelectedDate(formatDate(addDays(d, 1)));
        else if (viewMode === 'week') setSelectedDate(formatDate(addDays(d, 7)));
        else if (viewMode === 'month') setSelectedDate(formatDate(addYears(d, 1)));
    };

    const handleBackToToday = () => {
        setSelectedDate(systemTime.fullDate);
        // Force view context to today for clarity if desired, or keep viewMode
        // setViewMode('today');
    };

    const isShowingToday = selectedDate === systemTime.fullDate;

    // Sort months so current is first
    // Sort months so current is first ONLY if viewing the current system year
    const systemYear = new Date().getFullYear();
    const currentMonthIndex = new Date().getMonth();

    const sortedMonths = currentYear === systemYear
        ? [
            { name: months[currentMonthIndex], index: currentMonthIndex },
            ...months.map((name, index) => ({ name, index })).filter(m => m.index !== currentMonthIndex)
        ]
        : months.map((name, index) => ({ name, index }));

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {/* Content Area */}
            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingTop: 10,
                    paddingBottom: insets.bottom + 180 // Increased to ensure FAB safety for cards
                }}
                stickyHeaderIndices={viewMode === 'week' ? [0] : []}
            >
                {viewMode === 'today' && (
                    <Animated.View style={[styles.todayContent, { opacity: fadeAnim }]}>
                        {/* Primary Tile Card — Center Refined for 2C */}
                        {isShowingToday && (
                            <View style={[
                                styles.primaryTile,
                                { backgroundColor: theme.colors.surface, ...theme.shadows.medium },
                                themeType === 'glass' && { backgroundColor: 'rgba(255,255,255,0.4)' }
                            ]}>
                                {/* Left Status Icons */}
                                <View style={styles.tileLeftStrip}>
                                    <View style={[styles.statusIconBox, { backgroundColor: '#C8E6C9' }]}>
                                        <Ionicons name="checkmark" size={16} color="#2E7D32" />
                                    </View>
                                    <View style={styles.categoryIconColumn}>
                                        {getPrioritizedIcons(systemTime.fullDate).slice(0, 3).map((type, idx) => (
                                            <View key={type} style={[styles.miniIconCircle, { backgroundColor: getItemColor({ type }), marginTop: idx === 0 ? 0 : 8 }]}>
                                                <Ionicons
                                                    name={type === 'event' ? 'star' : type === 'todo' ? 'checkbox' : type === 'reminder' ? 'notifications' : 'document-text'}
                                                    size={12}
                                                    color={getContrastColor(getItemColor({ type }))}
                                                />
                                            </View>
                                        ))}
                                        {getPrioritizedIcons(systemTime.fullDate).length === 0 && (
                                            <View style={[styles.miniIconCircle, { backgroundColor: '#F5F5F5' }]}>
                                                <Ionicons name="sunny" size={12} color="#9E9E9E" />
                                            </View>
                                        )}
                                    </View>
                                </View>

                                {/* Center Info - Iteration 2C Fix */}
                                <View style={styles.tileMainContent}>
                                    <View style={styles.tileDateRow}>
                                        <Text style={[styles.largeDateText, { color: theme.colors.onSurface }]}>
                                            {systemTime.date}
                                        </Text>
                                        <Text style={[styles.dateSuffix, { color: theme.colors.onSurface }]}>th</Text>
                                    </View>
                                    <Text style={[styles.dayNameText, { color: theme.colors.onSurface }]}>
                                        {systemTime.dayName}
                                    </Text>

                                    <View style={styles.tileBottomRow}>
                                        <View style={styles.timeDisplay}>
                                            <Text style={[styles.timeText, { color: theme.colors.onSurface }]}>{systemTime.time}</Text>
                                            <Text style={[styles.ampmSmall, { color: theme.colors.onSurfaceVariant }]}>{systemTime.ampm}</Text>
                                        </View>
                                        <Text style={[styles.monthLabel, { color: theme.colors.onSurfaceVariant }]}>
                                            {systemTime.monthName.toUpperCase()}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        )}

                        <View style={styles.sectionHeader}>
                            <View style={styles.sectionLabelWrapper}>
                                <View style={[styles.sectionIndicator, { backgroundColor: theme.colors.primary }]} />
                                <Text style={[theme.typography.h3, { color: theme.colors.onSurface }]}>
                                    Scheduled for {isShowingToday ? 'Today' : parseDate(selectedDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                                </Text>
                            </View>
                            {!isShowingToday && (
                                <Text style={[theme.typography.bodySmall, { color: theme.colors.onSurfaceVariant }]}>
                                    {parseDate(selectedDate).toLocaleDateString('en-US', { weekday: 'long' })}
                                </Text>
                            )}
                        </View>

                        {displayEvents.length > 0 ? (
                            displayEvents.map((item: any) => {
                                const itemColor = getItemColor(item);
                                const contrastColor = getContrastColor(itemColor);
                                return (
                                    <TouchableOpacity
                                        key={item.id}
                                        style={[styles.scheduleItem, { backgroundColor: itemColor }]}
                                        activeOpacity={0.8}
                                        onPress={() => {
                                            const screenMap: Record<string, string> = {
                                                'event': 'EventDetail',
                                                'note': 'NoteDetail',
                                                'reminder': 'ReminderDetail',
                                                'todo': 'TodoDetail'
                                            };
                                            navigation.navigate(screenMap[item.type], { item });
                                        }}
                                    >
                                        <View style={styles.itemTimeSection}>
                                            <Text style={[styles.itemTimeMain, { color: contrastColor }]}>{item.payload.startTime || item.payload.time || 'All Day'}</Text>
                                            <Text style={[styles.itemTimeSub, { color: contrastColor + '99' }]}>
                                                {item.payload.startTime?.includes('AM') || item.payload.time?.includes('AM') ? 'AM' :
                                                    item.payload.startTime?.includes('PM') || item.payload.time?.includes('PM') ? 'PM' : ''}
                                            </Text>
                                        </View>
                                        <View style={[styles.itemDivider, { backgroundColor: contrastColor + '33' }]} />
                                        <View style={[styles.itemIconCircle, { backgroundColor: '#FFFFFF' }]}>
                                            <Ionicons
                                                name={item.type === 'event' ? 'star' : item.type === 'todo' ? 'checkbox' : item.type === 'reminder' ? 'notifications' : 'document-text'}
                                                size={20}
                                                color={itemColor}
                                            />
                                        </View>
                                        <Text style={[styles.itemTitle, { color: contrastColor }]} numberOfLines={1}>{item.payload.title}</Text>
                                    </TouchableOpacity>
                                );
                            })
                        ) : (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emojiText}>😊</Text>
                                <Text style={[theme.typography.h3, { color: theme.colors.onSurface, textAlign: 'center' }]}>
                                    Have a great day!
                                </Text>
                                <Text style={[theme.typography.body, { color: theme.colors.onSurfaceVariant, textAlign: 'center', marginTop: 8 }]}>
                                    No events planned for {isShowingToday ? 'today' : 'this day'}.
                                </Text>
                            </View>
                        )}
                    </Animated.View>
                )}

                {viewMode === 'week' && (
                    <View style={styles.weekContent}>
                        <Text style={[theme.typography.h2, { color: theme.colors.onSurface, marginBottom: 16 }]}>
                            {parseDate(selectedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </Text>

                        <ScrollView
                            ref={weekScrollRef}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.weekScrollContent}
                        >
                            {/* Lead Padding for Centering */}
                            <View style={{ width: width / 2 - 56 }} />
                            {weekDates.map((date) => {
                                const dateStr = formatDate(date);
                                const isTodayDate = isToday(date);
                                const isSelected = selectedDate === dateStr;
                                const prioritizedTypes = getPrioritizedIcons(dateStr);
                                return (
                                    <TouchableOpacity
                                        key={dateStr}
                                        activeOpacity={0.9}
                                        onPress={() => setSelectedDate(dateStr)}
                                        style={[
                                            styles.weekDayColumn,
                                            { backgroundColor: theme.colors.surface, ...theme.shadows.small },
                                            isSelected && { borderWidth: 2, borderColor: theme.colors.primary, elevation: 5 },
                                            isTodayDate && !isSelected && { backgroundColor: theme.colors.primaryContainer + '22' }
                                        ]}
                                    >
                                        <View style={[styles.weekDateHeader, isTodayDate && { borderBottomColor: theme.colors.primary }]}>
                                            <Text style={[theme.typography.caption, { color: isTodayDate ? theme.colors.primary : theme.colors.onSurfaceVariant, fontWeight: '800' }]}>
                                                {date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}
                                            </Text>
                                            <Text style={[theme.typography.h2, { color: isTodayDate ? theme.colors.primary : theme.colors.onSurface, fontSize: 32 }]}>
                                                {date.getDate()}
                                            </Text>
                                            <Text style={[theme.typography.caption, { color: theme.colors.onSurfaceVariant }]}>
                                                {date.toLocaleDateString('en-US', { month: 'short' })}
                                            </Text>
                                        </View>

                                        <View style={styles.weekEventsPreview}>
                                            {prioritizedTypes.length > 0 ? (
                                                prioritizedTypes.slice(0, 3).map(type => (
                                                    <View key={type} style={styles.weekIconCircle}>
                                                        <Ionicons
                                                            name={type === 'event' ? 'star' : type === 'todo' ? 'checkbox' : type === 'reminder' ? 'notifications' : 'document-text'}
                                                            size={8}
                                                            color={getItemColor({ type })}
                                                        />
                                                    </View>
                                                ))
                                            ) : (
                                                <Ionicons name="sunny-outline" size={14} color={theme.colors.onSurfaceVariant + '44'} />
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                            {/* Tail Padding for Centering */}
                            <View style={{ width: width / 2 - 56 }} />
                        </ScrollView>

                        {/* Detail area for selected day in week view */}
                        <View style={styles.weekDayDetail}>
                            <Text style={[theme.typography.h3, { color: theme.colors.onSurface, marginBottom: 12 }]}>
                                {parseDate(selectedDate).toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </Text>
                            {dayItems.length > 0 ? (
                                dayItems.map(item => (
                                    <TouchableOpacity
                                        key={item.id}
                                        style={[styles.scheduleItem, { backgroundColor: getItemColor(item) }]}
                                        activeOpacity={0.8}
                                        onPress={() => {
                                            const screenMap: Record<string, string> = {
                                                'event': 'EventDetail',
                                                'note': 'NoteDetail',
                                                'reminder': 'ReminderDetail',
                                                'todo': 'TodoDetail'
                                            };
                                            navigation.navigate(screenMap[item.type], { item });
                                        }}
                                    >
                                        <View style={styles.itemIconCircle}>
                                            <Ionicons
                                                name={item.type === 'event' ? 'star' : item.type === 'todo' ? 'checkbox' : item.type === 'reminder' ? 'notifications' : 'document-text'}
                                                size={16}
                                                color={getItemColor(item)}
                                            />
                                        </View>
                                        <Text style={{ color: getContrastColor(getItemColor(item)), fontWeight: '700', marginLeft: 12 }}>{item.payload.title}</Text>
                                    </TouchableOpacity>
                                ))
                            ) : (
                                <View style={[styles.emptyContainer, { marginTop: 20 }]}>
                                    <Text style={styles.emojiText}>😊</Text>
                                    <Text style={[theme.typography.body, { color: theme.colors.onSurfaceVariant, fontStyle: 'italic', textAlign: 'center' }]}>
                                        Nothing scheduled. Enjoy your day!
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                )}

                {viewMode === 'month' && (
                    <View style={styles.monthContent}>
                        <View style={styles.yearHeader}>
                            <Text style={[theme.typography.h1, { color: theme.colors.onSurface, fontSize: 32 }]}>
                                {currentYear}
                            </Text>
                        </View>
                        <View style={styles.monthGrid}>
                            {sortedMonths.map((m) => {
                                const daysInMonth = getDaysInMonth(currentYear, m.index);
                                const firstDay = new Date(currentYear, m.index, 1).getDay();
                                const isPresentMonth = m.index === currentMonthIndex;
                                return (
                                    <TouchableOpacity
                                        key={m.name}
                                        style={[
                                            styles.monthCard,
                                            { backgroundColor: pastelColors[m.index], ...theme.shadows.small },
                                            isPresentMonth && currentYear === systemYear && { width: '100%', height: 260, borderWidth: 3, borderColor: theme.colors.primary }
                                        ]}
                                        activeOpacity={0.8}
                                        onPress={() => {
                                            const firstOfMonth = new Date(currentYear, m.index, 1);
                                            setSelectedDate(formatDate(firstOfMonth));
                                            setViewMode('today');
                                        }}
                                    >
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                            <Text style={[theme.typography.h3, { color: '#000', fontSize: isPresentMonth && currentYear === systemYear ? 24 : 18 }]}>{m.name}</Text>
                                            {isPresentMonth && currentYear === systemYear && (
                                                <View style={{ backgroundColor: theme.colors.primary, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 }}>
                                                    <Text style={{ color: '#FFF', fontSize: 10, fontWeight: '800' }}>PRESENT</Text>
                                                </View>
                                            )}
                                        </View>

                                        {/* Weekday Headers */}
                                        <View style={styles.weekdayHeaderRow}>
                                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                                                <Text key={idx} style={[styles.miniWeekdayText, isPresentMonth && currentYear === systemYear && { fontSize: 10 }]}>{day}</Text>
                                            ))}
                                        </View>

                                        <View style={[styles.miniGrid, isPresentMonth && currentYear === systemYear && { gap: 4 }]}>
                                            {Array.from({ length: firstDay }).map((_, i) => (
                                                <View key={`pad-${i}`} style={[styles.miniGridCell, isPresentMonth && currentYear === systemYear && { width: (width - 100) / 7, height: 24 }, { backgroundColor: 'transparent' }]} />
                                            ))}
                                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                                const isTodayInGrid = isPresentMonth && currentYear === systemYear && (i + 1) === new Date().getDate();
                                                return (
                                                    <View key={i} style={[
                                                        styles.miniGridCell,
                                                        isPresentMonth && currentYear === systemYear && { width: (width - 100) / 7, height: 24 },
                                                        isTodayInGrid && { backgroundColor: theme.colors.primary }
                                                    ]}>
                                                        <Text style={[
                                                            styles.miniGridText,
                                                            { color: isTodayInGrid ? '#FFF' : '#00000088' },
                                                            isPresentMonth && currentYear === systemYear && { fontSize: 12 }
                                                        ]}>
                                                            {i + 1}
                                                        </Text>
                                                    </View>
                                                );
                                            })}
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                )}
            </ScrollView>

            {/* Back to Today Floating Button */}
            {!isShowingToday && (
                <TouchableOpacity
                    style={[
                        styles.backToToday,
                        {
                            bottom: insets.bottom + 180,
                            backgroundColor: theme.colors.primaryContainer,
                            ...theme.shadows.medium
                        }
                    ]}
                    onPress={() => setSelectedDate(systemTime.fullDate)}
                >
                    <Ionicons name="today" size={20} color={theme.colors.onPrimaryContainer} />
                    <Text style={[theme.typography.caption, { color: theme.colors.onPrimaryContainer, marginLeft: 8, fontWeight: '700' }]}>TODAY</Text>
                </TouchableOpacity>
            )}

            {/* Floating Action Button - Positioned above navbar */}
            <FloatingActionButton selectedDate={selectedDate} />

            {/* Bottom Ergonomic Navigation Bar - Restricted to Secondary Container for visibility */}
            <View style={[
                styles.bottomNav,
                {
                    backgroundColor: themeType === 'glass' ? 'rgba(255,255,255,0.7)' : theme.colors.secondaryContainer + 'AA', // Semi-translucent
                    paddingBottom: insets.bottom + 16,
                    minHeight: 80 + insets.bottom,
                    borderTopWidth: 1,
                    borderTopColor: theme.colors.primary + '33',
                    ...theme.shadows.large,
                    elevation: 20,
                    zIndex: 2000,
                    overflow: 'hidden'
                }
            ]}>
                {Platform.OS !== 'web' && (
                    <BlurView
                        intensity={80}
                        style={StyleSheet.absoluteFill}
                        tint={colorMode === 'dark' ? 'dark' : 'light'}
                    />
                )}
                <View style={styles.navControls}>
                    <TouchableOpacity onPress={goToPrev} style={[styles.navArrow, { backgroundColor: theme.colors.surface }]}>
                        <Ionicons name="chevron-back" size={24} color={theme.colors.onSurfaceVariant} />
                    </TouchableOpacity>

                    <View style={[styles.pillContainer, { backgroundColor: theme.colors.surface }]}>
                        <TouchableOpacity
                            style={[styles.pill, viewMode === 'today' ? { backgroundColor: theme.colors.primary } : null]}
                            onPress={() => setViewMode('today')}
                        >
                            <Text style={[styles.pillText, { color: viewMode === 'today' ? theme.colors.onPrimary : theme.colors.onSurfaceVariant }]}>
                                Today
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.pill, viewMode === 'week' ? { backgroundColor: theme.colors.primary } : null]}
                            onPress={() => setViewMode('week')}
                        >
                            <Text style={[styles.pillText, { color: viewMode === 'week' ? theme.colors.onPrimary : theme.colors.onSurfaceVariant }]}>
                                Week
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.pill, viewMode === 'month' ? { backgroundColor: theme.colors.primary } : null]}
                            onPress={() => setViewMode('month')}
                        >
                            <Text style={[styles.pillText, { color: viewMode === 'month' ? theme.colors.onPrimary : theme.colors.onSurfaceVariant }]}>
                                Month
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={goToNext} style={[styles.navArrow, { backgroundColor: theme.colors.surface }]}>
                        <Ionicons name="chevron-forward" size={24} color={theme.colors.onSurfaceVariant} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
    todayContent: {
        padding: 16,
    },
    primaryTile: {
        borderRadius: 32,
        padding: 24,
        height: 220,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 12, // High elevation for floating effect
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        transform: [{ translateY: -4 }], // Floating offset
    },
    tileLeftStrip: {
        width: 60,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderRightWidth: 1,
        borderRightColor: '#00000008',
    },
    statusIconBox: {
        width: 36,
        height: 36,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    categoryIconColumn: {
        alignItems: 'center',
    },
    miniIconCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tileMainContent: {
        flex: 1,
        paddingLeft: 24,
        justifyContent: 'center',
        alignItems: 'center', // Center text
    },
    tileDateRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    largeDateText: {
        fontSize: 110,
        fontWeight: '800',
        lineHeight: 110,
    },
    dateSuffix: {
        fontSize: 24,
        fontWeight: '700',
        marginTop: 15,
        marginLeft: 4,
    },
    dayNameText: {
        fontSize: 28,
        fontWeight: '700',
        marginTop: -10,
    },
    tileBottomRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 15,
        paddingHorizontal: 20,
    },
    timeDisplay: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    timeText: {
        fontSize: 32,
        fontWeight: '800',
    },
    ampmSmall: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 4,
    },
    monthLabel: {
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 2,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 32,
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    sectionLabelWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sectionIndicator: {
        width: 4,
        height: 24,
        borderRadius: 2,
        marginRight: 12,
    },
    scheduleItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 24,
        marginBottom: 16,
        elevation: 6, // Floating effect
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        transform: [{ translateY: -2 }], // Floating offset
    },
    itemTimeSection: {
        width: 65,
        alignItems: 'center',
    },
    itemTimeMain: {
        fontSize: 16,
        fontWeight: '800',
        color: '#000000',
    },
    itemTimeSub: {
        fontSize: 10,
        fontWeight: '700',
        color: '#00000088',
        marginTop: -2,
    },
    itemDivider: {
        width: 1,
        height: 30,
        backgroundColor: '#00000015',
        marginHorizontal: 12,
    },
    itemIconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000000',
        flex: 1,
    },
    weekContent: {
        padding: 16,
    },
    weekScrollContent: {
        paddingRight: 32,
        paddingBottom: 8,
    },
    weekDayColumn: {
        width: 100,
        height: 140,
        borderRadius: 24,
        marginRight: 12,
        padding: 12,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    weekEventsPreview: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 4,
        marginTop: 8,
    },
    weekIconCircle: {
        width: 14,
        height: 14,
        borderRadius: 7,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.03)',
    },
    weekDayDetail: {
        marginTop: 24,
        paddingTop: 24,
        borderTopWidth: 1,
        borderTopColor: '#00000008',
    },
    weekDayCard: {
        borderRadius: 24,
        overflow: 'hidden',
        marginBottom: 16,
    },
    weekDateHeader: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#00000008',
    },
    weekEventsBucket: {
        padding: 16,
        gap: 12,
    },
    weekEventRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    tinyTypeIndicator: {
        width: 4,
        height: 16,
        borderRadius: 2,
        marginRight: 12,
    },
    monthContent: {
        padding: 16,
    },
    yearHeader: {
        marginBottom: 20,
    },
    monthGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
    },
    monthCard: {
        width: (width - 44) / 2,
        padding: 16,
        borderRadius: 28,
        minHeight: 230,
        marginBottom: 16,
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
        transform: [{ translateY: -3 }], // Floating effect
    },
    weekdayHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
        paddingHorizontal: 2,
    },
    miniWeekdayText: {
        fontSize: 8,
        fontWeight: '900',
        color: '#00000088',
        width: (width - 44) / 14 - 4, // Match miniGridCell width
        textAlign: 'center',
    },
    miniGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 2,
    },
    miniGridCell: {
        width: (width - 76) / 14 - 1,
        height: 18,
        backgroundColor: 'rgba(0,0,0,0.04)',
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.5,
        borderColor: 'rgba(0,0,0,0.02)',
    },
    miniGridText: {
        fontSize: 8,
        fontWeight: '600',
    },
    bottomNav: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingTop: 12,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        zIndex: 1000, // Top layer
    },
    navControls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    navArrow: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pillContainer: {
        flex: 1,
        flexDirection: 'row',
        borderRadius: 25,
        padding: 4,
        marginHorizontal: 12,
    },
    pill: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 20,
        alignItems: 'center',
    },
    pillText: {
        fontSize: 14,
        fontWeight: '700',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    emojiText: {
        fontSize: 48,
        marginBottom: 16,
    },
    backToToday: {
        position: 'absolute',
        right: 24,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 25,
        zIndex: 100,
    }
});
