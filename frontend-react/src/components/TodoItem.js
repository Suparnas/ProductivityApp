// src/components/TodoItem.js
import React from "react";

const TodoItem = ({ todo, onUpdateStatus, onDelete }) => {
  return (
    <li className={todo.TodoStatus}>
      <span>{todo.Title}</span>
      <button onClick={() => onUpdateStatus(todo._id, "done")}>Mark as Done</button>
      <button onClick={() => onDelete(todo._id)}>Delete</button>
    </li>
  );
};

export default TodoItem;
