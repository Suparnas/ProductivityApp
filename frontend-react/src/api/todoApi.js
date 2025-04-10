import axios from "axios";

const API_URL = "http://localhost:1337/api";

// Configure axios defaults
axios.defaults.baseURL = API_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true; // Enable credentials for CORS

// Set auth token for subsequent requests
export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Clear auth token and user data
export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  delete axios.defaults.headers.common['Authorization'];
};

// ✅ Fetch Todos
export const fetchTodos = async () => {
  try {
    const response = await axios.get('/todos');
    console.log('Fetch todos response:', response.data);

    // Check if the response contains an error
    if (response.data?.error) {
      console.error('API returned an error:', response.data.error);
      return [];
    }

    // Validate the response structure
    const todosData = response?.data?.data;
    if (!todosData || !Array.isArray(todosData)) {
      console.error('Invalid response structure:', response.data);
      return [];
    }

    // Transform the data to match the frontend structure
    return todosData.map(todo => ({
      id: todo.id,
      title: todo.attributes?.Title || 'Untitled',
      description: todo.attributes?.Description || '',
      priority: (todo.attributes?.Priority || 'medium').toLowerCase(),
      due_date: todo.attributes?.DueDate || null, // Use null if no due date is provided
      completed: todo.attributes?.TodoStatus === 'completed'
    }));
  } catch (error) {
    console.error('Error fetching todos:', error.response?.data || error.message || error);
    return [];
  }
};

// ✅ Add Todo
export const addTodo = async (todoData) => {
  try {
    console.log('Sending request with data:', {
      data: {
        Title: todoData.title,
        Description: todoData.description || '',
        Priority: todoData.priority || 'medium',
        DueDate: todoData.due_date || new Date().toISOString().split('T')[0],
        TodoStatus: 'pending'
      }
    });

    const response = await axios.post('/todos', {
      data: {
        Title: todoData.title,
        Description: todoData.description || '',
        Priority: todoData.priority || 'medium',
        DueDate: todoData.due_date || new Date().toISOString().split('T')[0],
        TodoStatus: 'pending'
      }
    });
    
    console.log('Server response:', response.data);

    if (!response.data) {
      throw new Error('No response data received');
    }

    const responseData = response.data.data;
    if (!responseData) {
      console.error('Invalid response structure:', response.data);
      throw new Error('Invalid response structure from server');
    }

    // Transform the response data to match our frontend structure
    return {
      id: responseData.id,
      title: responseData.Title,
      description: responseData.Description || '',
      priority: responseData.Priority?.toLowerCase() || 'medium',
      due_date: responseData.DueDate,
      completed: responseData.TodoStatus === 'completed'
    };
  } catch (error) {
    console.error('Error adding todo:', error.response?.data || error);
    throw new Error(error.response?.data?.error?.message || 'Failed to add todo');
  }
};

// ✅ Update Todo
export const updateTodo = async (documentId, todoData) => {
  if (!documentId || typeof documentId !== 'string') {
    throw new Error('Invalid document ID provided');
  }

  if (!todoData || typeof todoData !== 'object') {
    throw new Error('Invalid todo data provided');
  }

  try {
    console.log('Updating todo with document ID:', documentId);
    console.log('Payload being sent:', todoData);

    const response = await fetch(`${API_URL}/todos/${documentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
      data: {
        Title: todoData.title,
        Description: todoData.description,
        TodoStatus: todoData.completed ? 'completed' : 'pending',
        Priority: todoData.priority,
        DueDate: todoData.due_date,
      },
  }),
});

if (!response.ok) {
  const errorData = await response.json();
  console.error('API Error:', errorData);
  throw new Error(errorData?.error?.message || 'Failed to update todo');
}

const responseData = (await response.json())?.data;

if (!responseData || typeof responseData !== 'object') {
  throw new Error('Invalid response structure from server');
}

// Transform the response data to match our frontend structure
return {
  id: responseData.id,
  title: responseData.Title,
  description: responseData.Description || '',
  priority: responseData.Priority?.toLowerCase() || 'medium',
  due_date: responseData.DueDate,
  completed: responseData.TodoStatus === 'completed',
};
} catch (error) {
console.error('Error updating todo:', error.message || error);
throw new Error(error.message || 'Failed to update todo');
}
};

// ✅ Delete Todo
// export const deleteTodo = async (id) => {
//   try {
//     await axios.delete(`/todos/${id}`);
//     return true;
//   } catch (error) {
//     console.error("Delete todo error:", error);
//     throw new Error("Failed to delete todo");
//   }
// };
// ✅ Delete Todo
export const deleteTodo = async (documentId) => {
  try {
    const response = await fetch(`${API_URL}/todos/${documentId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(`Failed to delete todo: ${errorData.message || response.statusText}`);
      } else {
        const errorText = await response.text();
        console.error('API Error (non-JSON):', errorText);
        throw new Error(`Failed to delete todo: ${response.statusText}`);
      }
    }

    console.log(`Todo with documentId: ${documentId} deleted successfully.`);
    return true;
  } catch (error) {
    console.error('Error in deleteTodo:', error);
    throw error;
  }
};

// ✅ Login User
export const loginUser = async (credentials) => {
  try {
    clearAuth();
    const response = await axios.post('/auth/local', {
      identifier: credentials.email,
      password: credentials.password
    });
    const { jwt, user } = response.data;
    
    // Store the token and user data
    localStorage.setItem('token', jwt);
    localStorage.setItem('user', JSON.stringify(user));
    
    // Set the token in axios headers
    setAuthToken(jwt);
    
    return { token: jwt, user };
  } catch (error) {
    console.error('Login error:', error);
    throw new Error(error.response?.data?.error?.message || 'Invalid credentials');
  }
};

// ✅ Register User
export const registerUser = async (userData) => {
  try {
    const response = await axios.post('/auth/local/register', userData);
    const { jwt, user } = response.data;
    
    // Store the token and user data
    localStorage.setItem('token', jwt);
    localStorage.setItem('user', JSON.stringify(user));
    
    // Set the token in axios headers
    setAuthToken(jwt);
    
    return { token: jwt, user };
  } catch (error) {
    console.error("Registration error:", error);
    throw new Error(error.response?.data?.error?.message || "Registration failed");
  }
};

// ✅ Fetch Current Logged-in User
export const fetchCurrentUser = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    
    setAuthToken(token);
    const response = await axios.get('/users/me');
    return response.data;
  } catch (error) {
    console.error("Fetch user error:", error);
    return null;
  }
};
