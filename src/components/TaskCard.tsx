import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task } from '../types/Task';
import { StatusBadge, PriorityDot } from './StatusBadge';
import { colors, spacing, radius, fontSize, fontWeight, priorityColor } from '../theme';

interface Props {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
}

export function TaskCard({ task, onEdit, onDelete }: Props) {
  return (
    <Pressable style={({ pressed }) => [s.card, pressed && s.pressed]} onPress={onEdit}>
      <View style={[s.bar, { backgroundColor: priorityColor[task.priority] }]} />

      <View style={s.content}>
        <View style={s.top}>
          <PriorityDot priority={task.priority} />
          <Text
            style={[s.title, task.status === 'done' && s.titleDone]}
            numberOfLines={2}
          >
            {task.title}
          </Text>
        </View>

        {task.description ? (
          <Text style={s.description} numberOfLines={2}>{task.description}</Text>
        ) : null}

        <View style={s.footer}>
          <StatusBadge status={task.status} />
          <View style={s.actions}>
            <TouchableOpacity style={s.iconBtn} onPress={onEdit} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="pencil-outline" size={14} color={colors.text2} />
            </TouchableOpacity>
            <TouchableOpacity style={[s.iconBtn, s.iconBtnDelete]} onPress={onDelete} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="trash-outline" size={14} color={colors.red} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    marginBottom: spacing.sm + 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: { opacity: 0.85 },
  bar: { width: 3 },
  content: { flex: 1, padding: spacing.md, gap: spacing.sm },
  top: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  title: { flex: 1, fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: colors.text, lineHeight: 20 },
  titleDone: { textDecorationLine: 'line-through', color: colors.text3 },
  description: { fontSize: fontSize.sm, color: colors.text2, lineHeight: 18 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.xs },
  actions: { flexDirection: 'row', gap: spacing.sm },
  iconBtn: { width: 28, height: 28, borderRadius: radius.sm, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' },
  iconBtnDelete: { backgroundColor: colors.redDim },
});
