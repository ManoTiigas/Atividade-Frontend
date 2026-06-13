// src/screens/TaskFormScreen.tsx
import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform, Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { Priority, TaskStatus, RootStackParamList } from '../types/Task';
import { taskApi, ApiError } from '../services/api';
import {
  colors, spacing, radius, fontSize, fontWeight,
  priorityColor, priorityDimColor, priorityLabel,
  statusColor, statusDimColor, statusLabel,
} from '../theme';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Form'>;
  route: RouteProp<RootStackParamList, 'Form'>;
};

interface FormErrors {
  title?: string;
  description?: string;
}

export function TaskFormScreen({ navigation, route }: Props) {
  const editingTask = route.params?.task;
  const isEditing = Boolean(editingTask);

  // Form state
  const [title, setTitle] = useState(editingTask?.title ?? '');
  const [description, setDescription] = useState(editingTask?.description ?? '');
  const [priority, setPriority] = useState<Priority>(editingTask?.priority ?? 'medium');
  const [status, setStatus] = useState<TaskStatus>(editingTask?.status ?? 'pending');
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  function validate(): boolean {
    const newErrors: FormErrors = {};
    if (!title.trim()) newErrors.title = 'Título é obrigatório';
    else if (title.trim().length > 120) newErrors.title = 'Máximo 120 caracteres';
    if (description.length > 500) newErrors.description = 'Máximo 500 caracteres';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setSubmitting(true);

    const dto = {
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      status,
    };

    try {
      if (isEditing && editingTask) {
        await taskApi.update(editingTask.id, dto);
      } else {
        await taskApi.create(dto);
      }
      navigation.goBack();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Erro ao salvar tarefa';

      // Se a API retornar erros de campo, mapear para o form
      if (err instanceof ApiError && err.details?.length) {
        const fieldErrors: FormErrors = {};
        for (const d of err.details) {
          if (d.field === 'title') fieldErrors.title = d.message;
          if (d.field === 'description') fieldErrors.description = d.message;
        }
        setErrors(fieldErrors);
      } else {
        Alert.alert('Erro', msg);
      }
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
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={s.headerTitle}>
            {isEditing ? 'Editar Tarefa' : 'Nova Tarefa'}
          </Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={s.body}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

          {/* Title field */}
          <View style={s.field}>
            <Text style={s.label}>TÍTULO *</Text>
            <TextInput
              style={[s.input, errors.title ? s.inputError : null]}
              value={title}
              onChangeText={v => { setTitle(v); setErrors(p => ({ ...p, title: undefined })); }}
              placeholder="Ex: Implementar autenticação JWT"
              placeholderTextColor={colors.text3}
              maxLength={121}
              returnKeyType="next"
              autoFocus
            />
            {errors.title && <Text style={s.errorMsg}>{errors.title}</Text>}
            <Text style={s.counter}>{title.length}/120</Text>
          </View>

          {/* Description field */}
          <View style={s.field}>
            <Text style={s.label}>DESCRIÇÃO</Text>
            <TextInput
              style={[s.input, s.inputMulti, errors.description ? s.inputError : null]}
              value={description}
              onChangeText={v => { setDescription(v); setErrors(p => ({ ...p, description: undefined })); }}
              placeholder="Detalhes opcionais..."
              placeholderTextColor={colors.text3}
              multiline
              numberOfLines={3}
              maxLength={501}
              textAlignVertical="top"
            />
            {errors.description && <Text style={s.errorMsg}>{errors.description}</Text>}
            <Text style={s.counter}>{description.length}/500</Text>
          </View>

          {/* Priority selector */}
          <View style={s.field}>
            <Text style={s.label}>PRIORIDADE</Text>
            <View style={s.optionRow}>
              {(['low', 'medium', 'high'] as Priority[]).map(p => {
                const isSelected = priority === p;
                return (
                  <TouchableOpacity
                    key={p}
                    style={[
                      s.optionBtn,
                      isSelected && {
                        borderColor: priorityColor[p],
                        backgroundColor: priorityDimColor[p],
                      },
                    ]}
                    onPress={() => setPriority(p)}
                  >
                    <Text
                      style={[
                        s.optionText,
                        isSelected && { color: priorityColor[p], fontWeight: fontWeight.semibold },
                      ]}
                    >
                      {priorityLabel[p]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Status selector */}
          <View style={s.field}>
            <Text style={s.label}>STATUS</Text>
            <View style={s.statusGrid}>
              {(['pending', 'in_progress', 'done'] as TaskStatus[]).map(st => {
                const isSelected = status === st;
                return (
                  <TouchableOpacity
                    key={st}
                    style={[
                      s.statusBtn,
                      isSelected && {
                        borderColor: statusColor[st],
                        backgroundColor: statusDimColor[st],
                      },
                    ]}
                    onPress={() => setStatus(st)}
                  >
                    <Text
                      style={[
                        s.statusText,
                        isSelected && { color: statusColor[st], fontWeight: fontWeight.semibold },
                      ]}
                    >
                      {statusLabel[st]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Submit */}
          <TouchableOpacity
            style={[s.submitBtn, submitting && s.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={submitting}
            activeOpacity={0.85}
          >
            {submitting ? (
              <ActivityIndicator color={colors.white} size="small" />
            ) : (
              <>
                <Ionicons
                  name={isEditing ? 'checkmark-circle-outline' : 'add-circle-outline'}
                  size={18}
                  color={colors.white}
                />
                <Text style={s.submitText}>
                  {isEditing ? 'Salvar alterações' : 'Criar tarefa'}
                </Text>
              </>
            )}
          </TouchableOpacity>

          {isEditing && (
            <TouchableOpacity
              style={s.cancelBtn}
              onPress={() => navigation.goBack()}
            >
              <Text style={s.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          )}

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
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnDisabled: {
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
