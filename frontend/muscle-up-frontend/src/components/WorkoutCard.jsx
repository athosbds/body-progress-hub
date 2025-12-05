import React from 'react';

const WorkoutCard = ({ workout }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 mb-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-xl text-gray-900">{workout.title}</h3>
        <span className="text-sm text-gray-400">{workout.date}</span>
      </div>

      <p className="text-sm text-gray-600 mb-1"><span className="font-medium">Usuário:</span> {workout.user}</p>
      <p className="text-sm text-gray-600 mb-1"><span className="font-medium">Duração:</span> {workout.duration}</p>
      <p className="text-sm text-gray-600 mb-3"><span className="font-medium">Volume:</span> {workout.volume}</p>

      <div className="mb-3">
        <h4 className="font-semibold text-gray-800 mb-1">Exercícios:</h4>
        <ul className="text-sm text-gray-700 list-disc list-inside">
          {workout.exercises.map((ex, i) => (
            <li key={i}>
              {ex.sets} sets {ex.name} ({ex.reps} reps)
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-3">
        <button className="flex-1 py-2 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors">
          Curtir ({workout.likes})
        </button>
        <button className="flex-1 py-2 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition-colors">
          Comentar ({workout.comments.length})
        </button>
      </div>
    </div>
  );
};

export default WorkoutCard;
