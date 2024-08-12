'use client';

import React, { useState } from 'react';
import uuid from 'react-uuid';
import { FaPlus } from 'react-icons/fa6';
import { FaCircle } from 'react-icons/fa';
import ColorModal from './ColorModal';
import { Todo } from './TenMinPlanner';
import useParchmentModalStore from '../../../stores/parchment.modal.store';
import { getBackgroundColorClass, getColorClass } from '../../../lib/utils/tenMinPlannerColor';
import useEditModeStore from '@/stores/editMode.store';

interface TodolistProps {
  tenMinPlannerId: string;
  todoList: Todo[];
  setTodoList: React.Dispatch<React.SetStateAction<Todo[]>>;
  setSelectedColorTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
}

const Todolist = ({ tenMinPlannerId, todoList, setTodoList, setSelectedColorTodo }: TodolistProps) => {
  const [todoInput, setTodoInput] = useState<string>('');
  const [editingId, setEditingId] = useState('');
  const [selectedTodoId, setSelectedTodoId] = useState('');

  const { isEditMode } = useEditModeStore((state) => state);

  const { isTenMinplannerColorModalOpen, toggleTenMinplannerColorModal } = useParchmentModalStore((state) => state);
  // const { mutate: createTenMinTodo } = useCreateTenMinTodo();

  const updateTodoInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodoInput(e.target.value);
  };

  const handleAddTodo = () => {
    if (todoInput.trim() === '') return;
    // addTodo({ id: uuid(), text: todoInput, isDone: false, color: 'transparent', planner_id: tenMinPlannerId });
    setTodoList((prev) => [
      ...prev,
      { id: uuid(), text: todoInput, isDone: false, color: 'transparent', planner_id: tenMinPlannerId }
    ]);
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
    // toggleTodoCompletion(id);
    setTodoList(todoList.map((todo) => (todo.id === id ? { ...todo, isDone: !todo.isDone } : todo)));
  };

  const handleEditingChange = (e: React.ChangeEvent<HTMLInputElement>, todoId: string) => {
    if (todoId) {
      // editTodo(editingId, e.target.value);
      setTodoList(todoList.map((todo) => (todo.id === todoId ? { ...todo, text: e.target.value } : todo)));
    }
  };

  const startEditing = (todoId: string) => {
    setEditingId(todoId);
  };

  const submitEdit = (id: string, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // stopEditing();
      setEditingId('');
    }
  };

  const openModal = (id: string) => {
    toggleTenMinplannerColorModal();
    setSelectedTodoId(id);
  };

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
    <div className="border-2  h-[38rem]">
      <div className="w-ful">
        <ul className="relative">
          {todoList.map((todo) => {
            return (
              <li
                key={todo.id}
                className={`flex flex-row border`}
                style={{ backgroundColor: todo.isDone ? getBackgroundColorClass(todo.color) : 'transparent' }}
              >
                <span
                  onClick={() => {
                    openModal(todo.id);
                  }}
                  style={{ color: getColorClass(todo.color) }}
                >
                  <FaCircle />
                </span>
                <input
                  type="checkbox"
                  checked={todo.isDone}
                  onChange={() => handleToggle(todo.id)}
                  disabled={!isEditMode}
                />
                {editingId === todo.id ? (
                  <input
                    type="text"
                    value={todo.text}
                    onChange={(e) => handleEditingChange(e, todo.id)}
                    onKeyUp={(e) => submitEdit(todo.id, e)}
                    disabled={!isEditMode}
                  />
                ) : (
                  <span onClick={() => startEditing(todo.id)}>{todo.text}</span>
                )}
                <div className="absolute right-1">
                  {isEditMode ? <button onClick={() => handleSelectTodo(todo)}>선택</button> : null}
                  {isEditMode ? <button onClick={() => removeTodo(todo.id)}>✕</button> : null}
                </div>
              </li>
            );
          })}
        </ul>
        {isEditMode ? (
          <div className="w-full">
            <input
              type="text"
              value={todoInput}
              onChange={updateTodoInput}
              onKeyUp={submitOnEnter}
              className="w-11/12"
            />
            <button onClick={handleAddTodo}>
              <FaPlus />
            </button>
          </div>
        ) : null}
      </div>
      {isTenMinplannerColorModalOpen && <ColorModal todoId={selectedTodoId} changeTodoColor={changeTodoColor} />}
    </div>
  );
};

export default Todolist;
