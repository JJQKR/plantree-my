import { create } from 'zustand';

interface Todo {
  id: string;
  text: string;
  isDone: boolean;
  color: string;
}

interface TodoListStore {
  todoList: Todo[];
  editingId: string | null;
  editingText: string;
  addTodo: (todo: Todo) => void;
  removeTodo: (id: string) => void;
  toggleTodoCompletion: (id: string, newColor: string) => void;
  startEditing: (id: string) => void;
  stopEditing: () => void;
  editTodo: (id: string, text: string) => void;
}

const useTodoListStore = create<TodoListStore>((set) => ({
  todoList: [],
  editingId: null,
  editingText: '',
  // todo 추가
  addTodo: (todo) =>
    set((state) => ({
      todoList: [...state.todoList, todo]
    })),
  // todo 제거
  removeTodo: (id) =>
    set((state) => ({
      todoList: state.todoList.filter((todo) => todo.id !== id)
    })),
  // todo isDone 요소 변경
  toggleTodoCompletion: (id, newColor) =>
    set((state) => ({
      todoList: state.todoList.map((todo) =>
        todo.id === id ? { ...todo, isDone: !todo.isDone, color: newColor } : todo
      )
    })),
  // 특정 todo의 할 일을 편집 상태로 만들기
  startEditing: (id) =>
    set((state) => ({
      editingId: id,
      editingText: state.todoList.find((todo) => todo.id === id)?.text || ''
    })),
  // 편집 상태 종료 하기
  stopEditing: () =>
    set({
      editingId: null,
      editingText: ''
    }),
  // 편집 todo 업데이트
  editTodo: (id, text) =>
    set((state) => ({
      todoList: state.todoList.map((todo) => (todo.id === id ? { ...todo, text: text } : todo)),
      editingText: text
    }))
}));
export default useTodoListStore;
