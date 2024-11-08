import React from 'react';

interface AddCourseFormProps {
  onUpdate: () => void;
}

export default function AddCourseForm({ onUpdate }: AddCourseFormProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Implementar lógica de criação do curso aqui
      onUpdate();
    } catch (error) {
      console.error('Erro ao criar curso:', error);
    }
  };

  return (
    <div className="glass-effect rounded-xl p-6">
      <h2 className="text-xl font-bold text-primary-light mb-4">Adicionar Novo Curso</h2>
      <form onSubmit={handleSubmit}>
        {/* Formulário aqui */}
        <button type="submit" className="bg-primary text-white px-4 py-2 rounded">
          Criar Curso
        </button>
      </form>
    </div>
  );
} 