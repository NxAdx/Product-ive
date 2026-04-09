import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';
import { useTheme } from '../theme/ThemeContext';

interface HeatmapDataPoint {
  date: string; // ISO YYYY-MM-DD
  count: number;
}

interface HeatmapProps {
  data: HeatmapDataPoint[];
}

const WEEKS = 12;
const DAYS_PER_WEEK = 7;
const TOTAL_DAYS = WEEKS * DAYS_PER_WEEK;

export function HistoryHeatmap({ data }: HeatmapProps) {
  const t = useTheme();
  const [containerWidth, setContainerWidth] = React.useState(0);

  const grid = useMemo(() => {
    const cells = [];
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - TOTAL_DAYS + 1);
    
    const dataMap = new Map(data.map(d => [d.date, d.count]));

    for (let i = 0; i < TOTAL_DAYS; i++) {
      const current = new Date(start);
      current.setDate(start.getDate() + i);
      const dateStr = current.toISOString().split('T')[0];
      const count = dataMap.get(dateStr) || 0;
      
      cells.push({
        id: dateStr,
        level: count === 0 ? 0 : count < 2 ? 1 : count < 4 ? 2 : 3,
        day: current.getDay(),
      });
    }
    return cells;
  }, [data]);

  const getColor = (level: number) => {
    switch (level) {
      case 3: return t.positivity;
      case 2: return t.isDark ? 'rgba(0, 255, 127, 0.6)' : 'rgba(0, 200, 100, 0.6)';
      case 1: return t.isDark ? 'rgba(0, 255, 127, 0.2)' : 'rgba(0, 200, 100, 0.2)';
      default: return t.isDark ? '#111' : '#f0f0f0';
    }
  };

  const gap = 3;
  const cellSize = containerWidth > 0 
    ? Math.floor((containerWidth - (WEEKS * gap)) / WEEKS) 
    : 20;

  return (
    <View 
      style={styles.container} 
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      <View style={[styles.grid, { height: (cellSize + gap) * DAYS_PER_WEEK }]}>
        {grid.map((cell) => (
          <View 
            key={cell.id} 
            style={[
              styles.cell, 
              { 
                width: cellSize,
                height: cellSize,
                backgroundColor: getColor(cell.level),
                borderColor: t.isDark ? '#000' : '#fff'
              }
            ]} 
          />
        ))}
      </View>
      <View style={styles.footer}>
        <ThemedText variant="caption" color={t.textSecondary}>Last 12 Weeks</ThemedText>
        <View style={styles.legend}>
          <ThemedText variant="caption" color={t.textSecondary} style={{ marginRight: 4 }}>Less</ThemedText>
          <View style={[styles.cellSmall, { backgroundColor: getColor(0) }]} />
          <View style={[styles.cellSmall, { backgroundColor: getColor(1) }]} />
          <View style={[styles.cellSmall, { backgroundColor: getColor(2) }]} />
          <View style={[styles.cellSmall, { backgroundColor: getColor(3) }]} />
          <ThemedText variant="caption" color={t.textSecondary} style={{ marginLeft: 4 }}>More</ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    width: '100%',
  },
  grid: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    gap: 3,
  },
  cell: {
    borderRadius: 2,
    borderWidth: 0.5,
  },
  cellSmall: {
    width: 8,
    height: 8,
    borderRadius: 1,
    marginHorizontal: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
  }
});
