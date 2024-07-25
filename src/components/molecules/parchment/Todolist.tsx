'use client';

import React, { useState } from 'react';
import uuid from 'react-uuid';
import { FaPlus } from 'react-icons/fa6';

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
  // const [modal, setModal] = useState<boolean>(false);

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
  return (
    <div className="border-2 border-gray-500 h-96">
      <h2>todolist</h2>
      <div className="w-ful mx-auto border">
        <ul>
          {todoList.map((todo) => {
            return (
              <div className="relative">
                <li key={todo.id} className={todo.isDone ? 'bg-yellow-400' : 'no-underline'}>
                  <input type="checkbox" onChange={() => toggleTodoCompletion(todo.id)} />
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
              </div>
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
    </div>
  );
};

export default Todolist;
