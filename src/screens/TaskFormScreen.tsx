import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import {
  Priority,
  TaskStatus,
  RootStackParamList,
} from '../types/Task';

import { taskApi } from '../services/api';

import {
  colors,
  spacing,
  radius,
  fontSize,
  fontWeight,
  priorityColor,
  priorityDimColor,
  priorityLabel,
  statusColor,
  statusDimColor,
  statusLabel,
} from '../theme';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Form'>;
  route: RouteProp<RootStackParamList, 'Form'>;
};

export function TaskFormScreen({ navigation, route }: Props) {
  const editing = route.params?.task;

  const [title, setTitle] = useState(editing?.title ?? '');
  const [description, setDescription] = useState(
    editing?.description ?? ''
  );
  const [priority, setPriority] = useState<Priority>(
    editing?.priority ?? 'medium'
  );
  const [status, setStatus] = useState<TaskStatus>(
    editing?.status ?? 'pending'
  );

  const [titleError, setTitleError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!title.trim()) {
      setTitleError('Título é obrigatório');
      return;
    }

    if (title.trim().length > 120) {
      setTitleError('Máximo 120 caracteres');
      return;
    }

    setSubmitting(true);

    try {
      const dto = {
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        status,
      };

      if (editing) {
        await taskApi.update(editing.id, dto);
      } else {
        await taskApi.create(dto);
      }

      navigation.goBack();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Não foi possível salvar a tarefa.';

      Alert.alert('Erro', message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={s.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={s.header}>
          <TouchableOpacity
            style={s.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Ionicons
              name="chevron-back"
              size={20}
              color={colors.text}
            />
          </TouchableOpacity>

          <Text style={s.headerTitle}>
            {editing ? 'Editar Tarefa' : 'Nova Tarefa'}
          </Text>

          <View style={{ width: 36 }} />
        </View>

        <ScrollView
          contentContainerStyle={s.body}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={s.field}>
            <Text style={s.label}>TÍTULO *</Text>

            <TextInput
              style={[
                s.input,
                titleError ? s.inputError : undefined,
              ]}
              value={title}
              onChangeText={(value) => {
                setTitle(value);
                setTitleError('');
              }}
              placeholder="Ex: Implementar autenticação"
              placeholderTextColor={colors.text3}
              maxLength={120}
              autoFocus
            />

            {!!titleError && (
              <Text style={s.errorMsg}>{titleError}</Text>
            )}

            <Text style={s.counter}>{title.length}/120</Text>
          </View>

          <View style={s.field}>
            <Text style={s.label}>DESCRIÇÃO</Text>

            <TextInput
              style={[s.input, s.inputMulti]}
              value={description}
              onChangeText={setDescription}
              placeholder="Detalhes opcionais..."
              placeholderTextColor={colors.text3}
              multiline
              numberOfLines={3}
              maxLength={500}
              textAlignVertical="top"
            />
          </View>

          <View style={s.field}>
            <Text style={s.label}>PRIORIDADE</Text>

            <View style={s.optionRow}>
              {(['low', 'medium', 'high'] as Priority[]).map(
                (item) => (
                  <TouchableOpacity
                    key={item}
                    style={[
                      s.optionBtn,
                      priority === item && {
                        borderColor: priorityColor[item],
                        backgroundColor:
                          priorityDimColor[item],
                      },
                    ]}
                    onPress={() => setPriority(item)}
                  >
                    <Text
                      style={[
                        s.optionText,
                        priority === item && {
                          color: priorityColor[item],
                          fontWeight:
                            fontWeight.semibold,
                        },
                      ]}
                    >
                      {priorityLabel[item]}
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </View>
          </View>

          <View style={s.field}>
            <Text style={s.label}>STATUS</Text>

            <View style={s.statusGrid}>
              {(
                ['pending', 'in_progress', 'done'] as TaskStatus[]
              ).map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[
                    s.statusBtn,
                    status === item && {
                      borderColor: statusColor[item],
                      backgroundColor:
                        statusDimColor[item],
                    },
                  ]}
                  onPress={() => setStatus(item)}
                >
                  <Text
                    style={[
                      s.statusText,
                      status === item && {
                        color: statusColor[item],
                        fontWeight:
                          fontWeight.semibold,
                      },
                    ]}
                  >
                    {statusLabel[item]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={[
              s.submitBtn,
              submitting && s.submitDisabled,
            ]}
            onPress={handleSubmit}
            disabled={submitting}
            activeOpacity={0.85}
          >
            {submitting ? (
              <ActivityIndicator
                color={colors.white}
                size="small"
              />
            ) : (
              <>
                <Ionicons
                  name={
                    editing
                      ? 'checkmark-circle-outline'
                      : 'add-circle-outline'
                  }
                  size={18}
                  color={colors.white}
                />

                <Text style={s.submitText}>
                  {editing
                    ? 'Salvar alterações'
                    : 'Criar tarefa'}
                </Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={s.cancelBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={s.cancelText}>Cancelar</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  backBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },

  body: {
    padding: spacing.xl,
    gap: spacing.xl,
    paddingBottom: 48,
  },

  field: {
    gap: spacing.sm - 2,
  },

  label: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.text2,
    letterSpacing: 0.8,
  },

  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    color: colors.text,
    fontSize: fontSize.md,
  },

  inputMulti: {
    minHeight: 80,
    paddingTop: spacing.md,
  },

  inputError: {
    borderColor: colors.red,
  },

  errorMsg: {
    fontSize: fontSize.xs,
    color: colors.red,
    marginTop: 2,
  },

  counter: {
    fontSize: fontSize.xs,
    color: colors.text3,
    textAlign: 'right',
  },

  optionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },

  optionBtn: {
    flex: 1,
    paddingVertical: spacing.md - 2,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },

  optionText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.text2,
  },

  statusGrid: {
    gap: spacing.sm,
  },

  statusBtn: {
    paddingVertical: spacing.md - 2,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },

  statusText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.text2,
  },

  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: spacing.md + 2,
    marginTop: spacing.sm,
  },

  submitDisabled: {
    opacity: 0.6,
  },

  submitText: {
    color: colors.white,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },

  cancelBtn: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },

  cancelText: {
    fontSize: fontSize.md,
    color: colors.text3,
  },
});