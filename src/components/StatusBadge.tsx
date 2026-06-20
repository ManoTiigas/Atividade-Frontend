import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TaskStatus, Priority } from '../types/Task';
import {
  statusColor, statusDimColor, statusLabel,
  priorityColor, priorityLabel, priorityDimColor,
  fontSize, fontWeight, spacing, radius,
} from '../theme';

export function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <View style={[s.badge, { backgroundColor: statusDimColor[status] }]}>
      <Text style={[s.text, { color: statusColor[status] }]}>{statusLabel[status]}</Text>
    </View>
  );
}

export function PriorityDot({ priority }: { priority: Priority }) {
  return <View style={[s.dot, { backgroundColor: priorityColor[priority] }]} />;
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <View style={[s.badge, { backgroundColor: priorityDimColor[priority] }]}>
      <Text style={[s.text, { color: priorityColor[priority] }]}>{priorityLabel[priority]}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs - 1,
    borderRadius: radius.full,
  },
  text: { fontSize: fontSize.xs, fontWeight: fontWeight.semibold, letterSpacing: 0.3 },
  dot: { width: 8, height: 8, borderRadius: 4 },
});
