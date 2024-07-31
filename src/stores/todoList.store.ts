import { create } from 'zustand';

export interface TodoObjectType {
  id: string;
  text: string;
  isDone: boolean;
  color: string;
  planer_id: string;
}

interface TodoListStoreType {
  todo: TodoObjectType;
  todoId: string;
  todoList: TodoObjectType[];
  editingId: string | null;
  editingText: string;
  selectTodo: (todo: TodoObjectType) => void;
  addTodo: (todo: TodoObjectType) => void;
  removeTodo: (id: string) => void;
  setTodoList: (todoLis: TodoObjectType[]) => void;
  editTodo: (id: string, text: string) => void;
  selectTodoId: (id: string) => void;
  toggleTodoCompletion: (id: string) => void;
  changeTodoColor: (id: string, newColor: string) => void;
  startEditing: (id: string) => void;
  stopEditing: () => void;
}

const useTodoListStore = create<TodoListStoreType>((set) => ({
  todo: { id: '', text: '', isDone: false, color: '', planer_id: '' },
  todoId: '',
  todoList: [],
  editingId: null,
  editingText: '',
  // todo 전달
  selectTodo: (todo: TodoObjectType) =>
    set(() => ({
      todo: todo
    })),

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
  // 완전 새로운 todolist 넣기
  setTodoList: (newTodoList: TodoObjectType[]) =>
    set(() => ({
      todoList: newTodoList
    })),
  // 편집 todo 업데이트
  editTodo: (id, text) =>
    set((state) => ({
      todoList: state.todoList.map((todo) => (todo.id === id ? { ...todo, text: text } : todo)),
      editingText: text
    })),
  // todo Id 전달
  selectTodoId: (id) =>
    set(() => ({
      todoId: id
    })),
  // todo isDone 요소 변경
  toggleTodoCompletion: (id) =>
    set((state) => ({
      todoList: state.todoList.map((todo) => (todo.id === id ? { ...todo, isDone: !todo.isDone } : todo))
    })),
  // todo color 요소 변경
  changeTodoColor: (id, newColor) =>
    set((state) => ({
      todoList: state.todoList.map((todo) => (todo.id === id ? { ...todo, color: newColor } : todo))
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
    })
}));
export default useTodoListStore;
