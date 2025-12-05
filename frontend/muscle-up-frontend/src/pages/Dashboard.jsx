export default function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-6 bg-white shadow rounded-xl">
          <h2 className="font-semibold text-lg">Treinos</h2>
          <p className="text-gray-600 text-sm">Visualize seu progresso diário.</p>
        </div>

        <div className="p-6 bg-white shadow rounded-xl">
          <h2 className="font-semibold text-lg">Perfil</h2>
          <p className="text-gray-600 text-sm">Gerencie suas informações.</p>
        </div>
      </div>
    </div>
  );
}
