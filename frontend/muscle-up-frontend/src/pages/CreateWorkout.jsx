export default function CreateWorkout() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Criar Treino</h1>

      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Nome do exercício"
          className="px-4 py-3 border rounded-lg"
        />

        <input
          type="number"
          placeholder="Repetições"
          className="px-4 py-3 border rounded-lg"
        />

        <button className="bg-blue-600 text-white py-3 rounded-lg font-semibold">
          Salvar
        </button>
      </div>
    </div>
  );
}
