'use client';

import React, { useCallback, useState } from 'react';
import uuid from 'react-uuid';
import { FaPlus } from 'react-icons/fa6';
import useMyModalStore from '@/stores/my.modal.store';
import { FaCircle } from 'react-icons/fa';
import ColorModal from './ColorModal';
import useColorStore from '@/stores/color.stor';

type Todo = {
  id: string;
  text: string;
  isDone: boolean;
};

const Todolist: React.FC = () => {
  const [todoInput, setTodoInput] = useState<string>('');
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>('');

  const { isTenMinPlanerColorModalOpen, toggleTenMinPlanerColorModal } = useMyModalStore((state) => state);
  const { color } = useColorStore((state) => state);
  console.log(color);

  const updateTodoInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodoInput(e.target.value);
  };

  const addTodo = () => {
    if (todoInput.trim() === '') return;

    const nextTodo: Todo = { id: uuid(), text: todoInput, isDone: false };
    setTodoList((prev) => [...prev, nextTodo]);
    setTodoInput('');
  };

  const toggleTodoCompletion = (id: string) => {
    setTodoList(todoList.map((todo) => (id === todo.id ? { ...todo, isDone: !todo.isDone } : todo)));
  };

  const removeTodo = (id: string) => {
    setTodoList(todoList.filter((todo) => id !== todo.id));
    // setModal(true);
  };

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditingText(todo.text);
  };

  const handleEditingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingText(e.target.value);
  };

  const submitEdit = (id: string, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setTodoList(todoList.map((todo) => (todo.id === id ? { ...todo, text: editingText } : todo)));
      setEditingId(null);
      setEditingText('');
    }
  };

  const submitOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTodo();
      setTodoInput('');
    }
  };

  const handleColorModal = (id: string) => {
    alert(`컬러 선택 모달 ${id}`);
    toggleTenMinPlanerColorModal();
  };

  return (
    <div className="border-2 border-gray-500 h-96">
      <h2>todolist</h2>
      <div className="w-ful">
        <ul className="relative">
          {todoList.map((todo) => {
            return (
              <li key={todo.id} className={`flex flex-row border ${todo.isDone ? 'bg-yellow-400' : 'no-underline'}`}>
                <span onClick={() => handleColorModal(todo.id)} className={`text-${color}`}>
                  <FaCircle />
                </span>
                <input type="checkbox" onClick={() => toggleTodoCompletion(todo.id)} />
                {editingId === todo.id ? (
                  <input
                    type="text"
                    value={editingText}
                    onChange={handleEditingChange}
                    onKeyUp={(e) => submitEdit(todo.id, e)}
                  />
                ) : (
                  <span onClick={() => startEditing(todo)}>{todo.text}</span>
                )}
                <button onClick={() => removeTodo(todo.id)} className="absolute right-1">
                  ✕
                </button>
              </li>
            );
          })}
        </ul>
        <div className="w-full">
          <input type="text" value={todoInput} onChange={updateTodoInput} onKeyUp={submitOnEnter} className="w-11/12" />
          <button onClick={addTodo}>
            <FaPlus />
          </button>
        </div>
      </div>
      {isTenMinPlanerColorModalOpen && <ColorModal />}
    </div>
  );
};

export default Todolist;
