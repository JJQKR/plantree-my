'use client';

import React, { useState, ElementRef, useRef } from 'react';
import uuid from 'react-uuid';
import { FaPlus } from 'react-icons/fa6';
import { Todo } from './TenMinPlanner';
import { getColorClass } from '../../../lib/utils/tenMinPlannerColor';
import useEditModeStore from '@/stores/editMode.store';
import { FaTrashAlt } from 'react-icons/fa';
import { FaRegEdit } from 'react-icons/fa';
import { TodoType } from '@/api/tenMinPlanner.api';

interface TodolistProps {
  tenMinPlannerId: string;
  todoList: Todo[];
  setTodoList: React.Dispatch<React.SetStateAction<Todo[]>>;
  setSelectedColorTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  selectedColorTodo: TodoType | null;
}

const Todolist = ({
  tenMinPlannerId,
  todoList,
  setTodoList,
  setSelectedColorTodo,
  selectedColorTodo
}: TodolistProps) => {
  const [todoInput, setTodoInput] = useState<string>('');
  const [editingId, setEditingId] = useState('');

  // document.querySelector => dom에 접근 <input />
  // 1. useRef로 dom에 접근할 수 있음
  const editTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  // const textareaRef = useRef();

  const { isEditMode } = useEditModeStore((state) => state);

  // const { isTenMinplannerColorModalOpen, toggleTenMinplannerColorModal } = useParchmentModalStore((state) => state);

  // const updateTodoInput = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setTodoInput(e.target.value);
  // };

  const handleAddTodo = () => {
    setTodoList((prev) => [
      ...prev,
      { id: uuid(), text: todoInput, isDone: false, color: 'transparent', planner_id: tenMinPlannerId }
    ]);
    setTodoInput('');
  };

  // 인풋에 달려있는 엔터를 통해 투두를 추가하는 함수
  // const submitOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (e.key === 'Enter') {
  //     handleAddTodo();
  //     setTodoInput('');
  //   }
  // };

  const handleToggle = (id: string) => {
    setTodoList(todoList.map((todo) => (todo.id === id ? { ...todo, isDone: !todo.isDone } : todo)));
  };

  const handleEditingChange = (e: React.ChangeEvent<HTMLTextAreaElement>, todoId: string) => {
    if (todoId) {
      setTodoList(todoList.map((todo) => (todo.id === todoId ? { ...todo, text: e.target.value } : todo)));
    }
  };

  const startEditing = (todoId: string) => {
    setEditingId(todoId);
    // 실행 컨텍스트 -> 야매
    setTimeout(() => {
      // 3. editInputRef.current => <input />
      editTextareaRef.current?.focus();
    });
  };

  const endEdit = (id: string, e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      setEditingId('');
    }
  };

  // const openModal = (id: string) => {
  //   // toggleTenMinplannerColorModal();
  //   setSelectedTodoId(id);
  // };

  const handleSelectTodo = (todo: Todo) => {
    if (todo.color === 'transparent') {
      alert('컬러를 먼저 지정해주세요');
      return;
    }
    setSelectedColorTodo(todo);
  };

  const changeTodoColor = (todoId: string, newColor: string) => {
    setTodoList(todoList.map((todo) => (todo.id === todoId ? { ...todo, color: newColor } : todo)));
  };

  const removeTodo = (id: string) => {
    setTodoList(todoList.filter((todo) => todo.id !== id));
  };

  return (
    <div className="w-[26.1rem] h-[40rem] overflow-y-auto">
      <div className="w-[25rem">
        <ul className="relative">
          {todoList.map((todo) => {
            return (
              <li
                key={todo.id}
                className="flex flex-row justify-between w-[26.1rem] border-b-[0.15rem] border-[#EAEAEA] min-h-[3.2rem] text-[1.5rem] font-[400] items-center"
                style={{
                  backgroundColor: selectedColorTodo?.id === todo.id ? todo.color : 'transparent'
                }}
              >
                <input
                  type="color"
                  className="color-input"
                  onChange={(e) => changeTodoColor(todo.id, e.target.value)}
                />
                {/* {
                    todo.color === "transparent" ? 
                  } */}
                <style jsx>{`
                  .color-input {
                    width: 2.5rem;
                    height: 2.9rem;
                    -webkit-appearance: none;
                    -moz-appearance: none;
                    appearance: none;
                    background-color: transparent;
                    border: none;
                  }
                  .color-input::-webkit-color-swatch {
                    border-radius: 50%;
                    border: none;
                  }
                `}</style>
                {/* </span> */}
                <input
                  type="checkbox"
                  checked={todo.isDone}
                  onChange={() => handleToggle(todo.id)}
                  disabled={!isEditMode}
                  style={{ zoom: 1.7 }}
                />
                {editingId === todo.id ? (
                  <textarea
                    key={todo.id}
                    // 2. ref 속성에 값 넣기
                    ref={editTextareaRef}
                    value={todo.text}
                    onChange={(e) => handleEditingChange(e, todo.id)}
                    onKeyUp={(e) => endEdit(todo.id, e)}
                    disabled={!isEditMode}
                    className="bg-transparent w-[14rem] min-h-[3.2rem]"
                  />
                ) : (
                  <div className="w-[14rem]" onClick={() => handleSelectTodo(todo)}>
                    <span className="h-[1.7rem] w-[14rem]">{todo.text}</span>
                  </div>
                )}
                <div className="w-[4.6rem] flex gap-[0.6rem]">
                  {isEditMode ? (
                    <button onClick={() => startEditing(todo.id)} className="text-[#9E9E9E] text-[2rem]">
                      <FaRegEdit />
                    </button>
                  ) : null}
                  {isEditMode ? (
                    <button onClick={() => removeTodo(todo.id)} className="text-[#9E9E9E] text-[2rem]">
                      <FaTrashAlt />
                    </button>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
        {isEditMode ? (
          <div
            onClick={handleAddTodo}
            className="h-[3.1rem] py-[0.6rem] flex flex-row justify-center items-center text-[#727272] font-[600]"
          >
            <FaPlus />
            <span className="h-[1.9rem] ml-[0.2rem]"> 리스트 추가 </span>
          </div>
        ) : null}
      </div>
      {/* {isTenMinplannerColorModalOpen && <ColorModal todoId={selectedTodoId} changeTodoColor={changeTodoColor} />} */}
    </div>
  );
};

export default Todolist;
