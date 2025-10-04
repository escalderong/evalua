import { useState } from 'react';
import type { CreateStudentDto } from '../types';

interface AddStudentFormProps {
  onSubmit: (data: CreateStudentDto) => void;
  isLoading?: boolean;
}

export function AddStudentForm({ onSubmit, isLoading }: AddStudentFormProps) {
  const [formData, setFormData] = useState<CreateStudentDto>({
    name: '',
    email: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: '', email: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="text"
        required
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Student name"
        className="flex-1 px-3 py-2 border border-shironezu bg-gofuniro text-kokushoku focus:ring-2 focus:ring-asagiiro focus:border-transparent"
      />
      <input
        type="email"
        required
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="Student email"
        className="flex-1 px-3 py-2 border border-shironezu bg-gofuniro text-kokushoku focus:ring-2 focus:ring-asagiiro focus:border-transparent"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="bg-benihi text-gofuniro px-6 py-2 hover:brightness-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors self-end"
      >
        {isLoading ? 'Adding...' : 'Add Student'}
      </button>
    </form>
  );
}
