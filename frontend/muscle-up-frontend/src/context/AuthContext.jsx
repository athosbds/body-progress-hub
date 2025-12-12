import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";

const LOCAL_USERS_KEY = "muscleup_users_v1";
const LOCAL_SESSION_KEY = "muscleup_session_v1";


function loadUsers() {
  try {
    const raw = localStorage.getItem(LOCAL_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    restoreSession();
  }, []);

  const restoreSession = async () => {
    const token = localStorage.getItem("access_token");
    
    if (token) {
      try {
        const response = await api.get("/users/me");
        if (response && response.id) {
          setUser(response);
        } else {
          fallbackToLocalSession();
        }
      } catch (error) {
        console.warn("Backend offline, usando sessão local");
        fallbackToLocalSession();
      }
    } else {
      fallbackToLocalSession();
    }
    setLoadingAuth(false);
  };

  const fallbackToLocalSession = () => {
    const raw = localStorage.getItem(LOCAL_SESSION_KEY);
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        setUser(null);
      }
    }
  };

  const register = async ({ name, email, password }) => {
    try {
      const response = await api.post("/auth/register", {
        nome: name,
        email,
        senha: password
      });

      if (response && response.id) {
        const session = { id: response.id, name: response.name, email: response.email };
        setUser(session);
        localStorage.removeItem(LOCAL_SESSION_KEY);
        return { ok: true, user: session };
      }
    } catch (apiError) {
      console.warn("Backend offline, usando registro local");
    }

    // Fallback para registro local
    const users = loadUsers();
    if (users.find((u) => u.email === email)) {
      return { ok: false, error: "Email já cadastrado" };
    }
    
    const newUser = { id: Date.now(), name, email, password };
    users.push(newUser);
    saveUsers(users);
    
    const session = { id: newUser.id, name: newUser.name, email: newUser.email };
    setUser(session);
    localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(session));
    
    return { ok: true, user: session };
  };

  const login = async ({ email, password }) => {
    try {
      const response = await api.post("/auth/login", {
        email,
        senha: password
      });

      if (response && response.access_token) {
        localStorage.setItem("access_token", response.access_token);
        

        const userResponse = await api.get("/users/me");
        if (userResponse && userResponse.id) {
          const session = { 
            id: userResponse.id, 
            name: userResponse.name, 
            email: userResponse.email,
            avatar_url: userResponse.avatar_url,
            bio: userResponse.bio
          };
          setUser(session);
          localStorage.removeItem(LOCAL_SESSION_KEY); // Limpa sessão local
          return { ok: true, user: session };
        }
      }
    } catch (apiError) {
      console.warn("Backend offline, usando login local");
    }

    const users = loadUsers();
    const found = users.find((u) => u.email === email && u.password === password);
    if (!found) {
      return { ok: false, error: "Credenciais inválidas" };
    }
    
    const session = { id: found.id, name: found.name, email: found.email };
    setUser(session);
    localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(session));
    
    return { ok: true, user: session };
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
    localStorage.removeItem(LOCAL_SESSION_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, loadingAuth, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}