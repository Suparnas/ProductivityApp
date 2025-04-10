import React, { useState, useEffect } from 'react';
import { fetchTodos, addTodo, updateTodo, deleteTodo } from '../api/todoApi';
import { FaTrash, FaClock, FaExclamationCircle } from 'react-icons/fa';
import '../styles/TodoPage.css';

const TodoPage = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTodos = async () => {
    const response = await fetch('http://localhost:1337/api/todos');
    if (!response.ok) throw new Error('Failed to fetch todos');
    
    const data = await response.json();
    console.log('API Response:', data); // Debugging log
    
    // Adjusted to handle the actual API response structure
    if (data && Array.isArray(data.data)) {
      return data.data; // Extract the array from the "data" key
    } else {
      throw new Error('Invalid response format');
    }
  };

  const loadTodos = async () => {
    try {
      setIsLoading(true);
      const response = await fetchTodos(); // Fetch the API response
      console.log('Full API Response:', response); // Log the full response for debugging
  
      // Adjusted validation based on response structure
if (response && Array.isArray(response)) {
  // Map the response to ensure proper structure
  const formattedTodos = response.map(todo => ({
    id: todo.id, // Keep the unique identifier
    documentId: todo.documentId, // Map the separate documentId
    title: todo.Title, // Map `Title` to `title`
    description: todo.Description,
    status: todo.TodoStatus,
  }));
  setTodos(formattedTodos);
} else if (response && typeof response === 'object' && response.data && Array.isArray(response.data)) {
  const formattedTodos = response.data.map(todo => ({
    id: todo.id, // Keep the unique identifier
    documentId: todo.documentId, // Map the separate documentId
    title: todo.Title, // Map `Title` to `title`
    description: todo.Description,
    status: todo.TodoStatus,
  }));
  setTodos(formattedTodos);
} else {
  console.error('Unexpected response format:', response); // Log unexpected format
  throw new Error('Invalid response format');
}
setError(null);
    } catch (err) {
      console.error('Error fetching todos:', err);
      setError('Failed to load todos. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadTodos();
  }, []);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) {
      setError('Title is required.');
      return;
    }

    try {
      const todoData = {
        title: newTodo,
        description,
        priority,
        due_date: dueDate,
      };
      console.log('Sending todo data:', todoData);
      const newTodoItem = await addTodo(todoData);
      console.log('Created new todo:', newTodoItem);
      setTodos([...todos, newTodoItem]);
      setNewTodo('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
      setError(null);
    } catch (err) {
      console.error('Error adding todo:', err);
      setError('Failed to add todo. Please try again.');
    }
  };

  const handleToggleTodo = async (todo) => {
      console.log('Todo object:', todo); // Log the todo object
      try {
        const documentId = todo; // Use documentId from the todo object
        if (!documentId) {
          throw new Error('Invalid todo object: Missing documentId');
        }
      
      // Ensure the due_date is in the correct format (yyyy-MM-dd)
      const formattedDueDate = todo.due_date ? todo.due_date : new Date().toISOString().split('T')[0]; // Default to today's date if due_date is missing
      
      // Toggle the status between "pending" and "completed"
      const newStatus = todo.status === 'completed' ? 'pending' : 'completed';

      // Prepare updated todo data
      const updatedTodoData = {
        description: todo.description || '',
        priority: todo.priority || 'medium',
        due_date: formattedDueDate,
        completed: newStatus === 'completed', // Sync completed with status
        status: newStatus, // Toggle status
      };
  
      console.log('Updating todo with ID:', todo.documentId, 'Data:', updatedTodoData);
  
        // Call the API to update the todo
      const updatedTodo = await updateTodo(todo, updatedTodoData);
      
      console.log('API Response:', updatedTodo);
      
      // Update local state
      setTodos((prevTodos) => {
          console.log('Previous Todos:', prevTodos);
          const updatedTodos = prevTodos.map((t) =>
            t.documentId === todo ? { ...t, ...updatedTodo } : t
          );
          console.log('Updated Todos:', updatedTodos);
          return updatedTodos;
        });
      
      setError(null); // Clear errors
      } catch (error) {
        console.error('Error toggling todo:', error);
        setError('Failed to update todo. Please try again.');
      }
    };

// Ensure you are passing the correct documentId to deleteTodo
const handleDeleteTodo = async (todo) => {
  try {
    console.log('Todo object:', todo); // Debug log
    console.log('Deleting todo with documentId:', todo.documentId); // Debug log
    await deleteTodo(todo.documentId); // Pass documentId, not id
    console.log('Todo deleted successfully');
  } catch (error) {
    console.error('Error deleting todo:', error);
  }
};

  const getPriorityColor = (priority = 'medium') => {
    switch (priority.toLowerCase()) {
      case 'high': return 'var(--color-high-priority)';
      case 'medium': return 'var(--color-medium-priority)';
      case 'low': return 'var(--color-low-priority)';
      default: return 'var(--color-medium-priority)';
    }
  };

  const formatPriority = (priority = 'medium') => {
    return priority.charAt(0).toUpperCase() + priority.toLowerCase().slice(1);
  };

  if (isLoading) {
    return <div className="loading">Loading your todos...</div>;
  }

  return (
    <div className="todo-container">
      <div className="todo-header">
        <h1>Taskie</h1>
        <p className="todo-subtitle">Organize your day, achieve your goals</p>
      </div>

      {error && <div className="todo-error">{error}</div>}

      <form onSubmit={handleAddTodo} className="todo-form">
        <div className="form-row">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="What needs to be done?"
            className="todo-input"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="todo-select"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="todo-date"
          />
        </div>
        <div className="form-row">
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description (optional)"
            className="todo-input"
          />
          <button type="submit" className="btn btn-primary">
            Add Task
          </button>
        </div>
      </form>

      <div className="todo-list">
        {todos.length === 0 ? (
          <div className="todo-empty">
            No tasks yet. Add your first task above!
          </div>
        ) : (
          todos.map(todo => (
            <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
              <label className="todo-checkbox">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggleTodo(todo.documentId, todo.completed)}
                />
                <span className="checkmark"></span>
              </label>
              <div className="todo-content">
              <h3 className="todo-title">{todo.title || 'Untitled Task'}</h3>
          {todo.description && (
            <p className="todo-description">{todo.description}</p>
          )}
                <div className="todo-meta">
                  <span className="todo-priority">
                    <FaExclamationCircle />
                    {formatPriority(todo.priority)}
                  </span>
                  {todo.due_date && (
                    <span className="todo-due-date">
                      <FaClock />
                      {new Date(todo.due_date).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleDeleteTodo(todo)}
                className="todo-delete"
                aria-label="Delete todo"
              >
                <FaTrash />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TodoPage; 