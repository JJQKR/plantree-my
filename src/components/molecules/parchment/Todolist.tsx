'use client';

import React, { useCallback, useState } from 'react';
import uuid from 'react-uuid';
import { FaPlus } from 'react-icons/fa6';
import useMyModalStore from '@/stores/my.modal.store';
import { FaCircle } from 'react-icons/fa';
import ColorModal from './ColorModal';
import useColorStore from '@/stores/color.stor';
import useTodoListStore from '@/stores/todoList.stor';

const Todolist: React.FC = () => {
  const [todoInput, setTodoInput] = useState<string>('');

  const {
    todoList,
    editingId,
    editingText,
    addTodo,
    toggleTodoCompletion,
    removeTodo,
    startEditing,
    stopEditing,
    editTodo
  } = useTodoListStore((state) => state);
  const { isTenMinPlanerColorModalOpen, toggleTenMinPlanerColorModal } = useMyModalStore((state) => state);
  const { color: newColor } = useColorStore((state) => state);

  const updateTodoInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodoInput(e.target.value);
  };

  const handleAddTodo = () => {
    if (todoInput.trim() === '') return;
    addTodo({ id: uuid(), text: todoInput, isDone: false, color: newColor });
    setTodoInput('');
  };

  const submitOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // e.preventDefault();
      handleAddTodo();
      setTodoInput('');
    }
  };

  const handleToggle = (id: string) => {
    toggleTodoCompletion(id, newColor);
  };

  const handleEditingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingId) {
      editTodo(editingId!, e.target.value);
    }
  };

  const submitEdit = (id: string, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      stopEditing();
    }
  };

  return (
    <div className="border-2 border-gray-500 h-96">
      <h2>todolist</h2>
      <div className="w-ful">
        <ul className="relative">
          {todoList.map((todo) => {
            return (
              <li key={todo.id} className={`flex flex-row border ${todo.isDone ? `bg-${todo.color}` : 'no-underline'}`}>
                <span onClick={() => toggleTenMinPlanerColorModal()} className={`text-${newColor}`}>
                  <FaCircle />
                </span>
                <input type="checkbox" onClick={() => handleToggle(todo.id)} />
                {editingId === todo.id ? (
                  <input
                    type="text"
                    value={editingText}
                    onChange={handleEditingChange}
                    onKeyUp={(e) => submitEdit(todo.id, e)}
                  />
                ) : (
                  <span onClick={() => startEditing(todo.id)}>{todo.text}</span>
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
          <button onClick={handleAddTodo}>
            <FaPlus />
          </button>
        </div>
      </div>
      {isTenMinPlanerColorModalOpen && <ColorModal />}
    </div>
  );
};

export default Todolist;
