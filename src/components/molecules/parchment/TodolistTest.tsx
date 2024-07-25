'use client';

import React, { useState } from 'react';
import uuid from 'react-uuid';
import { FaCircle } from 'react-icons/fa';

type Todo = {
  id: string;
  text: string;
  isDone: boolean;
};

const TodolistTest: React.FC = () => {
  const [input1, setInput1] = useState<string>('');
  const [input2, setInput2] = useState<string>('');
  const [input3, setInput3] = useState<string>('');
  const [input4, setInput4] = useState<string>('');
  const [input5, setInput5] = useState<string>('');

  const [todoList, setTodoList] = useState<Todo[]>([]);

  const updateInput1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput1(e.target.value);

    console.log('1:', input1);
  };
  const updateInput2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput2(e.target.value);

    console.log('2:', input2);
  };
  const updateInput3 = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput3(e.target.value);

    console.log('3:', input3);
  };
  const updateInput4 = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput4(e.target.value);

    console.log('4:', input4);
  };
  const updateInput5 = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput5(e.target.value);

    console.log('5:', input5);
  };

  // const addTodo = () => {
  //   if (todoInput.trim() === '') return;

  //   const nextTodo: Todo = { id: uuid(), text: todoInput, isDone: false };
  //   setTodoList((prev) => [...prev, nextTodo]);
  //   setTodoInput('');
  // };

  const toggleTodoCompletion = (id: string) => {
    setTodoList(todoList.map((todo) => (id === todo.id ? { ...todo, isDone: !todo.isDone } : todo)));
  };

  const removeTodo = (id: string) => {
    setTodoList(todoList.filter((todo) => id !== todo.id));
  };

  // const submitOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (e.key === 'Enter') {
  //     e.preventDefault();
  //     addTodo();
  //     setTodoInput('');
  //   }
  // };

  return (
    <div className="border-2 border-gray-500 h-96">
      <h2>todolist</h2>
      <div className="w-5/6 mx-auto border">
        <div className="w-full flex items-center">
          <input type="text" onChange={updateInput1} className="border" />
          <button className="text-lg">
            <FaCircle />
          </button>
        </div>
        <div>
          <input type="text" onChange={updateInput2} className="border w-full" />
        </div>
        <div>
          <input type="text" onChange={updateInput3} className="border w-full" />
        </div>
        <div>
          <input type="text" onChange={updateInput4} className="border w-full" />
        </div>
        <div>
          <input type="text" onChange={updateInput5} className="border w-full" />
        </div>
        {/* <ul>
          {todoList.map((todo) => {
            return (
              <div>
                <div className="border-b-2"></div>
                <li key={todo.id} className={todo.isDone ? 'line-through' : 'no-underline'}>
                  <input type="checkbox" onChange={() => toggleTodoCompletion(todo.id)} />

                  {todo.text}
                  <button onClick={() => removeTodo(todo.id)}>✕</button>
                </li>
              </div>
            );
          })}
        </ul> */}
      </div>
    </div>
  );
};

export default TodolistTest;
