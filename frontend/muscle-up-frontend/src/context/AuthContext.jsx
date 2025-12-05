import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

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
    // restaura sessão se houver
    const raw = localStorage.getItem(LOCAL_SESSION_KEY);
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        setUser(null);
      }
    }
    setLoadingAuth(false);
  }, []);

  const register = ({ name, email, password }) => {
    const users = loadUsers();
    // checa email duplicado
    if (users.find((u) => u.email === email)) {
      return { ok: false, error: "Email já cadastrado" };
    }
    // cria novo usuário mock (id simples)
    const newUser = { id: Date.now(), name, email, password };
    users.push(newUser);
    saveUsers(users);
    return { ok: true, user: { id: newUser.id, name: newUser.name, email: newUser.email } };
  };

  const login = ({ email, password }) => {
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
