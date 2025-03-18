import axios from "axios";

const API_URL = "http://localhost:1337/api";

// ✅ Fetch Todos
export const fetchTodos = async () => {
  try {
    const response = await axios.get(`${API_URL}/todos`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching todos:", error);
    return [];
  }
};

// ✅ Add Todo
export const addTodo = async (todoData) => {
  try {
    const response = await axios.post(`${API_URL}/todos`, { data: todoData });
    return response.data.data;
  } catch (error) {
    console.error("Error adding todo:", error);
  }
};

// ✅ Update Todo
export const updateTodo = async (documentId, updatedFields) => {
  try {
    const response = await axios.put(`${API_URL}/todos/${documentId}`, { data: updatedFields });
    return response.data.data;
  } catch (error) {
    console.error("Error updating todo:", error);
  }
};

// ✅ Delete Todo
export const deleteTodo = async (documentId) => {
  try {
    await axios.delete(`${API_URL}/todos/${documentId}`);
  } catch (error) {
    console.error("Error deleting todo:", error);
  }
};

// ✅ Login User
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/auth/local`, credentials);
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error.response?.data || error.message);
    return null;
  }
};

// ✅ Register User
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/local/register`, userData);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error.response?.data || error.message);
    return null;
  }
};

// ✅ Fetch Current Logged-in User
export const fetchCurrentUser = async () => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) return null;
    
    const response = await axios.get(`${API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};
