'use client';

import React, { useState } from 'react';
import uuid from 'react-uuid';

type Todo = {
  id: string;
  text: string;
  isDone: boolean;
};

const Todolist: React.FC = () => {
  const [todoInput, setTodoInput] = useState<string>('');
  const [todoList, setTodoList] = useState<Todo[]>([]);

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
      <ul>
        {todoList.map((todo) => {
          return (
            <li key={todo.id} className={todo.isDone ? 'line-through' : 'no-underline'}>
              <input type="checkbox" onChange={() => toggleTodoCompletion(todo.id)} />
              {todo.text}
              <button onClick={() => removeTodo(todo.id)}>✕</button>
            </li>
          );
        })}
      </ul>
      <div>
        <button onClick={addTodo}>+</button>
        <input type="text" value={todoInput} onChange={updateTodoInput} onKeyUp={submitOnEnter} />
      </div>
    </div>
  );
};

export default Todolist;
