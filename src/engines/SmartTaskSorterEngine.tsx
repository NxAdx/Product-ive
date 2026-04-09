import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, TextInput } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { RuleConfig } from '../data/rules';
import { useSessionStore } from '../store/sessionStore';
import { useTodoStore } from '../store/todoStore';
import { Plus, Trash2, CheckCircle, Zap } from 'lucide-react-native';
import { AppModal } from '../components/AppModal';

interface EngineProps {
  rule: RuleConfig;
  color: string;
}

/**
 * SmartTaskSorterEngine
 * Powers rules: Eat the Frog, 1-3-5 Rule, 80/20 Pareto
 * Helps users select and prioritize tasks for the session
 */
export function SmartTaskSorterEngine({ rule, color }: EngineProps) {
  const t = useTheme();
  const session = useSessionStore();
  const todoStore = useTodoStore();
  const [sessionTasks, setSessionTasks] = useState<typeof todoStore.todos>([]);
  const [newTask, setNewTask] = useState('');
  const [sessionStarted, setSessionStarted] = useState(false);
  const [modal, setModal] = useState<{ visible: boolean; title: string; description: string } | null>(null);

  // Get rule-specific task limits
  const getTaskLimit = () => {
    switch (rule.id) {
      case 'eat_frog': return 1;        // One high-impact task
      case '1_3_5': return 5;           // 1 big, 3 medium, 1 small
      case '80_20': return 3;           // Top 3 tasks yielding 80% results
      default: return 3;
    }
  };

  const taskLimit = getTaskLimit();

  useEffect(() => {
    // Load tasks for this session
    const activeTasks = todoStore.getActiveTodos();
    setSessionTasks(activeTasks);
  }, [todoStore]);

  const handleAddTask = () => {
    if (!newTask.trim()) return;
    if (sessionTasks.length >= taskLimit) {
      setModal({
        visible: true,
        title: 'Limit Reached',
        description: `You can focus on max ${taskLimit} tasks for this rule.`,
      });
      return;
    }
    
    const newTodo = {
      id: Date.now().toString(),
      title: newTask,
      completed: false,
      ruleIds: [rule.id],
      priority: 'high' as const,
      createdAt: new Date().toISOString(),
      dueDate: undefined,
      completedAt: undefined,
    };
    
    setSessionTasks([...sessionTasks, newTodo]);
    setNewTask('');
  };

  const handleRemoveTask = (taskId: string) => {
    setSessionTasks(sessionTasks.filter(t => t.id !== taskId));
  };

  const handleCompleteTask = (taskId: string) => {
    setSessionTasks(sessionTasks.map(t =>
      t.id === taskId
        ? { ...t, completed: true, completedAt: new Date().toISOString() }
        : t
    ));
    
    // Sync back to todo store
    todoStore.toggleTodo(taskId);
  };

  const handleStartSession = () => {
    if (sessionTasks.length === 0) {
      setModal({
        visible: true,
        title: 'No Tasks Yet',
        description: 'Please add at least one task to focus on.',
      });
      return;
    }
    setSessionStarted(true);
    session.startSession(rule.id);
  };

  const handleEndSession = () => {
    session.endSession();
    setSessionStarted(false);
  };

  const completedCount = sessionTasks.filter(t => t.completed).length;
  const isAllComplete = completedCount === sessionTasks.length && sessionTasks.length > 0;

  if (!sessionStarted) {
    return (
      <>
        <View style={styles.planningMode}>
          {/* Instructions */}
          <View style={styles.instructionBox}>
            <Text style={[styles.instrTitle, { color: t.ink }]}>
              {rule.name}
            </Text>
            <Text style={[styles.instrDesc, { color: t.inkMid }]}>
              {rule.description}
            </Text>
            {rule.engineConfig.instructions && (
              <Text style={[styles.instrNote, { color: t.inkDim }]}>
                {rule.engineConfig.instructions}
              </Text>
            )}
            <Text style={[styles.taskLimit, { color }]}>
              Focus on {taskLimit} task{taskLimit > 1 ? 's' : ''}
            </Text>
          </View>

          {/* Task Input */}
          <View style={styles.inputGroup}>
            <View style={[styles.inputContainer, {
              backgroundColor: t.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
              borderColor: t.border
            }]}>
              <TextInput
                style={[styles.input, { color: t.ink }]}
                placeholder="Add a task..."
                placeholderTextColor={t.inkDim}
                value={newTask}
                onChangeText={setNewTask}
                editable={sessionTasks.length < taskLimit}
              />
              <Pressable
                onPress={handleAddTask}
                disabled={sessionTasks.length >= taskLimit}
                style={({ pressed }) => [
                  styles.addBtn,
                  {
                    backgroundColor: color,
                    opacity: sessionTasks.length >= taskLimit ? 0.5 : (pressed ? 0.8 : 1)
                  }
                ]}
              >
                <Plus size={18} color="#FFF" />
              </Pressable>
            </View>
          </View>

          {/* Task List */}
          {sessionTasks.length > 0 && (
            <FlatList
              data={sessionTasks}
              keyExtractor={item => item.id}
              scrollEnabled={false}
              renderItem={({ item, index }) => (
                <View style={[styles.taskItem, {
                  backgroundColor: t.isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                  borderColor: t.border
                }]}>
                  <Text style={[styles.taskNumber, { color }]}>
                    {index + 1}
                  </Text>
                  <Text style={[styles.taskTitle, { color: t.ink, flex: 1 }]}>
                    {item.title}
                  </Text>
                  <Pressable onPress={() => handleRemoveTask(item.id)}>
                    <Trash2 size={16} color={t.inkMid} />
                  </Pressable>
                </View>
              )}
              style={styles.taskList}
            />
          )}

          {/* Start Button */}
          {sessionTasks.length > 0 && (
            <Pressable
              onPress={handleStartSession}
              style={[styles.startBtn, { backgroundColor: color }]}
            >
              <Zap size={20} color="#FFF" />
              <Text style={styles.startBtnText}>Start Focus Session</Text>
            </Pressable>
          )}
        </View>
        <AppModal
          visible={modal?.visible || false}
          title={modal?.title || ''}
          description={modal?.description || ''}
          onClose={() => setModal(null)}
        />
      </>
    );
  }

  // During session
  return (
    <>
      <View style={styles.sessionMode}>
        {/* Progress */}
        <View style={[styles.progressDisplay, {
          backgroundColor: color + '15',
          borderColor: color + '40'
        }]}>
          <Text style={[styles.progressTitle, { color: t.ink }]}>
            Let&apos;s focus on {sessionTasks.length} task{sessionTasks.length !== 1 ? 's' : ''}
          </Text>
          <Text style={[styles.progressSub, { color: t.inkMid }]}>
            {completedCount} / {sessionTasks.length} completed
          </Text>
        </View>

        {/* Task Checklist */}
        <FlatList
          data={sessionTasks}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => handleCompleteTask(item.id)}
              style={[styles.checklistItem, {
                backgroundColor: item.completed ? (color + '20') : 'transparent',
                borderColor: item.completed ? color : t.border
              }]}
            >
              <View style={[
                styles.checkbox,
                {
                  backgroundColor: item.completed ? color : 'transparent',
                  borderColor: item.completed ? color : t.border
                }
              ]}>
                {item.completed && <CheckCircle size={20} color="#FFF" />}
              </View>
              <Text style={[
                styles.checklistText,
                {
                  color: item.completed ? t.inkMid : t.ink,
                  textDecorationLine: item.completed ? 'line-through' : 'none'
                }
              ]}>
                {item.title}
              </Text>
            </Pressable>
          )}
          scrollEnabled={false}
          style={styles.checklist}
        />

        {/* Action */}
        <Pressable
          onPress={handleEndSession}
          style={[styles.endBtn, {
            backgroundColor: isAllComplete ? color : t.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
          }]}
        >
          <Text style={[styles.endBtnText, { color: isAllComplete ? '#FFF' : t.ink }]}>
            {isAllComplete ? 'Complete Session' : 'End Session'}
          </Text>
        </Pressable>
      </View>
      <AppModal
        visible={modal?.visible || false}
        title={modal?.title || ''}
        description={modal?.description || ''}
        onClose={() => setModal(null)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  planningMode: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
    gap: 20,
  },
  instructionBox: {
    gap: 12,
    paddingVertical: 16,
  },
  instrTitle: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Manrope_700Bold',
  },
  instrDesc: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },
  instrNote: {
    fontSize: 12,
    lineHeight: 18,
    fontStyle: 'italic',
    marginTop: 8,
  },
  taskLimit: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 12,
  },
  inputGroup: {
    gap: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    paddingRight: 4,
    gap: 8,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
  },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  taskList: {
    flexGrow: 0,
    maxHeight: 200,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  taskNumber: {
    fontSize: 14,
    fontWeight: '700',
    minWidth: 24,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 18,
    marginTop: 12,
  },
  startBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
  },
  sessionMode: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
    gap: 20,
    justifyContent: 'space-between',
  },
  progressDisplay: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressSub: {
    fontSize: 13,
    marginTop: 6,
  },
  checklist: {
    flex: 1,
    gap: 12,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checklistText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  endBtn: {
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 12,
  },
  endBtnText: {
    fontSize: 15,
    fontWeight: '600',
  }
});

