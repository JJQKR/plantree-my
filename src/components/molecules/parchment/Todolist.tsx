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

  const handleTodoInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodoInput(e.target.value);
  };

  const addTodoList = () => {
    if (todoInput.trim() === '') return;

    const nextTodo: Todo = { id: uuid(), text: todoInput, isDone: false };
    setTodoList((prev) => [...prev, nextTodo]);
    setTodoInput('');
  };

  const handleChangeIsDone = (id: string) => {
    setTodoList(todoList.map((todo) => (id === todo.id ? { ...todo, isDone: !todo.isDone } : todo)));
  };

  const handleDeleteTodo = (id: string) => {
    setTodoList(todoList.filter((todo) => id !== todo.id));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTodoList();
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
              <input type="checkbox" onChange={() => handleChangeIsDone(todo.id)} />
              {todo.text}
              <button onClick={() => handleDeleteTodo(todo.id)}>✕</button>
            </li>
          );
        })}
      </ul>
      <div>
        <button onClick={addTodoList}>+</button>
        <input type="text" value={todoInput} onChange={handleTodoInput} onKeyUp={handleKeyDown} />
      </div>
    </div>
  );
};

export default Todolist;
