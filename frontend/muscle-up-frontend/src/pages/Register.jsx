import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !email.trim() || !password) {
      setError("Preencha todos os campos");
      return;
    }
    setLoading(true);
    // mock sync call
    const res = register({ name: name.trim(), email: email.trim(), password });
    setLoading(false);
    if (!res.ok) {
      setError(res.error || "Erro ao registrar");
      return;
    }
    // sucesso -> ir para login
    alert("Registrado com sucesso! Faça login.");
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-6">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-6">Criar Conta</h1>

        {error && <div className="mb-3 text-sm text-red-600">{error}</div>}

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Nome completo"
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Senha"
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-60"
          >
            {loading ? "Criando..." : "Registrar"}
          </button>
        </form>

        <p className="mt-4 text-center">
          Já tem conta?{" "}
          <Link to="/login" className="text-blue-600 hover:underline font-semibold">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
