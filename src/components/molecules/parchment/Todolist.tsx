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

  const { isEditMode } = useEditModeStore((state) => state);

  // const updateTodoInput = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setTodoInput(e.target.value);
  // };

  const handleAddTodo = () => {
    setTodoList((prev) => [
      ...prev,
      { id: uuid(), text: todoInput, isDone: false, color: '#EAEAEA', planner_id: tenMinPlannerId }
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

  // const startEditing = (todo: TodoType) => {
  //   setEditingId(todo.id);
  //   setSelectedColorTodo(todo);

  //   // 실행 컨텍스트 -> 야매
  //   setTimeout(() => {
  //     // 3. editInputRef.current => <input />
  //     if (editTextareaRef.current) {
  //       editTextareaRef.current?.focus();
  //       adjustHeight(editTextareaRef.current);
  //     }
  //   });
  // };

  const endEdit = (id: string, e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      setEditingId('');
    }
  };

  const handleSelectTodo = (todo: Todo) => {
    // if (todo.color === 'transparent') {
    //   alert('컬러를 먼저 지정해주세요');
    //   return;
    // }
    setSelectedColorTodo(todo);
    setEditingId(todo.id);

    setTimeout(() => {
      // 3. editInputRef.current => <input />
      if (editTextareaRef.current) {
        editTextareaRef.current?.focus();
        adjustHeight(editTextareaRef.current);
      }
    });
  };

  const changeTodoColor = (todoId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    setTodoList(todoList.map((todo) => (todo.id === todoId ? { ...todo, color: e.target.value } : todo)));
  };

  const removeTodo = (id: string) => {
    setTodoList(todoList.filter((todo) => todo.id !== id));
  };

  const adjustHeight = (e: HTMLTextAreaElement) => {
    if (window.innerWidth < 768) {
      if (e.value.trim() !== '') {
        e.style.height = 'auto'; // 높이를 auto로 설정
        e.style.height = `${e.scrollHeight}px`; // 내용에 따라 높이 조정
      } else {
        e.style.height = '1.8rem'; // 기본 높이를 1.2rem로 설정 (화면 크기 767px 이하)
      }
    } else {
      if (e.value.trim() !== '') {
        e.style.height = 'auto'; // 높이를 auto로 설정
        e.style.height = `${e.scrollHeight}px`; // 내용에 따라 높이 조정
      } else {
        e.style.height = '3.2rem'; // 기본 높이를 3.2rem로 유지 (화면 크기 767px 초과)
      }
    }
  };

  return (
    <div className="w-full sm:h-[27rem] h-[36rem] overflow-y-auto overflow-x-hidden">
      <ul className="relative">
        {todoList.map((todo) => {
          return (
            <li
              key={todo.id}
              className="flex flex-row justify-between w-full border-b-[0.135rem] border-[#EAEAEA] sm:min-h-[2.08rem] min-h-[2.88rem] sm:text-[0.97rem] text-[1.35rem] font-[400] items-center"
              style={{
                backgroundColor: selectedColorTodo?.id === todo.id ? todo.color : 'transparent'
              }}
            >
              <div className="flex gap-[0.2rem]">
                <input
                  type="color"
                  className="round-color-input"
                  value={todo.color}
                  onChange={(e) => changeTodoColor(todo.id, e)}
                  disabled={!isEditMode}
                />
                <input
                  type="checkbox"
                  checked={todo.isDone}
                  onChange={() => handleToggle(todo.id)}
                  disabled={!isEditMode}
                  className="checkbox"
                />
              </div>
              {editingId === todo.id ? (
                <textarea
                  key={todo.id}
                  // 2. ref 속성에 값 넣기
                  ref={editTextareaRef}
                  value={todo.text}
                  onChange={(e) => {
                    handleEditingChange(e, todo.id);
                    adjustHeight(e.target); // 높이 조절 함수 호출
                  }}
                  onKeyUp={(e) => endEdit(todo.id, e)}
                  disabled={!isEditMode}
                  className=" sm:w-[10.9rem] w-[15.3rem] overflow-y-auto resize-none sm:text-[0.9rem] text-[1.26rem] p-[0.45rem] "
                />
              ) : (
                <div>
                  <div
                    className="sm:min-h-[2rem] min-h-[2.88rem] sm:w-[10.5rem] w-[15.3rem] whitespace-pre-wrap break-words break-all flex items-center"
                    onClick={() => isEditMode && handleSelectTodo(todo)}
                  >
                    {todo.text || ''}
                  </div>
                </div>
              )}
              <div className="flex items-center">
                {isEditMode ? (
                  <button onClick={() => removeTodo(todo.id)} className="text-[#9E9E9E] sm:text-[1.3rem] text-[2rem]">
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
          className="sm:h-[1.98rem] h-[2.79rem] sm:py-[0.39rem] py-[0.54rem] sm:text-[0.97rem]  flex flex-row justify-center items-center text-[#727272] font-[600]"
        >
          <FaPlus />
          <span className="sm:h-[1.2rem] h-[1.71rem] ml-[0.18rem]"> 리스트 추가 </span>
        </div>
      ) : null}
    </div>
  );
};

export default Todolist;
