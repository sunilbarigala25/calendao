import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Dimensions } from 'react-native';
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
    const { theme, themeType } = useTheme();
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

    // Fallback mock data if no items exist for today
    const displayEvents = dayItems.length > 0 ? dayItems : [
        { id: 'm1', type: 'event', payload: { title: 'Product Review', startTime: '10:00 AM' } },
        { id: 'm2', type: 'todo', payload: { title: 'Buy Groceries', completed: true } },
        { id: 'm3', type: 'reminder', payload: { title: 'Evening Walk', time: '06:00 PM' } },
    ];

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

    // Animation values
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        fadeAnim.setValue(0);
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
        }).start();
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
    const currentMonthIndex = new Date().getMonth();
    const sortedMonths = [
        { name: months[currentMonthIndex], index: currentMonthIndex },
        ...months.map((name, index) => ({ name, index })).filter(m => m.index !== currentMonthIndex)
    ];

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
                                        <View style={[styles.miniIconCircle, { backgroundColor: '#E3F2FD' }]}>
                                            <Ionicons name="document-text" size={12} color="#1976D2" />
                                        </View>
                                        <View style={[styles.miniIconCircle, { backgroundColor: '#FFF9C4', marginTop: 8 }]}>
                                            <Ionicons name="notifications" size={12} color="#FBC02D" />
                                        </View>
                                        <View style={[styles.miniIconCircle, { backgroundColor: '#F3E5F5', marginTop: 8 }]}>
                                            <Ionicons name="star" size={12} color="#7B1FA2" />
                                        </View>
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
                                    Today's schedule
                                </Text>
                            </View>
                            <TouchableOpacity>
                                <Text style={[theme.typography.bodySmall, { color: theme.colors.primary, fontWeight: '600' }]}>View all</Text>
                            </TouchableOpacity>
                        </View>

                        {displayEvents.map((item: any) => {
                            const itemColor = getItemColor(item);
                            const contrastColor = getContrastColor(itemColor);
                            return (
                                <TouchableOpacity
                                    key={item.id}
                                    style={[styles.scheduleItem, { backgroundColor: itemColor }]}
                                    activeOpacity={0.8}
                                >
                                    <View style={styles.itemTimeSection}>
                                        <Text style={[styles.itemTimeMain, { color: contrastColor }]}>{item.payload.startTime || item.payload.time || '10:00'}</Text>
                                        <Text style={[styles.itemTimeSub, { color: contrastColor + '99' }]}>{item.payload.startTime?.includes('AM') || item.payload.time?.includes('AM') ? 'AM' : 'PM'}</Text>
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
                        })}
                    </Animated.View>
                )}

                {viewMode === 'week' && (
                    <View style={styles.weekContent}>
                        <Text style={[theme.typography.h2, { color: theme.colors.onSurface, marginBottom: 16 }]}>
                            {currentYear}
                        </Text>

                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.weekScrollContent}
                        >
                            {weekDates.map((date) => {
                                const dateStr = formatDate(date);
                                const isTodayDate = isToday(date);
                                const isSelected = selectedDate === dateStr;
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
                                            {isTodayDate ? (
                                                mockEvents.map(event => (
                                                    <View key={event.id} style={styles.weekIconDot}>
                                                        <View style={[styles.dotCircle, { backgroundColor: getItemColor(event) }]} />
                                                    </View>
                                                ))
                                            ) : (
                                                <Ionicons name="ellipsis-horizontal" size={16} color={theme.colors.divider} />
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>

                        {/* Detail area for selected day in week view */}
                        <View style={styles.weekDayDetail}>
                            <Text style={[theme.typography.h3, { color: theme.colors.onSurface, marginBottom: 12 }]}>
                                {parseDate(selectedDate).toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </Text>
                            {dayItems.length > 0 ? (
                                dayItems.map(item => (
                                    <View key={item.id} style={[styles.scheduleItem, { backgroundColor: getItemColor(item) }]}>
                                        <Text style={{ color: getContrastColor(getItemColor(item)), fontWeight: '700' }}>{item.payload.title}</Text>
                                    </View>
                                ))
                            ) : (
                                <Text style={[theme.typography.body, { color: theme.colors.onSurfaceVariant, fontStyle: 'italic' }]}>Nothing scheduled</Text>
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
                                            isPresentMonth && { width: '100%', height: 200, borderWidth: 3, borderColor: theme.colors.primary }
                                        ]}
                                        activeOpacity={0.8}
                                        onPress={() => {
                                            const firstOfMonth = new Date(currentYear, m.index, 1);
                                            setSelectedDate(formatDate(firstOfMonth));
                                            setViewMode('today');
                                        }}
                                    >
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                            <Text style={[theme.typography.h3, { color: '#000', fontSize: isPresentMonth ? 24 : 18 }]}>{m.name}</Text>
                                            {isPresentMonth && (
                                                <View style={{ backgroundColor: theme.colors.primary, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 }}>
                                                    <Text style={{ color: '#FFF', fontSize: 10, fontWeight: '800' }}>PRESENT</Text>
                                                </View>
                                            )}
                                        </View>
                                        <View style={[styles.miniGrid, isPresentMonth && { gap: 4 }]}>
                                            {Array.from({ length: firstDay }).map((_, i) => (
                                                <View key={`pad-${i}`} style={[styles.miniGridCell, { backgroundColor: 'transparent' }]} />
                                            ))}
                                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                                const isTodayInGrid = isPresentMonth && (i + 1) === new Date().getDate();
                                                return (
                                                    <View key={i} style={[
                                                        styles.miniGridCell,
                                                        isPresentMonth && { width: (width - 100) / 7, height: 24 },
                                                        isTodayInGrid && { backgroundColor: theme.colors.primary }
                                                    ]}>
                                                        <Text style={[
                                                            styles.miniGridText,
                                                            { color: isTodayInGrid ? '#FFF' : '#00000088' },
                                                            isPresentMonth && { fontSize: 12 }
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
                            bottom: insets.bottom + 140,
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
                    backgroundColor: themeType === 'glass' ? 'rgba(255,255,255,0.7)' : theme.colors.secondaryContainer, // Distinct color
                    paddingBottom: insets.bottom + 16,
                    minHeight: 80 + insets.bottom,
                    borderTopWidth: 2,
                    borderTopColor: theme.colors.primary, // Primary color border for visibility
                    ...theme.shadows.large,
                    elevation: 20,
                    zIndex: 2000,
                },
                themeType === 'glass' && { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.3)' }
            ]}>
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
        marginBottom: 12,
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
        padding: 12,
        borderRadius: 24,
        height: 180,
    },
    miniGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 2,
    },
    miniGridCell: {
        width: (width - 44) / 14 - 4, // 7 columns
        height: 20,
        backgroundColor: '#00000008',
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
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
