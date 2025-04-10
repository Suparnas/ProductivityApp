import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../../styles/TodoForm.css';

const TodoForm = ({ onSubmit }) => {
  const [todo, setTodo] = useState({
    title: '',
    description: '',
    priority: 'low',
    dueDate: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!todo.title.trim()) {
      setError('Title is required');
      return;
    }
    onSubmit(todo);
    setTodo({ title: '', description: '', priority: 'low', dueDate: '' });
    setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTodo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="text"
          name="title"
          value={todo.title}
          onChange={handleChange}
          placeholder="Enter todo title"
          className="form-input"
        />
        {error && <div className="error-message">{error}</div>}
      </div>

      <div className="form-group">
        <input
          type="text"
          name="description"
          value={todo.description}
          onChange={handleChange}
          placeholder="Enter description"
          className="form-input"
        />
      </div>

      <div className="form-group">
        <select
          name="priority"
          value={todo.priority}
          onChange={handleChange}
          className="form-select"
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
      </div>

      <div className="form-group">
        <input
          type="date"
          name="dueDate"
          value={todo.dueDate}
          onChange={handleChange}
          className="form-input"
        />
      </div>

      <button type="submit" className="form-button">
        Add Todo
      </button>
    </form>
  );
};

TodoForm.propTypes = {
  onSubmit: PropTypes.func.isRequired
};

export default TodoForm; 