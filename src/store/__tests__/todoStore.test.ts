/* global describe, beforeEach, it, expect, jest */
import { usePositivityStore } from '../positivityStore';
import { useTodoStore } from '../todoStore';

jest.mock('../../db/sessionRepository', () => ({
  insertPointEvents: jest.fn().mockResolvedValue(undefined),
}));

function resetStores() {
  useTodoStore.setState(useTodoStore.getInitialState(), true);
  usePositivityStore.setState(usePositivityStore.getInitialState(), true);
}

describe('todoStore', () => {
  beforeEach(() => {
    resetStores();
  });

  it('adds todos and awards positivity points on completion', () => {
    const todoStore = useTodoStore.getState();
    todoStore.addTodo('Ship v1.0.1', [], 'high');

    const created = useTodoStore.getState().todos[0];
    expect(created).toBeDefined();
    expect(created?.title).toBe('Ship v1.0.1');
    expect(created?.completed).toBe(false);

    useTodoStore.getState().toggleTodo(created!.id);

    const updated = useTodoStore.getState().todos[0];
    expect(updated?.completed).toBe(true);
    expect(updated?.completedAt).toBeTruthy();
    expect(usePositivityStore.getState().weeklyScore).toBe(10);
  });
});
