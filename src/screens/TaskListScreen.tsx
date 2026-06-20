import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import {
  Task,
  TaskStatus,
  RootStackParamList,
} from '../types/Task';

import { TaskCard } from '../components/TaskCard';
import { useTasks } from '../hooks/useTasks';

import {
  colors,
  spacing,
  radius,
  fontSize,
  fontWeight,
  statusColor,
  statusLabel,
} from '../theme';

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    'List'
  >;
};

type Filter = TaskStatus | 'all';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'Todas' },
  { key: 'pending', label: 'Pendentes' },
  { key: 'in_progress', label: 'Em progresso' },
  { key: 'done', label: 'Concluídas' },
];

export function TaskListScreen({
  navigation,
}: Props) {
  const {
    tasks,
    loading,
    error,
    fetchTasks,
    deleteTask,
  } = useTasks();

  const [filter, setFilter] =
    useState<Filter>('all');

  const visible = useMemo(() => {
    if (filter === 'all') return tasks;

    return tasks.filter(
      (task) => task.status === filter
    );
  }, [tasks, filter]);

  const stats = useMemo<
    Record<TaskStatus, number>
  >(
    () => ({
      done: tasks.filter(
        (t) => t.status === 'done'
      ).length,

      in_progress: tasks.filter(
        (t) => t.status === 'in_progress'
      ).length,

      pending: tasks.filter(
        (t) => t.status === 'pending'
      ).length,
    }),
    [tasks]
  );

  function handleDelete(task: Task) {
    Alert.alert(
      'Excluir tarefa',
      `"${task.title}" será removida permanentemente.`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            const ok = await deleteTask(
              task.id
            );

            if (!ok) {
              Alert.alert(
                'Erro',
                'Não foi possível excluir a tarefa.'
              );
            }
          },
        },
      ]
    );
  }

  if (error) {
    return (
      <SafeAreaView style={s.center}>
        <Text style={s.errorTitle}>
          Sem conexão
        </Text>

        <Text style={s.errorSub}>
          {error}
        </Text>

        <TouchableOpacity
          style={s.retryBtn}
          onPress={fetchTasks}
        >
          <Text style={s.retryText}>
            Tentar novamente
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.container}>
      <View style={s.header}>
        <Text style={s.heading}>
          Minhas Tarefas
        </Text>

        <Text style={s.subheading}>
          {stats.pending === 0
            ? 'Tudo em dia ✅'
            : `${stats.pending} pendente${
                stats.pending > 1 ? 's' : ''
              }`}
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.statsRow}
      >
        {(
          [
            'done',
            'in_progress',
            'pending',
          ] as TaskStatus[]
        ).map((status) => (
          <TouchableOpacity
            key={status}
            style={s.statCard}
            onPress={() =>
              setFilter(status)
            }
            activeOpacity={0.75}
          >
            <Text
              style={[
                s.statNumber,
                {
                  color:
                    statusColor[status],
                },
              ]}
            >
              {stats[status]}
            </Text>

            <Text style={s.statLabel}>
              {statusLabel[status]}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.filterRow}
      >
        {FILTERS.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={[
              s.chip,
              filter === item.key &&
                s.chipActive,
            ]}
            onPress={() =>
              setFilter(item.key)
            }
          >
            <Text
              style={[
                s.chipLabel,
                filter === item.key &&
                  s.chipLabelActive,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading && tasks.length === 0 ? (
        <View style={s.center}>
          <ActivityIndicator
            size="large"
            color={colors.accent}
          />
        </View>
      ) : (
        <FlatList
          data={visible}
          keyExtractor={(item) => item.id}
          contentContainerStyle={
            s.listContent
          }
          showsVerticalScrollIndicator={
            false
          }
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={fetchTasks}
              tintColor={colors.accent}
            />
          }
          renderItem={({ item }) => (
            <TaskCard
              task={item}
              onEdit={() =>
                navigation.navigate(
                  'Form',
                  { task: item }
                )
              }
              onDelete={() =>
                handleDelete(item)
              }
            />
          )}
          ListEmptyComponent={
            <View style={s.empty}>
              <Text style={s.emptyIcon}>
                📭
              </Text>

              <Text style={s.emptyTitle}>
                Nenhuma tarefa aqui
              </Text>

              <Text style={s.emptySub}>
                {filter === 'all'
                  ? 'Toque no + para criar sua primeira tarefa'
                  : `Sem tarefas com status "${statusLabel[filter]}"`}
              </Text>
            </View>
          }
        />
      )}

      <TouchableOpacity
        style={s.fab}
        onPress={() =>
          navigation.navigate(
            'Form',
            undefined
          )
        }
        activeOpacity={0.85}
      >
        <Ionicons
          name="add"
          size={26}
          color={colors.white}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  center: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
    gap: spacing.md,
  },

  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },

  heading: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    letterSpacing: -0.5,
  },

  subheading: {
    fontSize: fontSize.sm,
    color: colors.text2,
    marginTop: 2,
  },

  statsRow: {
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
    paddingBottom: spacing.md,
  },

  statCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 90,
    alignItems: 'center',
  },

  statNumber: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
  },

  statLabel: {
    fontSize: fontSize.xs,
    color: colors.text2,
    marginTop: 2,
  },

  filterRow: {
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
    paddingBottom: spacing.md,
  },

  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm - 1,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },

  chipActive: {
    backgroundColor: colors.accentDim,
    borderColor: colors.accent,
  },

  chipLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.text2,
  },

  chipLabelActive: {
    color: colors.accentLight,
  },

  listContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: 100,
  },

  empty: {
    alignItems: 'center',
    paddingTop: 60,
    gap: spacing.sm,
  },

  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },

  emptyTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text2,
  },

  emptySub: {
    fontSize: fontSize.sm,
    color: colors.text3,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
    lineHeight: 20,
  },

  fab: {
    position: 'absolute',
    bottom: spacing.xxxl,
    right: spacing.xl,
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },

  errorTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text2,
  },

  errorSub: {
    fontSize: fontSize.sm,
    color: colors.text3,
    textAlign: 'center',
  },

  retryBtn: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    backgroundColor: colors.accentDim,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.accent,
  },

  retryText: {
    color: colors.accentLight,
    fontWeight: fontWeight.semibold,
    fontSize: fontSize.md,
  },
});