import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
    
      const sessionData = JSON.parse(sessionStorage.getItem('CURRENT_USER') || '{}');    

      if (sessionData?.userId && sessionData?.refreshToken) {
        try {          
          const userData = await getUserById();
          
          setUser(userData);
        } catch (err) {
          console.error('restoreSession: Error=', err.message);
          
          if (err.response?.status === 401) {
            sessionStorage.removeItem('CURRENT_USER');
          }
        }
      } else {
        console.log('restoreSession: No session data');
      }

      //  console.log('restoreSession: Setting loading=false');
      setLoading(false);
    };

    restoreSession();
  }, []);

  const login = async (identifier, password) => {
    try {
      const res = await axios.post('/api/auth/login', { identifier, password });
      const { user, accessToken, refreshToken } = res.data;

      const sessionData = {
        userId: user.id,
        accessToken,
        refreshToken,
      };
      sessionStorage.setItem('CURRENT_USER', JSON.stringify(sessionData));
      setUser(user);
      return user;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Login failed');
    }
  };

  const register = async (name, lastname, username, email, password) => {
    try {
      const res = await axios.post('/api/auth/register', {
        name,
        lastname,
        username,
        email,
        password,
        role: 'user',
      });
      const { user, accessToken, refreshToken } = res.data;

      const sessionData = {
        userId: user.id,
        accessToken,
        refreshToken,
      };
      sessionStorage.setItem('CURRENT_USER', JSON.stringify(sessionData));
      setUser(user);
      return user;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Registration failed');
    }
  };

  const logout = () => {
    sessionStorage.removeItem('CURRENT_USER');
    setUser(null);
  };

const updateNiches = async (niches) => {
  try {
    const sessionData = JSON.parse(sessionStorage.getItem('CURRENT_USER'));
    if (!sessionData?.refreshToken) {
      throw new Error('No access token found');
    }
    
    const cleanedNiches = niches.map(niche => ({
      category: niche.category,
      specific: niche.specific,
      isCustom: niche.isCustom || false,
    }));

    console.log('Sending cleaned niches:', cleanedNiches);

    const res = await axios.patch(
      '/api/auth/profile',
      { niches: cleanedNiches },
      { headers: { Authorization: `Bearer ${sessionData.refreshToken}` } }
    );
    setUser(res.data);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Failed to update niches');
  }
};

const getUserById = async () => {
  try {
    const sessionData = JSON.parse(sessionStorage.getItem('CURRENT_USER') || '{}');
    if (!sessionData?.userId || !sessionData?.refreshToken) {
      throw new Error('User ID or refresh token not found');
    }
    
    const res = await axios.post(
      '/api/auth/profile',
      { user: { _id: sessionData.userId } },
      { headers: { Authorization: `Bearer ${sessionData.refreshToken}` } }
    );
    
    return res.data; 
  } catch (err) {
    
    throw new Error(err.response?.data?.message || 'Failed to fetch user');
  }
};

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateNiches, getUserById }}>
      {children}
    </AuthContext.Provider>
  );
};