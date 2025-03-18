// src/components/TodoInput.js
import React from "react";

const TodoInput = ({ newTodo, setNewTodo, onAdd }) => {
  return (
    <div className="todo-input">
      <input
        type="text"
        placeholder="Add a new task..."
        value={newTodo.Title}
        onChange={(e) => setNewTodo({ ...newTodo, Title: e.target.value })}
      />
      <button onClick={onAdd}>Add</button>
    </div>
  );
};

export default TodoInput;
