import React from 'react';

const Header = () => (
  <header className="flex justify-between items-center mb-6">
    <h1 className="text-3xl font-bold text-gray-900">Muscle Up</h1>
    <nav className="flex gap-4">
      <button className="px-4 py-2 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors">
        Criar Treino
      </button>
      <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition-colors">
        Perfil
      </button>
    </nav>
  </header>
);

export default Header;
