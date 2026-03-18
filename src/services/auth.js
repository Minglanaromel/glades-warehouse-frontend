// Mock auth service for testing
const mockUser = {
  id: 1,
  name: 'Test User',
  email: 'minglanara574@gmail.com',
  role: 'admin'
};

export const login = async (credentials) => {
  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (credentials.email && credentials.password) {
        // Accept any email/password for testing
        localStorage.setItem('token', 'mock-token-123');
        resolve({
          user: mockUser,
          token: 'mock-token-123'
        });
      } else {
        reject({
          response: {
            data: {
              message: 'Invalid credentials'
            }
          }
        });
      }
    }, 1000);
  });
};

export const register = async (userData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 1000);
  });
};

export const logout = async () => {
  localStorage.removeItem('token');
  return { success: true };
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  if (token) {
    return mockUser;
  }
  throw new Error('Not authenticated');
};