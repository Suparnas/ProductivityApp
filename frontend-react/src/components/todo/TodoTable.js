import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import '../../styles/TodoTable.css';

const TodoTable = ({ todos, onUpdateTodo, onDeleteTodo }) => {
  const handleStatusChange = (todoId, newStatus) => {
    onUpdateTodo(todoId, { status: newStatus });
  };

  const handlePriorityChange = (todoId, newPriority) => {
    onUpdateTodo(todoId, { priority: newPriority });
  };

  const handleDueDateChange = (todoId, newDueDate) => {
    onUpdateTodo(todoId, { dueDate: newDueDate });
  };

  if (!todos || todos.length === 0) {
    return <div className="no-todos">No todos found. Create one to get started!</div>;
  }

  return (
    <div className="todos-container">
      {todos.map((todo) => (
        <div key={todo.id} className={`todo-item ${todo.status.toLowerCase()}`}>
          <div className="todo-main">
            <h3 className="todo-title">{todo.title}</h3>
            <p className="todo-description">{todo.description}</p>
          </div>
          
          <div className="todo-controls">
            <div className="todo-field">
              <label htmlFor={`status-${todo.id}`}>Status</label>
              <select
                id={`status-${todo.id}`}
                value={todo.status}
                onChange={(e) => handleStatusChange(todo.id, e.target.value)}
              >
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            <div className="todo-field">
              <label htmlFor={`priority-${todo.id}`}>Priority</label>
              <select
                id={`priority-${todo.id}`}
                value={todo.priority}
                onChange={(e) => handlePriorityChange(todo.id, e.target.value)}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>

            <div className="todo-field">
              <label htmlFor={`due-date-${todo.id}`}>Due Date</label>
              <input
                id={`due-date-${todo.id}`}
                type="date"
                value={format(new Date(todo.dueDate), 'yyyy-MM-dd')}
                onChange={(e) => handleDueDateChange(todo.id, e.target.value)}
              />
            </div>

            <button
              className="delete-button"
              onClick={() => onDeleteTodo(todo.id)}
              aria-label="Delete todo"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

TodoTable.propTypes = {
  todos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      status: PropTypes.string.isRequired,
      priority: PropTypes.string.isRequired,
      dueDate: PropTypes.string.isRequired,
    })
  ).isRequired,
  onUpdateTodo: PropTypes.func.isRequired,
  onDeleteTodo: PropTypes.func.isRequired,
};

export default TodoTable; 